import React, { useState, useEffect } from 'react';
import './AISentimentOrb.css';

const AISentimentOrb = () => {
  const [sentiment, setSentiment] = useState('neutral');
  const [value, setValue] = useState(0);

  useEffect(() => {
    // Simulate sentiment changes
    const sentiments = ['positive', 'neutral', 'negative'];
    const interval = setInterval(() => {
      const randomSentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
      setSentiment(randomSentiment);
      setValue(Math.floor(Math.random() * 100));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getSentimentColor = () => {
    switch (sentiment) {
      case 'positive':
        return '#0FF4C6'; // Mint
      case 'negative':
        return '#ff6b6b'; // Red
      default:
        return '#4BB3FD'; // Blue
    }
  };

  const getSentimentLabel = () => {
    switch (sentiment) {
      case 'positive':
        return 'Bullish';
      case 'negative':
        return 'Bearish';
      default:
        return 'Neutral';
    }
  };

  return (
    <div className="ai-sentiment-orb-container glass-card">
      <h3 className="orb-title">AI Market Sentiment</h3>
      <div className="orb-wrapper">
        <div 
          className="sentiment-orb"
          style={{
            '--orb-color': getSentimentColor(),
            '--orb-glow': `${getSentimentColor()}40`
          }}
        >
          <div className="orb-core"></div>
          <div className="orb-particles">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="particle" style={{ '--delay': `${i * 0.1}s` }}></div>
            ))}
          </div>
        </div>
        <div className="orb-info">
          <div className="orb-label">{getSentimentLabel()}</div>
          <div className="orb-value">{value}%</div>
        </div>
      </div>
      <p className="orb-description">
        Real-time AI analysis of market sentiment across all assets
      </p>
    </div>
  );
};

export default AISentimentOrb;

