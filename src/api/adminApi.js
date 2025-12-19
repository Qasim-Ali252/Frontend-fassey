import client from "./client";

const ADMIN_BASE = "/admin";

/**
 * Fetches admin dashboard data including stats, recent orders, and top products
 */
export const getAdminDashboard = async () => {
  try {
    const response = await client.get(`${ADMIN_BASE}/dashboard`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch dashboard data";
    throw new Error(message);
  }
};