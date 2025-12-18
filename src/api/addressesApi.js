// src/api/addressesApi.js 

// NOTE: Please ensure the import path for your Axios instance is correct.
import client from "./client"; 

const ADDRESS_BASE_URL = "/user/addresses";

/**
 * Fetches all addresses for the logged-in user.
 * Endpoint: GET /api/user/addresses
 */
export const fetchUserAddresses = async () => {
    try {
        // 🛑 CURRENTLY MOCKED 🛑
        // When your API is ready, replace this block with:
        // const res = await client.get(ADDRESS_BASE_URL);
        // return res.data; 

        console.warn("API MOCK: fetchUserAddresses is running. Returning empty data.");
        return { data: [] }; // Return empty array to prevent Profile page crash

    } catch (error) {
        // Handle error logging or re-throwing
        console.error("Error fetching user addresses (MOCK):", error);
        throw error;
    }
};

/**
 * Saves (creates or updates) an address.
 * Endpoint: POST /api/user/addresses or PUT/PATCH
 */
export const saveAddress = async (addressData) => {
    try {
        // 🛑 CURRENTLY MOCKED 🛑
        // When your API is ready, replace this block with:
        // const res = await client.post(ADDRESS_BASE_URL, addressData);
        // return res.data;

        console.warn("API MOCK: saveAddress is simulating success.");
        return { data: { ...addressData, id: Date.now() } };

    } catch (error) {
        console.error("Error saving address (MOCK):", error);
        throw error;
    }
};

/**
 * Deletes an address by ID.
 * Endpoint: DELETE /api/user/addresses/:id
 */
export const deleteAddress = async (id) => {
    try {
        // 🛑 CURRENTLY MOCKED 🛑
        // When your API is ready, replace this block with:
        // const res = await client.delete(`${ADDRESS_BASE_URL}/${id}`);
        // return res.data;

        console.warn("API MOCK: deleteAddress is simulating success for ID:", id);
        return { message: "Deleted" };
        
    } catch (error) {
        console.error("Error deleting address (MOCK):", error);
        throw error;
    }
};