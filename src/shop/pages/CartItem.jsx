// src/shop/pages/CartItem.jsx
import React from 'react';
import { useCart } from '../../hooks/useCart';
import '../styles/Cart.css';

const CartItem = ({ item }) => {
    const { updateQuantity, removeFromCart } = useCart();
    
    // Safely destructure with fallbacks for missing data
    const { _id: itemId, productId, quantity, size, color } = item;
    const productName = productId?.name || 'Loading...';
    const price = productId?.price || 0;
    const imageUrl = productId?.images?.[0]?.url || '/placeholder_cart.jpg';
    
    // Derived State: Instant subtotal calculation
    const subtotal = price * quantity;

    const handleUpdate = (newQty) => {
        if (newQty >= 1) {
            updateQuantity({ itemId, quantity: newQty });
        }
    };

    return (
        <div className="cart-item-tile">
            <div className="cart-item-image-wrapper">
                <img src={imageUrl} alt={productName} className="cart-item-image" />
            </div>
            
            <div className="cart-item-content">
                <div className="cart-item-header">
                    <h4 className="cart-item-name">{productName}</h4>
                    <button 
                        className="cart-item-remove-btn" 
                        onClick={() => removeFromCart(itemId)}
                        title="Remove Item"
                    >
                        &times;
                    </button>
                </div>

                <p className="cart-item-variant">
                    {size && `Size: ${size}`} {color && ` | ${color.name || color}`}
                </p>

                <div className="cart-item-quantity-section">
                    <div className="cart-quantity-controls">
                        <button 
                            className="quantity-btn quantity-btn-minus"
                            onClick={() => handleUpdate(quantity - 1)} 
                            disabled={quantity <= 1}
                        >
                            -
                        </button>
                        <input type="number" className="quantity-input" readOnly value={quantity} />
                        <button 
                            className="quantity-btn quantity-btn-plus"
                            onClick={() => handleUpdate(quantity + 1)}
                        >
                            +
                        </button>
                    </div>
                    <p className="cart-item-price">Rs.{subtotal.toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
};

export default CartItem;