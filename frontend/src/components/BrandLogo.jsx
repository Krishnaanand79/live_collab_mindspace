import React from 'react';
import './BrandLogo.css';

export default function BrandLogo({ 
  size = 38, 
  showText = true, 
  showBadge = false, 
  badgeText = 'ENTERPRISE',
  lightText = false,
  textSize = 'default',
  className = '' 
}) {
  return (
    <div className={`brand-logo-container ${lightText ? 'light-text' : ''} text-size-${textSize} ${className}`}>
      <div className="brand-logo-emblem-wrap" style={{ width: size, height: size }}>
        <img 
          src="/logo.png" 
          alt="LiveCollab MindSpace Logo" 
          className="brand-logo-img"
        />
        <div className="brand-logo-glow" />
      </div>
      {showText && (
        <div className="brand-logo-text-group">
          <div className="brand-logo-title">
            <span className="brand-prefix">LiveCollab</span>
            <span className="brand-suffix">MindSpace</span>
          </div>
          {showBadge && (
            <span className="brand-edition-pill">{badgeText}</span>
          )}
        </div>
      )}
    </div>
  );
}

