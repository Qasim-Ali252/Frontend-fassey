// src/api/orderApi.js 

import client from "./client"; // 🛑 Ensure this path to your Axios client is correct

const ORDER_BASE_URL = "/order";

/**
 * Fetches a list of orders for the authenticated user.
 * Endpoint: GET http://localhost:3000/api/order/user_orders
 */
export const fetchUserOrders = async (page = 1, limit = 10) => {
    const response = await client.get(`${ORDER_BASE_URL}/user_orders`, {
        params: { page, limit }
    }); 
    return response.data; 
};


export const fetchOrderById = async (id) => {
    
    const response = await client.get(`${ORDER_BASE_URL}/${sku}`);
    return response.data;
};




export const cancelOrder = async (orderId) => {

    const response = await client.post(`${ORDER_BASE_URL}/cancel/${orderId}`);
    return response.data;
};