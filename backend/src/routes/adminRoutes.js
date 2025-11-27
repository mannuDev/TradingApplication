const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  isAdmin,
  getAllUsers,
  getUserById,
  getPendingKYC,
  approveKYC,
  rejectKYC,
  getAllTransactions,
  getDashboardStats,
  toggleUserStatus,
  makeAdmin
} = require('../controllers/adminController');

// All admin routes require authentication and admin role
router.use(protect);
router.use(isAdmin);

// Dashboard
router.get('/dashboard', getDashboardStats);

// User management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.patch('/users/:id/status', toggleUserStatus);
router.patch('/users/:id/make-admin', makeAdmin);

// KYC management
router.get('/kyc/pending', getPendingKYC);
router.patch('/kyc/:userId/approve', approveKYC);
router.patch('/kyc/:userId/reject', rejectKYC);

// Transactions
router.get('/transactions', getAllTransactions);

module.exports = router;

