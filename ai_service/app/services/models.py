import torch
import torch.nn as nn
import torchvision.models as models

class FaceClassifier(nn.Module):
  """
  Frame-level spatial face classifier using standard torchvision EfficientNet-B0
  modified for binary classification (real vs fake).
  """
  def __init__(self) -> None:
    super().__init__()
    # Instantiate standard torchvision efficientnet_b0
    self.model = models.efficientnet_b0()
    # Replace final linear classifier layer to match FaceForensics++ 2-class output shape
    self.model.classifier = nn.Sequential(
      nn.Dropout(p=0.2, inplace=True),
      nn.Linear(in_features=1280, out_features=2)
    )

  def forward(self, x: torch.Tensor) -> torch.Tensor:
    """
    Args:
        x (torch.Tensor): Crop tensor, shape (batch, 3, 224, 224)
    Returns:
        torch.Tensor: Logits, shape (batch, 2)
    """
    return self.model(x)


class PatchEmbed(nn.Module):
  """
  Linear projection mapping frame feature dimensions to transformer dimensions.
  """
  def __init__(self) -> None:
    super().__init__()
    self.proj = nn.Linear(1280, 384)

  def forward(self, x: torch.Tensor) -> torch.Tensor:
    return self.proj(x)


class TransformerBlock(nn.Module):
  """
  Standard Pre-LayerNorm Transformer Encoder layer.
  Ensures parameter keys map exactly to target safetensors names (norm1, attn, norm2, mlp).
  """
  def __init__(self, dim: int = 384, num_heads: int = 8, mlp_dim: int = 1536) -> None:
    super().__init__()
    self.norm1 = nn.LayerNorm(dim)
    self.attn = nn.MultiheadAttention(embed_dim=dim, num_heads=num_heads, batch_first=True)
    self.norm2 = nn.LayerNorm(dim)
    self.mlp = nn.Sequential(
      nn.Linear(dim, mlp_dim),
      nn.GELU(),
      nn.Linear(mlp_dim, dim)
    )

  def forward(self, x: torch.Tensor) -> torch.Tensor:
    # 1. Pre-norm self-attention residual connection
    x_norm = self.norm1(x)
    attn_out, _ = self.attn(x_norm, x_norm, x_norm)
    x = x + attn_out
    
    # 2. Pre-norm feed-forward network residual connection
    x_norm2 = self.norm2(x)
    mlp_out = self.mlp(x_norm2)
    x = x + mlp_out
    return x


class VideoTransformerClassifier(nn.Module):
  """
  Dual-stream Sequence Transformer Network:
  1. Backbone: EfficientNet-B0 extracts features for each frame.
  2. Sequential: Transformer Blocks evaluate temporal flow anomalies.
  """
  def __init__(self, sequence_length: int = 10) -> None:
    super().__init__()
    self.sequence_length = sequence_length
    
    # Feature Extractor Backbone (torchvision efficientnet_b0)
    self.backbone = models.efficientnet_b0()
    # Remove classifier to save memory, keeping only features extractor
    self.backbone.classifier = nn.Identity()
    
    # Projection layer mapping feature size (1280) to transformer dimensions (384)
    self.patch_embed = PatchEmbed()
    
    # Transformer Tokens & Position embeddings
    self.cls_token = nn.Parameter(torch.zeros(1, 1, 384))
    self.pos_embed = nn.Parameter(torch.zeros(1, 50, 384))
    
    # 6 Transformer layers
    self.blocks = nn.ModuleList([
      TransformerBlock(dim=384, num_heads=8, mlp_dim=1536) 
      for _ in range(6)
    ])
    
    # Classification Head (matches keys head.0, head.1, head.4 in safetensors)
    self.head = nn.Sequential(
      nn.LayerNorm(384),
      nn.Linear(384, 128),
      nn.GELU(),
      nn.Dropout(0.1),
      nn.Linear(128, 1)
    )

  def forward(self, x: torch.Tensor) -> torch.Tensor:
    """
    Args:
        x (torch.Tensor): Input video tensor, shape (batch, sequence_length, 3, 224, 224)
    Returns:
        torch.Tensor: Combined probability prediction (sigmoid), shape (batch,)
    """
    batch_size, seq_len, c, h, w = x.shape
    
    # Flatten sequence frames to process in batch through backbone
    x_flat = x.view(batch_size * seq_len, c, h, w)
    features_flat = self.backbone.features(x_flat)  # Shape: (batch * seq_len, 1280, 7, 7)
    
    # Global average pooling to reduce features to shape (batch * seq_len, 1280)
    features_pooled = self.backbone.avgpool(features_flat).squeeze(-1).squeeze(-1)
    
    # Reshape back to sequence format: (batch, sequence_length, 1280)
    features = features_pooled.view(batch_size, seq_len, -1)
    
    # Project embeddings to 384
    x_emb = self.patch_embed(features)  # Shape: (batch, seq_len, 384)
    
    # Prepend CLS token
    cls_tokens = self.cls_token.expand(batch_size, -1, -1)  # Shape: (batch, 1, 384)
    x_tokens = torch.cat((cls_tokens, x_emb), dim=1)  # Shape: (batch, seq_len + 1, 384)
    
    # Add positional encoding
    num_tokens = x_tokens.shape[1]
    x_pos = x_tokens + self.pos_embed[:, :num_tokens, :]
    
    # Run through Transformer Blocks
    for block in self.blocks:
      x_pos = block(x_pos)
      
    # Extract class token representation (index 0)
    cls_out = x_pos[:, 0, :]  # Shape: (batch, 384)
    
    # Classify output
    logit = self.head(cls_out).squeeze(1)  # Shape: (batch,)
    score = torch.sigmoid(logit)
    return score
