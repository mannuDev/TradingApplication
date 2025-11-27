const express = require('express');
const router = express.Router();
const { buyProduct, getHistory } = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

router.post('/buy', protect, buyProduct);
router.get('/history', protect, getHistory);

module.exports = router;

