// src/hooks/useCheckoutData.js
import { useQuery } from "@tanstack/react-query";
import { fetchCart } from "../api/cartApi";

export const useCheckoutData = (cart_id) => {
  const resolvedCartId = cart_id || localStorage.getItem("cart_id");
  
  return useQuery({
    queryKey: ["checkout", resolvedCartId],
    // Use GET (fetchCart) instead of POST (checkoutCart) to pull data instantly
    queryFn: () => fetchCart(resolvedCartId),
    enabled: !!resolvedCartId,
    retry: false,
    staleTime: 1000 * 60 * 5, // Keep in cache for 5 mins to make skeleton disappear fast
    refetchOnWindowFocus: false,
  });
};