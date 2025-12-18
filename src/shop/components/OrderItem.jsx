import React from "react";

const OrderItem = ({ item }) => (
  <div className="order-item">
    <p>{item.sku} - {item.quantity} × Rs {item.final_price}</p>
    <p>Subtotal: Rs {item.subtotal}</p>
  </div>
);

export default OrderItem;
