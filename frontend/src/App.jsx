import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import KYCForm from './pages/KYC/KYCForm';
import ProductList from './pages/Products/ProductList';
import ProductDetail from './pages/Products/ProductDetail';
import BuyPage from './pages/Transactions/BuyPage';
import PortfolioDashboard from './pages/Portfolio/PortfolioDashboard';
import WatchlistPage from './pages/Watchlist/WatchlistPage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="neon-spinner"></div>
        <p className="loading-text">Loading OrbitCapital...</p>
      </div>
    );
  }
  return user ? children : <Navigate to="/login" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/kyc"
        element={
          <PrivateRoute>
            <KYCForm />
          </PrivateRoute>
        }
      />
      <Route path="/products" element={<ProductList />} />
      <Route
        path="/products/:id"
        element={
          <PrivateRoute>
            <ProductDetail />
          </PrivateRoute>
        }
      />
      <Route
        path="/buy/:id"
        element={
          <PrivateRoute>
            <BuyPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/portfolio"
        element={
          <PrivateRoute>
            <PortfolioDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/watchlist"
        element={
          <PrivateRoute>
            <WatchlistPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        }
      />
      <Route path="/" element={<Navigate to="/products" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <AppRoutes />
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

