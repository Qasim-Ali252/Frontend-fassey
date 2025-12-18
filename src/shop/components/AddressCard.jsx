// src/shop/components/AddressCard.jsx

import React from 'react';
import { IoLocationOutline, IoTrashOutline, IoPencilOutline, IoCheckmarkCircle } from 'react-icons/io5';
import '../styles/ProfilePage.css'; // Inherits styling from the main Profile CSS

const AddressCard = ({ address, onDelete, isDeleting }) => {
    
    // Helper function to format the full address for display
    const formatAddressLines = () => {
        const lines = [
            address.address_line1,
            address.address_line2,
            `${address.city}, ${address.postal_code}`,
            address.country
        ].filter(Boolean); // Filter out any null/undefined lines

        return lines.map((line, index) => <p key={index}>{line}</p>);
    };

    return (
        <div className={`address-card ${address.is_default ? 'is-default' : ''}`}>
            
            <div className="card-header">
                <h4>
                    <IoLocationOutline /> {address.name}
                </h4>
                {address.is_default && (
                    <span className="default-badge">
                        <IoCheckmarkCircle /> Default
                    </span>
                )}
            </div>

            <div className="card-body">
                <p className="recipient-name">
                    <strong>{address.first_name} {address.last_name}</strong>
                </p>
                <div className="address-lines">
                    {formatAddressLines()}
                </div>
                <p className="address-phone">Phone: {address.phone || 'N/A'}</p>
            </div>

            <div className="card-actions">
                <button className="btn-icon-link edit-btn">
                    <IoPencilOutline /> Edit
                </button>
                <button 
                    className="btn-icon-link delete-btn" 
                    onClick={() => { if (window.confirm("Are you sure you want to delete this address?")) onDelete() }}
                    disabled={isDeleting}
                >
                    {isDeleting ? 'Deleting...' : (
                        <>
                            <IoTrashOutline /> Delete
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default AddressCard;