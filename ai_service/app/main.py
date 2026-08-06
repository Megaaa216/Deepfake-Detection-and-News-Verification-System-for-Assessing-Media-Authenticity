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

from fastapi.staticfiles import StaticFiles
import os

static_frames_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../static_frames"))
os.makedirs(static_frames_path, exist_ok=True)
app.mount("/public/frames", StaticFiles(directory=static_frames_path), name="static_frames")

from pydantic import BaseModel
from app.services.detector import deepfake_detector
from app.services.downloader import download_video_link
from fastapi import HTTPException
from news_verifier import news_verifier

class VideoAnalysisRequest(BaseModel):
  video_path: str

class LinkAnalysisRequest(BaseModel):
  video_url: str

class TextAnalysisRequest(BaseModel):
  text: str

@app.post("/analyze", tags=["analysis"])
async def analyze_video(payload: VideoAnalysisRequest):
  """
  Accepts local file path of saved video, runs face detection, 
  and performs sequence inference.
  """
  try:
    static_frames_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../static_frames"))
    from news_verifier import cleanup_previous_frames
    cleanup_previous_frames(static_frames_path)
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
    static_frames_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../static_frames"))
    from news_verifier import cleanup_previous_frames
    cleanup_previous_frames(static_frames_path)
    # 1. Download video to temporary folder
    local_path = download_video_link(payload.video_url, temp_dir)
    
    # 2. Run model inference on downloaded local file
    result = await deepfake_detector.analyze_video(local_path)
    return result
  except ValueError as val_err:
    print(f"[AI Service Ingestion Error] {val_err}")
    return JSONResponse(
      status_code=400,
      content={
        "success": False,
        "detail": str(val_err),
        "message": str(val_err),
        "error_code": "INGESTION_FAILED",
        "unavailable": True
      }
    )
  except Exception as e:
    print(f"[AI Service Error] analyze_link failed: {e}")
    return JSONResponse(
      status_code=400,
      content={
        "success": False,
        "detail": f"Failed to ingest video stream: {str(e)}",
        "message": f"Failed to ingest video stream: {str(e)}",
        "error_code": "INGESTION_FAILED",
        "unavailable": True
      }
    )
  finally:
    # 3. Securely clean up local temporary file
    if local_path and os.path.exists(local_path):
      try:
        os.remove(local_path)
        print(f"[AI Service] Cleaned up temporary download file: {local_path}")
      except Exception as rm_err:
        print(f"[WARNING] Failed to remove temp file {local_path}: {rm_err}")

@app.post("/analyze-text", tags=["analysis"])
async def analyze_text(payload: TextAnalysisRequest):
  """
  Accepts news article text content, calculates credibility score,
  sentiment bias, and checks claim match consensus.
  """
  try:
    result = news_verifier.verify(payload.text)
    return result
  except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))

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
