// src/shop/pages/OrderConfirmationPage.jsx

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrderDetails } from '../../hooks/useOrderDetails'; // The corrected hook
import '../styles/OrderConfirmationPage.css'; // We will create this CSS file next

const OrderConfirmationPage = () => {
    // 1. Get the order ID from the URL (e.g., /order-confirmation/123)
    const { id: orderId } = useParams(); 

    // 2. Fetch the order details using the ID
    const { data, isLoading, isError } = useOrderDetails(orderId);
    
    // We expect the data structure to be data: { order_summary, order_items, shipping_address }
    const order = data?.data?.order_summary; 
    const items = data?.data?.order_items;
    const shipping = data?.data?.shipping_address;

    // --- Loading and Error States ---
    if (isLoading) {
        return <div className="confirmation-page-container loading">Processing your order confirmation...</div>;
    }

    if (isError || !order) {
        return (
            <div className="confirmation-page-container error">
                <h2>Order Not Found</h2>
                <p>We could not find the details for order ID: {orderId}. Please check your order history.</p>
                <Link to="/my-orders" className="btn-secondary">Go to My Orders</Link>
            </div>
        );
    }

    // --- Helper for formatting address ---
    const formatAddress = (addr) => {
        if (!addr) return "N/A";
        return [
            addr.address_line1,
            addr.address_line2,
            `${addr.city}, ${addr.postal_code}`,
            addr.country
        ].filter(Boolean).join(', ');
    };


    return (
        <div className="confirmation-page-container">
            <div className="confirmation-card">
                <svg className="success-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
                </svg>
                
                <h1>Thank You for Your Order!</h1>
                <p className="order-status">Your order has been successfully placed.</p>
                
                <div className="order-details-summary">
                    <div className="detail-box">
                        <span className="label">Order ID</span>
                        <span className="value">#{order.order_id}</span>
                    </div>
                    <div className="detail-box">
                        <span className="label">Order Date</span>
                        {/* Assuming placed_at is a Date string we can format */}
                        <span className="value">{new Date(order.placed_at).toLocaleDateString()}</span>
                    </div>
                    <div className="detail-box">
                        <span className="label">Payment Method</span>
                        <span className="value">{order.payment_method.toUpperCase()}</span>
                    </div>
                    <div className="detail-box total-amount">
                        <span className="label">Total Paid</span>
                        <span className="value">Rs.{Number(order.total_amount).toLocaleString()}</span>
                    </div>
                </div>

                <div className="sections-grid">
                    {/* Shipping Address Section */}
                    <div className="address-section">
                        <h4>Shipping Address</h4>
                        <p><strong>{shipping?.first_name} {shipping?.last_name}</strong></p>
                        <p>{formatAddress(shipping)}</p>
                        <p>Phone: {shipping?.phone}</p>
                    </div>

                    {/* Order Items Section */}
                    <div className="items-section">
                        <h4>Order Items ({items?.length || 0})</h4>
                        <ul className="item-list">
                            {items?.map(item => (
                                <li key={item.sku} className="item-row">
                                    <span>{item.quantity} x {item.sku}</span>
                                    <span className="item-price">Rs.{Number(item.final_price).toLocaleString()}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="confirmation-actions">
                    <Link to="/" className="btn-secondary">
                        Continue Shopping
                    </Link>
                    <Link to={`/order/${order.order_id}`} className="btn-primary">
                        View Full Order Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmationPage;