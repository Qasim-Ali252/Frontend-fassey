// src/shop/components/Layout.jsx

import React, { useState } from "react"; 
import { Outlet } from "react-router-dom"; 
import NavBar from "./Navbar";
import Sidebar from "./Sidebar"; 
import CartSidebar from "./CartSidebar"; 
import Footer from "./Footer";
import Breadcrumb from "../../components/Breadcrumb";
import { useCartStore } from "../../store/useCartStore";
import "../styles/Layout.css"; 

const Layout = () => {
    // 🛑 USE GLOBAL STORE
    const { isCartOpen, closeCart, openCart } = useCartStore();
    
    // Keep local state ONLY for the main menu (hamburger) sidebar
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

    return (
        <div className="shop-wrapper"> 
            <NavBar 
                onMenuClick={toggleSidebar} 
                onOpenCart={openCart} // 🛑 Pass the global open function
            /> 
            
            <Sidebar 
                isOpen={isSidebarOpen} 
                onClose={toggleSidebar} 
            />
            
            {/* 🛑 ONLY ONE CART SIDEBAR HERE */}
            <CartSidebar 
                isOpen={isCartOpen} 
                onClose={closeCart} 
            />
            
            <main className="shop-main-full shop-main-min-height">
                <Outlet /> 
            </main>
            
            <Footer />
        </div>
    );
};

export default Layout;