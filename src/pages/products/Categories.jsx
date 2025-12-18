import React from "react";

const demoCategories = [
  { id: 1, name: "Jeans" },
  { id: 2, name: "Jackets" },
  { id: 3, name: "Shirts" },
];

const Categories = () => {
  return (
    <div className="app-content">
      <div className="card">
        <h3>Categories</h3>
        <ul className="simple-list">
          {demoCategories.map((c) => (
            <li key={c.id}>{c.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Categories;
