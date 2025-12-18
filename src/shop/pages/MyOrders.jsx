// src/shop/pages/MyOrders.jsx

import React from "react";
import { Link } from 'react-router-dom'; 
// --- CORRECTED HOOK IMPORT ---
import { useUserMyOrders } from "../../hooks/useUserMyOrders"; 
import { useCancelOrder } from "../../hooks/useCancelOrder";
import { useQueryClient } from "@tanstack/react-query";
import { getStatusClass, getStatusIcon } from '../../utils/orderStatusUtils.jsx'; 
import "../styles/MyOrdersPage.css"; 

const MyOrdersPage = () => {
  const queryClient = useQueryClient();
  
  // --- CORRECTED HOOK USAGE ---
  const { orders = [], isLoading, isError } = useUserMyOrders(); 
  const cancelOrder = useCancelOrder();

  if (isLoading) return <div className="loading-state">Loading orders...</div>;
  if (isError) return <div className="error-state">Error loading orders. Please try again.</div>;

  const handleCancel = (orderId) => {
    if (!window.confirm(`Are you sure you want to cancel Order #${orderId}?`)) {
        return;
    }
    
    cancelOrder.mutate(orderId, {
      onSuccess: () => {
        // Invalidate the 'myOrders' query key to force a refresh of the list
        // Note: The correct query key here should match the one used in useUserMyOrders.js 
        queryClient.invalidateQueries({ queryKey: ["userOrders"] }); 
        alert(`Order #${orderId} has been successfully cancelled.`);
      },
    });
  };

  return (
    <div className="my-orders-container">
      <h2>My Order History</h2>
      {orders.length === 0 ? (
        <div className="empty-state">
            <p>You have no past orders.</p>
            <Link to="/shop" className="btn-primary">Start Shopping</Link>
        </div>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => (
            <div className="order-card" key={order.order_id}>
              <div className="order-header">
                <p><b>Order ID:</b> {order.order_id}</p>
                <p>
                  <b>Status:</b>{" "}
                  <span className={`status-badge ${getStatusClass(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </span>
                </p>
              </div>

              <div className="order-items">
                {order.items.map((item) => (
                  <div key={item.order_item_id || item.sku} className="order-item">
                    <img src={item.image || "/path/to/placeholder.jpg"} alt={item.sku} />
                    <div className="item-info">
                      <p>{item.sku}</p>
                      <p>{item.quantity} × Rs {Number(item.final_price).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <p><b>Total:</b> Rs {Number(order.total_amount).toLocaleString()}</p>
                
                <Link to={`/order/${order.order_id}`} className="btn-secondary btn-small">
                    View Details
                </Link>

                {order.status === "pending" && (
                  <button 
                    className="cancel-btn btn-secondary btn-small" 
                    onClick={() => handleCancel(order.order_id)}
                    disabled={cancelOrder.isLoading}
                  >
                    {cancelOrder.isLoading ? 'Cancelling...' : 'Cancel Order'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;