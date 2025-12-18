// src/api/cartApi.js
import client from "./client";

const CART_BASE = "/cart";

/**
 * Normalizes the cart_id.
 * Backend can derive cart from authenticated user/session, 
 * so we resolve to a number or null.
 */
const resolveCartId = (cart_id) => {
  if (cart_id === undefined || cart_id === null) return null;
  const parsed = parseInt(cart_id, 10);
  return isNaN(parsed) ? null : parsed;
};

// Fetch cart contents
export const fetchCart = async (cart_id) => {
  const cartToken = resolveCartId(cart_id);
  // Using params to pass cart_id for the GET request
  const res = await client.get(`${CART_BASE}`, { params: { cart_id: cartToken } });
  return res.data;
};

// Add item to cart
export const addToCart = async ({ sku, quantity = 1, cart_id }) => {
  if (!sku) throw new Error("SKU is required to add item to cart");
  
  const cartToken = resolveCartId(cart_id);
  const res = await client.post(`${CART_BASE}/add`, { 
    sku, 
    quantity, 
    cart_id: cartToken 
  });
  return res.data;
};

// Update quantity of cart item
export const updateCartItem = async ({ cart_id, sku, quantity }) => {
  if (!sku) throw new Error("SKU is required to update cart item");
  
  const cartToken = resolveCartId(cart_id);
  // PUT request sends quantity and sku for stock validation
  const res = await client.put(`${CART_BASE}/updateitem`, { 
    cart_id: cartToken, 
    sku, 
    quantity 
  });
  return res.data;
};

// Remove item from cart
export const removeCartItem = async ({ cart_id, sku }) => {
  if (!sku) throw new Error("SKU is required to remove cart item");
  
  const cartToken = resolveCartId(cart_id);
  // Axios DELETE requires data to be wrapped in a config object
  const res = await client.delete(`${CART_BASE}/removeitem`, { 
    data: { cart_id: cartToken, sku } 
  });
  return res.data;
};

// Clear the entire cart
export const clearCart = async (cart_id) => {
  const cartToken = resolveCartId(cart_id);
  const res = await client.post(`${CART_BASE}/clear`, { cart_id: cartToken });
  return res.data;
};

// Checkout cart
export const checkoutCart = async (cart_id) => {
  const cartToken = resolveCartId(cart_id);
  const res = await client.post(`${CART_BASE}/checkout`, { 
    cart_id: cartToken 
  });
  return res.data;
};