// src/shop/components/StripePayment.jsx
import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Initialize Stripe - you'll need to set VITE_STRIPE_PUBLISHABLE_KEY in your .env
const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

const CheckoutForm = ({ clientSecret, amount, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (stripeError) {
        setError(stripeError.message);
        onError?.(stripeError);
        setIsProcessing(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess?.(paymentIntent);
      }
    } catch (err) {
      setError(err.message || 'An error occurred during payment');
      onError?.(err);
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stripe-payment-form">
      <div className="stripe-card-element">
        <label className="stripe-card-label">Card details</label>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '15px',
                color: '#111111',
                fontFamily: '"Poppins", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                iconColor: '#111111',
                '::placeholder': {
                  color: '#b0b0b0',
                },
              },
              invalid: {
                color: '#d93025',
              },
            },
          }}
        />
      </div>
      {error && <div className="stripe-error">{error}</div>}
      <button type="submit" className="btn-primary stripe-pay-button" disabled={!stripe || isProcessing}>
        {isProcessing ? 'Processing...' : `Pay Rs.${amount.toFixed(2)}`}
      </button>
    </form>
  );
};

const StripePayment = ({ clientSecret, amount, onSuccess, onError }) => {
  if (!clientSecret) {
    return <div>Loading payment form...</div>;
  }

  if (!stripePromise) {
    return <div className="stripe-error">Stripe is not configured. Please set VITE_STRIPE_PUBLISHABLE_KEY in your environment variables.</div>;
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm
        clientSecret={clientSecret}
        amount={amount}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
};

export default StripePayment;

