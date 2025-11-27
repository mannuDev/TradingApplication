import React, { useState, useEffect } from 'react';
import { getWatchlist, removeFromWatchlist } from '../../api';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';

const WatchlistPage = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadWatchlist();
  }, []);

  const loadWatchlist = async () => {
    try {
      const response = await getWatchlist();
      setWatchlist(response.data);
    } catch (err) {
      setError('Failed to load watchlist');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromWatchlist(productId);
      setWatchlist(watchlist.filter(p => p._id !== productId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove from watchlist');
    }
  };

  if (loading) return <div className="loading">Loading watchlist...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div>
      <h1 style={{ marginBottom: '30px' }}>My Watchlist</h1>
      {watchlist.length === 0 ? (
        <div className="card">
          <p>Your watchlist is empty. <Link to="/products">Browse products</Link> to add items to your watchlist!</p>
        </div>
      ) : (
        <div className="grid">
          {watchlist.map((product) => (
            <div key={product._id} style={{ position: 'relative' }}>
              <ProductCard product={product} />
              <button
                onClick={() => handleRemove(product._id)}
                className="btn btn-danger"
                style={{ width: '100%', marginTop: '10px' }}
              >
                Remove from Watchlist
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchlistPage;

