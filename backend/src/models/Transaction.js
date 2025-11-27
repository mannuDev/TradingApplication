const mongoose = require('mongoose');


const transactionSchema = new mongoose.Schema({
user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
units: { type: Number, required: true },
priceAtPurchase: { type: Number, required: true },
createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Transaction', transactionSchema);