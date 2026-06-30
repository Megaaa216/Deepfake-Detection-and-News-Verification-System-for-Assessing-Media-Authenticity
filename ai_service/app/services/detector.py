import torch
from app.services.preprocessor import VideoPreprocessor
from app.services.models import DeepfakeClassifier

class DeepfakeDetectorManager:
  """
  Coordinates preprocessing and model inference:
  1. Receives video path.
  2. Runs VideoPreprocessor to crop and build sequence tensor.
  3. Executes dual-stream DeepfakeClassifier forward pass.
  4. Formats predictions and returns confidence scores.
  """
  def __init__(self) -> None:
    self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    self.preprocessor = VideoPreprocessor(target_size=224)
    
    # Instantiate the classifier with random weights (no pretrained weights download)
    self.model = DeepfakeClassifier(sequence_length=10)
    self.model.to(self.device)
    self.model.eval()  # Set model to evaluation mode

  async def analyze_video(self, video_path: str) -> dict:
    """
    Runs media processing and PyTorch classification.
    """
    try:
      # 1. Preprocess video frames into a tensor: shape (1, 10, 3, 224, 224)
      print(f"[AI Service] Preprocessing video file: {video_path}")
      sequence_tensor = self.preprocessor.preprocess_video(
        video_path, 
        sequence_length=10
      )
      sequence_tensor = sequence_tensor.to(self.device)

      # 2. Run model forward pass under no-grad context
      print(f"[AI Service] Tensor shape entering model: {sequence_tensor.shape}")
      with torch.no_grad():
        face_scores, temporal_scores = self.model(sequence_tensor)
      
      # Extract raw float values
      face_score = float(face_scores[0].item())
      temporal_score = float(temporal_scores[0].item())
      
      # 3. Calculate weighted confidence (40% frame spatial + 60% temporal sequence)
      final_score = 0.4 * face_score + 0.6 * temporal_score
      
      # Threshold prediction outcome
      result = "fake" if final_score >= 0.5 else "real"
      confidence = final_score if result == "fake" else (1.0 - final_score)

      return {
        "result": result,
        "confidence": round(confidence, 4),
        "model_results": {
          "face_model": round(face_score, 4),
          "temporal_model": round(temporal_score, 4)
        }
      }

    except Exception as e:
      # Return fallback error mapping or raise
      raise RuntimeError(f"Deepfake prediction execution failed: {str(e)}")

# Single instance coordinator
deepfake_detector = DeepfakeDetectorManager()
