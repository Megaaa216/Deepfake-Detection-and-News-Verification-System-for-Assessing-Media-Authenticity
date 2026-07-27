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

  def _crop_face(self, img: np.ndarray, bbox: tuple, padding_ratio: float = 0.15) -> np.ndarray:
    """
    Extracts bounding box region from frame with a 15% margin padding around the face box
    to capture facial boundaries (forehead, jawline, ears) cleanly.
    """
    img_h, img_w = img.shape[:2]
    x, y, w, h = bbox
    
    pad_w = int(w * padding_ratio)
    pad_h = int(h * padding_ratio)
    
    x1 = max(0, x - pad_w)
    y1 = max(0, y - pad_h)
    x2 = min(img_w, x + w + pad_w)
    y2 = min(img_h, y + h + pad_h)
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
      faces = self.face_cascade.detectMultiScale(
        gray, 
        scaleFactor=1.1, 
        minNeighbors=4, 
        minSize=(30, 30)
      )
      
      cropped_face = None
      if len(faces) > 0:
        # Sort detected faces by bounding box area to extract the primary face
        faces = sorted(faces, key=lambda b: b[2] * b[3], reverse=True)
        # Extract face ROI with 15% margin padding
        cropped_face = self._crop_face(frame, faces[0], padding_ratio=0.15)
        faces_detected_count += 1
      else:
        # Fallback if no face was found: center crop frame
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
    print(f"[Preprocessor] Faces detected in {faces_detected_count}/{actual_sequence_length} frames ({detection_pct:.1f}% detection rate)")
    print(f"Saved {len(saved_filenames)} face crop frames to static_frames/ (mean Laplacian variance: {np.mean(laplacian_vars):.2f})")
    return sequence_tensor, saved_filenames, laplacian_vars
