import React, { useState } from "react";
import { useAdminOrders, useUpdateOrderStatus } from "../../hooks/useAdminOrders";

const Orders = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [limit] = useState(10);

  const { data: ordersData, isLoading, error } = useAdminOrders(currentPage, limit, statusFilter);
  const updateStatusMutation = useUpdateOrderStatus();

  const orders = ordersData?.data || [];
  const pagination = ordersData?.pagination || {};

  const statusOptions = [
    { value: '', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      confirmed: '#3b82f6',
      shipped: '#8b5cf6',
      completed: '#10b981',
      cancelled: '#ef4444',
    };
    return colors[status?.toLowerCase()] || '#6b7280';
  };

  const handleStatusChange = (orderId, newStatus) => {
    updateStatusMutation.mutate(
      { orderId, status: newStatus },
      {
        onSuccess: () => {
          // Success feedback could be added here
        },
        onError: (error) => {
          alert('Failed to update order status: ' + error.message);
        }
      }
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h3>Error loading orders</h3>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="card">
        <div className="orders-header">
          <h3>Orders Management</h3>
          <div className="orders-filters">
            <select 
              value={statusFilter} 
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1); // Reset to first page when filtering
              }}
              className="status-filter"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="no-orders">
            <p>No orders found</p>
          </div>
        ) : (
          <>
            <div className="table-container">
              <table className="table orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer ID</th>
                    <th>Items</th>
                    <th>Total Amount</th>
                    <th>Payment Method</th>
                    <th>Status</th>
                    <th>Order Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.order_id}>
                      <td>
                        <strong>#{order.order_id}</strong>
                      </td>
                      <td>User #{order.user_id}</td>
                      <td>
                        <span className="items-count">
                          {order._count?.items || 0} items
                        </span>
                      </td>
                      <td>
                        <strong>${order.total_amount}</strong>
                      </td>
                      <td>
                        <span className="payment-method">
                          {order.payment_method?.replace('-', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <span 
                          className="status-badge"
                          style={{ 
                            backgroundColor: getStatusColor(order.status),
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '600',
                            textTransform: 'uppercase'
                          }}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td>{formatDate(order.placed_at)}</td>
                      <td>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.order_id, e.target.value)}
                          disabled={updateStatusMutation.isPending}
                          className="status-select"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="shipped">Shipped</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="pagination">
                <div className="pagination-info">
                  Showing page {pagination.page} of {pagination.pages} 
                  ({pagination.total} total orders)
                </div>
                <div className="pagination-controls">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="btn btn-small"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`btn btn-small ${page === currentPage ? 'active' : ''}`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pagination.pages}
                    className="btn btn-small"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Orders;
