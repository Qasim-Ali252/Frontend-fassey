import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeCartItem } from "../api/cartApi.js";

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeCartItem,
    onSuccess: (data) => {
      queryClient.invalidateQueries(["cart", data.cart_id]);
    },
  });
};
