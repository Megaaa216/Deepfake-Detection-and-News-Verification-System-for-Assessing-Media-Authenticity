const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const auth = require('../middleware/authMiddleware');

router.post('/verify', auth, newsController.verifyNews);
router.get('/history', auth, newsController.getHistory);
router.get('/:id', auth, newsController.getById);

module.exports = router;
