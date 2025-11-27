# Quick Start Guide

## ✅ Database Setup Complete!

The MongoDB connection has been fixed and products have been seeded successfully.

## 🚀 Start the Application

### Step 1: Start Backend Server

Open a terminal and run:
```bash
cd backend
node src/server.js
```

Or with nodemon (auto-restart on changes):
```bash
cd backend
npm run dev
```

You should see:
```
MongoDB connected: ac-ahvlv2k-shard-00-00.ochevnx.mongodb.net
Server running on port 5000
API available at http://localhost:5000
```

### Step 2: Start Frontend Server

Open a **NEW** terminal and run:
```bash
cd frontend
npm start
```

The frontend will automatically open at `http://localhost:3000`

## 🧪 Test the API (Optional)

Once the backend is running, you can test the API:
```bash
cd backend
node test-api.js
```

## 📋 What Was Fixed

1. ✅ MongoDB URI - Password is now URL encoded (`@` → `%40`)
2. ✅ Database connection - Improved error handling
3. ✅ Products seeded - 5 products added to database
4. ✅ Server startup - Now waits for DB connection before starting

## 🎯 Next Steps

1. **Backend is running** - Check terminal for "Server running on port 5000"
2. **Frontend is running** - Check browser at http://localhost:3000
3. **Register a user** - Create an account
4. **Complete KYC** - Submit PAN and ID proof
5. **Browse products** - View the 5 seeded products
6. **Make a purchase** - Buy products with your ₹100,000 wallet
7. **View portfolio** - Check your investments and returns

## 🐛 Troubleshooting

### Backend won't start
- Check if MongoDB URI is correct in `.env` file
- Make sure password is URL encoded (`mannu%409988`)
- Check if port 5000 is available

### Frontend shows "Failed to load products"
- Make sure backend server is running on port 5000
- Check browser console for CORS errors
- Verify API URL in `frontend/src/api.js` is `http://localhost:5000/api`

### Database connection error
- Verify MongoDB Atlas cluster is accessible
- Check network/IP whitelist in MongoDB Atlas
- Ensure password in URI is URL encoded

## ✅ All Features Working

- ✅ User Registration & Login
- ✅ KYC Form Submission
- ✅ Product Listing (5 products)
- ✅ Product Details with Charts
- ✅ Buy Products
- ✅ Portfolio Dashboard
- ✅ Watchlist
- ✅ Transaction History

Enjoy your Mini Finance App! 🎉

