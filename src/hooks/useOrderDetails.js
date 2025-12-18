// src/hooks/useOrderDetails.js (FINAL CORRECTED CODE)

import { useQuery } from "@tanstack/react-query";
// CORRECTED IMPORT: Use the actual function name exported from orderApi.js
import { fetchOrderById } from "../api/myOrderApi"; 

/**
 * Fetches the detailed information for a single order by ID.
 * @param {number} orderId - The ID of the order to fetch.
 */
export const useOrderDetails = (orderId) => {
    return useQuery({
        queryKey: ["order", orderId], // Changed queryKey to ["order", ID] for consistency
        
        // CORRECTED queryFn: Use the correct function name and pass the ID
        queryFn: () => fetchOrderById(orderId), 

        // Only run the query if orderId is provided
        enabled: !!orderId,
        staleTime: 1000 * 60 * 5, 
    });
};