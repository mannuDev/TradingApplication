import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar-futuristic">
      <div className="nav-container">
        <Link to="/" className="nav-logo-link">
          <Logo size="medium" />
        </Link>
        <div className="nav-menu">
          <Link to="/products" className="nav-link-futuristic">
            <span>Products</span>
          </Link>
          {user ? (
            <>
              <Link to="/portfolio" className="nav-link-futuristic">
                <span>Portfolio</span>
              </Link>
              <Link to="/watchlist" className="nav-link-futuristic">
                <span>Watchlist</span>
              </Link>
              <Link to="/kyc" className="nav-link-futuristic">
                <span>KYC</span>
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="nav-link-futuristic admin-link">
                  <span>Admin</span>
                </Link>
              )}
              <div className="nav-user-badge">
                <div className="user-avatar"></div>
                <span className="nav-user-text">{user.name}</span>
              </div>
              <button onClick={handleLogout} className="nav-logout-futuristic">
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link-futuristic">
                <span>Login</span>
              </Link>
              <Link to="/register" className="nav-link-futuristic register-link">
                <span>Register</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

