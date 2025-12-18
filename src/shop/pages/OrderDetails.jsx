import React from "react";
import { useParams } from "react-router-dom";
import { useOrderDetails } from "../../hooks/useOrderDetails";
import "../styles/OrdersDetails.css";

const OrderDetails = () => {
  const { id } = useParams();
  const { data, isLoading } = useOrderDetails(id);

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>Order not found</p>;

  const { order_summary, order_items, shipping_address } = data;

  return (
    <div className="order-details-page">
      <h2>Order #{order_summary.order_id}</h2>
      <p className="order-status"><b>Status:</b> {order_summary.status}</p>
      <p className="order-total"><b>Total Amount:</b> Rs {order_summary.total_amount}</p>

      <div className="shipping-info card">
        <h3>Shipping Address</h3>
        <p>{shipping_address.first_name} {shipping_address.last_name}</p>
        <p>{shipping_address.address_line1}</p>
        {shipping_address.address_line2 && <p>{shipping_address.address_line2}</p>}
        <p>{shipping_address.city} - {shipping_address.postal_code}</p>
        <p>{shipping_address.country}</p>
        <p>Phone: {shipping_address.phone}</p>
        <p>Email: {shipping_address.email}</p>
      </div>

      <div className="order-items-details card">
        <h3>Items</h3>
        {order_items.map(item => (
          <div className="order-item-card" key={item.order_item_id}>
            <img src={item.image} alt={item.sku} />
            <div className="item-info">
              <p>{item.sku}</p>
              <p>{item.quantity} × Rs {item.final_price}</p>
              <p className="subtotal">Subtotal: Rs {item.subtotal}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderDetails;
