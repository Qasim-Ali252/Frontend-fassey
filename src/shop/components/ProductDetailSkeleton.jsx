import React from "react";
import "../styles/ProductSkeleton.css"; // You can share the same CSS file for shimmer effects

const ProductDetailSkeleton = () => {
  return (
    <div className="p-detail-wrapper skeleton-page">
      {/* Breadcrumb Placeholder */}
      <div className="p-nav-header">
        <div className="skeleton-text breadcrumb shimmer"></div>
      </div>

      <div className="p-main-layout">
        {/* Left Side: Large Image + Thumbnails */}
        <div className="p-gallery-side">
          <div className="skeleton-image main-img shimmer"></div>
          <div className="p-thumb-strip">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="skeleton-image thumb shimmer"></div>
            ))}
          </div>
        </div>

        {/* Right Side: Title, Price, Sizes, Button */}
        <div className="p-info-side">
          <div className="skeleton-text title shimmer"></div>
          <div className="skeleton-text sku shimmer"></div>
          
          <div className="skeleton-price-box shimmer"></div>

          <div className="skeleton-options">
            <div className="skeleton-text label shimmer"></div>
            <div className="p-size-chips">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="skeleton-chip shimmer"></div>
              ))}
            </div>
          </div>

          <div className="p-action-gate">
            <div className="skeleton-qty-box shimmer"></div>
            <div className="skeleton-button shimmer"></div>
          </div>

          <div className="p-description-block">
            <div className="skeleton-text label shimmer"></div>
            <div className="skeleton-text paragraph shimmer"></div>
            <div className="skeleton-text paragraph shimmer"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;