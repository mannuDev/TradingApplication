const Watchlist = require('../models/Watchlist');
const Product = require('../models/Product');

exports.addToWatchlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const exists = await Watchlist.findOne({ user: req.user._id, product: productId });
    if (exists) return res.status(400).json({ message: 'Already in watchlist' });

    const watchlist = await Watchlist.create({
      user: req.user._id,
      product: productId
    });

    res.status(201).json({ message: 'Added to watchlist', watchlist });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.removeFromWatchlist = async (req, res) => {
  try {
    const { productId } = req.params;
    await Watchlist.findOneAndDelete({ user: req.user._id, product: productId });
    res.json({ message: 'Removed from watchlist' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getWatchlist = async (req, res) => {
  try {
    const watchlist = await Watchlist.find({ user: req.user._id }).populate('product');
    res.json(watchlist.map(w => w.product));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

