import React from "react";

const demoStock = [
  { sku: "P1001", name: "Blue Slim Fit Jeans", stock: 120 },
  { sku: "P1002", name: "Ripped Denim Jacket", stock: 50 },
];

const Inventory = () => {
  return (
    <div className="card">
      <h3>Inventory</h3>
      <table className="table">
        <thead><tr><th>SKU</th><th>Name</th><th>Stock</th></tr></thead>
        <tbody>
          {demoStock.map(s => (
            <tr key={s.sku}>
              <td>{s.sku}</td>
              <td>{s.name}</td>
              <td>{s.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Inventory;
