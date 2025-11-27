const express = require('express');
const router = express.Router();
const { addToWatchlist, removeFromWatchlist, getWatchlist } = require('../controllers/watchlistController');
const { protect } = require('../middleware/authMiddleware');

router.post('/add', protect, addToWatchlist);
router.delete('/remove/:productId', protect, removeFromWatchlist);
router.get('/', protect, getWatchlist);

module.exports = router;

