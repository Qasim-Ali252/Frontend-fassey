import React from 'react';

const AuthLoading = ({ message = "Checking authentication..." }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'var(--bg)',
      color: 'var(--text)'
    }}>
      <div 
        className="auth-loading-spinner"
        style={{
          width: '40px',
          height: '40px',
          border: '3px solid var(--border)',
          borderTop: '3px solid var(--accent)',
          borderRadius: '50%',
          marginBottom: '1rem'
        }}
      ></div>
      <p>{message}</p>
    </div>
  );
};

export default AuthLoading;