const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Watchlist = require('../models/Watchlist');
const Product = require('../models/Product');

// Middleware to check admin role
exports.isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get pending KYC requests
exports.getPendingKYC = async (req, res) => {
  try {
    const users = await User.find({ kycStatus: 'pending' })
      .select('name email pan aadhaar dob address kycImage kycStatus createdAt')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Approve KYC
exports.approveKYC = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.kycStatus = 'verified';
    user.kycRejectionReason = null;
    await user.save();

    res.json({ message: 'KYC approved successfully', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Reject KYC
exports.rejectKYC = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!reason) {
      return res.status(400).json({ message: 'Rejection reason is required' });
    }

    user.kycStatus = 'rejected';
    user.kycRejectionReason = reason;
    await user.save();

    res.json({ message: 'KYC rejected', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all transactions
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('user', 'name email')
      .populate('product', 'name category pricePerUnit')
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const verifiedUsers = await User.countDocuments({ kycStatus: 'verified' });
    const pendingKYC = await User.countDocuments({ kycStatus: 'pending' });
    const totalTransactions = await Transaction.countDocuments();
    
    const totalVolume = await Transaction.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: 'product',
          foreignField: '_id',
          as: 'productData'
        }
      },
      {
        $unwind: '$productData'
      },
      {
        $group: {
          _id: null,
          total: { $sum: { $multiply: ['$units', '$priceAtPurchase'] } }
        }
      }
    ]);

    const totalVolumeAmount = totalVolume.length > 0 ? totalVolume[0].total : 0;

    res.json({
      totalUsers,
      totalAdmins,
      verifiedUsers,
      pendingKYC,
      totalTransactions,
      totalVolume: totalVolumeAmount,
      activeUsers: await User.countDocuments({ isActive: true })
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Ban/Unban user
exports.toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot ban admin users' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({ 
      message: user.isActive ? 'User activated' : 'User banned',
      user 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Make user admin
exports.makeAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = 'admin';
    await user.save();

    res.json({ message: 'User promoted to admin', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

