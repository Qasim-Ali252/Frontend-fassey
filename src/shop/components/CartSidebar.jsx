import React, { useState, useEffect } from 'react';
import { IoCloseOutline, IoChevronForwardOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useCheckoutCart } from '../../hooks/useCheckoutCart';
import { useUserAuth } from '../../hooks/useUserAuth';
import CartItem from './CartItem';
import '../styles/Cart.css';

const CartSidebar = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const { isAuthenticated } = useUserAuth(); 
    
    // Final Hook Integration: Pulling data, errors, and success states from unified useCart
    const { 
        items, 
        subtotal, 
        isLoading, 
        totalItems, 
        refetch, 
        updateError, 
        removeError, 
        removeSuccess 
    } = useCart();
    
    const checkoutMutation = useCheckoutCart();
    const [status, setStatus] = useState({ message: "", type: "" });
    const cartId = localStorage.getItem("cart_id");

    /**
     * 1. Monitor for Stock Limit Errors
     * Triggered if a user increments quantity beyond available inventory on the server
     */
    useEffect(() => {
        if (updateError) {
            const errorMsg = updateError?.response?.data?.message || "Requested quantity exceeds available stock.";
            setStatus({ message: errorMsg, type: "error" });
            
            // Auto-clear message after 4 seconds
            const timer = setTimeout(() => setStatus({ message: "", type: "" }), 4000);
            return () => clearTimeout(timer);
        }
    }, [updateError]);

    /**
     * 2. Monitor for Removal Confirmation
     * Triggers a boutique success message when an item is optimistically deleted
     */
    useEffect(() => {
        if (removeSuccess) {
            setStatus({ message: "Item removed from bag.", type: "success" });
            const timer = setTimeout(() => setStatus({ message: "", type: "" }), 3000);
            return () => clearTimeout(timer);
        }
        if (removeError) {
            setStatus({ message: "Failed to remove item.", type: "error" });
        }
    }, [removeSuccess, removeError]);

    // Refetch logic to ensure data is fresh when sidebar opens
    useEffect(() => {
        if (isOpen && isAuthenticated) {
            refetch();
        }
    }, [isOpen, isAuthenticated, refetch]);

    const handleLoginClick = () => {
        onClose();
        navigate('/user/login');
    };

    const handleCheckout = () => {
        if (!cartId || items.length === 0) {
            setStatus({ message: "Your bag is empty", type: "error" });
            return;
        }

        setStatus({ message: "Preparing checkout...", type: "info" });
        checkoutMutation.mutate(
            { cart_id: parseInt(cartId, 10) },
            {
                onSuccess: () => {
                    onClose();
                    navigate('/checkout');
                },
                onError: (error) => {
                    setStatus({ 
                        message: error?.response?.data?.message || "Failed to proceed to checkout", 
                        type: "error" 
                    });
                }
            }
        );
    };

    const cartClass = `cart-sidebar ${isOpen ? 'is-open' : ''}`;

    return (
        <>
            {/* Backdrop closes the cart when clicked */}
            {isOpen && <div className="cart-backdrop" onClick={onClose} />}
            
            <div className={cartClass}>
                {/* Header */}
                <div className="cart-header">
                    <h2 className="cart-title">Your bag ({isAuthenticated ? totalItems : 0})</h2>
                    <button className="cart-close-btn" onClick={onClose} aria-label="Close cart">
                        <IoCloseOutline size={24} />
                    </button>
                </div>

                {/* Body: Conditional Rendering */}
                <div className="cart-body">
                    {/* BOUTIQUE INLINE STATUS: Handles stock limits & deletion confirmations */}
                    {status.message && (
                        <div className={`p-inline-status ${status.type}`} style={{ margin: '10px 20px', fontSize: '12px' }}>
                            {status.message}
                        </div>
                    )}

                    {!isAuthenticated ? (
                        <div className="auth-prompt-state">
                            <p className="auth-prompt-message">Please log in to manage your bag and checkout.</p>
                            <button className="login-signup-btn" onClick={handleLoginClick}>
                                Log In / Sign Up <IoChevronForwardOutline className="forward-icon" />
                            </button>
                        </div>
                    ) : isLoading && items.length === 0 ? (
                        <div className="cart-loading-state">
                            <p className="cart-loading-message">Refining bag...</p>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="cart-empty-state">
                            <p className="cart-empty-message">Your cart is empty.</p>
                            <button className="continue-shopping-btn" onClick={onClose}>Shop New Arrivals</button>
                        </div>
                    ) : (
                        <div className="cart-items-list">
                            {items.map(item => (
                                <CartItem key={item.sku} item={item} />
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer: Totals and Actions */}
                {isAuthenticated && items.length > 0 && (
                    <div className="cart-footer">
                        <div className="cart-total-row">
                            <span className="total-label">Estimated total</span>
                            <span className="total-amount">Rs.{subtotal.toLocaleString()}</span>
                        </div>
                        <p className="shipping-note">Taxes and shipping calculated at checkout.</p>
                        <button 
                            className="cart-checkout-btn"
                            onClick={handleCheckout}
                            disabled={checkoutMutation.isLoading}
                        >
                            {checkoutMutation.isLoading ? 'Processing...' : 'CHECKOUT'}
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartSidebar;