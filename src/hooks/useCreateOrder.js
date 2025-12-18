// src/hooks/useCreateOrder.js

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrder } from "../api/orderApi";

export const useCreateOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createOrder,
        onSuccess: (data) => {
            console.log("Order submitted successfully:", data);
            
            // 1. Clear local cart data (Crucial for successful order)
            localStorage.removeItem("cart_id");
            localStorage.removeItem("cart_count");
            
            // 2. Invalidate old cart queries
            const cartId = data?.cart_id;
            queryClient.invalidateQueries({ queryKey: ["cart", cartId] });
            queryClient.invalidateQueries({ queryKey: ["cart"] });
            
            // 3. Invalidate user orders (for history page)
            queryClient.invalidateQueries({ queryKey: ["userOrders"] });
        },
        onError: (error) => {
            console.error("Order creation failed:", error);
        }
    });
};