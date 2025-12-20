// src/shop/pages/AboutPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AboutPage.css';

const AboutPage = () => {
    const navigate = useNavigate();

    return (
        <div className="about-page-wrapper">
            {/* Simple Centered Header */}
            <header className="about-header">
                <span className="brand-label">Established 2025</span>
                <h1>THE FOLKS</h1>
                <div className="header-line"></div>
            </header>

            {/* Section 1: Brand Philosophy */}
            <section className="about-content-grid">
                <div className="content-block">
                    <h2>Our Philosophy</h2>
                    <p>
                        <strong>THE FOLKS</strong> was founded on a commitment to minimalist design and 
                        uncompromising quality. Based in Pakistan, we aim to bridge the gap between 
                        high-end boutique fashion and everyday comfort. We believe that true style 
                        is found in the details—the weight of the fabric, the precision of the 
                        stitching, and the longevity of the garment.
                    </p>
                </div>
                <div className="content-block">
                    <h2>The Collection</h2>
                    <p>
                        Our curated range focuses on the modern wardrobe. For men, we specialize in 
                        <strong> structured shirts</strong> and <strong>heavyweight hoodies</strong> that 
                        transition seamlessly from day to night. For women, our focus remains on 
                        effortless silhouettes, featuring <strong>premium hoodies</strong> and 
                        <strong> tailored pants</strong> designed for both grace and utility.
                    </p>
                </div>
            </section>

            {/* Section 2: Product Integrity (Replacing the boxes) */}
            <section className="integrity-section">
                <div className="integrity-card">
                    <h3>Premium Materials</h3>
                    <p>
                        We source high-GSM cotton and sustainably produced blends. Every fiber is chosen 
                        to ensure that your favorite piece remains your favorite for years to come.
                    </p>
                </div>
                <div className="integrity-card">
                    <h3>Boutique Craftsmanship</h3>
                    <p>
                        Each design is produced in limited quantities. This allows us to maintain 
                        strict quality control and ensures that every customer receives a 
                        uniquely crafted item.
                    </p>
                </div>
            </section>

            {/* Footer CTA */}
            <footer className="about-footer">
                <p>Designed for the folks who appreciate the finer things.</p>
                <button className="btn-primary" onClick={() => navigate('/shop')}>
                    Explore Our Shop
                </button>
            </footer>
        </div>
    );
};

export default AboutPage;