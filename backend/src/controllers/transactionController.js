const Transaction = require('../models/Transaction');
const Product = require('../models/Product');
const User = require('../models/User');


exports.buyProduct = async (req, res) => {
try {
const { productId, units } = req.body;
const product = await Product.findById(productId);
if (!product) return res.status(404).json({ message: 'Product not found' });
const total = product.pricePerUnit * units;
const user = await User.findById(req.user._id);
if (user.walletBalance < total) return res.status(400).json({ message: 'Insufficient balance' });


// Deduct balance
user.walletBalance -= total;
await user.save();


// Create transaction
const tx = await Transaction.create({
user: user._id,
product: product._id,
units,
priceAtPurchase: product.pricePerUnit
});


res.status(201).json({ message: 'Purchase successful', transaction: tx });
} catch (err) {
res.status(500).json({ message: err.message });
}
};


exports.getHistory = async (req, res) => {
try {
const txs = await Transaction.find({ user: req.user._id }).populate('product');
res.json(txs);
} catch (err) {
res.status(500).json({ message: err.message });
}
};