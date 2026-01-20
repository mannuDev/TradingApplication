# Mini Finance Trading App

A full-stack financial trading application built with Node.js, Express, MongoDB, and React.

## Features

### 1. Authentication & KYC
- User registration and login with JWT authentication
- KYC form submission with PAN number and ID proof upload
- Secure password hashing with bcrypt

### 2. Product Listing & Details
- Display investment products (stocks and mutual funds)
- Product detail pages with price history charts
- Product categories and key metrics (P/E ratio, NAV)

### 3. Transactions & Portfolio
- Buy products with unit selection
- Virtual wallet with ₹100,000 initial balance
- Transaction history tracking
- Portfolio dashboard showing:
  - Total invested amount
  - Current portfolio value
  - Returns (profit/loss)
  - Individual holdings

### 4. Watchlist
- Add/remove products to watchlist
- View all watchlisted products


**🎬 Application Demo**

### 🔐 Authentication
**Login Page**
<img width="1919" height="705" alt="image" src="https://github.com/user-attachments/assets/1a3703da-f9fc-40c9-8e71-0ab77725d4f2" />

### 📊 Product Listing
<img width="1919" height="771" alt="image" src="https://github.com/user-attachments/assets/9905614d-0270-45f4-b74d-5fa542935d2e" />

### 📈 Product Details & Chart
<img width="1919" height="847" alt="image" src="https://github.com/user-attachments/assets/dc8d3140-12e0-475d-8708-2426fb5d373f" />

### 💼 Portfolio Dashboard
<img width="1913" height="795" alt="image" src="https://github.com/user-attachments/assets/8571815e-339a-4e42-8e4f-7beb920cddc5" />,
<img width="1919" height="842" alt="image" src="https://github.com/user-attachments/assets/d1158baf-34d3-492b-852b-5cf34b564ecb" />

## Tech Stack

### Backend
- Node.js + Express
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads
- bcryptjs for password hashing

### Frontend
- React
- React Router for navigation
- Axios for API calls
- Chart.js for price charts
- Modern, responsive UI

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `backend` directory with the following variables:
```
PORT=5000
MONGO_URI=DB_URI
JWT_SECRET=yourSecretKey
```

**Note**: If your MongoDB password contains special characters like `@`, you need to URL encode them. For example, `@` becomes `%40`. You can copy the `.env.example` file and update it with your credentials.

4. Seed the database with sample products:
```bash
npm run seed
```

5. Start the backend server:
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
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

The frontend will run on `http://localhost:3000`

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
  - Body: `{ name, email, password }`
  
- `POST /api/auth/login` - Login user
  - Body: `{ email, password }`

### KYC Endpoints

- `POST /api/kyc/submit` - Submit KYC form (requires authentication)
  - Body: FormData with `pan` and `kycImage` (file)
  
- `GET /api/kyc/status` - Get KYC status (requires authentication)

### Product Endpoints

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID

### Transaction Endpoints

- `POST /api/transactions/buy` - Buy a product (requires authentication)
  - Body: `{ productId, units }`
  
- `GET /api/transactions/history` - Get transaction history (requires authentication)

### Portfolio Endpoints

- `GET /api/portfolio` - Get portfolio summary (requires authentication)
- `GET /api/portfolio/wallet` - Get wallet balance (requires authentication)

### Watchlist Endpoints

- `POST /api/watchlist/add` - Add product to watchlist (requires authentication)
  - Body: `{ productId }`
  
- `DELETE /api/watchlist/remove/:productId` - Remove from watchlist (requires authentication)
- `GET /api/watchlist` - Get watchlist (requires authentication)

## Project Structure

```
mini-finance-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── kycController.js
│   │   │   ├── productController.js
│   │   │   ├── transactionController.js
│   │   │   ├── portfolioController.js
│   │   │   └── watchlistController.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   └── upload.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Product.js
│   │   │   ├── Transaction.js
│   │   │   └── Watchlist.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── kycRoutes.js
│   │   │   ├── productRoutes.js
│   │   │   ├── transactionRoutes.js
│   │   │   ├── portfolioRoutes.js
│   │   │   └── watchlistRoutes.js
│   │   ├── seed/
│   │   │   └── seedProducts.js
│   │   ├── utils/
│   │   │   └── generateToken.js
│   │   ├── app.js
│   │   └── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── api.js
│   │   ├── App.jsx
│   │   └── index.js
│   └── package.json
└── README.md
```

## Usage

### For Regular Users
1. **Register/Login**: Create an account or login with existing credentials
2. **Complete KYC**: Submit your PAN number, Aadhaar, DOB, address, and ID proof
3. **Browse Products**: View available investment products
4. **View Details**: Click on any product to see details and price chart
5. **Buy Products**: Select units and purchase products
6. **View Portfolio**: Check your investments, returns, and wallet balance
7. **Manage Watchlist**: Add products to watchlist for easy access

### For Admins
1. **Create Admin User**: Run `npm run create-admin` in backend directory
2. **Login**: Use admin credentials (default: `admin@orbitcapital.com` / `Admin@123`)
3. **Access Admin Panel**: Click "Admin" link in navbar (only visible to admins)
4. **Review KYC**: Approve or reject user KYC requests
5. **Manage Users**: View all users, ban/unban accounts
6. **View Transactions**: Monitor all platform transactions
7. **Dashboard**: View platform statistics and analytics

See [ADMIN_PANEL_GUIDE.md](./ADMIN_PANEL_GUIDE.md) for detailed admin instructions.

## Notes

- All users start with ₹100,000 in their virtual wallet
- Product prices are static (dummy data) for demonstration
- KYC images are stored locally in `backend/src/uploads/kyc/`
- JWT tokens expire after 7 days

## Future Enhancements (Optional)

- Redis caching for product listings
- Role-based access control (Admin dashboard)
- Real-time price updates
- Email notifications
- Advanced charting features
- Transaction filters and search

## License

This project is created for assignment purposes.

