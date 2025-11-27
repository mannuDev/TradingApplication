const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
name: { type: String, required: true },
category: { type: String },
pricePerUnit: { type: Number, required: true },
metric: { type: String },
createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Product', productSchema);