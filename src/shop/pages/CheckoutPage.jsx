// src/shop/pages/CheckoutPage.jsx

import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCheckoutData } from '../../hooks/useCheckoutData';
import { useUserAuth } from '../../hooks/useUserAuth'; 
import { useCreateOrder } from '../../hooks/useCreateOrder';
import { usePaymentIntent } from '../../hooks/usePaymentIntent';
import CheckoutAddressForm from '../components/CheckoutAddressForm';
import CheckoutOrderSummary from '../components/CheckoutOrderSummary';
import StripePayment from '../components/StripePayment';
import '../styles/CheckoutPage.css';

// --- Checkout Steps ---
const STEPS = {
    SHIPPING: 1,
    PAYMENT: 2,
    CONFIRMATION: 3,
};

// --- Boutique Skeleton Loader for Zero-Lag Perception ---
const CheckoutSkeleton = () => (
    <div className="checkout-page-wrapper skeleton-active">
        <div className="skeleton-header-block" />
        <div className="checkout-grid">
            <div className="checkout-main-form">
                <div className="skeleton-form-card">
                    <div className="skeleton-line title" />
                    <div className="skeleton-line field" />
                    <div className="skeleton-row">
                        <div className="skeleton-line half" />
                        <div className="skeleton-line half" />
                    </div>
                </div>
            </div>
            <div className="checkout-summary-panel">
                <div className="skeleton-summary-card">
                    <div className="skeleton-line title" />
                    {[1, 2].map(i => (
                        <div key={i} className="skeleton-item-row">
                            <div className="skeleton-thumb" />
                            <div className="skeleton-text-stack">
                                <div className="skeleton-line" />
                                <div className="skeleton-line short" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const CheckoutPage = () => {
    const navigate = useNavigate();
    const cartId = localStorage.getItem("cart_id");
    
    // 1. ALL HOOKS AT TOP LEVEL (Crucial to prevent "Rendered more hooks" error)
    const { data: checkoutData, isLoading: isCheckoutLoading } = useCheckoutData(cartId);
    const { data: user, isLoading: isUserLoading } = useUserAuth();
    const createOrderMutation = useCreateOrder();
    const paymentIntentMutation = usePaymentIntent();
    
    const [currentStep, setCurrentStep] = useState(STEPS.SHIPPING);
    const [shippingAddress, setShippingAddress] = useState({});
    const [paymentMethod, setPaymentMethod] = useState('cash-on-delivery');
    const [paymentIntentData, setPaymentIntentData] = useState(null);

    const memoizedInitialData = useMemo(() => checkoutData?.contact_info || {}, [checkoutData]);

    const totals = useMemo(() => {
        if (!checkoutData) return { subtotal: 0, shipping: 0, tax: 0, grandTotal: 0, items: [], cartId: null };
        return {
            subtotal: checkoutData.items?.reduce((sum, item) => sum + (item.subtotal || 0), 0) || 0,
            grandTotal: checkoutData.total || 0,
            items: checkoutData.items || [],
            cartId: checkoutData.cart_id || null,
        };
    }, [checkoutData]);

    // 2. Redirection Logic (Hooks-safe)
    useEffect(() => {
        let timer;
        if (!isCheckoutLoading && (!checkoutData || totals.items.length === 0)) {
            timer = setTimeout(() => navigate('/shop'), 3000);
        }
        return () => clearTimeout(timer);
    }, [checkoutData, isCheckoutLoading, totals.items.length, navigate]);

    // 3. Logic Handlers
    const handleAddressSubmit = (formData) => {
        // Validation is already handled inside CheckoutAddressForm
        setShippingAddress(formData);
        setCurrentStep(STEPS.PAYMENT);
    };

    const handlePlaceOrder = () => {
        if (createOrderMutation.isLoading) return;
        createOrderMutation.mutate({
            cart_id: totals.cartId,
            shippingAddress: { ...shippingAddress },
            paymentMethod: paymentMethod,
        }, {
            onSuccess: () => {
                setCurrentStep(STEPS.CONFIRMATION);
                localStorage.removeItem("cart_count");
            },
            onError: (err) => alert(`Order Failed: ${err?.response?.data?.message || 'Error.'}`)
        });
    };

    const handleCardPayment = () => {
        paymentIntentMutation.mutate({
            cart_id: totals.cartId,
            shippingAddress: { ...shippingAddress },
        }, {
            onSuccess: (data) => setPaymentIntentData(data),
            onError: (err) => alert(`Payment Error: ${err?.message}`)
        });
    };

    // 4. EARLY RETURNS (Must come AFTER all Hooks)
    if (isCheckoutLoading || isUserLoading) return <CheckoutSkeleton />;

    if (!checkoutData || totals.items.length === 0) {
        return (
            <div className="checkout-page-wrapper">
                <div className="checkout-error">Your cart is empty. Redirecting to shop...</div>
            </div>
        );
    }

    const renderFormContent = () => {
        switch (currentStep) {
            case STEPS.SHIPPING:
                return <CheckoutAddressForm onSubmit={handleAddressSubmit} initialData={memoizedInitialData} />;
            case STEPS.PAYMENT:
                return (
                    <div className="checkout-step-panel">
                        <h3>2. Payment Method</h3>
                        <div className="payment-options">
                            {/* Card 1: COD */}
                            <label className={`payment-option-card ${paymentMethod === 'cash-on-delivery' ? 'selected' : ''}`}>
                                <input 
                                    type="radio" 
                                    name="payment_type"
                                    value="cash-on-delivery" 
                                    checked={paymentMethod === 'cash-on-delivery'} 
                                    onChange={() => setPaymentMethod('cash-on-delivery')} 
                                />
                                <div className="opt-text">
                                    <strong>Cash on Delivery (COD)</strong>
                                    <span>Pay at your doorstep upon delivery</span>
                                </div>
                            </label>
                            
                            {/* Card 2: Stripe */}
                            <label className={`payment-option-card ${paymentMethod === 'card' ? 'selected' : ''}`}>
                                <input 
                                    type="radio" 
                                    name="payment_type"
                                    value="card" 
                                    checked={paymentMethod === 'card'} 
                                    onChange={() => setPaymentMethod('card')} 
                                />
                                <div className="opt-text">
                                    <strong>Credit/Debit Card</strong>
                                    <span>Secure Payment via Stripe</span>
                                </div>
                            </label>
                        </div>

                        <div className="step-navigation">
                            <button className="btn-back" onClick={() => setCurrentStep(STEPS.SHIPPING)}>← Back</button>
                            
                            {paymentMethod === 'card' ? (
                                !paymentIntentData ? (
                                    <button className="btn-primary" onClick={handleCardPayment} disabled={paymentIntentMutation.isLoading}>
                                        {paymentIntentMutation.isLoading ? 'Loading Stripe...' : 'Proceed to Pay'}
                                    </button>
                                ) : (
                                    <StripePayment 
                                        clientSecret={paymentIntentData.clientSecret} 
                                        amount={paymentIntentData.amount / 100} 
                                        onSuccess={() => setCurrentStep(STEPS.CONFIRMATION)} 
                                        onError={(err) => alert(err.message)} 
                                    />
                                )
                            ) : (
                                <button className="btn-primary" onClick={handlePlaceOrder} disabled={createOrderMutation.isLoading}>
                                    {createOrderMutation.isLoading ? 'Placing Order...' : 'Place Order'}
                                </button>
                            )}
                        </div>
                    </div>
                );
            case STEPS.CONFIRMATION:
                return (
                    <div className="checkout-confirmation-message">
                        <div className="success-icon">✓</div>
                        <h2>Order Placed Successfully!</h2>
                        <p>A confirmation email has been sent to {shippingAddress.email}.</p>
                        <button className="btn-primary" onClick={() => navigate('/')}>Continue Shopping</button>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="checkout-page-wrapper">
            <div className="checkout-header">
                <h1>Checkout</h1>
                <div className="step-indicator">
                    <span className={currentStep >= 1 ? 'active' : ''}>1. Shipping</span>
                    <div className="step-line" />
                    <span className={currentStep >= 2 ? 'active' : ''}>2. Payment</span>
                </div>
            </div>
            <div className="checkout-grid">
                <div className="checkout-main-form">{renderFormContent()}</div>
                <div className="checkout-summary-panel">
                    <CheckoutOrderSummary totals={totals} isSubmitting={createOrderMutation.isLoading} />
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;