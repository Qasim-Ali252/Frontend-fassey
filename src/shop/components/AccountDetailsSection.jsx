// src/shop/components/AccountDetailsSection.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchUserProfile, updateUserProfile } from '../../api/userAuthApi';
import { 
    IoPersonOutline, 
    IoMailOutline, 
    IoCallOutline, 
    IoLocationOutline, 
    IoHomeOutline,
    IoPencilOutline,
    IoCheckmarkCircleOutline,
    IoAddCircleOutline
} from 'react-icons/io5';

// Common Pakistani cities for dropdown
const PAKISTAN_CITIES = [
    'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 
    'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala',
    'Hyderabad', 'Sargodha', 'Bahawalpur', 'Sukkur', 'Larkana',
    'Sheikhupura', 'Jhang', 'Rahim Yar Khan', 'Gujrat', 'Kasur',
    'Mardan', 'Mingora', 'Nawabshah', 'Chiniot', 'Kotri',
    'Khanpur', 'Hafizabad', 'Kohat', 'Jacobabad', 'Shikarpur',
    'Muzaffargarh', 'Khanewal', 'Hasan Abdal', 'Kamoke', 'Mandi Bahauddin',
    'Other'
];

const AccountDetailsSection = ({ user }) => {
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        phone: '',
        address: '',
        appartment: '',
        city: '',
        postal_code: '',
    });
    const [errors, setErrors] = useState({});

    // Fetch user profile data
    const { data: profileData, isLoading: isProfileLoading, refetch } = useQuery({
        queryKey: ['userProfile'],
        queryFn: fetchUserProfile,
        enabled: !!user,
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    });

    // Get email from multiple possible sources
    // The email should be in the User model from the /api/user/me response
    const userEmail = useMemo(() => {
        // The /api/user/me endpoint should return user data with email
        // Backend returns: { userProfile: {...} } or { userProfile: null, needProfile: true }
        // The user email should be in the User model, which might be at the root or nested
        
        // Priority 1: Check user prop from useUserAuth (from User model)
        if (user?.email) return user.email;
        // Priority 2: Check profileData root level (if backend returns email directly)
        if (profileData?.email) return profileData.email;
        // Priority 3: Check nested user object in profileData
        if (profileData?.user?.email) return profileData.user.email;
        // Priority 4: Check userProfile email (if it exists in profile)
        if (profileData?.userProfile?.email) return profileData.userProfile.email;
        return '';
    }, [profileData, user]);

    // Update profile mutation
    const updateMutation = useMutation({
        mutationFn: updateUserProfile,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            queryClient.invalidateQueries({ queryKey: ['user'] });
            setIsEditing(false);
            alert('Profile updated successfully!');
        },
        onError: (error) => {
            alert(error?.response?.data?.message || 'Failed to update profile');
        },
    });

    // Initialize form data when profile data is loaded
    useEffect(() => {
        if (profileData?.userProfile) {
            setFormData({
                first_name: profileData.userProfile.first_name || '',
                last_name: profileData.userProfile.last_name || '',
                phone: profileData.userProfile.phone || '',
                address: profileData.userProfile.address || '',
                appartment: profileData.userProfile.appartment || '',
                city: profileData.userProfile.city || '',
                postal_code: profileData.userProfile.postal_code || '',
            });
        }
        // Reset form when switching to edit mode from empty state
        if (isEditing && !profileData?.userProfile) {
            setFormData({
                first_name: '',
                last_name: '',
                phone: '',
                address: '',
                appartment: '',
                city: '',
                postal_code: '',
            });
        }
    }, [profileData, isEditing]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validate = () => {
        const newErrors = {};
        const phoneRegex = /^((\+92)|(92)|(0))?3[0-9]{9}$/;

        if (!formData.first_name.trim()) newErrors.first_name = "First name is required";
        if (!formData.last_name.trim()) newErrors.last_name = "Last name is required";
        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else if (!phoneRegex.test(formData.phone.replace(/[\s-]/g, ''))) {
            newErrors.phone = "Invalid format (e.g. 03001234567)";
        }
        if (!formData.address.trim()) newErrors.address = "Address is required";
        if (!formData.city) newErrors.city = "City selection is required";
        if (!formData.postal_code.trim()) {
            newErrors.postal_code = "Postal code is required";
        } else if (formData.postal_code.length < 4) {
            newErrors.postal_code = "Min 4 digits required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        updateMutation.mutate(formData);
    };

    if (isProfileLoading) {
        return (
            <div className="profile-section details-section">
                <div className="loading-profile">
                    <div className="loading-spinner"></div>
                    <p>Loading your profile...</p>
                </div>
            </div>
        );
    }

    const needProfile = profileData?.needProfile;
    const userProfile = profileData?.userProfile;
    const hasProfile = !!userProfile;

    return (
        <div className="profile-section details-section modern-profile-section">
            <div className="section-header">
                <div className="section-title-wrapper">
                    <h3>Personal Information</h3>
                    {hasProfile && (
                        <span className="profile-status-badge">
                            <IoCheckmarkCircleOutline /> Complete
                        </span>
                    )}
                </div>
                {hasProfile && !isEditing && (
                    <button 
                        className="btn-edit-modern" 
                        onClick={() => setIsEditing(true)}
                        disabled={updateMutation.isLoading}
                    >
                        <IoPencilOutline /> Edit
                    </button>
                )}
            </div>

            {!hasProfile && !isEditing ? (
                // Empty State - No Profile Found
                <div className="profile-empty-state">
                    <div className="empty-state-icon">
                        <IoPersonOutline />
                    </div>
                    <h4>Complete Your Profile</h4>
                    <p>Add your personal information to get started with a better shopping experience.</p>
                    <button 
                        className="btn-add-profile"
                        onClick={() => setIsEditing(true)}
                    >
                        <IoAddCircleOutline /> Add Personal Information
                    </button>
                </div>
            ) : isEditing ? (
                // Edit Form View
                <div className="profile-form-container modern-form">
                    {!hasProfile && (
                        <div className="profile-notice modern-notice">
                            <IoPersonOutline />
                            <span>Please complete your profile to continue.</span>
                        </div>
                    )}
                    <form className="modern-form-grid" onSubmit={handleSubmit}>
                        <div className="form-row-modern">
                            <div className="input-group-modern">
                                <label htmlFor="first_name">
                                    <IoPersonOutline /> First Name *
                                </label>
                                <input 
                                    id="first_name" 
                                    name="first_name"
                                    type="text" 
                                    value={formData.first_name} 
                                    onChange={handleChange}
                                    className={errors.first_name ? 'input-error' : ''}
                                    placeholder="Enter your first name"
                                    required 
                                />
                                {errors.first_name && <span className="error-text">{errors.first_name}</span>}
                            </div>
                            <div className="input-group-modern">
                                <label htmlFor="last_name">
                                    <IoPersonOutline /> Last Name *
                                </label>
                                <input 
                                    id="last_name" 
                                    name="last_name"
                                    type="text" 
                                    value={formData.last_name} 
                                    onChange={handleChange}
                                    className={errors.last_name ? 'input-error' : ''}
                                    placeholder="Enter your last name"
                                    required 
                                />
                                {errors.last_name && <span className="error-text">{errors.last_name}</span>}
                            </div>
                        </div>

                        <div className="input-group-modern">
                            <label htmlFor="email">
                                <IoMailOutline /> Email Address
                            </label>
                            <input 
                                id="email" 
                                type="email" 
                                value={userEmail} 
                                disabled 
                                className="input-disabled"
                            />
                            <span className="field-hint">Email cannot be changed</span>
                        </div>

                        <div className="input-group-modern">
                            <label htmlFor="phone">
                                <IoCallOutline /> Phone Number *
                            </label>
                            <input 
                                id="phone" 
                                name="phone"
                                type="tel" 
                                placeholder="03001234567"
                                value={formData.phone} 
                                onChange={handleChange}
                                className={errors.phone ? 'input-error' : ''}
                                required 
                            />
                            {errors.phone && <span className="error-text">{errors.phone}</span>}
                        </div>

                        <div className="input-group-modern">
                            <label htmlFor="address">
                                <IoLocationOutline /> Street Address *
                            </label>
                            <input 
                                id="address" 
                                name="address"
                                type="text" 
                                placeholder="Street no. 2 Ali Town, Kot Khadim Ali Shah"
                                value={formData.address} 
                                onChange={handleChange}
                                className={errors.address ? 'input-error' : ''}
                                required 
                            />
                            {errors.address && <span className="error-text">{errors.address}</span>}
                        </div>

                        <div className="input-group-modern">
                            <label htmlFor="appartment">
                                <IoHomeOutline /> Apartment / Suite (Optional)
                            </label>
                            <input 
                                id="appartment" 
                                name="appartment"
                                type="text" 
                                placeholder="Apartment, suite, unit, etc."
                                value={formData.appartment} 
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-row-modern">
                            <div className="input-group-modern">
                                <label htmlFor="city">
                                    <IoLocationOutline /> City *
                                </label>
                                <select 
                                    id="city" 
                                    name="city"
                                    value={formData.city} 
                                    onChange={handleChange}
                                    className={errors.city ? 'input-error' : ''}
                                    required
                                >
                                    <option value="">Select City</option>
                                    {PAKISTAN_CITIES.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                                {errors.city && <span className="error-text">{errors.city}</span>}
                            </div>
                            <div className="input-group-modern">
                                <label htmlFor="postal_code">
                                    <IoLocationOutline /> Postal Code *
                                </label>
                                <input 
                                    id="postal_code" 
                                    name="postal_code"
                                    type="text" 
                                    placeholder="5700"
                                    value={formData.postal_code} 
                                    onChange={handleChange}
                                    className={errors.postal_code ? 'input-error' : ''}
                                    required 
                                />
                                {errors.postal_code && <span className="error-text">{errors.postal_code}</span>}
                            </div>
                        </div>

                        <div className="form-actions-modern">
                            <button 
                                type="button"
                                className="btn-cancel-modern"
                                onClick={() => {
                                    setIsEditing(false);
                                    setErrors({});
                                }}
                                disabled={updateMutation.isLoading}
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className="btn-save-modern"
                                disabled={updateMutation.isLoading}
                            >
                                {updateMutation.isLoading ? (
                                    <>
                                        <span className="spinner-small"></span> Saving...
                                    </>
                                ) : (
                                    <>
                                        <IoCheckmarkCircleOutline /> {hasProfile ? 'Save Changes' : 'Save Profile'}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                // Read-Only View - Modern Card Layout
                <div className="profile-info-cards">
                    <div className="info-card">
                        <div className="info-card-icon">
                            <IoPersonOutline />
                        </div>
                        <div className="info-card-content">
                            <span className="info-card-label">Full Name</span>
                            <span className="info-card-value">
                                {userProfile?.first_name && userProfile?.last_name 
                                    ? `${userProfile.first_name} ${userProfile.last_name}`
                                    : 'Not provided'
                                }
                            </span>
                        </div>
                    </div>

                    <div className="info-card">
                        <div className="info-card-icon">
                            <IoMailOutline />
                        </div>
                        <div className="info-card-content">
                            <span className="info-card-label">Email Address</span>
                            <span className="info-card-value">{userEmail || 'Not provided'}</span>
                        </div>
                    </div>

                    <div className="info-card">
                        <div className="info-card-icon">
                            <IoCallOutline />
                        </div>
                        <div className="info-card-content">
                            <span className="info-card-label">Phone Number</span>
                            <span className="info-card-value">{userProfile?.phone || 'Not provided'}</span>
                        </div>
                    </div>

                    {userProfile?.address && (
                        <div className="info-card info-card-full">
                            <div className="info-card-icon">
                                <IoLocationOutline />
                            </div>
                            <div className="info-card-content">
                                <span className="info-card-label">Address</span>
                                <div className="info-card-address">
                                    <span className="info-card-value">{userProfile.address}</span>
                                    {userProfile.appartment && (
                                        <span className="info-card-value address-line-2">{userProfile.appartment}</span>
                                    )}
                                    <span className="info-card-value address-line-3">
                                        {userProfile.city}, {userProfile.postal_code}, Pakistan
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AccountDetailsSection;
