import client from "./client";

const PAYMENT_BASE = "/payment";

export const createPaymentIntent = async ({ cart_id, shippingAddress }) => {
  const res = await client.post(`${PAYMENT_BASE}/create-payment-intent`, {
    cart_id,
    shippingAddress,
  });
  return res.data;
};

