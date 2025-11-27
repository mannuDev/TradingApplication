require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const connectDB = require('../config/db');

const products = [
  {
    name: 'Reliance Industries',
    category: 'Stocks',
    pricePerUnit: 2450.50,
    metric: 'P/E Ratio: 28.5'
  },
  {
    name: 'TCS',
    category: 'Stocks',
    pricePerUnit: 3850.75,
    metric: 'P/E Ratio: 32.1'
  },
  {
    name: 'HDFC Mutual Fund',
    category: 'Mutual Funds',
    pricePerUnit: 125.30,
    metric: 'NAV: ₹125.30'
  },
  {
    name: 'Infosys',
    category: 'Stocks',
    pricePerUnit: 1520.25,
    metric: 'P/E Ratio: 25.8'
  },
  {
    name: 'SBI Bluechip Fund',
    category: 'Mutual Funds',
    pricePerUnit: 89.45,
    metric: 'NAV: ₹89.45'
  }
];

const seedProducts = async () => {
  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('Deleting existing products...');
    await Product.deleteMany({});
    console.log('Inserting products...');
    await Product.insertMany(products);
    console.log('✅ Products seeded successfully!');
    console.log(`Inserted ${products.length} products`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding products:', err.message);
    process.exit(1);
  }
};

seedProducts();

