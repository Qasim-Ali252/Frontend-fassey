// src/hooks/useProduct.js

import { useQuery } from "@tanstack/react-query";
import { fetchProductBySku } from "../api/productApi";

/**
 * Fetch a single product by SKU.
 */
export const useProduct = (sku) =>
  useQuery({
    queryKey: ["product", sku],
    queryFn: () => fetchProductBySku(sku),
    enabled: !!sku,
    staleTime: 1000 * 60 * 5,
  });