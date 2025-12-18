// src/shop/components/profile/ChangePasswordSection.jsx
import React, { useState } from 'react';

const ChangePasswordSection = () => {
    // NOTE: This should use a mutation hook (e.g., useChangePassword) from useUserAuth
    const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Logic for calling a mutation to change password...
        setTimeout(() => {
            alert('Password changed successfully (Mock)!');
            setIsSubmitting(false);
            setPasswordData({ current: '', new: '', confirm: '' });
        }, 1000);
    };

    return (
        <div className="profile-section password-section">
            <h3>Change Password</h3>
            <form className="password-form" onSubmit={handleSubmit}>
                <label>Current Password</label>
                <input 
                    type="password" 
                    required 
                    value={passwordData.current}
                    onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                />
                
                <label>New Password</label>
                <input 
                    type="password" 
                    required 
                    value={passwordData.new}
                    onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                />

                <label>Confirm New Password</label>
                <input 
                    type="password" 
                    required 
                    value={passwordData.confirm}
                    onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                />
                
                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Update Password'}
                </button>
            </form>
        </div>
    );
};

export default ChangePasswordSection;