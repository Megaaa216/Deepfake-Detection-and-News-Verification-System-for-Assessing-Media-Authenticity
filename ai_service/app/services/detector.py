import torch
import os
from safetensors.torch import load_file
from app.services.preprocessor import VideoPreprocessor
from app.services.models import FaceClassifier, VideoTransformerClassifier

class DeepfakeDetectorManager:
  """
  Coordinates preprocessing and model inference using true weights:
  1. Receives video path.
  2. Runs VideoPreprocessor to crop and build sequence tensor.
  3. Executes dual-stream predictions:
     - Spatial: torchvision EfficientNet-B0 face-by-frame binary classification.
     - Temporal: Custom Transformer sequence model.
  4. Formats predictions and returns confidence scores.
  """
  def __init__(self) -> None:
    self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    self.preprocessor = VideoPreprocessor(target_size=224)
    
    # Define weight paths relative to the project workspace root directory
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../"))
    model1_path = os.path.join(base_dir, "video_model_1", "efficientnet_b0_ffpp_c23.pth")
    model2_path = os.path.join(base_dir, "video_model_2", "model.safetensors")
    
    # 1. Instantiate Spatial Face Model and load .pth weights
    self.face_model = FaceClassifier()
    if os.path.exists(model1_path):
      print(f"[AI Service] Loading face model weights from: {model1_path}")
      state_dict = torch.load(model1_path, map_location=self.device)
      self.face_model.model.load_state_dict(state_dict)
    else:
      print(f"[WARNING] Face model weights not found at {model1_path}. Initializing with random weights.")
      
    self.face_model.to(self.device)
    self.face_model.eval()

    # 2. Instantiate Sequence Transformer Model and load .safetensors weights
    self.temporal_model = VideoTransformerClassifier(sequence_length=10)
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
      # 1. Preprocess video frames into a tensor: shape (1, 10, 3, 224, 224)
      print(f"[AI Service] Preprocessing video file: {video_path}")
      sequence_tensor = self.preprocessor.preprocess_video(
        video_path, 
        sequence_length=10
      )
      sequence_tensor = sequence_tensor.to(self.device)

      # 2. Execute inference under no-grad context
      print(f"[AI Service] Tensor shape entering model: {sequence_tensor.shape}")
      with torch.no_grad():
        # A. Spatial Face Model: Reshape sequence (1, 10, 3, 224, 224) to a batch of frames (10, 3, 224, 224)
        frames_batch = sequence_tensor.squeeze(0)  # Shape: (10, 3, 224, 224)
        face_logits = self.face_model(frames_batch)  # Shape: (10, 2)
        face_probs = torch.softmax(face_logits, dim=1)  # Softmax probabilities
        
        # Face score is average of fake probabilities (index 1) across the sequence of frames
        face_score = float(face_probs[:, 1].mean().item())
        
        # B. Temporal Sequence Transformer: Run on full sequence tensor
        temporal_score = float(self.temporal_model(sequence_tensor)[0].item())
      
      # 3. Calculate weighted confidence (40% frame spatial + 60% temporal sequence)
      final_score = 0.4 * face_score + 0.6 * temporal_score
      
      # Threshold prediction outcome
      result = "fake" if final_score >= 0.5 else "real"
      confidence = final_score if result == "fake" else (1.0 - final_score)

      print(f"[AI Service] Inference successful. Results: result={result}, confidence={confidence:.4f}")

      return {
        "result": result,
        "confidence": round(confidence, 4),
        "model_results": {
          "face_model": round(face_score, 4),
          "temporal_model": round(temporal_score, 4)
        }
      }

    except Exception as e:
      raise RuntimeError(f"Deepfake prediction execution failed: {str(e)}")

# Single instance coordinator
deepfake_detector = DeepfakeDetectorManager()
