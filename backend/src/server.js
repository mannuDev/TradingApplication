require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const mongoose = require('mongoose');
const net = require('net');

// Check if port is available
const isPortAvailable = (port) => {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.once('close', () => resolve(true));
      server.close();
    });
    server.on('error', () => resolve(false));
  });
};

// Connect to database first, then start server
const startServer = async () => {
  try {
    await connectDB();
    
    // Graceful shutdown
    let server;
    let isShuttingDown = false;
    
    const shutdown = async (signal) => {
      if (isShuttingDown) return;
      isShuttingDown = true;
      
      console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
      
      if (server) {
        return new Promise((resolve) => {
          server.close(() => {
            console.log('✅ Server closed');
            mongoose.connection.close(false, () => {
              console.log('✅ MongoDB connection closed');
              resolve();
            });
          });
          
          // Force close after 5 seconds
          setTimeout(() => {
            console.log('⚠️  Forcing shutdown...');
            process.exit(0);
          }, 5000);
        });
      } else {
        await mongoose.connection.close();
        console.log('✅ MongoDB connection closed');
        process.exit(0);
      }
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    
    // Handle nodemon restart (Windows doesn't support SIGUSR2, so we use SIGTERM)
    if (process.platform !== 'win32') {
      process.once('SIGUSR2', () => {
        shutdown('SIGUSR2').then(() => {
          process.kill(process.pid, 'SIGUSR2');
        });
      });
    }

    const PORT = process.env.PORT || 5000;
    
    // Check if port is available (with retries for nodemon restarts)
    let portAvailable = false;
    let retries = 5;
    
    while (!portAvailable && retries > 0) {
      portAvailable = await isPortAvailable(PORT);
      if (!portAvailable) {
        retries--;
        if (retries > 0) {
          console.log(`⏳ Port ${PORT} busy, waiting 1 second... (${retries} retries left)`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
    
    if (!portAvailable) {
      console.error(`❌ Port ${PORT} is still in use after retries!`);
      console.error('\n💡 Quick Fix:');
      console.error(`   cd backend && .\\kill-port.ps1`);
      console.error('\n💡 Or use a different port:');
      console.error(`   Set PORT=5001 in .env file`);
      process.exit(1);
    }
    
    server = app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🌐 API available at http://localhost:${PORT}`);
    });

    // Handle server errors
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use!`);
        console.error('\n💡 Quick Fix:');
        console.error(`   cd backend && .\\kill-port.ps1`);
        console.error('\n💡 Or use a different port:');
        console.error(`   Set PORT=5001 in .env file`);
        process.exit(1);
      } else {
        console.error('Server error:', err);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
