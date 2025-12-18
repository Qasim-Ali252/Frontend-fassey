// src/hooks/useCancelOrder.js (FINAL CORRECTED CODE)

import { useMutation, useQueryClient } from "@tanstack/react-query";
// CORRECTED IMPORT: Use the actual function name exported from orderApi.js
import { cancelOrder } from "../api/myOrderApi"; 

export const useCancelOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        // CORRECTED mutationFn: Use the imported function name directly
        mutationFn: cancelOrder, 
        
        onSuccess: (data, variables) => {
            // variables here is the orderId passed to mutate()
            const orderId = variables; 
            
            // Invalidate the specific order detail page
            queryClient.invalidateQueries({ queryKey: ["order", orderId] });
            
            // Invalidate the list of all user orders (MyOrders page)
            queryClient.invalidateQueries({ queryKey: ["userOrders"] });

            alert(`Order ${orderId} has been cancelled.`);
        },
        onError: (error) => {
            console.error("Order cancellation failed:", error);
            alert(`Failed to cancel order: ${error.response?.data?.message || error.message}`);
        },
    });
};