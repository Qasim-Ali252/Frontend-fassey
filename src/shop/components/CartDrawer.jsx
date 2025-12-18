import React from "react";
import { useCartStore } from "../../store/useCartStore";
import { useCart } from "../../hooks/useCart"; // Link to your existing logic
import "../styles/CartDrawer.css";

const CartDrawer = () => {
  const { isCartOpen, closeCart } = useCartStore();
  
  // Connects to the same 'cart' query as your main /cart page
  const { items, subtotal, isLoading } = useCart();

  return (
    <>
      <div className={`cart-overlay ${isCartOpen ? "active" : ""}`} onClick={closeCart} />
      <div className={`cart-drawer ${isCartOpen ? "open" : ""}`}>
        <div className="cart-header">
          <h3>YOUR BAG ({items.length})</h3>
          <button onClick={closeCart} className="close-x">×</button>
        </div>

        <div className="cart-body">
          {items.length > 0 ? (
            items.map((item) => (
              <div key={item.id} className="drawer-item">
                <img src={item.image} alt={item.name} className="drawer-img" />
                <div className="drawer-info">
                  <p className="item-name">{item.name}</p>
                  <p className="item-meta">{item.size} / {item.color}</p>
                  <p className="item-price">Rs.{item.price}</p>
                  <p className="item-qty">Qty: {item.quantity}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="empty-msg">Your bag is empty.</p>
          )}
        </div>

        <div className="cart-footer">
          <div className="subtotal-row">
            <span>Subtotal</span>
            <span>Rs.{subtotal.toLocaleString()}</span>
          </div>
          <button className="checkout-btn" onClick={() => window.location.href='/checkout'}>
            CHECKOUT
          </button>
        </div>
      </div>
    </>
  );
};

export default CartDrawer;