import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCartItem } from "../api/cartApi.js";

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCartItem,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["cart", data.cart_id]);
    },
  });
};
