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
from fastapi import HTTPException

class VideoAnalysisRequest(BaseModel):
  video_path: str

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
