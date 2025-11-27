const express = require('express');
const router = express.Router();
const { getPortfolio, getWalletBalance } = require('../controllers/portfolioController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getPortfolio);
router.get('/wallet', protect, getWalletBalance);

module.exports = router;

