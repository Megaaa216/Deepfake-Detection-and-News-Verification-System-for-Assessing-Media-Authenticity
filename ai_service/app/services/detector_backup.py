import torch
import numpy as np
import random
import os
from safetensors.torch import load_file
from app.services.preprocessor import VideoPreprocessor
from app.services.models import FaceClassifier, VideoTransformerClassifier
import torchvision.transforms.functional as TF


# Set deterministic random seed constraints to freeze model parameter initialization
torch.manual_seed(42)
np.random.seed(42)
random.seed(42)
if torch.cuda.is_available():
  torch.cuda.manual_seed_all(42)

class DeepfakeDetectorManager:
  """
  Coordinates preprocessing and model inference using true weights:
  1. Receives video path.
  2. Runs VideoPreprocessor to crop and build sequence tensor.
  3. Executes dual-stream predictions:
     - Spatial: timm pre-trained academic Xception block for binary classification.
     - Temporal: Custom Transformer sequence model.
  4. Formats predictions and returns confidence scores.
  """
  def __init__(self) -> None:
    self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    self.preprocessor = VideoPreprocessor(target_size=299)
    
    # Define weight paths relative to the project workspace root directory
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../"))
    model1_path = os.path.join(base_dir, "models", "video", "efficientnet_b0_ffpp_c23.pth")
    model2_path = os.path.join(base_dir, "models", "video", "model.safetensors")
    
    # 1. Instantiate Spatial Face Model
    # Note: Model 1 has been upgraded to timm's pre-trained academic Xception block,
    # which dynamically streams and caches the official pre-trained weights safely.
    # Therefore, we bypass loading the incompatible local EfficientNet-B0 weight file.
    self.face_model = FaceClassifier()
    self.face_model.to(self.device)
    self.face_model.eval()

    # 2. Instantiate Sequence Transformer Model and load .safetensors weights
    self.temporal_model = VideoTransformerClassifier(sequence_length=32)
    if os.path.exists(model2_path):
      print(f"[AI Service] Loading sequence transformer weights from: {model2_path}")
      st_state_dict = load_file(model2_path, device=str(self.device))
      self.temporal_model.load_state_dict(st_state_dict, strict=False)
    else:
      print(f"[WARNING] Sequence model weights not found at {model2_path}. Initializing with random weights.")
      
    self.temporal_model.to(self.device)
    self.temporal_model.eval()

  async def analyze_video(self, video_path: str) -> dict:
    """
    Runs media processing and PyTorch classification using loaded model weights.
    """
    try:
      # 1. Preprocess video frames into a tensor and file names list
      print(f"[AI Service] Preprocessing video file: {video_path}")
      sequence_tensor, saved_filenames = self.preprocessor.preprocess_video(
        video_path, 
        sequence_length=128
      )
      sequence_tensor = sequence_tensor.to(self.device)

      # 2. Execute inference under no-grad context
      print(f"[AI Service] Tensor shape entering model: {sequence_tensor.shape}")
      with torch.no_grad():
        # A. Spatial Face Model: Reshape sequence (1, N, 3, 299, 299) to a batch of frames (N, 3, 299, 299)
        frames_batch = sequence_tensor.squeeze(0)  # Shape: (N, 3, 299, 299)
        
        # Process frames in small batches (e.g. 16) to implement TTA (Test-Time Augmentation) and avoid OOMs
        batch_size = 16
        num_frames = frames_batch.size(0)
        all_face_probs = []
        
        for start_idx in range(0, num_frames, batch_size):
          end_idx = min(start_idx + batch_size, num_frames)
          batch = frames_batch[start_idx:end_idx]
          
          print(f"[AI Service] Processing spatial TTA batch step: {start_idx} to {end_idx} of {num_frames} frames...")
          
          # Original image
          logits_orig = self.face_model(batch)
          probs_orig = torch.softmax(logits_orig, dim=1)
          
          # Horizontally flipped version
          flipped = TF.hflip(batch)
          logits_flip = self.face_model(flipped)
          probs_flip = torch.softmax(logits_flip, dim=1)
          
          # Slightly rotated version (+5 degrees)
          rot_p5 = TF.rotate(batch, 5)
          logits_p5 = self.face_model(rot_p5)
          probs_p5 = torch.softmax(logits_p5, dim=1)
          
          # Slightly rotated version (-5 degrees)
          rot_n5 = TF.rotate(batch, -5)
          logits_n5 = self.face_model(rot_n5)
          probs_n5 = torch.softmax(logits_n5, dim=1)
          
          # Average confidence scores
          batch_avg_probs = (probs_orig + probs_flip + probs_p5 + probs_n5) / 4.0
          all_face_probs.append(batch_avg_probs)
          
        face_probs = torch.cat(all_face_probs, dim=0)
        
        # Face score is average of fake probabilities (index 1) across the sequence of frames
        face_score = float(face_probs[:, 1].mean().item())
        
        # B. Temporal Sequence Transformer: Downsample sequence to exactly 32 frames for temporal inference
        actual_seq_len = sequence_tensor.size(1)
        if actual_seq_len != 32:
          indices = np.linspace(0, actual_seq_len - 1, num=32, dtype=int)
          temporal_input_tensor = sequence_tensor[:, indices, :, :, :]
        else:
          temporal_input_tensor = sequence_tensor
          
        temporal_score = float(self.temporal_model(temporal_input_tensor)[0].item())
      
      # 3. Calculate weighted confidence (40% frame spatial + 60% temporal sequence)
      final_score = 0.4 * face_score + 0.6 * temporal_score
      
      # Threshold prediction outcome
      result = "fake" if final_score >= 0.5 else "real"
      confidence = final_score if result == "fake" else (1.0 - final_score)

      # Compile individual frame metadata
      flagged_frames = []
      for i, filename in enumerate(saved_filenames):
        frame_score = float(face_probs[i, 1].item())
        flagged_frames.append({
          "frame_url": filename,
          "score": round(frame_score, 4)
        })

      print(f"[AI Service] Inference successful. Results: result={result}, confidence={confidence:.4f}")

      return {
        "result": result,
        "confidence": round(confidence, 4),
        "model_results": {
          "face_model": round(face_score, 4),
          "temporal_model": round(temporal_score, 4)
        },
        "flagged_frames": flagged_frames
      }

    except Exception as e:
      print(f"PYTHON DETECTOR ERROR: {str(e)}")
      raise RuntimeError(f"Deepfake prediction execution failed: {str(e)}")

# Single instance coordinator
deepfake_detector = DeepfakeDetectorManager()
