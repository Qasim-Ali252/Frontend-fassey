import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct } from "../api/adminApi";

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      // Invalidate and refetch any product-related queries
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    },
  });
};