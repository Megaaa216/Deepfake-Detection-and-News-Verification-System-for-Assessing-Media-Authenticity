const express = require('express');
const router = express.Router();
const deepfakeController = require('../controllers/deepfakeController');
const auth = require('../middleware/authMiddleware');

router.post('/analyze', auth, deepfakeController.uploadAndAnalyze);
router.get('/history', auth, deepfakeController.getHistory);
router.get('/:id', auth, deepfakeController.getById);

module.exports = router;
