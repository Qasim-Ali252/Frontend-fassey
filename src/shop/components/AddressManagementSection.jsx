// src/shop/components/profile/AddressManagementSection.jsx
import React from 'react';
import { useAddresses } from '../../hooks/useAddresses'; // Uses the mock-enabled hook
import AddressCard from './AddressCard'; // Assuming a simple Card component

const AddressManagementSection = () => {
    const { addresses, isLoading, deleteAddress, isDeleting } = useAddresses();

    return (
        <div className="profile-section address-management-section">
            <div className="section-header">
                <h3>My Saved Shipping Addresses</h3>
                {/* NOTE: Add form/modal toggle here in real app */}
                <button className="btn-primary btn-small">Add New Address</button>
            </div>
            
            {isLoading ? (
                <p>Loading addresses...</p>
            ) : addresses.length === 0 ? (
                <div className="empty-state-card">
                    <p>You haven't saved any addresses yet. Add one now!</p>
                </div>
            ) : (
                <div className="address-grid">
                    {addresses.map(addr => (
                        <AddressCard 
                            key={addr.id} 
                            address={addr} 
                            onDelete={() => deleteAddress(addr.id)}
                            isDeleting={isDeleting}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default AddressManagementSection;