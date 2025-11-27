import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, buyProduct, getWalletBalance } from '../../api';

const BuyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [units, setUnits] = useState(1);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadProduct();
    loadWalletBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadProduct = async () => {
    try {
      const response = await getProductById(id);
      setProduct(response.data);
    } catch (err) {
      setError('Failed to load product');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      await buyProduct({ productId: id, units: parseInt(units) });
      setSuccess('Purchase successful!');
      loadWalletBalance();
      setTimeout(() => {
        navigate('/portfolio');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Purchase failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!product) return <div>Product not found</div>;

  const totalCost = product.pricePerUnit * units;
  const canAfford = walletBalance >= totalCost;

  return (
    <div className="form-container">
      <h2>Buy {product.name}</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="card" style={{ marginBottom: '20px' }}>
        <h3>Product Details</h3>
        <p><strong>Name:</strong> {product.name}</p>
        <p><strong>Category:</strong> {product.category}</p>
        <p><strong>Price per Unit:</strong> ₹{product.pricePerUnit.toFixed(2)}</p>
        <p><strong>Your Wallet Balance:</strong> ₹{walletBalance.toFixed(2)}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Number of Units</label>
          <input
            type="number"
            min="1"
            value={units}
            onChange={(e) => setUnits(e.target.value)}
            required
          />
        </div>

        <div className="card" style={{ marginBottom: '20px', backgroundColor: '#f5f5f5' }}>
          <p><strong>Total Cost:</strong> ₹{totalCost.toFixed(2)}</p>
          <p><strong>Remaining Balance:</strong> ₹{(walletBalance - totalCost).toFixed(2)}</p>
        </div>

        {!canAfford && (
          <div className="error-message" style={{ marginBottom: '20px' }}>
            Insufficient balance. You need ₹{totalCost.toFixed(2)} but only have ₹{walletBalance.toFixed(2)}
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={submitting || !canAfford || units < 1}
        >
          {submitting ? 'Processing...' : 'Confirm Purchase'}
        </button>
      </form>

      <button
        onClick={() => navigate(`/products/${id}`)}
        className="btn btn-secondary btn-block"
        style={{ marginTop: '10px' }}
      >
        Back to Product
      </button>
    </div>
  );
};

export default BuyPage;

