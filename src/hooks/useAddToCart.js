import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToCart } from "../api/cartApi";

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToCart,
    
    // 1. When the button is clicked, this runs immediately before the API call
    onMutate: async (newItem) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      const cartId = localStorage.getItem("cart_id") || "guest";
      await queryClient.cancelQueries({ queryKey: ["cart", cartId] });

      // Snapshot the previous cart data to roll back if the server fails
      const previousCart = queryClient.getQueryData(["cart", cartId]);

      // Optimistically update the cart count in localStorage for the Navbar
      const currentCount = parseInt(localStorage.getItem("cart_count") || "0");
      localStorage.setItem("cart_count", String(currentCount + newItem.quantity));
      window.dispatchEvent(new Event('storage'));

      // Return a context object with the snapshotted value
      return { previousCart, cartId };
    },

    // 2. If the server request succeeds
    onSuccess: (data) => {
      if (data?.cart_id) {
        localStorage.setItem("cart_id", String(data.cart_id));
      }
      if (data?.items) {
        const totalItems = data.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
        localStorage.setItem("cart_count", String(totalItems));
        window.dispatchEvent(new Event('storage'));
      }
    },

    // 3. If the server request fails, we roll back our changes
    onError: (error, newItem, context) => {
      console.error("Add to cart error:", error);
      
      // Roll back localStorage count
      const currentCount = parseInt(localStorage.getItem("cart_count") || "0");
      localStorage.setItem("cart_count", String(Math.max(0, currentCount - newItem.quantity)));
      window.dispatchEvent(new Event('storage'));

      // Roll back the React Query cache
      if (context?.previousCart) {
        queryClient.setQueryData(["cart", context.cartId], context.previousCart);
      }
    },

    // 4. Always refetch after error or success to ensure we are in sync with the DB
    onSettled: (data, error, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["cart", context?.cartId] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};