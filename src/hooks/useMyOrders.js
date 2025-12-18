// src/hooks/useMyOrders.js

import { useQuery } from '@tanstack/react-query';
import axios from 'axios'; 
// NOTE: Assuming your Axios instance is correctly imported/configured for auth

const fetchMyOrders = async () => {
    // You confirmed this is your orders endpoint
    const response = await axios.get('http://localhost:3000/api/order/user_orders');
    
    // The response structure is { message, data: [...orders], pagination: {...} }
    return response.data;
};

// --- React Query Hook ---
export const useMyOrders = (page = 1, limit = 10) => {
    // Key changes when page/limit changes, triggering a refetch
    const queryKey = ['myOrders', { page, limit }]; 

    const query = useQuery({
        queryKey: queryKey,
        queryFn: fetchMyOrders, 
        staleTime: 1000 * 60, // Orders can be slightly stale
    });

    return {
        orders: query.data?.data || [],
        pagination: query.data?.pagination,
        isLoading: query.isLoading,
        isError: query.isError,
    };
};