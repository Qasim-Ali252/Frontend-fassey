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

/**
 * Creates a new product with variants and images
 * Backend expects multipart/form-data with file uploads
 */
export const createProduct = async (formData) => {
  try {
    const response = await client.post(`/products/add`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to create product";
    throw new Error(message);
  }
};

/**
 * Fetches all categories for the admin panel
 */
export const getCategories = async () => {
  try {
    const response = await client.get(`${ADMIN_BASE}/category/all`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch categories";
    throw new Error(message);
  }
};

/**
 * Uploads an image file and returns the URL
 */
export const uploadImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await client.post(`${ADMIN_BASE}/upload/image`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to upload image";
    throw new Error(message);
  }
};

/**
 * Fetches all orders for admin with pagination and filtering
 */
export const getAdminOrders = async (page = 1, limit = 10, status = '') => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (status) {
      params.append('status', status);
    }
    
    // Correct endpoint: /api/admin/orders/all
    const response = await client.get(`${ADMIN_BASE}/orders/all?${params}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch orders";
    throw new Error(message);
  }
};

/**
 * Fetches order details by ID
 */
export const getOrderById = async (orderId) => {
  try {
    const response = await client.get(`${ADMIN_BASE}/orders/${orderId}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to fetch order details";
    throw new Error(message);
  }
};

/**
 * Updates order status
 * Backend expects: PATCH /api/admin/orders/:id/:status
 */
export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await client.patch(`${ADMIN_BASE}/orders/${orderId}/${status}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to update order status";
    throw new Error(message);
  }
};