import React, { useState, useEffect } from 'react';
import { getProducts } from '../../api';
import ProductCard from '../../components/ProductCard';
import AISentimentOrb from '../../components/AISentimentOrb';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data);
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="neon-spinner"></div>
        <p className="loading-text">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: 'var(--space-2xl)' }}>
        <div className="error-message-futuristic">{error}</div>
        <button onClick={loadProducts} className="neon-button" style={{ marginTop: 'var(--space-md)' }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="page-header">
        <h1 className="page-title gradient-text">Investment Products</h1>
        <p className="page-subtitle">Discover opportunities in the future of finance</p>
      </div>

      <div style={{ marginBottom: 'var(--space-xl)' }}>
        <AISentimentOrb />
      </div>

      <div className="products-grid">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;

