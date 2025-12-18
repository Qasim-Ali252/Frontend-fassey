import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <h1>403 - Unauthorized</h1>
      <p>You don't have permission to access this page.</p>
      <div style={{ marginTop: '2rem' }}>
        <Link to="/" style={{ marginRight: '1rem' }}>Go Home</Link>
        <Link to="/user/login">Login</Link>
      </div>
    </div>
  );
};

export default Unauthorized;