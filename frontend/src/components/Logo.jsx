import React from 'react';
import './Logo.css';

const Logo = ({ size = 'medium' }) => {
  return (
    <div className={`logo-container logo-${size}`}>
      <div className="logo-orb">
        <div className="logo-core"></div>
        <div className="logo-ring ring-1"></div>
        <div className="logo-ring ring-2"></div>
        <div className="logo-ring ring-3"></div>
      </div>
      <span className="logo-text">OrbitCapital</span>
    </div>
  );
};

export default Logo;

