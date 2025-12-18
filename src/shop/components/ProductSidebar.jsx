// src/shop/components/ProductSidebar.jsx

import React from 'react';
import { IoChevronForward } from 'react-icons/io5';
import '../styles/ProductSidebar.css'; 

const CATALOG_FILTERS = [
    { name: "Men", slug: "men", categories: ["View All", "shirts", "hoodies"] },
    { name: "Women", slug: "women", categories: ["View All", "pants", "hoodies"] },
    { name: "Kids", slug: "kids", categories: ["View All", "Shirts", "Hoodies"] },
];

const ProductSidebar = ({ activeFilters, onFilterSelect }) => {
    // Function to handle category clicks (like Shirts, Hoodies)
    const handleCategoryClick = (genderSlug, categoryName) => {
        onFilterSelect(genderSlug, categoryName);
    };

    // Function to handle gender title click (implicitly selects "View All" for that gender)
    const handleGenderTitleClick = (genderSlug) => {
        onFilterSelect(genderSlug, 'View All');
    };

    return (
        <div className="product-filter-sidebar">
            <h2 className="filter-heading">Shop By Category</h2>
            
            {CATALOG_FILTERS.map((genderGroup) => (
                <div key={genderGroup.slug} className="gender-group">
                    {/* Gender Title (always visible, acts as filter header) */}
                    <div 
                        className={`gender-title ${activeFilters.gender === genderGroup.slug ? 'is-active' : ''}`}
                        onClick={() => handleGenderTitleClick(genderGroup.slug)}
                    >
                        {genderGroup.name}
                        <IoChevronForward className="title-arrow" />
                    </div>
                    
                    {/* Category List (Visible when gender is active) */}
                    <div className={`category-list ${activeFilters.gender === genderGroup.slug ? 'is-expanded' : ''}`}>
                        {genderGroup.categories.map((catName) => (
                            <div 
                                key={catName} 
                                className={`category-item ${activeFilters.gender === genderGroup.slug && activeFilters.category === catName ? 'is-selected' : ''}`}
                                onClick={() => handleCategoryClick(genderGroup.slug, catName)}
                            >
                                {catName}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductSidebar;