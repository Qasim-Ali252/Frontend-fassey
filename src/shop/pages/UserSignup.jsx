import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserAuth } from '../../hooks/useUserAuth';
import '../styles/userAuth.css'; // Using the shared CSS for styling

const UserSignup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const navigate = useNavigate();
    
    // Get the register function and loading state from the hook
    const { register, isRegistering } = useUserAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");

        if (!formData.name || !formData.email || !formData.password) {
            setErrorMsg("Please fill all fields");
            return;
        }

        register(
            formData,
            {
                onSuccess: () => {
                    setSuccessMsg("Signup successful! Please log in.");
                    // Redirect after a brief moment or on user action
                    setTimeout(() => navigate("/user/login"), 1500); 
                },
                onError: (error) => {
                    setErrorMsg(error.response?.data?.message || "Signup failed. Please try a different email.");
                }
            }
        );
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>Customer Create Account</h2>
                
                <form className="auth-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        disabled={isRegistering}
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={isRegistering}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        disabled={isRegistering}
                    />
                    <button className="btn" type="submit" disabled={isRegistering}>
                        {isRegistering ? "Signing up..." : "Signup"}
                    </button>
                </form>

                {errorMsg && <p style={{ color: "red", marginTop: "10px" }}>{errorMsg}</p>}
                {successMsg && <p style={{ color: "green", marginTop: "10px" }}>{successMsg}</p>}

                <p className="auth-text">
                    Already have an account? <Link to="/user/login">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default UserSignup;