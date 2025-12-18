// src/shop/components/CheckoutAddressForm.jsx

import React, { useState, useEffect, useRef } from 'react';

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

const CheckoutAddressForm = ({ onSubmit, initialData = {} }) => {
    // Track if we've already synced backend data
    const hasInitialized = useRef(false);
    
    // Initialize state for all fields
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address_line1: '',
        address_line2: '',
        city: '',
        postal_code: '',
        country: 'Pakistan',
    });

    // State to track specific field validation errors
    const [errors, setErrors] = useState({});

    // Sync backend data once upon load
    useEffect(() => {
        if (!hasInitialized.current && initialData && Object.keys(initialData).length > 0) {
            setFormData({
                first_name: initialData.first_name || '',
                last_name: initialData.last_name || '',
                email: initialData.email || '',
                phone: initialData.phone || '',
                address_line1: initialData.address_line1 || initialData.address || '',
                address_line2: initialData.address_line2 || initialData.appartment || '',
                city: initialData.city || '',
                postal_code: initialData.postal_code || '',
                country: initialData.country || 'Pakistan',
            });
            hasInitialized.current = true;
        }
    }, [initialData]);

    // Handle input changes - Unlocks fields for typing
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Clear error text as the user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    // Validation Logic
    const validate = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // Specifically tuned for Pakistani phone formats
        const phoneRegex = /^((\+92)|(92)|(0))?3[0-9]{9}$/;

        if (formData.first_name.trim().length < 2) newErrors.first_name = "Min 2 characters required";
        if (formData.last_name.trim().length < 2) newErrors.last_name = "Min 2 characters required";
        if (!emailRegex.test(formData.email)) newErrors.email = "Invalid email format";
        if (!phoneRegex.test(formData.phone.replace(/[\s-]/g, ''))) newErrors.phone = "Invalid format (e.g. 03001234567)";
        if (formData.address_line1.trim().length < 5) newErrors.address_line1 = "Please provide full address";
        if (!formData.city) newErrors.city = "City selection is required";
        if (formData.postal_code.trim().length < 4) newErrors.postal_code = "Min 4 digits";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Progress to next step only if data meets requirements
        if (validate()) {
            if (onSubmit && typeof onSubmit === 'function') {
                onSubmit(formData);
            }
        } else {
            // Scroll to first error field
            const firstErrorField = Object.keys(errors)[0];
            if (firstErrorField) {
                const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
                if (errorElement) {
                    errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    errorElement.focus();
                }
            }
        }
    };

    const hasBackendData = initialData && (initialData.first_name || initialData.email);

    return (
        <form className="checkout-step-panel address-form" onSubmit={handleSubmit}>
            <h3>1. Shipping Information</h3>
            
            {hasBackendData && (
                <div className="backend-data-notice" style={{ 
                    padding: '0.75rem', marginBottom: '1rem', backgroundColor: '#f6fdf9', 
                    border: '1px solid #52b788', borderRadius: '8px', color: '#1b4332',
                    fontSize: '0.85rem', fontWeight: '500'
                }}>
                    ✓ Information pre-filled from your profile. Feel free to edit if needed.
                </div>
            )}
            
            <div className="form-row">
                <div className="input-group">
                    <input type="text" name="first_name" placeholder="First Name *" value={formData.first_name} 
                        onChange={handleChange} className={errors.first_name ? 'input-error' : ''} required />
                    {errors.first_name && <span className="error-text">{errors.first_name}</span>}
                </div>
                <div className="input-group">
                    <input type="text" name="last_name" placeholder="Last Name *" value={formData.last_name} 
                        onChange={handleChange} className={errors.last_name ? 'input-error' : ''} required />
                    {errors.last_name && <span className="error-text">{errors.last_name}</span>}
                </div>
            </div>
            
            <div className="form-row">
                <div className="input-group">
                    <input type="email" name="email" placeholder="Email Address *" value={formData.email} 
                        onChange={handleChange} className={errors.email ? 'input-error' : ''} required />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                </div>
                <div className="input-group">
                    <input type="tel" name="phone" placeholder="Phone (e.g. 03001234567) *" value={formData.phone} 
                        onChange={handleChange} className={errors.phone ? 'input-error' : ''} required />
                    {errors.phone && <span className="error-text">{errors.phone}</span>}
                </div>
            </div>

            <div className="input-group">
                <input type="text" name="address_line1" placeholder="Address (House #, Street, Area) *" value={formData.address_line1} 
                    onChange={handleChange} className={errors.address_line1 ? 'input-error' : ''} required />
                {errors.address_line1 && <span className="error-text">{errors.address_line1}</span>}
            </div>

            <div className="input-group">
                <input type="text" name="address_line2" placeholder="Apartment, Suite, Unit (Optional)" 
                    value={formData.address_line2} onChange={handleChange} />
            </div>

            <div className="form-row">
                <div className="input-group">
                    <select name="city" value={formData.city} onChange={handleChange} className={errors.city ? 'input-error' : ''} required>
                        <option value="">Select City *</option>
                        {PAKISTAN_CITIES.map(city => (<option key={city} value={city}>{city}</option>))}
                    </select>
                    {errors.city && <span className="error-text">{errors.city}</span>}
                </div>
                <div className="input-group">
                    <input type="text" name="postal_code" placeholder="Postal Code *" value={formData.postal_code} 
                        onChange={handleChange} className={errors.postal_code ? 'input-error' : ''} required />
                    {errors.postal_code && <span className="error-text">{errors.postal_code}</span>}
                </div>
            </div>
            
            <div className="input-group">
                <input type="text" name="country" value={formData.country} readOnly className="read-only-input" style={{ backgroundColor: '#f9f9f9', cursor: 'not-allowed' }} />
            </div>
            
            <div className="step-navigation">
                <button type="submit" className="btn-primary">
                    Continue to Payment →
                </button>
            </div>
        </form>
    );
};

export default CheckoutAddressForm;