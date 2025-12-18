import React from "react";

const demoOrders = [
  { id: 1001, customer: "Ali", total: "$120", status: "Pending" },
  { id: 1000, customer: "Sarah", total: "$85", status: "Shipped" },
];

const Orders = () => {
  return (
    <div className="card">
      <h3>All Orders</h3>
      <table className="table">
        <thead>
          <tr><th>#</th><th>Customer</th><th>Total</th><th>Status</th></tr>
        </thead>
        <tbody>
          {demoOrders.map(o => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.customer}</td>
              <td>{o.total}</td>
              <td>{o.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
