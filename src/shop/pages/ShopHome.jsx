import React from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import ProductCard from "../components/ProductCard";
import ShopNavbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/shop.css";

const ShopHome = () => {
  const { data: products = [], isLoading, isError } = useProducts();

  return (
    <>
      <ShopNavbar />

      {/* Hero Section */}
      <div className="hero">
        <div className="hero-text">
          <h1>Men's Collection 2025</h1>
          <p>Premium Denim • Modern Fit • Trendy Wear</p>
          <Link to="/shop" className="hero-btn">
            Shop Now
          </Link>
        </div>
      </div>

      {/* Featured Products */}
      <div className="container">
        <h2 className="section-title">Featured Products</h2>

        {isLoading ? (
          <p className="loading-text">Loading products...</p>
        ) : isError ? (
          <p className="error-text">Error fetching products</p>
        ) : (
          <div className="product-grid">
            {products.slice(0, 4).map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default ShopHome;
