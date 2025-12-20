import React from "react";
import "../styles/dashboard.css";

const Topbar = ({ title = "Dashboard" }) => {
  const user = JSON.parse(localStorage.getItem("access_token"))?.user || { username: "Admin" };

  return (
    <header className="app-topbar">
      <h2 className="topbar-title">{title}</h2>

      <div className="topbar-actions">
        <div className="search">
          <input placeholder="Search products, orders..." />
        </div>
        <div className="user">
          <div className="avatar">{user.username ? user.username[0].toUpperCase() : "A"}</div>
          <div className="username">{user.username || "Admin"}</div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;