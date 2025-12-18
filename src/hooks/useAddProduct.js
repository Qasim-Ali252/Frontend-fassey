import { useMutation } from "@tanstack/react-query";
import { addProduct } from "../api/productApi";

export const useAddProduct = () =>
  useMutation({
    mutationFn: addProduct,
  });
