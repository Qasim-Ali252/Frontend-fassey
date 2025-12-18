// src/hooks/useCheckoutCart.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { checkoutCart } from "../api/cartApi";

export const useCheckoutCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // Pass the object { cart_id } to match the api/cartApi.js signature
    mutationFn: ({ cart_id }) => checkoutCart(cart_id),
    onSuccess: () => {
      // Clear cart data from cache once order is placed
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["checkout"] });
    },
  });
};