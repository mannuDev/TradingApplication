import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { user } = useAuth();

  return (
    <div className="product-card-futuristic glass-card">
      <div className="product-header-futuristic">
        <div className="product-icon">
          <div className="icon-glow"></div>
        </div>
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <span className="product-category-badge">{product.category}</span>
        </div>
      </div>
      
      <div className="product-details-futuristic">
        <div className="price-section">
          <span className="price-label">Price</span>
          <div className="product-price-futuristic">
            <span className="currency">₹</span>
            {product.pricePerUnit.toFixed(2)}
          </div>
        </div>
        <div className="metric-section">
          <span className="metric-text">{product.metric}</span>
        </div>
      </div>

      {user && (
        <div className="product-actions-futuristic">
          <Link to={`/products/${product._id}`} className="product-button neon-button">
            <span>View Details</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProductCard;

