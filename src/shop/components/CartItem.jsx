import React from "react";
import { useCart } from "../../hooks/useCart";
import "../styles/Cart.css";

/**
 * CartItem Component
 * Utilizes optimistic updates from useCart hook for a zero-lag experience.
 * Identified by SKU to match backend API requirements.
 */
const CartItem = ({ item }) => {
  // Use unified actions and statuses from the high-performance hook
  const { updateCartItem, removeCartItem, isUpdating, isRemoving } = useCart();
  
  // Retrieve cart_id for API calls
  const cart_id = localStorage.getItem("cart_id");

  /**
   * Handles quantity adjustments (+/-)
   * Triggers an optimistic update in the UI instantly
   */
  const handleQuantityChange = (newValue) => {
    // Prevent invalid quantities or overlapping updates
    if (newValue < 1 || isUpdating) return;
    
    // Pass the exact parameters required by cartApi.js
    updateCartItem({ 
      cart_id: parseInt(cart_id, 10), 
      sku: item.sku, 
      quantity: newValue 
    });
  };

  /**
   * Handles item removal
   * Triggers optimistic removal from UI instantly
   */
  const handleRemove = () => {
    // Pass the exact parameters required by cartApi.js
    removeCartItem({ 
      cart_id: parseInt(cart_id, 10), 
      sku: item.sku 
    });
  };

  // Pricing Logic derived from global state for consistency
  const price = item.discounted_price || item.base_price || 0;
  const subtotal = item.subtotal || (price * item.quantity);

  return (
    <div className={`cart-item-tile ${isRemoving ? 'item-fading' : ''}`}>
      {/* Product Image */}
      <div className="cart-item-image-wrapper">
        <img 
          src={item.image || '/placeholder.jpg'} 
          alt={item.name || 'Product'} 
          className="cart-item-image" 
        />
      </div>

      {/* Product Details & Controls */}
      <div className="cart-item-content">
        <div className="cart-item-header">
          <h3 className="cart-item-name">{item.name || 'Product'}</h3>
          <button 
            className="cart-item-remove-btn" 
            onClick={handleRemove}
            disabled={isRemoving}
            title="Remove item"
          >
            {isRemoving ? '...' : '×'}
          </button>
        </div>

        {/* Display Variants if they exist */}
        {item.variant && (
          <p className="cart-item-variant">
            {item.variant.size}{item.variant.color ? `, ${item.variant.color}` : ''}
          </p>
        )}

        {/* Unit Price */}
        <p className="cart-item-price">Rs.{price.toLocaleString()}</p>

        {/* Quantity Selection Group */}
        <div className="cart-item-quantity-section">
          <div className="cart-quantity-controls">
            <button 
              className="quantity-btn"
              onClick={() => handleQuantityChange(item.quantity - 1)} 
              disabled={item.quantity <= 1 || isUpdating}
            >
              −
            </button>
            <span className="quantity-display">{item.quantity}</span>
            <button 
              className="quantity-btn"
              onClick={() => handleQuantityChange(item.quantity + 1)} 
              disabled={isUpdating}
            >
              +
            </button>
          </div>
          
          {/* Row Subtotal */}
          <p className="cart-item-subtotal">
            Rs.{subtotal.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartItem;