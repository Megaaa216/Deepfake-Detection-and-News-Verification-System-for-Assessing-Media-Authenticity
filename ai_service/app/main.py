from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.config import settings
from app.routes import analysis

app = FastAPI(
    title="Deepfake Detection AI Microservice",
    description="FastAPI service for deep learning models analyzing media files for authenticity.",
    version="1.0.0"
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
app.include_router(analysis.router, prefix="/api/v1/analysis", tags=["analysis"])

from pydantic import BaseModel
from app.services.detector import deepfake_detector
from app.services.downloader import download_video_link
from fastapi import HTTPException
import os

class VideoAnalysisRequest(BaseModel):
  video_path: str

class LinkAnalysisRequest(BaseModel):
  video_url: str

@app.post("/analyze", tags=["analysis"])
async def analyze_video(payload: VideoAnalysisRequest):
  """
  Accepts local file path of saved video, runs face detection, 
  and performs sequence inference.
  """
  try:
    result = await deepfake_detector.analyze_video(payload.video_path)
    return result
  except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze-link", tags=["analysis"])
async def analyze_link(payload: LinkAnalysisRequest):
  """
  Downloads a streaming video from platform link or direct link,
  runs the deepfake classification, and cleans up the temporary file.
  """
  temp_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../temp_downloads"))
  local_path = None
  try:
    # 1. Download video to temporary folder
    local_path = download_video_link(payload.video_url, temp_dir)
    
    # 2. Run model inference on downloaded local file
    result = await deepfake_detector.analyze_video(local_path)
    return result
  except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))
  finally:
    # 3. Securely clean up local temporary file
    if local_path and os.path.exists(local_path):
      try:
        os.remove(local_path)
        print(f"[AI Service] Cleaned up temporary download file: {local_path}")
      except Exception as rm_err:
        print(f"[WARNING] Failed to remove temp file {local_path}: {rm_err}")

@app.get("/", tags=["health"])
async def root():
  return {
    "status": "online",
    "service": "deepfake-detection-ai-service",
    "version": "1.0.0"
  }

@app.get("/health", tags=["health"])
async def health_check():
  return {"status": "healthy"}

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
  return JSONResponse(
    status_code=500,
    content={"success": False, "message": f"Internal Server Error: {str(exc)}"}
  )
