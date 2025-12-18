// src/hooks/usePaymentIntent.js
import { useMutation } from "@tanstack/react-query";
import { createPaymentIntent } from "../api/paymentApi";

export const usePaymentIntent = () => {
  return useMutation({
    mutationFn: createPaymentIntent,
  });
};

