// src/App.jsx 

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// --- CORE IMPORTS ---
import NotFound from "./pages/NotFound"; 
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";

// --- ADMIN AUTH IMPORTS ---
import AdminLogin from "./pages/Login";    
import AdminSignup from "./pages/Signup";  
import AdminLayout from "./components/Layout"; 

// --- CUSTOMER (SHOP) AUTH IMPORTS ---
import UserLogin from "./shop/pages/UserLogin";       
import UserSignup from "./shop/pages/UserSignup";     

// --- ADMIN PAGES IMPORTS ---
import Dashboard from "./pages/dashboard/Dashboard";
import Products from "./pages/products/Products";
import AddProduct from "./pages/products/AddProduct";
import EditProduct from "./pages/products/EditProduct";
import ViewProduct from "./pages/products/ViewProduct";
import Categories from "./pages/products/Categories";
import Orders from "./pages/orders/Orders";
import Customers from "./pages/customers/Customers";
import Inventory from "./pages/inventory/Inventory";
import Settings from "./pages/settings/Settings";

// --- SHOP PAGES IMPORTS ---
import Layout from "./shop/components/Layout";
import HomePage from "./shop/pages/HomePage";
import ShopPage from "./shop/pages/ShopPage";
import ShopProduct from "./shop/pages/ShopProduct";
import Cart from "./shop/pages/Cart.jsx";
import Checkout from "./shop/pages/CheckoutPage";
import MyOrders from "./shop/pages/MyOrders";
import OrderDetails from "./shop/pages/OrderDetails";
import Profile from "./shop/pages/Profile"; 
import SearchResultsPage from "./shop/pages/SearchResultsPage"; 

// Optimized Query Client Configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Cache data for 5 mins to prevent "Refining Details" flicker
      refetchOnWindowFocus: false, 
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
        {/* 🛑 CRITICAL CHANGE: Removed <CartDrawer /> from here. 
            The cart is now handled exclusively inside Layout.jsx 
            to prevent the "Two Carts" duplication bug.
        */}

        <Routes>
          {/* ----------- DEDICATED AUTH ROUTES (No Layout) ----------- */}
          <Route path="/login" element={
            <ProtectedRoute requireAuth={false}>
              <AdminLogin />
            </ProtectedRoute>
          } />
          <Route path="/signup" element={
            <ProtectedRoute requireAuth={false}>
              <AdminSignup />
            </ProtectedRoute>
          } />
          <Route path="/user/login" element={
            <ProtectedRoute requireAuth={false}>
              <UserLogin />
            </ProtectedRoute>
          } />
          <Route path="/user/signup" element={
            <ProtectedRoute requireAuth={false}>
              <UserSignup />
            </ProtectedRoute>
          } />

          {/* ----------- SHOP LAYOUT (Frontend) ----------- */}
          <Route element={<Layout />}>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} /> 
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/shop/:gender" element={<ShopPage />} />
            <Route path="/shop/:gender/:category" element={<ShopPage />} />
            <Route path="/product/:sku" element={<ShopProduct />} /> 
            <Route path="/about" element={<h1>About Us</h1>} />
            <Route path="/contact" element={<h1>Contact</h1>} />
            <Route path="/cart" element={<Cart />} /> 
            
            {/* Protected Customer Routes */}
            <Route path="/checkout" element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } /> 
            <Route path="/my-orders" element={
              <ProtectedRoute>
                <MyOrders />
              </ProtectedRoute>
            } />
            <Route path="/order/:id" element={
              <ProtectedRoute>
                <OrderDetails />
              </ProtectedRoute>
            } />
          </Route>

          {/* ----------- ADMIN LAYOUT (Backend) - All Protected ----------- */}
          <Route path="/admin" element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }>
            <Route index element={<Dashboard />} /> 
            <Route path="products" element={<Products />} />
            <Route path="products/add" element={<AddProduct />} />
            <Route path="products/edit/:id" element={<EditProduct />} />
            <Route path="products/view/:sku" element={<ViewProduct />} />
            <Route path="products/categories" element={<Categories />} />
            <Route path="orders" element={<Orders />} />
            <Route path="customers" element={<Customers />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Error Routes */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;