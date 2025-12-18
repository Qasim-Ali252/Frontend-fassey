import React from "react";
import "../../styles/dashboard.css";

const stats = [
  { label: "Total Orders", value: 1240 },
  { label: "Total Sales", value: "$42,300" },
  { label: "Products", value: 320 },
  { label: "Low Stock", value: 18 },
];

const Dashboard = () => {
  return (
    <>
      <section className="stats-grid">
        {stats.map((s) => (
          <div className="card stat-card" key={s.label}>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </section>

      <section className="grid-2">
        <div className="card">
          <h3>Recent Orders</h3>
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1001</td>
                <td>Ali</td>
                <td>$120</td>
                <td>Pending</td>
              </tr>
              <tr>
                <td>1000</td>
                <td>Sarah</td>
                <td>$85</td>
                <td>Shipped</td>
              </tr>
              <tr>
                <td>999</td>
                <td>Hamza</td>
                <td>$40</td>
                <td>Delivered</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="card">
          <h3>Top Selling Products</h3>
          <ul className="simple-list">
            <li>Blue Slim Fit Jeans — 120 sold</li>
            <li>Black Slim Fit-Chinos — 87 sold</li>
            <li>Skin Regular Fit-Chinos — 65 sold</li>
          </ul>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
