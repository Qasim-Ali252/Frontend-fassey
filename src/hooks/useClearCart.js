import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clearCart } from "../api/cartApi.js";

export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearCart,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["cart", data.cart_id]);
    },
  });
};
