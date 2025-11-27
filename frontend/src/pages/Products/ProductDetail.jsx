import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, addToWatchlist, removeFromWatchlist, getWatchlist } from '../../api';
import ChartComponent from '../../components/ChartComponent';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [inWatchlist, setInWatchlist] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);

  useEffect(() => {
    loadProduct();
    checkWatchlist();
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

  const checkWatchlist = async () => {
    try {
      const response = await getWatchlist();
      const watchlist = response.data;
      setInWatchlist(watchlist.some(p => p._id === id));
    } catch (err) {
      console.error('Error checking watchlist:', err);
    }
  };

  const handleWatchlistToggle = async () => {
    setWatchlistLoading(true);
    try {
      if (inWatchlist) {
        await removeFromWatchlist(id);
        setInWatchlist(false);
      } else {
        await addToWatchlist(id);
        setInWatchlist(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update watchlist');
    } finally {
      setWatchlistLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading product...</div>;
  if (error && !product) return <div className="error-message">{error}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <div>
            <h1 className="card-title">{product.name}</h1>
            <p style={{ color: '#666', marginBottom: '10px' }}>Category: {product.category}</p>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#4CAF50', marginBottom: '10px' }}>
              ₹{product.pricePerUnit.toFixed(2)}
            </div>
            <p style={{ color: '#666' }}>{product.metric}</p>
          </div>
          <div>
            <button
              onClick={handleWatchlistToggle}
              className={`btn ${inWatchlist ? 'btn-danger' : 'btn-secondary'}`}
              disabled={watchlistLoading}
            >
              {inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
            </button>
            <button
              onClick={() => navigate(`/buy/${id}`)}
              className="btn btn-primary"
              style={{ marginTop: '10px', width: '100%' }}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <ChartComponent productName={product.name} pricePerUnit={product.pricePerUnit} />
      </div>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default ProductDetail;

