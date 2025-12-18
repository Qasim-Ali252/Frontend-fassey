// src/shop/components/CategoryGridItem.jsx
import React from 'react';
import '../styles/HomePage.css'; 

const CategoryGridItem = ({ title, link, imageUrl }) => {
    return (
        <a href={link} className="category-grid-item">
            <img src={imageUrl} alt={title} className="grid-image" />
            <div className="grid-overlay">
                <span className="grid-title">{title}</span>
            </div>
        </a>
    );
};

export default CategoryGridItem;