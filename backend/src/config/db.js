const mongoose = require('mongoose');

const connectDB = async (retries = 5, delay = 5000) => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // 30 seconds
      socketTimeoutMS: 45000, // 45 seconds
      retryWrites: true,
      w: 'majority',
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected successfully');
    });

  } catch (err) {
    console.error(`MongoDB connection error (Attempt ${6 - retries}/5):`, err.message);
    
    if (retries > 0) {
      console.log(`Retrying connection in ${delay / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return connectDB(retries - 1, delay);
    } else {
      console.error('Failed to connect to MongoDB after 5 attempts');
      console.error('Please check:');
      console.error('1. MONGO_URI in the .env file');
      console.error('2. Special characters in password are URL encoded (@ becomes %40)');
      console.error('3. MongoDB Atlas network access (IP whitelist)');
      console.error('4. Internet connection');
      process.exit(1);
    }
  }
};

module.exports = connectDB;


