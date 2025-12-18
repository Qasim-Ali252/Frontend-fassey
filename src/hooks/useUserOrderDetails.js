// src/hooks/useOrderDetails.js

import { useQuery } from '@tanstack/react-query';
import axios from 'axios'; 

// --- API Function ---
const fetchOrderById = async (orderId) => {
    if (!orderId) {
        throw new Error("Order ID is required to fetch details.");
    }
    
    // NOTE: Replace this with your actual Axios instance call (e.g., client.get)
    // The endpoint is assumed to be dynamic: /api/order/:id
    const response = await axios.get(`http://localhost:3000/api/order/${orderId}`);
    
    // The response structure is assumed to be { message, data: {...order_object} }
    return response.data;
};

// --- React Query Hook ---
export const useOrderDetails = (orderId) => {
    const queryKey = ['orderDetails', orderId];

    const query = useQuery({
        queryKey: queryKey,
        queryFn: () => fetchOrderById(orderId), 
        // Only run the query if orderId is a valid number
        enabled: !!orderId && !isNaN(orderId), 
        staleTime: 1000 * 60 * 5, // Order details rarely change, so use a longer stale time
    });

    return {
        // We expect the result to be query.data.data
        order: query.data?.data,
        isLoading: query.isLoading,
        isError: query.isError,
    };
};