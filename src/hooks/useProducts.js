import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../api/productApi";

export const useProducts = () =>
  useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
