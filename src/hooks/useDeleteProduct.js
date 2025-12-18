import { useMutation } from "@tanstack/react-query";

// Backend does not expose delete at the moment; surface a clear error.
export const useDeleteProduct = () =>
  useMutation({
    mutationFn: async () => {
      throw new Error("Product deletion is not available in the current API.");
    },
  });
