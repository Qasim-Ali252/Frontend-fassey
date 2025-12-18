import client from "./client";

const USER_BASE = "/user";

// Login API (cookie-based auth)
export const loginUser = async (credentials) => {
  try {
    const response = await client.post(`${USER_BASE}/signin`, credentials);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Login failed";
    throw new Error(message);
  }
};

// Signup API
export const signupUser = async (formData) => {
  try {
    const response = await client.post(`${USER_BASE}/signup`, formData);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Signup failed";
    throw new Error(message);
  }
};
