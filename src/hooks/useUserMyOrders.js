// src/hooks/useUserMyOrders.js

import { useQuery } from '@tanstack/react-query';
import { fetchUserOrders } from '../api/myOrderApi';

const fetchMyOrders = async ({ page, limit }) => {
    // Use the configured Axios client from API
    const response = await fetchUserOrders(page, limit);
    
    // The response structure is { message, data: [...orders], pagination: {...} }
    return response;
};

// --- React Query Hook ---
// 🛑 FIX: Export the hook with the name the component is expecting (useUserMyOrders)
export const useUserMyOrders = (page = 1, limit = 10) => { 
    // Key changes when page/limit changes, triggering a refetch
    // NOTE: Changed query key to "userOrders" for better consistency with useCancelOrder
    const queryKey = ['userOrders', { page, limit }]; 

    const query = useQuery({
        queryKey: queryKey,
        queryFn: () => fetchMyOrders({ page, limit }), 
        staleTime: 1000 * 60, // Orders can be slightly stale
    });

    return {
        orders: query.data?.data || [],
        pagination: query.data?.pagination,
        isLoading: query.isLoading,
        isError: query.isError,
    };
};