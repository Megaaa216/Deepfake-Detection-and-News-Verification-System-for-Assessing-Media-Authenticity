import torch
import torch.nn as nn
import timm
from typing import Tuple

class DeepfakeClassifier(nn.Module):
  """
  Dual-stream Deepfake Classification Network:
  1. Spatial Stream: EfficientNet-B0 extracts frame-by-frame face representations.
  2. Temporal Stream: LSTM models sequence consistency across frames.
  """
  def __init__(self, sequence_length: int = 10) -> None:
    super().__init__()
    self.sequence_length = sequence_length
    
    # EfficientNet-B0 backbone (num_classes=0 yields pooled features of size 1280)
    self.backbone = timm.create_model(
      "efficientnet_b0", 
      pretrained=False, 
      num_classes=0
    )
    
    # LSTM to process sequence of frame embeddings
    self.lstm = nn.LSTM(
      input_size=1280, 
      hidden_size=256, 
      num_layers=1, 
      batch_first=True, 
      bidirectional=False
    )
    
    # Classification heads
    self.fc_face = nn.Linear(1280, 1)  # Frame level classification head
    self.fc_temp = nn.Linear(256, 1)   # Sequential level classification head

  def forward(self, x: torch.Tensor) -> Tuple[torch.Tensor, torch.Tensor]:
    """
    Args:
        x (torch.Tensor): Input video tensor of shape (batch, sequence_length, 3, 224, 224)
    Returns:
        Tuple[torch.Tensor, torch.Tensor]: 
            - mean_face_scores: Average frame-level fake scores, shape (batch,)
            - temporal_scores: Sequence temporal fake scores, shape (batch,)
    """
    batch_size, seq_len, c, h, w = x.shape
    
    # Flatten batch and sequence dimensions for EfficientNet feature extractor
    x_flat = x.view(batch_size * seq_len, c, h, w)
    features_flat = self.backbone(x_flat)  # Output shape: (batch * seq_len, 1280)
    
    # 1. Compute frame-level face anomaly scores
    face_logits = self.fc_face(features_flat)
    face_scores = torch.sigmoid(face_logits).view(batch_size, seq_len)
    mean_face_scores = face_scores.mean(dim=1)  # Shape: (batch,)
    
    # 2. Reshape features back for LSTM: (batch, sequence_length, 1280)
    features = features_flat.view(batch_size, seq_len, -1)
    lstm_out, _ = self.lstm(features)  # Shape: (batch, seq_len, 256)
    
    # Extrapolate sequence features from the final LSTM step
    last_step = lstm_out[:, -1, :]  # Shape: (batch, 256)
    temporal_logit = self.fc_temp(last_step)
    temporal_scores = torch.sigmoid(temporal_logit).squeeze(1)  # Shape: (batch,)
    
    return mean_face_scores, temporal_scores
