const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const logger = require("../utils/logger");

exports.uploadVideo = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "No video file uploaded");
  }

  logger.info(`Received video upload: ${req.file.originalname} (${req.file.size} bytes)`);

  // Return the mock JSON response exactly as specified
  return res.status(200).json({
    result: "fake",
    confidence: 0.85,
    model_results: {
      face_model: 0.90,
      temporal_model: 0.78
    }
  });
});
