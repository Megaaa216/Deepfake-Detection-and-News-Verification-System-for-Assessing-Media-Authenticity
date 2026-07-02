const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const detectionController = require("../controllers/detection.controller");

const router = express.Router();

// Ensure uploads folder exists in backend root directory
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up disk storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null, 
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  }
});

// Init multer upload middleware
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // Limit to 50MB videos
  }
});

// POST route for video upload
router.post("/video", upload.single("video"), detectionController.uploadVideo);

// POST route for video URL link upload
router.post("/video-link", express.json(), detectionController.analyzeVideoLink);

module.exports = router;
