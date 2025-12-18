import axios from "axios";

/**
 * Shared Axios client for backend calls.
 * - Base URL comes from Vite env `VITE_API_BASE_URL` or falls back to localhost.
 * - Supports both JWT token and cookie-based authentication.
 */
const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  withCredentials: true,
});

// Add request interceptor to include JWT token if available
client.interceptors.request.use(
  (config) => {
    // Check for JWT token in localStorage
    const token = localStorage.getItem('access_token') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear it
      localStorage.removeItem('access_token');
      localStorage.removeItem('token');
      // Optionally redirect to login
      // window.location.href = '/user/login';
    }
    return Promise.reject(error);
  }
);

export default client;

