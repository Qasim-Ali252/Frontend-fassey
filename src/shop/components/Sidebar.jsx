import React, { useState } from 'react';
import { IoCloseOutline, IoChevronForward, IoChevronBack, IoLogOutOutline, IoPersonOutline, IoLogInOutline } from 'react-icons/io5'; // <-- ADDED IoLogInOutline
import { Link, useNavigate } from 'react-router-dom';
import { useUserAuth } from '../../hooks/useUserAuth'; 
import '../styles/Sidebar.css'; 

// --- CATEGORIES ---
const CATEGORIES = [
    { 
        name: 'Shop Men', 
        id: 'men',
        subcategories: [
            { name: 'View All', slug: '/shop?gender=MEN' }, 
            { name: 'Hoodies', slug: '/shop?gender=MEN&category=hoodies' },
            { name: 'Shirts', slug: '/shop?gender=MEN&category=shirts' },
        ]
    },
    { 
        name: 'Shop Women', 
        id: 'women',
        subcategories: [
            { name: 'View All', slug: '/shop?gender=WOMEN' },
            { name: 'Hoodies', slug: '/shop?gender=WOMEN&category=hoodies' },
            { name: 'Pants', slug: '/shop?gender=WOMEN&category=pants' },
        ]
    },
    { name: 'About Us', id: 'about', slug: '/about', subcategories: [] },
    { name: 'Contact', id: 'contact', slug: '/contact', subcategories: [] },
];

const Sidebar = ({ isOpen, onClose }) => { 
    const navigate = useNavigate();
    // Destructure isLoggingOut for the button disabled state
    const { isAuthenticated, logout, isLoggingOut } = useUserAuth(); 
    const [menuLevel, setMenuLevel] = useState(0); 
    const [activeCategory, setActiveCategory] = useState(null); 

    const handleCategoryClick = (categoryName, hasSubcategories) => {
        if (hasSubcategories) {
            setActiveCategory(categoryName);
            setMenuLevel(1);
        }
    };

    const handleBack = () => {
        setMenuLevel(0);
        setTimeout(() => setActiveCategory(null), 300); 
    };
    
    // --- Centralized Logout Handler ---
    const handleLogout = () => {
        logout(null, { onSuccess: () => {
            onClose(); 
            navigate('/'); 
        }});
    };

    const handleLoginClick = () => {
        onClose();
        navigate('/user/login');
    };

    const currentSubCategories = CATEGORIES.find(cat => cat.name === activeCategory)?.subcategories || [];
    const menuLevelClass = `level-${menuLevel}`;

    return (
        <>
            {/* 1. Backdrop */}
            {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

            {/* 2. Sidebar Container (Flex Column) */}
            <div className={`sidebar ${isOpen ? 'is-open' : ''}`} onClick={(e) => e.stopPropagation()}>
                
                {/* === HEADER === */}
                <div className="sidebar-header">
                    <div className="back-btn-placeholder">
                        {menuLevel === 1 && (
                            <IoChevronBack
                                className="back-icon"
                                onClick={handleBack}
                            />
                        )}
                    </div>
                    <span
                        className="sidebar-title"
                        onClick={menuLevel === 1 ? handleBack : undefined}
                    >
                        {menuLevel === 1 ? activeCategory : 'THE FOLKS'}
                    </span>
                    <IoCloseOutline className="close-icon" onClick={onClose} />
                </div>
                
                {/* === CONTENT WRAPPER (Flex-Grow) === */}
                <div className={`sidebar-content-wrapper ${menuLevelClass}`}>
                    
                    {/* 1. Main Menu (Level 0) */}
                    <div className="menu-panel main-menu">
                        {CATEGORIES.map(category => {
                            const hasSubs = category.subcategories.length > 0;
                            
                            return (
                                <div
                                    key={category.id}
                                    className="menu-item"
                                >
                                    <Link 
                                        to={hasSubs ? '#' : category.slug} 
                                        onClick={(e) => { 
                                            if (hasSubs) {
                                                e.preventDefault(); 
                                                handleCategoryClick(category.name, hasSubs); 
                                            } else {
                                                onClose(); 
                                            }
                                        }}
                                    >
                                        {category.name}
                                    </Link>
                                    {hasSubs && <IoChevronForward className="menu-arrow" />}
                                </div>
                            );
                        })}

                        {/* --- Auth Links: Profile/Placeholder --- */}
                        <div className="auth-section-divider"></div>
                        {isAuthenticated ? (
                            <Link to="/profile" className="menu-item auth-link" onClick={onClose}>
                                <IoPersonOutline className="menu-icon" /> <span>Profile</span>
                            </Link>
                        ) : (
                            // Show a blank placeholder if unauthenticated.
                            // We move the main action to the bottom static button.
                            <div className="menu-item auth-link placeholder-link"></div> 
                        )}
                    </div>

                    {/* 2. Sub Menu (Level 1) */}
                    <div className="menu-panel sub-menu">
                        <div className="sub-menu-list">
                            {/* Explicit back row so it's always visible on small screens */}
                            {menuLevel === 1 && (
                                <button
                                    type="button"
                                    className="sub-menu-back-row"
                                    onClick={handleBack}
                                >
                                    <IoChevronBack className="sub-menu-back-icon" />
                                    <span>All categories</span>
                                </button>
                            )}
                            {currentSubCategories.map((sub) => (
                                <Link
                                    key={sub.slug}
                                    to={sub.slug}
                                    className="sub-menu-item"
                                    onClick={onClose}
                                >
                                    {sub.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
                
                {/* === STATIC BUTTON (BOTTOM) - Conditionally renders Login or Logout === */}
                <div className="sidebar-footer-actions">
                    {isAuthenticated ? (
                        <div 
                            className="menu-item static-auth-btn static-logout-btn" 
                            onClick={handleLogout} 
                            disabled={isLoggingOut}
                        >
                            <IoLogOutOutline className="menu-icon" /> 
                            <span>{isLoggingOut ? 'Logging Out...' : 'Logout'}</span>
                        </div>
                    ) : (
                        <div 
                            className="menu-item static-auth-btn static-login-btn" 
                            onClick={handleLoginClick}
                        >
                            <IoLogInOutline className="menu-icon" /> 
                            <span>Log In / Register</span>
                        </div>
                    )}
                </div>
                
            </div>
        </>
    );
};

export default Sidebar;