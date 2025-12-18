import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './BackendUnavailable.css';

const BackendUnavailable = ({ onRetry }) => {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    if (onRetry) {
      await onRetry();
    }
    setTimeout(() => setIsRetrying(false), 1000);
  };

  return (
    <div className="backend-unavailable">
      <div className="error-container">
        <div className="error-icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10"/>
            <path d="M15 9l-6 6"/>
            <path d="M9 9l6 6"/>
          </svg>
        </div>
        
        <h1 className="error-title">Oops! Something went wrong</h1>
        <p className="error-subtitle">We're having trouble loading the content right now. Please try again in a moment.</p>
        
        <div className="error-actions">
          <button 
            className="retry-button" 
            onClick={handleRetry}
            disabled={isRetrying}
          >
            {isRetrying ? (
              <>
                <div className="spinner"></div>
                Retrying...
              </>
            ) : (
              'Try Again'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BackendUnavailable;