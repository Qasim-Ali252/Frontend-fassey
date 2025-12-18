import React from 'react';
import '../styles/Cart.css'; // We will add skeleton styles here

const CheckoutSkeleton = () => {
  return (
    <div className="checkout-page-skeleton">
      <div className="skeleton-header" />
      <div className="checkout-layout-skeleton">
        {/* Left Section: Form Skeleton */}
        <div className="skeleton-form-section">
          <div className="skeleton-block title" />
          <div className="skeleton-field" />
          <div className="skeleton-field-row">
            <div className="skeleton-field half" />
            <div className="skeleton-field half" />
          </div>
          <div className="skeleton-field large" />
        </div>
        
        {/* Right Section: Order Summary Skeleton */}
        <div className="skeleton-summary-section">
          <div className="skeleton-block summary-title" />
          {[1, 2].map((i) => (
            <div key={i} className="skeleton-item-row">
              <div className="skeleton-img-thumb" />
              <div className="skeleton-text-stack">
                <div className="skeleton-line" />
                <div className="skeleton-line short" />
              </div>
            </div>
          ))}
          <div className="skeleton-total-block" />
        </div>
      </div>
    </div>
  );
};

export default CheckoutSkeleton;