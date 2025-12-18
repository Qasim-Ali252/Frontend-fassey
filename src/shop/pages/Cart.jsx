// src/shop/pages/Cart.jsx

import React, { useState, useEffect } from 'react';
import { useCart } from '../../hooks/useCart';
import CartItem from '../components/CartItem';
import { Link } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb';
import '../styles/Cart.css';

/**
 * Main Cart Page Component
 * Features zero-lag optimistic updates and synchronized boutique status alerts.
 */
const Cart = () => {
  // Access unified state and mutation statuses from useCart hook
  const { 
    items, 
    subtotal, 
    isLoading, 
    isError, 
    error, 
    totalItems,
    updateError,
    removeSuccess 
  } = useCart();
  
  // Local state for boutique-styled inline messages (Stock limits, removals)
  const [status, setStatus] = useState({ message: "", type: "" });

  /**
   * 1. Monitor for Stock Limit Errors
   * Triggered when the backend rejects an optimistic quantity increase due to inventory limits.
   */
  useEffect(() => {
    if (updateError) {
      const errorMsg = updateError?.response?.data?.message || "Requested quantity exceeds available stock.";
      setStatus({ message: errorMsg, type: "error" });
      
      // Auto-clear message after 4 seconds to keep UI clean
      const timer = setTimeout(() => setStatus({ message: "", type: "" }), 4000);
      return () => clearTimeout(timer);
    }
  }, [updateError]);

  /**
   * 2. Monitor for Removal Confirmation
   * Provides positive feedback once an item is successfully removed from the bag.
   */
  useEffect(() => {
    if (removeSuccess) {
      setStatus({ message: "Item removed from bag.", type: "success" });
      
      // Auto-clear message after 3 seconds
      const timer = setTimeout(() => setStatus({ message: "", type: "" }), 3000);
      return () => clearTimeout(timer);
    }
  }, [removeSuccess]);

  // Handle Loading State (Only on initial load when items aren't cached)
  if (isLoading && items.length === 0) {
    return (
      <div className="cart-page-wrapper">
        <div className="cart-loading-state">
          <p>Refining your bag...</p>
        </div>
      </div>
    );
  }

  // Handle Global Sync Errors
  if (isError && items.length === 0) {
    return (
      <div className="cart-page-wrapper">
        <div className={`p-inline-status error`}>
          Error: {error?.message || 'Unable to sync cart data.'}
        </div>
      </div>
    );
  }

  const cartBreadcrumbs = [
    { label: 'Home', link: '/' },
    { label: 'Shopping Cart', link: null }
  ];

  return (
    <div className="cart-page-wrapper">
      <Breadcrumb customBreadcrumbs={cartBreadcrumbs} />
      <h1 className="cart-title">Your Bag ({totalItems || 0})</h1>

      {items.length === 0 ? (
        // Empty State View
        <div className="cart-empty-container">
          <p>Your bag is currently empty.</p>
          <Link to="/shop" className="cart-continue-btn">
            CONTINUE SHOPPING
          </Link>
        </div>
      ) : (
        <div className="cart-content-layout">
          {/* LEFT: Instant-update Item List Area */}
          <div className="cart-items-section">
            
            {/* BOUTIQUE INLINE STATUS: High-visibility area for stock/sync alerts */}
            {status.message && (
              <div className={`p-inline-status ${status.type}`} style={{ marginBottom: '20px' }}>
                {status.message}
              </div>
            )}

            {items.map((item) => (
              <CartItem key={item.sku} item={item} />
            ))}
          </div>

          {/* RIGHT: Order Summary (Sticky) */}
          <div className="cart-summary-section">
            <div className="cart-summary-card">
              <h3>Order Summary</h3>
              
              <div className="summary-row">
                <span>Subtotal</span>
                <span>Rs.{subtotal?.toLocaleString() || 0}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className="free-text">Calculated at checkout</span>
              </div>
              
              <div className="summary-total-row">
                <span>Estimated Total</span>
                <span>Rs.{subtotal?.toLocaleString() || 0}</span>
              </div>

              <Link to="/checkout" className="cart-checkout-btn">
                PROCEED TO CHECKOUT
              </Link>
              
              <p className="cart-policy-note">
                Taxes and shipping calculated during checkout process.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;