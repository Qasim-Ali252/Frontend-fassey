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

// Add response interceptor to handle authentication errors
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Authentication failed, redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default client;

