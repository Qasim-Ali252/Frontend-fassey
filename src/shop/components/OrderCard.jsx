// src/shop/components/OrderCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const OrderCard = ({ order }) => {
  const navigate = useNavigate();

  return (
    <div className="order-card" onClick={() => navigate(`/order/${order.order_id}`)}>
      <p>Order ID: #{order.order_id}</p>
      <p>Status: <strong>{order.status}</strong></p>
      <p>Total Amount: Rs {order.total_amount}</p>
      <p>Items: {order._count.items}</p>
      <p>Placed At: {new Date(order.placed_at).toLocaleDateString()}</p>
    </div>
  );
};

export default OrderCard;
