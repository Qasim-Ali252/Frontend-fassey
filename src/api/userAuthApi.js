import client from "./client";

const USER_BASE = "/user";

// 1. Function to register a new user (maps to /api/user/signup)
export const registerUser = async (userData) => {
  const res = await client.post(`${USER_BASE}/signup`, userData);
  return res.data;
};

// 2. Function to log in a user (maps to /api/user/signin)
export const loginUser = async (credentials) => {
  const res = await client.post(`${USER_BASE}/signin`, credentials);
  return res.data;
};

// 3. Function to log out a user (maps to /api/user/signout)
export const logoutUser = async () => {
  const res = await client.get(`${USER_BASE}/signout`);
  return res.data;
};

// 4. Function to fetch the current user's details (maps to /api/user/me)
export const fetchUserProfile = async () => {
  const res = await client.get(`${USER_BASE}/me`);
  return res.data;
};

// 5. Function to update/create user profile (maps to /api/user/me POST)
export const updateUserProfile = async (payload) => {
  const res = await client.post(`${USER_BASE}/me`, payload);
  return res.data;
};