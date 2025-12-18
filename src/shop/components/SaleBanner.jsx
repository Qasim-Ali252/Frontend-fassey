// src/shop/components/SaleBanner.jsx
import React from 'react';
import '../styles/SaleBanner.css'; 

const SaleBanner = () => {
    return (
        <div className="sale-banner-container">
            <div className="sale-content">
                <span className="end-of-season">END OF SEASON SALE</span>
                <div className="flat-off-group">
                    <span className="flat-text">FLAT</span>
                    <span className="percent-off">50% OFF</span>
                </div>
                <span className="on-everything">ON EVERYTHING</span>
                <div className="men-women-links">
                    <a href="/shop/men">MEN</a> / <a href="/shop/women">WOMEN</a>
                </div>
            </div>
        </div>
    );
};

export default SaleBanner;