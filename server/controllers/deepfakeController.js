const multer = require('multer');
const path = require('path');
const fs = require('fs');
const DeepfakeResult = require('../models/DeepfakeResult');
const deepfakeService = require('../services/deepfakeService');

const uploadDir = path.join(__dirname, '..', 'uploads');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/jpg'];
  if (!allowed.includes(file.mimetype)) return cb(new Error('Invalid file type'), false);
  cb(null, true);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }).single('image');

exports.uploadAndAnalyze = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) return next(err);
    if (!req.file) return res.status(400).json({ error: 'Image is required (field name: image)' });
    try {
      const filePath = req.file.path;
      const result = await deepfakeService.analyzeImage(filePath);
      const record = new DeepfakeResult({
        user: req.user ? req.user._id : null,
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
        deepfakeProbability: result.probability,
        confidence: result.confidence,
        label: result.label,
        explanation: result.explanation,
        details: result,
      });
      await record.save();
      res.json({ id: record._id, ...result });
    } catch (e) {
      next(e);
    }
  });
};

exports.getHistory = async (req, res, next) => {
  try {
    const items = await DeepfakeResult.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const item = await DeepfakeResult.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    next(err);
  }
};
