import React from "react";
import "../styles/ProductSkeleton.css";

const ProductSkeleton = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-image shimmer"></div>
      <div className="skeleton-info">
        <div className="skeleton-text title shimmer"></div>
        <div className="skeleton-text price shimmer"></div>
      </div>
    </div>
  );
};

export default ProductSkeleton;