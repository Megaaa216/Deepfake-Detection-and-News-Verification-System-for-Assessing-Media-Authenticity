import os
from typing import List, Optional

try:
  from google import genai
  from google.genai import types
  HAS_GENAI = True
except ImportError:
  HAS_GENAI = False

class GeminiForensicAuditor:
  """
  Secondary visual auditor and news verifier leveraging Gemini 2.5 Flash:
  1. Audits top high-anomaly facial crops extracted by ResNeXt50+LSTM.
  2. Performs multimodal forensic reasoning on visual inconsistencies.
  3. Provides claim fact-checking and propaganda bias analysis on text.
  """
  def __init__(self) -> None:
    self.api_key = os.getenv("GEMINI_API_KEY", "")
    self.client = None
    
    if HAS_GENAI and self.api_key:
      try:
        self.client = genai.Client(api_key=self.api_key)
        print(f"[Gemini Auditor] Initialized Gemini 2.5 Flash auditor successfully!")
      except Exception as e:
        print(f"[WARNING] Gemini client initialization warning: {e}")
    else:
      print("[Gemini Auditor] google-genai package or GEMINI_API_KEY not present.")

  def audit_frames(self, frame_paths: List[str], classification_res: str, score: float) -> Optional[str]:
    """
    Passes the top 3 highest-anomaly face crop images to gemini-2.5-flash for visual forensic reasoning.
    """
    if not self.client or not HAS_GENAI:
      return None

    try:
      image_contents = []
      for path in frame_paths[:3]:
        if os.path.exists(path):
          with open(path, "rb") as f:
            img_bytes = f.read()
            image_contents.append(
              types.Part.from_bytes(
                data=img_bytes,
                mime_type="image/jpeg"
              )
            )

      if not image_contents:
        return None

      prompt = (
        f"You are an expert digital media forensic auditor. "
        f"Our primary ML spatial-temporal detector classified this video sequence as '{classification_res.upper()}' "
        f"with an anomaly score of {score:.2f} (0.0=authentic, 1.0=fake).\n\n"
        f"Inspect the attached high-risk face crops extracted from the video sequence. "
        f"Provide a 2-3 sentence technical forensic audit explaining any visual anomalies "
        f"(e.g., mask edge blending, specular reflection vectors, facial symmetry distortion, mouth viseme sync, or over-smoothed noise grain). "
        f"Be direct, precise, and concise without intro headers."
      )

      contents = image_contents + [prompt]
      model_name = "gemini-1.5-flash"
      try:
        response = self.client.models.generate_content(
          model=model_name,
          contents=contents,
        )
      except Exception:
        response = self.client.models.generate_content(
          model="gemini-2.0-flash",
          contents=contents,
        )

      if response and response.text:
        return response.text.strip()
    except Exception as e:
      print(f"[Gemini Auditor] Frame audit API call warning: {e}")
      return None
    return None

  def audit_text(self, text: str) -> Optional[str]:
    """
    Performs semantic fact verification on news article claims.
    """
    if not self.client or not HAS_GENAI:
      return None

    try:
      prompt = (
        f"You are a professional fact-checker. Audit the following news claim for factual consistency, "
        f"propaganda style, and verifiable claim consensus:\n\n\"{text}\"\n\n"
        f"Write a 2-sentence summary detailing factual alignment and stylistic credibility."
      )

      try:
        response = self.client.models.generate_content(
          model="gemini-1.5-flash",
          contents=prompt,
        )
      except Exception:
        response = self.client.models.generate_content(
          model="gemini-2.0-flash",
          contents=prompt,
        )

      if response and response.text:
        return response.text.strip()
    except Exception as e:
      print(f"[Gemini Auditor] Text audit API call warning: {e}")
      return None
    return None

gemini_auditor = GeminiForensicAuditor()
