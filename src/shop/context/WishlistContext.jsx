import React, { createContext, useContext, useReducer } from "react";

const WishlistContext = createContext();

const initialState = {
  wishlist: [],
};

function reducer(state, action) {
  let updatedWishlist;
  switch (action.type) {
    case "ADD_TO_WISHLIST":
      if (state.wishlist.find(item => item._id === action.payload._id)) return state;
      updatedWishlist = [...state.wishlist, action.payload];
      return { ...state, wishlist: updatedWishlist };

    case "REMOVE_FROM_WISHLIST":
      updatedWishlist = state.wishlist.filter(item => item._id !== action.payload);
      return { ...state, wishlist: updatedWishlist };

    case "CLEAR_WISHLIST":
      return initialState;

    default:
      return state;
  }
}

export const WishlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <WishlistContext.Provider value={{ ...state, dispatch }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
