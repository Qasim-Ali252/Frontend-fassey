import { useQuery } from "@tanstack/react-query";
import { fetchProductBySku } from "../api/productApi";

export const useViewProduct = (sku) =>
  useQuery({
    queryKey: ["product", sku],
    queryFn: () => fetchProductBySku(sku),
    enabled: !!sku,
  });
