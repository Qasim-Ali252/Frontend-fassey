import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserAuth } from '../../hooks/useUserAuth';
import '../styles/userAuth.css'; // Using the shared CSS for styling

const UserLogin = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();
    
    // Get the login function and loading state from the hook
    const { login, isLoggingIn } = useUserAuth();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");

        if (!credentials.email || !credentials.password) {
            setErrorMsg("Please fill all fields");
            return;
        }

        try {
            console.log('Starting login process...');
            await login(
                credentials,
                {
                    onSuccess: (loginData, userData) => {
                        // Navigate home after successful login
                        console.log('Login successful, user data:', userData);
                        console.log('Navigating to home page...');
                        
                        // Use setTimeout to ensure all state updates are complete
                        setTimeout(() => {
                            navigate('/', { replace: true });
                        }, 200);
                    },
                    onError: (error) => {
                        console.error('Login error in callback:', error);
                        // Update local error state if the hook didn't handle the UI alert
                        setErrorMsg(error.response?.data?.message || "Login failed. Check your credentials."); 
                    }
                }
            );
            console.log('Login process completed');
        } catch (error) {
            console.error('Login error in try-catch:', error);
            // Fallback error handling
            setErrorMsg(error.response?.data?.message || "Login failed. Check your credentials.");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>Customer Login</h2>
                
                <form className="auth-form" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={credentials.email}
                        onChange={handleChange}
                        required
                        disabled={isLoggingIn}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={credentials.password}
                        onChange={handleChange}
                        required
                        disabled={isLoggingIn}
                    />
                    <button className="btn" type="submit" disabled={isLoggingIn}>
                        {isLoggingIn ? 'Logging In...' : 'Login'}
                    </button>
                </form>

                {errorMsg && <p style={{ color: "red", marginTop: "10px" }}>{errorMsg}</p>}
                
                <p className="auth-text">
                    Don’t have an account? <Link to="/user/signup">Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default UserLogin;