// src/api/orderApi.js (FINAL COMPLETE CODE)

import client from "./client";

const ORDER_BASE = "/order";

/**
 * Submits the final order to the backend.
 * @param {object} orderData - Contains cart_id, shippingAddress, and paymentMethod.
 */
export const createOrder = async (orderData) => {
    // API endpoint is POST /api/order/create-order
    const res = await client.post(`${ORDER_BASE}/create-order`, orderData);
    return res.data;
};

/**
 * Fetches the list of orders for the currently logged-in user.
 * This corresponds to the backend route: GET /api/order/user
 * @param {number} page - The page number to fetch.
 * @param {number} limit - The number of items per page.
 */
export const fetchUserOrders = async (page = 1, limit = 10) => {
    // The endpoint should be '/order/user' followed by query parameters
    const res = await client.get(`${ORDER_BASE}/user`, {
        params: { page, limit }
    });
    // The backend returns { message, data: orders, pagination }
    return res.data; 
};


/**
 * Fetches a single order by its ID.
 * This corresponds to the backend route: GET /api/order/:id
 * @param {number} orderId - The ID of the order to fetch.
 */
export const fetchOrderById = async (orderId) => {
    if (!orderId) throw new Error("Order ID is required");
    const res = await client.get(`${ORDER_BASE}/${orderId}`);
    // The backend returns { message, data: { order_summary, order_items, shipping_address, ... } }
    return res.data; 
};


/**
 * Sends a request to cancel a specific order.
 * This corresponds to the backend route: DELETE /api/order/:order_id
 * @param {number} orderId - The ID of the order to cancel.
 */
export const cancelOrder = async (orderId) => {
    if (!orderId) throw new Error("Order ID is required for cancellation");
    // The endpoint is DELETE /api/order/:orderId
    const res = await client.delete(`${ORDER_BASE}/${orderId}`); 
    return res.data;
};