const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reportsController');
const auth = require('../middleware/authMiddleware');

router.post('/generate', auth, reportsController.generateReport);
router.get('/', auth, reportsController.listReports);
router.get('/:id', auth, reportsController.getById);

module.exports = router;
