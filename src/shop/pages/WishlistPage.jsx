import React from "react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import "../styles/Wishlist.css";

const WishlistPage = () => {
  const { wishlist, dispatch: wishlistDispatch } = useWishlist();
  const { dispatch: cartDispatch } = useCart();

  if (wishlist.length === 0)
    return (
      <div className="wishlist-container empty-wishlist">
        <h2>Your Wishlist is Empty</h2>
        <p>Add some products to your wishlist!</p>
      </div>
    );

  const moveToCart = (item) => {
    cartDispatch({ type: "ADD_TO_CART", payload: item });
    wishlistDispatch({ type: "REMOVE_FROM_WISHLIST", payload: item._id });
  };

  return (
    <div className="wishlist-container">
      <h2 className="wishlist-title">My Wishlist</h2>
      <div className="wishlist-items">
        {wishlist.map((item) => (
          <div key={item._id} className="wishlist-item">
            <img src={item.image} alt={item.name} />
            <div className="item-details">
              <h3>{item.name}</h3>
              <p>${item.price}</p>
            </div>
            <div className="wishlist-actions">
              <button className="move-btn" onClick={() => moveToCart(item)}>
                Move to Cart
              </button>
              <button
                className="remove-btn"
                onClick={() =>
                  wishlistDispatch({ type: "REMOVE_FROM_WISHLIST", payload: item._id })
                }
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
