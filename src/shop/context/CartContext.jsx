import React, { createContext, useContext, useReducer } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCart } from "../../api/cartApi.js";

const CartContext = createContext();

const initialState = {
  cart: [],
  totalItems: 0,
  totalPrice: 0,
};

function reducer(state, action) {
  let updatedCart;
  switch (action.type) {
    case "SET_CART":
      const cartData = action.payload;
      return {
        ...state,
        cart: cartData.items,
        totalItems: cartData.items.reduce((a, b) => a + b.quantity, 0),
        totalPrice: cartData.items.reduce((a, b) => a + b.price * b.quantity, 0),
      };
    case "CLEAR_CART":
      return initialState;
    default:
      return state;
  }
}

export const CartProvider = ({ children, cart_id }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // DISABLED: Don't fetch cart automatically on mount
  // Cart will only be fetched when explicitly needed (e.g., cart page, after mutations)
  // This prevents unnecessary API calls on every page load

  return (
    <CartContext.Provider value={{ ...state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
