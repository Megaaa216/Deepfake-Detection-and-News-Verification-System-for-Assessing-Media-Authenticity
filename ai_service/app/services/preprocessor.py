import cv2
import numpy as np
import torch
from typing import List, Tuple
import os
import uuid
from torchvision import transforms

class VideoPreprocessor:
  """
  Processes local video files:
  1. Opens video stream via OpenCV.
  2. Samples evenly spaced frames.
  3. Detects and crops faces using OpenCV's built-in Haar Cascade frontal face detector.
  4. Resizes and normalizes faces to feed the PyTorch network.
  """
  def __init__(self, target_size: int = 112) -> None:
    self.target_size = target_size
    
    # Load OpenCV built-in frontal face Haar Cascade
    cascade_path = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    self.face_cascade = cv2.CascadeClassifier(cascade_path)
    if self.face_cascade.empty():
      raise IOError(f"Could not load Haar Cascade face detector from {cascade_path}")
    
    # Define standard PyTorch vision transform pipeline with ImageNet normalization
    self.preprocess = transforms.Compose([
      transforms.ToPILImage(),
      transforms.Resize((112, 112)),
      transforms.ToTensor(),          # Automatically scales pixels to [0.0, 1.0]
      transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
      )
    ])

  def _validate_face_box(
    self, 
    bbox: tuple, 
    confidence: float, 
    frame_w: int, 
    frame_h: int
  ) -> Tuple[bool, str]:
    """
    Applies strict validation constraints to eliminate false positive non-face detections
    (e.g., channel logos, watermarks, background graphics, banners):
    1. Confidence Thresholding (>= 0.75)
    2. Size Constraints (Min 80x80 px AND >= 10% frame height)
    3. Aspect Ratio Check (0.7 <= w/h <= 1.4)
    4. Corner Exclusion Mask (Excludes extreme top-left and top-right logo zones unless confidence > 0.90)
    """
    x, y, w, h = bbox
    
    # 1. Confidence threshold check (min 0.75)
    if confidence < 0.75:
      return False, f"Confidence {confidence:.2f} < min threshold 0.75"
      
    # 2. Minimum Face Size check (min 80x80 AND >= 10% of frame height)
    min_h = max(80, int(frame_h * 0.10))
    if w < 80 or h < min_h:
      return False, f"Size ({w}x{h}) below min 80x80 or 10% frame height ({min_h}px)"
      
    # 3. Aspect Ratio Check (0.7 <= width / height <= 1.4)
    aspect_ratio = float(w) / float(h)
    if aspect_ratio < 0.7 or aspect_ratio > 1.4:
      return False, f"Aspect ratio {aspect_ratio:.2f} out of bounds [0.7, 1.4]"
      
    # 4. Corner Exclusion Mask (Top-left & top-right logo/watermark zones)
    in_top_left = (x + w <= frame_w * 0.25) and (y <= frame_h * 0.25)
    in_top_right = (x >= frame_w * 0.75) and (y <= frame_h * 0.25)
    
    if (in_top_left or in_top_right) and confidence <= 0.90:
      zone = "top-left" if in_top_left else "top-right"
      return False, f"Located in extreme {zone} logo zone with confidence {confidence:.2f} <= 0.90"
      
    return True, "Valid face ROI"

  def _crop_face(self, img: np.ndarray, bbox: tuple, padding_ratio: float = 0.15) -> np.ndarray:
    """
    Extracts bounding box region from frame with a 15% margin padding around the face box
    to capture facial boundaries (forehead, jawline, ears) cleanly.
    Calculates integer pixel bounds and clamps strictly within image dimensions.
    """
    img_h, img_w = img.shape[:2]
    x, y, w, h = bbox
    
    pad_w = int(w * padding_ratio)
    pad_h = int(h * padding_ratio)
    
    x1 = max(0, int(x - pad_w))
    y1 = max(0, int(y - pad_h))
    x2 = min(img_w, int(x + w + pad_w))
    y2 = min(img_h, int(y + h + pad_h))

    # Guard against zero-width or zero-height crops
    if (x2 - x1) <= 0 or (y2 - y1) <= 0:
      return self._center_crop(img)

    return img[y1:y2, x1:x2]

  def _center_crop(self, img: np.ndarray) -> np.ndarray:
    """
    Fallback center cropping when face detection fails for a frame.
    """
    h, w = img.shape[:2]
    crop_size = min(h, w)
    start_y = (h - crop_size) // 2
    start_x = (w - crop_size) // 2
    return img[start_y:start_y+crop_size, start_x:start_x+crop_size]

  def _normalize_image(self, img: np.ndarray) -> np.ndarray:
    """
    Normalizes pixel range and scales channels.
    """
    img_normalized = img.astype(np.float32) / 255.0
    # Apply standard mean and standard deviation
    img_normalized = (img_normalized - self.mean) / self.std
    # Reshape from (H, W, C) to (C, H, W)
    return img_normalized.transpose(2, 0, 1)

  def preprocess_video(
    self, 
    video_path: str, 
    sequence_length: int = 32
  ) -> Tuple[torch.Tensor, List[str], List[float]]:
    """
    Main preprocessing execution pipeline.
    Args:
        video_path (str): Filepath of the uploaded video.
        sequence_length (int): Count of frames to extract.
    Returns:
        Tuple[torch.Tensor, List[str], List[float]]: Normalized tensor, names of saved face crop frames, and Laplacian frequency variance list.
    """
    # Reset EMA smoothed box state at the beginning of EVERY new video processing task
    self.prev_smoothed_box = None
    if not os.path.exists(video_path):
      raise FileNotFoundError(f"Video file not found at path: {video_path}")

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
      raise ValueError(f"Could not open video file stream at {video_path}")

    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    if total_frames <= 0:
      cap.release()
      raise ValueError("Invalid total frame count detected (empty video file).")

    # Get FPS and calculate duration to determine sequence length dynamically
    fps = cap.get(cv2.CAP_PROP_FPS)
    duration_seconds = total_frames / fps if fps > 0 else 0
    
    if duration_seconds > 0 and duration_seconds < 10:
      actual_sequence_length = total_frames
      print(f"[AI Service] Video duration is under 10s ({duration_seconds:.2f}s). Processing ALL {actual_sequence_length} frames.")
    else:
      actual_sequence_length = sequence_length
      print(f"[AI Service] Video duration is {duration_seconds:.2f}s. Processing uniform slice of {actual_sequence_length} frames.")

    # Select frame indices evenly spaced across duration
    frame_indices = np.linspace(
      0, 
      total_frames - 1, 
      num=actual_sequence_length, 
      dtype=int
    )
    
    processed_frames: List[np.ndarray] = []
    saved_filenames: List[str] = []
    laplacian_vars: List[float] = []
    faces_detected_count = 0
    
    # Track smoothed bounding box across consecutive frames to eliminate spatial coordinate jitter
    prev_smoothed_box: Optional[Tuple[int, int, int, int]] = None
    alpha_ema = 0.35
    
    # Define static_frames save path directory inside the root-level folder of the Python service
    processed_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../static_frames"))
    os.makedirs(processed_dir, exist_ok=True)
    
    unique_id = uuid.uuid4().hex[:8]

    for idx in frame_indices:
      cap.set(cv2.CAP_PROP_POS_FRAMES, int(idx))
      ret, frame = cap.read()
      if not ret or frame is None:
        # If frame read fails, append empty frame placeholder
        placeholder = np.zeros(
          (self.target_size, self.target_size, 3), 
          dtype=np.uint8
        )
        processed_frames.append(self.preprocess(placeholder))
        
        # Save empty frame placeholder as jpg
        frame_name = f"frame_{unique_id}_{len(saved_filenames)}.jpg"
        cv2.imwrite(os.path.join(processed_dir, frame_name), placeholder)
        saved_filenames.append(frame_name)
        laplacian_vars.append(0.0)
        continue

      # Convert to grayscale for face detection on BGR raw frame
      gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
      frame_h, frame_w = frame.shape[:2]

      # Detect candidate faces using OpenCV Haar Cascade with confidence level weights
      rects, reject_levels, level_weights = self.face_cascade.detectMultiScale3(
        gray, 
        scaleFactor=1.1, 
        minNeighbors=4, 
        minSize=(60, 60),
        outputRejectLevels=True
      )
      
      valid_candidates = []
      if len(rects) > 0:
        for bbox, weight in zip(rects, level_weights):
          # Normalize raw cascade detection weight to a 0.0 - 1.0 confidence score
          raw_w = float(weight[0] if hasattr(weight, '__iter__') else weight)
          conf = min(1.0, raw_w / 3.5)
          
          # Validate candidate against confidence, size, aspect ratio, and corner exclusion constraints
          is_valid, reason = self._validate_face_box(tuple(bbox), conf, frame_w, frame_h)
          if is_valid:
            valid_candidates.append((bbox, conf))
          else:
            print(f"[Preprocessor Warning] Rejected candidate box ({bbox[0]},{bbox[1]},{bbox[2]},{bbox[3]}): {reason}")

      cropped_face = None
      if len(valid_candidates) > 0:
        # Sort valid candidates by bounding box area (w * h) in descending order to prioritize the primary subject face
        valid_candidates = sorted(valid_candidates, key=lambda c: c[0][2] * c[0][3], reverse=True)
        primary_bbox, primary_conf = valid_candidates[0]
        
        # -----------------------------------------------------------------
        # 📐 1. BOUNDING BOX EXPONENTIAL MOVING AVERAGE (EMA) SMOOTHING (alpha = 0.35)
        # -----------------------------------------------------------------
        px, py, pw, ph = primary_bbox
        if prev_smoothed_box is not None:
          sx = int(alpha_ema * px + (1.0 - alpha_ema) * prev_smoothed_box[0])
          sy = int(alpha_ema * py + (1.0 - alpha_ema) * prev_smoothed_box[1])
          sw = int(alpha_ema * pw + (1.0 - alpha_ema) * prev_smoothed_box[2])
          sh = int(alpha_ema * ph + (1.0 - alpha_ema) * prev_smoothed_box[3])
          smoothed_box = (sx, sy, sw, sh)
        else:
          smoothed_box = (int(px), int(py), int(pw), int(ph))

        prev_smoothed_box = smoothed_box

        # Extract primary face ROI with 15% margin padding
        cropped_face = self._crop_face(frame, smoothed_box, padding_ratio=0.15)
        faces_detected_count += 1
      else:
        # Fallback if no valid face passed filters: center crop frame
        cropped_face = self._center_crop(frame)

      # Immediately convert to RGB color space after cropping
      face_rgb = cv2.cvtColor(cropped_face, cv2.COLOR_BGR2RGB)

      # Resize to 112x112 target size for model input and disk saving
      face_resized = cv2.resize(
        face_rgb, 
        (self.target_size, self.target_size), 
        interpolation=cv2.INTER_AREA
      )
      
      # 🔬 Laplacian Frequency Variance check for high-frequency noise / neural over-smoothing
      gray_face = cv2.cvtColor(face_resized, cv2.COLOR_RGB2GRAY)
      lap_var = float(cv2.Laplacian(gray_face, cv2.CV_64F).var())
      laplacian_vars.append(lap_var)

      # Save the face crop to disk
      frame_name = f"frame_{unique_id}_{len(saved_filenames)}.jpg"
      frame_save_path = os.path.join(processed_dir, frame_name)
      # OpenCV imwrite expects BGR, so convert RGB back to BGR
      face_bgr = cv2.cvtColor(face_resized, cv2.COLOR_RGB2BGR)
      cv2.imwrite(frame_save_path, face_bgr)
      saved_filenames.append(frame_name)

      # Normalize and convert to channel-first using standard torchvision transforms
      processed_frames.append(self.preprocess(face_rgb))

    cap.release()

    # Stack into sequence shape: (sequence_length, 3, 112, 112)
    sequence_tensor = torch.stack(processed_frames, dim=0)
    
    # Expand dims to add batch: (1, sequence_length, 3, 112, 112)
    sequence_tensor = sequence_tensor.unsqueeze(0)
    
    detection_pct = (faces_detected_count / actual_sequence_length * 100) if actual_sequence_length > 0 else 0.0
    print(f"[Preprocessor] Valid faces detected in {faces_detected_count}/{actual_sequence_length} frames ({detection_pct:.1f}% detection rate)")
    print(f"Saved {len(saved_filenames)} face crop frames to static_frames/ (mean Laplacian variance: {np.mean(laplacian_vars):.2f})")
    return sequence_tensor, saved_filenames, laplacian_vars
