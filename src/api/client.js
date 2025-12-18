import axios from "axios";

/**
 * Shared Axios client for backend calls.
 * - Base URL comes from Vite env `VITE_API_BASE_URL` or falls back to localhost.
 * - Cookies are sent by default (backend expects cookie-based auth).
 */
const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  withCredentials: true,
});

export default client;

