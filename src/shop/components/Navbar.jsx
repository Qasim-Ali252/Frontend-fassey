// src/shop/components/Navbar.jsx

import React, { useState, useEffect } from 'react';
import { 
    IoMenuOutline, 
    IoSearchOutline, 
    IoPersonOutline, 
    IoCartOutline, 
    IoCloseOutline // 🛑 NEW IMPORT: Needed for the 'X' icon
} from 'react-icons/io5';
import { useUserAuth } from '../../hooks/useUserAuth'; 
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar'; // 🛑 NEW IMPORT: To render the actual search input
import '../styles/NavBar.css'; 

const Navbar = ({ onMenuClick, onOpenCart }) => { 
    const navigate = useNavigate();
    
    // --- State Management ---
    const [cartCount, setCartCount] = useState(0);
    const [isSearchOpen, setIsSearchOpen] = useState(false); // 🛑 NEW STATE for toggle
    
    // Logic to read cart count from localStorage and listen for updates
    useEffect(() => {
        const updateCartCount = () => {
            const storedCount = localStorage.getItem('cart_count');
            if (storedCount) {
                setCartCount(parseInt(storedCount, 10));
            }
        };
        
        updateCartCount();
        window.addEventListener('storage', updateCartCount);
        return () => window.removeEventListener('storage', updateCartCount);
    }, []);

    // --- User Auth State ---
    const { isAuthenticated, user, logout, isLoggingOut } = useUserAuth(); 
    
    // --- Handlers ---

    // Handler for Account/Profile Icon
    const handleAccountClick = () => {
        if (isAuthenticated) {
            navigate('/profile'); 
        } else {
            navigate('/user/login');
        }
    };
    
    // 🚀 Handler for Search Toggle (Opens/Closes the inline bar)
    const handleSearchToggle = () => {
        setIsSearchOpen(!isSearchOpen);
        
        // Optional: If the search bar closes, you might want to redirect if they were on a full search page
        // if (isSearchOpen && window.location.pathname === '/search') {
        //     navigate('/'); 
        // }
    };

    return (
        <header className="navbarContainer">
            <nav className="mainNavRow"> 
                
                {/* Left Side: Menu Icon */}
                <div className="navLeftIcons">
                    <IoMenuOutline 
                        className="navIcon" 
                        title="Menu" 
                        onClick={onMenuClick} 
                    />
                </div>
                
                {/* Center: Logo (Hidden when search is open) */}
                <Link 
                    to="/" 
                    className={`logo ${isSearchOpen ? 'hidden' : ''}`} // 🛑 CONDITIONAL HIDE
                >
                    THE FOLKS
                </Link>
                
                {/* 🛑 INLINE SEARCH BAR CONTAINER (Overlays logo when active) */}
                <div className={`inlineSearchWrapper ${isSearchOpen ? 'active' : ''}`}>
                    <SearchBar />
                </div>
                
                {/* Right Side: Search, Account, and Cart Icons */}
                <div className="navRightIcons">
                    
                    {/* Search Icon (Now acts as a Toggle button) */}
                    <div className="searchToggleContainer" onClick={handleSearchToggle}>
                        {isSearchOpen ? (
                            <IoCloseOutline className="navIcon" title="Close Search" /> // X icon when open
                        ) : (
                            <IoSearchOutline className="navIcon" title="Search" /> // Search icon when closed
                        )}
                    </div>
                    
                    {/* Account/Auth Icon Logic */}
                    <div 
                        className="accountIconContainer" 
                        title={isAuthenticated ? `View Profile (${user?.name || user?.email})` : 'Log In'}
                        onClick={handleAccountClick} 
                    >
                        {isAuthenticated && isLoggingOut ? (
                            <span className="logout-spinner">...</span>
                        ) : (
                            <IoPersonOutline className="navIcon" />
                        )}
                    </div>
                    
                    {/* Cart Icon (Trigger for Cart Sidebar/Page) */}
                    <div 
                        className="cartIconContainer" 
                        title="Shopping Cart"
                        onClick={onOpenCart}
                    >
                        <IoCartOutline className="navIcon" />
                        
                        {cartCount > 0 && (
                            <span className="cartCounter">
                                {cartCount}
                            </span>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;