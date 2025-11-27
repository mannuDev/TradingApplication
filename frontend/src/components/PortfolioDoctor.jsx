import React, { useState } from 'react';
import './PortfolioDoctor.css';

const PortfolioDoctor = ({ portfolio }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const analyzePortfolio = () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      const risks = portfolio?.summary?.totalReturns < 0 ? ['High volatility detected', 'Consider diversifying'] : [];
      const opportunities = ['Tech sector showing growth', 'Consider adding more blue-chip stocks'];
      const health = portfolio?.summary?.totalReturns >= 0 ? 85 : 65;

      setAnalysis({
        health,
        risks,
        opportunities,
        recommendation: health >= 80 ? 'Portfolio is healthy' : 'Consider rebalancing'
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="portfolio-doctor glass-card">
      <div className="doctor-header">
        <div className="doctor-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" fill="none"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" fill="none"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" fill="none"/>
          </svg>
        </div>
        <h3 className="doctor-title">AI Portfolio Doctor</h3>
      </div>

      {!analysis ? (
        <div className="doctor-content">
          <p className="doctor-description">
            Get AI-powered insights about your portfolio health, risks, and opportunities
          </p>
          <button 
            onClick={analyzePortfolio} 
            className="doctor-button neon-button"
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <span className="analyzing-spinner"></span>
                Analyzing...
              </>
            ) : (
              'Analyze Portfolio'
            )}
          </button>
        </div>
      ) : (
        <div className="doctor-results">
          <div className="health-score">
            <div className="score-circle">
              <svg className="score-svg" viewBox="0 0 100 100">
                <circle className="score-bg" cx="50" cy="50" r="40" />
                <circle 
                  className="score-progress" 
                  cx="50" 
                  cy="50" 
                  r="40"
                  style={{
                    strokeDasharray: 251.2,
                    strokeDashoffset: 251.2 - (251.2 * analysis.health / 100)
                  }}
                />
              </svg>
              <div className="score-value">{analysis.health}</div>
            </div>
            <p className="score-label">Portfolio Health</p>
          </div>

          <div className="doctor-insights">
            <div className="insight-section">
              <h4 className="insight-title risks-title">⚠️ Risks Detected</h4>
              <ul className="insight-list">
                {analysis.risks.length > 0 ? (
                  analysis.risks.map((risk, i) => (
                    <li key={i} className="insight-item risk-item">{risk}</li>
                  ))
                ) : (
                  <li className="insight-item">No major risks detected</li>
                )}
              </ul>
            </div>

            <div className="insight-section">
              <h4 className="insight-title opportunities-title">💡 Opportunities</h4>
              <ul className="insight-list">
                {analysis.opportunities.map((opp, i) => (
                  <li key={i} className="insight-item opportunity-item">{opp}</li>
                ))}
              </ul>
            </div>

            <div className="recommendation">
              <p className="recommendation-text">
                <strong>Recommendation:</strong> {analysis.recommendation}
              </p>
            </div>
          </div>

          <button 
            onClick={() => setAnalysis(null)} 
            className="doctor-button neon-button"
            style={{ marginTop: 'var(--space-md)' }}
          >
            Analyze Again
          </button>
        </div>
      )}
    </div>
  );
};

export default PortfolioDoctor;

