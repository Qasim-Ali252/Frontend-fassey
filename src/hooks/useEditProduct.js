import { useMutation } from "@tanstack/react-query";

// Backend does not expose edit at the moment; surface a clear error.
export const useEditProduct = () =>
  useMutation({
    mutationFn: async () => {
      throw new Error("Product editing is not available in the current API.");
    },
  });
