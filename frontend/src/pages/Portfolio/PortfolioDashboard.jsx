import React, { useState, useEffect } from 'react';
import { getPortfolio, getWalletBalance } from '../../api';
import { Link } from 'react-router-dom';
import PortfolioDoctor from '../../components/PortfolioDoctor';

const PortfolioDashboard = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPortfolio();
    loadWalletBalance();
  }, []);

  const loadPortfolio = async () => {
    try {
      const response = await getPortfolio();
      setPortfolio(response.data);
    } catch (err) {
      setError('Failed to load portfolio');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadWalletBalance = async () => {
    try {
      const response = await getWalletBalance();
      setWalletBalance(response.data.walletBalance);
    } catch (err) {
      console.error('Error loading wallet balance:', err);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="neon-spinner"></div>
        <p className="loading-text">Loading portfolio...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
        <div className="error-message-futuristic">{error}</div>
      </div>
    );
  }

  const summary = portfolio?.summary || {
    totalInvested: 0,
    totalCurrentValue: 0,
    totalReturns: 0
  };

  const portfolioItems = portfolio?.portfolio || [];
  const returnPercentage = summary.totalInvested > 0 
    ? ((summary.totalReturns / summary.totalInvested) * 100).toFixed(2)
    : 0;

  return (
    <div className="portfolio-page">
      <div className="page-header">
        <h1 className="page-title gradient-text">Portfolio Dashboard</h1>
        <p className="page-subtitle">Your investment journey at a glance</p>
      </div>

      <div className="portfolio-summary-grid">
        <div className="summary-card glass-card wallet-card">
          <div className="card-icon">💰</div>
          <h3 className="card-title">Wallet Balance</h3>
          <div className="card-value wallet-value">
            ₹{walletBalance.toFixed(2)}
          </div>
        </div>

        <div className="summary-card glass-card invested-card">
          <div className="card-icon">📊</div>
          <h3 className="card-title">Total Invested</h3>
          <div className="card-value invested-value">
            ₹{summary.totalInvested.toFixed(2)}
          </div>
        </div>

        <div className="summary-card glass-card value-card">
          <div className="card-icon">📈</div>
          <h3 className="card-title">Current Value</h3>
          <div className="card-value value-amount">
            ₹{summary.totalCurrentValue.toFixed(2)}
          </div>
        </div>

        <div className={`summary-card glass-card returns-card ${summary.totalReturns >= 0 ? 'positive' : 'negative'}`}>
          <div className="card-icon">{summary.totalReturns >= 0 ? '🚀' : '⚠️'}</div>
          <h3 className="card-title">Total Returns</h3>
          <div className={`card-value ${summary.totalReturns >= 0 ? 'returns-positive' : 'returns-negative'}`}>
            ₹{summary.totalReturns.toFixed(2)}
          </div>
          {summary.totalInvested > 0 && (
            <div className="returns-percentage">
              {returnPercentage > 0 ? '+' : ''}{returnPercentage}%
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: 'var(--space-2xl)' }}>
        <PortfolioDoctor portfolio={portfolio} />
      </div>

      <div style={{ marginTop: 'var(--space-2xl)' }}>
        <h2 className="section-title">Holdings</h2>
        {portfolioItems.length === 0 ? (
          <div className="glass-card empty-state">
            <p className="empty-text">
              No holdings yet.{' '}
              <Link to="/products" className="empty-link">
                Browse products
              </Link>{' '}
              to start investing!
            </p>
          </div>
        ) : (
          <div className="holdings-grid">
            {portfolioItems.map((item) => (
              <div key={item.product._id} className="holding-card glass-card">
                <div className="holding-header">
                  <h3 className="holding-name">{item.product.name}</h3>
                  <span className="holding-category">{item.product.category}</span>
                </div>
                <div className="holding-details">
                  <div className="holding-stat">
                    <span className="stat-label">Units</span>
                    <span className="stat-value">{item.units}</span>
                  </div>
                  <div className="holding-stat">
                    <span className="stat-label">Invested</span>
                    <span className="stat-value">₹{item.invested.toFixed(2)}</span>
                  </div>
                  <div className="holding-stat">
                    <span className="stat-label">Current Value</span>
                    <span className="stat-value">₹{item.currentValue.toFixed(2)}</span>
                  </div>
                  <div className="holding-stat">
                    <span className="stat-label">Returns</span>
                    <span className={`stat-value ${item.returns >= 0 ? 'positive' : 'negative'}`}>
                      ₹{item.returns.toFixed(2)}
                    </span>
                  </div>
                </div>
                <Link 
                  to={`/products/${item.product._id}`} 
                  className="holding-link neon-button"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioDashboard;
