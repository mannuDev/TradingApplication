const express = require('express');
const router = express.Router();
const { submitKYC, getKYCStatus } = require('../controllers/kycController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.post('/submit', protect, upload.single('kycImage'), submitKYC);
router.get('/status', protect, getKYCStatus);

module.exports = router;

