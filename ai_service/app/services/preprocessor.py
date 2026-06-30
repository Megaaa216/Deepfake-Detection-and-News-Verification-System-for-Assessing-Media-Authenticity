import cv2
import numpy as np
import torch
from typing import List
import os

class VideoPreprocessor:
  """
  Processes local video files:
  1. Opens video stream via OpenCV.
  2. Samples evenly spaced frames.
  3. Detects and crops faces using OpenCV's built-in Haar Cascade frontal face detector.
  4. Resizes and normalizes faces to feed the PyTorch network.
  """
  def __init__(self, target_size: int = 224) -> None:
    self.target_size = target_size
    
    # Load OpenCV built-in frontal face Haar Cascade
    cascade_path = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    self.face_cascade = cv2.CascadeClassifier(cascade_path)
    if self.face_cascade.empty():
      raise IOError(f"Could not load Haar Cascade face detector from {cascade_path}")
    
    # ImageNet standard normalization parameters
    self.mean = np.array([0.485, 0.456, 0.406], dtype=np.float32)
    self.std = np.array([0.229, 0.224, 0.225], dtype=np.float32)

  def _crop_face(self, frame: np.ndarray, face_box) -> np.ndarray:
    """
    Crops the detected face with a 20% outer bounding box padding.
    """
    height, width, _ = frame.shape
    x, y, w, h = face_box
    
    # Add 20% padding
    pad_w = int(w * 0.2)
    pad_h = int(h * 0.2)
    
    x1 = max(0, x - pad_w)
    y1 = max(0, y - pad_h)
    x2 = min(width, x + w + pad_w)
    y2 = min(height, y + h + pad_h)
    
    if x2 > x1 and y2 > y1:
      return frame[y1:y2, x1:x2]
    
    return self._center_crop(frame)

  def _center_crop(self, frame: np.ndarray) -> np.ndarray:
    """
    Crops a square center region of the frame as a fallback.
    """
    h, w, _ = frame.shape
    min_dim = min(h, w)
    start_x = (w - min_dim) // 2
    start_y = (h - min_dim) // 2
    return frame[start_y:start_y + min_dim, start_x:start_x + min_dim]

  def _normalize_image(self, img: np.ndarray) -> np.ndarray:
    """
    Normalizes image coordinates by dividing by 255.0 and applying ImageNet normalization.
    Returns channel-first shape: (3, H, W)
    """
    # Scale to [0.0, 1.0]
    img_normalized = img.astype(np.float32) / 255.0
    # Apply standard mean and standard deviation
    img_normalized = (img_normalized - self.mean) / self.std
    # Reshape from (H, W, C) to (C, H, W)
    return img_normalized.transpose(2, 0, 1)

  def preprocess_video(
    self, 
    video_path: str, 
    sequence_length: int = 10
  ) -> torch.Tensor:
    """
    Main preprocessing execution pipeline.
    Args:
        video_path (str): Filepath of the uploaded video.
        sequence_length (int): Count of frames to extract.
    Returns:
        torch.Tensor: Normalized tensor, shape (1, sequence_length, 3, 224, 224)
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

    # Select frame indices evenly spaced across duration
    frame_indices = np.linspace(
      0, 
      total_frames - 1, 
      num=sequence_length, 
      dtype=int
    )
    
    processed_frames: List[np.ndarray] = []

    for idx in frame_indices:
      cap.set(cv2.CAP_PROP_POS_FRAMES, int(idx))
      ret, frame = cap.read()
      if not ret or frame is None:
        # If frame read fails, append empty frame placeholder
        placeholder = np.zeros(
          (self.target_size, self.target_size, 3), 
          dtype=np.uint8
        )
        processed_frames.append(self._normalize_image(placeholder))
        continue

      # Convert BGR to RGB for consistent model processing
      frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
      
      # Convert to grayscale for face detection
      gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
      faces = self.face_cascade.detectMultiScale(
        gray, 
        scaleFactor=1.1, 
        minNeighbors=5, 
        minSize=(30, 30)
      )
      
      face_img = None
      if len(faces) > 0:
        # Extract first detected face
        face_img = self._crop_face(frame_rgb, faces[0])

      if face_img is None or face_img.size == 0:
        # Fallback if no face was found
        face_img = self._center_crop(frame_rgb)

      # Final resize to 224x224
      face_resized = cv2.resize(
        face_img, 
        (self.target_size, self.target_size), 
        interpolation=cv2.INTER_AREA
      )
      
      # Normalize and convert to channel-first
      processed_frames.append(self._normalize_image(face_resized))

    cap.release()

    # Stack into sequence shape: (sequence_length, 3, 224, 224)
    sequence_array = np.stack(processed_frames, axis=0)
    
    # Expand dims to add batch: (1, sequence_length, 3, 224, 224)
    sequence_tensor = torch.from_numpy(sequence_array).unsqueeze(0)
    return sequence_tensor
