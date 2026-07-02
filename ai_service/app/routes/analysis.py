from fastapi import APIRouter, UploadFile, File, HTTPException, status
from app.services.detector import deepfake_detector

router = APIRouter()

@router.post("/upload")
async def upload_media(file: UploadFile = File(...)):
  """
  Accepts a media file upload (image/video), validates its content type, 
  and passes it to the ML/Deep Learning pipeline for analysis.
  """
  allowed_types = [
    "image/jpeg", 
    "image/jpg", 
    "image/png", 
    "video/mp4", 
    "video/quicktime", 
    "video/x-matroska"
  ]
  
  if file.content_type not in allowed_types:
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST,
      detail=f"Unsupported file type: {file.content_type}. Only images (JPEG, PNG) and videos (MP4, MOV, MKV) are supported."
    )

  try:
    # Read binary stream into memory
    contents = await file.read()
    
    # Delegate to model inference pipeline
    analysis_result = await deepfake_detector.analyze(
      contents, 
      file.filename, 
      file.content_type
    )
    
    return {
      "success": True,
      "filename": file.filename,
      "contentType": file.content_type,
      "result": analysis_result
    }
  except Exception as e:
    raise HTTPException(
      status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
      detail=f"Error analyzing media file: {str(e)}"
    )
