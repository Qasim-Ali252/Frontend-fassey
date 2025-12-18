// src/shop/pages/Profile.jsx

import React, { useState } from 'react';
import { useUserAuth } from '../../hooks/useUserAuth';
import { useAddresses } from '../../hooks/useAddresses';
import { useUserMyOrders } from '../../hooks/useUserMyOrders';
import { IoLocationOutline, IoPersonOutline, IoLockClosedOutline, IoBagCheckOutline } from 'react-icons/io5';
import { Link, Navigate } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb';

import AccountDetailsSection from '../components/AccountDetailsSection';
import AddressManagementSection from '../components/AddressManagementSection';
import ChangePasswordSection from '../components/ChangePasswordSection';

import '../styles/ProfilePage.css';

const ProfilePage = () => {
    // --- Data Hooks ---
    const { user, isLoading: isAuthLoading, isAuthenticated, logout, refetch: refetchUser } = useUserAuth();
    const { orders = [], isLoading: isOrdersLoading } = useUserMyOrders();
    
    // --- State & Tabs ---
    const [activeTab, setActiveTab] = useState('details');

    // Trigger user fetch on mount
    React.useEffect(() => {
        // Always try to fetch user data when component mounts
        refetchUser();
    }, [refetchUser]);

    if (isAuthLoading) {
        return <div className="profile-loading">Loading user profile...</div>;
    }
    
    // Safety redirect if not logged in
    if (!isAuthenticated) {
        return <Navigate to="/user/login" replace />;
    }
    
    // Renders the correct component based on the active tab
    const renderContent = () => {
        switch (activeTab) {
            case 'details':
                // Passing 'user' data fetched from useUserAuth()
                return <AccountDetailsSection user={user} />;
            case 'password':
                return <ChangePasswordSection />;
            case 'addresses':
                // AddressManagementSection uses the useAddresses() hook internally
                return <AddressManagementSection />;
            default:
                return null;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    const formatOrderId = (orderId) => {
        return `OF${orderId}`;
    };

    return (
        <div className="profile-page-container">
            <Breadcrumb customBreadcrumbs={[
                { label: 'Home', link: '/' },
                { label: 'My Profile', link: null }
            ]} />
            <div className="profile-header">
                <h1>Account</h1>
                <button onClick={logout} className="logout-link">Log out</button>
            </div>
            
            <div className="profile-layout">
                {/* Right Side - Account Details */}
                <div className="profile-right">
                    <div className="profile-tabs-wrapper">
                        <div className="profile-tabs">
                            <button 
                                className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
                                onClick={() => setActiveTab('details')}
                            >
                                <IoPersonOutline /> Account Details
                            </button>
                            <button 
                                className={`tab-btn ${activeTab === 'password' ? 'active' : ''}`}
                                onClick={() => setActiveTab('password')}
                            >
                                <IoLockClosedOutline /> Change Password
                            </button>
                            <button 
                                className={`tab-btn ${activeTab === 'addresses' ? 'active' : ''}`}
                                onClick={() => setActiveTab('addresses')}
                            >
                                <IoLocationOutline /> My Addresses
                            </button>
                        </div>
                    </div>
                    
                    <div className="profile-content">
                        {renderContent()}
                    </div>
                </div>
                {/* Left Side - Order History */}
                <div className="profile-left">
                    <h2>Order history</h2>
                    {isOrdersLoading ? (
                        <div className="loading-state">Loading orders...</div>
                    ) : orders.length === 0 ? (
                        <div className="empty-orders">
                            <p>No orders yet</p>
                        </div>
                    ) : (
                        <div className="orders-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>ORDER</th>
                                        <th>DATE</th>
                                        <th>PAYMENT STATUS</th>
                                        <th>FULFILLMENT STATUS</th>
                                        <th>TOTAL</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order.order_id}>
                                            <td>
                                                <Link to={`/order/${order.order_id}`} className="order-link">
                                                    {formatOrderId(order.order_id)}
                                                </Link>
                                            </td>
                                            <td>{formatDate(order.placed_at)}</td>
                                            <td>
                                                <span className={`status-badge ${order.payment_method === 'cash-on-delivery' ? 'pending' : 'paid'}`}>
                                                    {order.payment_method === 'cash-on-delivery' ? 'Pending' : 'Paid'}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`status-badge ${order.status === 'fulfilled' || order.status === 'completed' ? 'fulfilled' : 'pending'}`}>
                                                    {order.status === 'fulfilled' || order.status === 'completed' ? 'Fulfilled' : 'Pending'}
                                                </span>
                                            </td>
                                            <td>PKR {Number(order.total_amount).toLocaleString()} PKR</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                
            </div>
        </div>
    );
};

export default ProfilePage;