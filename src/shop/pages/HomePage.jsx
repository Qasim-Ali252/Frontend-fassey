import React from 'react';
import CategoryGridItem from '../components/CategoryGridItem';
import SaleBanner from '../components/SaleBanner';
import { SLIDER_DATA, CATEGORY_GRID_DATA } from '../components/HomePageData';
import '../styles/HomePage.css'; 
// Ensure you have a NotFound component for best routing practice

// --- Hero Section Component ---
const HeroSection = ({ data }) => {
    // We use the imageUrl from the first item in SLIDER_DATA
    const hero = data[0]; 
    
    return (
        <div 
            className="hero-section" 
            style={{ 
                // Uses the local image loaded via require() in HomePageData.js
                backgroundImage: `url(${hero.imageUrl})` 
            }}
        >
            <div className="hero-text-overlay">
                <h1 className="hero-main-text">{hero.text}</h1>
                <p className="hero-sub-text">{hero.subtitle}</p>
            </div>
        </div>
    );
};

// --- Main HomePage Component ---
function HomePage() {
    return (
        <div className="home-page">
            
            {/* 1. Hero/Slider Section (Top Visual Block) */}
            <HeroSection data={SLIDER_DATA} />

            {/* 2. Product/Category Grid (3 Columns: SHOP NOW, HOODIE, SHOP KIDS) */}
            <section className="category-grid-section">
                {CATEGORY_GRID_DATA.map(item => (
                    <CategoryGridItem 
                        key={item.id} 
                        title={item.title} 
                        link={item.link} 
                        imageUrl={item.imageUrl} 
                    />
                ))}
            </section>
            
            {/* 3. FLAT 50% OFF Sale Banner */}
            <section className="sale-banner-section">
                <SaleBanner />
            </section>
            
            {/* 4. 'Get Latest Trends' Section (Newsletter/Marketing Footer) */}
            <section className="latest-trends">
                <div className="container">
                    <h2>Get Latest Trends</h2>
                    {/* Placeholder for newsletter signup form/input */}
                </div>
            </section>
        </div>
    );
}

export default HomePage;