# Quick Setup Guide

## Step 1: Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. **IMPORTANT**: Create a `.env` file in the `backend` folder with:
```
PORT=5000
MONGO_URI=mongodb+srv://mannu:mannu%409988@mini-trading-app.ochevnx.mongodb.net/
JWT_SECRET=yourSecretKey
```

**Note**: The password `mannu@9988` needs to be URL encoded as `mannu%409988` in the MongoDB URI.

4. Seed the database:
```bash
npm run seed
```

5. Start the server:
```bash
npm run dev
```

Backend will run on http://localhost:5000

## Step 2: Frontend Setup

1. Open a new terminal and navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

Frontend will run on http://localhost:3000

## Step 3: Test the Application

1. Open http://localhost:3000 in your browser
2. Register a new account
3. Complete KYC form
4. Browse products and make purchases
5. View your portfolio

## Troubleshooting

- **MongoDB Connection Error**: Make sure your MongoDB URI is correct and the password is URL encoded
- **Port Already in Use**: Change the PORT in `.env` file if 5000 is already in use
- **CORS Errors**: Make sure backend is running on port 5000
- **Module Not Found**: Run `npm install` in both backend and frontend directories

