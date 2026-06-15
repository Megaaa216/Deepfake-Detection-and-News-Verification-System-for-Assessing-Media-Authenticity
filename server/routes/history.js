const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, historyController.getAll);
router.get('/:id', auth, historyController.getById);

module.exports = router;
