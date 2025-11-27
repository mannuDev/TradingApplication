const Transaction = require('../models/Transaction');
const Product = require('../models/Product');
const User = require('../models/User');

exports.getPortfolio = async (req, res) => {
  try {
    const txs = await Transaction.find({ user: req.user._id }).populate('product');
    
    // Aggregate by product
    const portfolio = {};
    txs.forEach(t => {
      const pid = t.product._id.toString();
      if (!portfolio[pid]) {
        portfolio[pid] = {
          product: t.product,
          totalUnits: 0,
          totalInvested: 0
        };
      }
      portfolio[pid].totalUnits += t.units;
      portfolio[pid].totalInvested += t.units * t.priceAtPurchase;
    });

    // Calculate current value and returns
    let totalInvested = 0;
    let totalCurrentValue = 0;
    
    const portfolioArray = Object.values(portfolio).map(item => {
      const currentValue = item.totalUnits * item.product.pricePerUnit;
      const returns = currentValue - item.totalInvested;
      totalInvested += item.totalInvested;
      totalCurrentValue += currentValue;
      
      return {
        product: item.product,
        units: item.totalUnits,
        invested: item.totalInvested,
        currentValue,
        returns
      };
    });

    res.json({
      portfolio: portfolioArray,
      summary: {
        totalInvested,
        totalCurrentValue,
        totalReturns: totalCurrentValue - totalInvested
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getWalletBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('walletBalance');
    res.json({ walletBalance: user.walletBalance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
