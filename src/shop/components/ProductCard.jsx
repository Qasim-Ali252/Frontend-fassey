// src/shop/components/ProductCard.jsx

import React from "react";
import { Link } from "react-router-dom"; // REQUIRED for navigation
import "../styles/ProductCard.css";

const ProductCard = ({ product }) => {
  // Prefer full product.images, but gracefully handle search results using image_url
  const imageUrl =
    product.images?.[0]?.url ||
    product.image_url ||
    product.imageUrl ||
    "placeholder_image.jpg";

  // Use SKU for routing as per backend contract
  const productSku = product.sku || product._id || "unknown";

  // Convert price from string to number (API returns price as string like "1999")
  const priceNumber = typeof product.price === 'string' ? parseFloat(product.price) : Number(product.price ?? 0);

  return (
    // Use Link component for seamless navigation to the product detail page
    <Link to={`/product/${productSku}`} className="product-card">
      <div className="product-image-container">
        <img src={imageUrl} alt={product.name} className="product-image" />
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">Rs. {priceNumber.toLocaleString()}</p>
      </div>
    </Link>
  );
};

export default ProductCard;