import React from "react";

const demoCustomers = [
  { id: 1, name: "Ali", email: "ali@example.com" },
  { id: 2, name: "Sarah", email: "sarah@example.com" },
];

const Customers = () => {
  return (
    <div className="card">
      <h3>Customers</h3>
      <table className="table">
        <thead>
          <tr><th>#</th><th>Name</th><th>Email</th></tr>
        </thead>
        <tbody>
          {demoCustomers.map(c => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>{c.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Customers;
