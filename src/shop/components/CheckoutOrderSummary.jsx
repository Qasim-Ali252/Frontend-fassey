// src/shop/components/CheckoutOrderSummary.jsx

import React from 'react';

const CheckoutOrderSummary = ({ totals, isSubmitting }) => {
    return (
        <div className="order-summary-card">
            <h4>Order Summary</h4>
            <div className="item-list">
                {totals.items && totals.items.length > 0 ? (
                    totals.items.map((item, index) => (
                        <div key={item.cart_item_id || item.sku || index} className="summary-item">
                            <div className="item-info">
                                <span className="item-quantity">{item.quantity} x</span>
                                <span className="item-sku">{item.sku || 'Product'}</span>
                            </div>
                            <div className="item-pricing">
                                {item.discounted_price && item.base_price !== item.discounted_price && (
                                    <span className="item-original-price">
                                        Rs.{(item.base_price * item.quantity).toFixed(2)}
                                    </span>
                                )}
                                <span className="item-subtotal">
                                    Rs.{(item.subtotal || item.discounted_price * item.quantity || 0).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-items">No items in cart</div>
                )}
            </div>

            <div className="summary-totals">
                <div className="summary-row">
                    <span>Subtotal</span>
                    <span>Rs.{totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                    <span>Shipping</span>
                    <span>{totals.shipping > 0 ? `Rs.${totals.shipping.toFixed(2)}` : 'Free'}</span>
                </div>
                <div className="summary-row total-row">
                    <strong>Total Amount</strong>
                    <strong>Rs.{totals.grandTotal.toFixed(2)}</strong>
                </div>
            </div>
            
            {/* Note: The final Place Order button is handled in CheckoutPage.jsx Step 2 */}
            {isSubmitting && <div className="submitting-message">Processing Order...</div>}
        </div>
    );
};

export default CheckoutOrderSummary;