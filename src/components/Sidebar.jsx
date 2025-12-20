import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles/dashboard.css";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const menu = [
    { to: "/admin", label: "Dashboard", icon: "🏠" },
    { to: "/admin/products", label: "Products", icon: "👖" },
    { to: "/admin/products/add", label: "Add Product", icon: "➕" },
    { to: "/admin/products/categories", label: "Categories", icon: "🗂️" },
    { to: "/admin/orders", label: "Orders", icon: "🧾" },
    { to: "/admin/customers", label: "Customers", icon: "👥" },
    // { to: "/admin/inventory", label: "Inventory", icon: "📦" },
    // { to: "/admin/banners", label: "Banners", icon: "🖼️" },
    // { to: "/admin/messages", label: "Messages", icon: "✉️" },
    { to: "/admin/settings", label: "Settings", icon: "⚙️" },
    { to: "/logout", label: "Logout", icon: "🚪" },
  ];

  return (
    <aside className={`app-sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-top">
        <div className="sidebar-brand">
          <div className="brand-logo">TF</div>
          {!collapsed && <h3>The Folks</h3>}
        </div>

        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? "»" : "«"}
        </button>
      </div>

      <nav className="sidebar-nav">
        {menu.map((m) => (
          <NavLink
            to={m.to}
            key={m.to}
            className="sidebar-link"
            activeclassname="active"
            onClick={() => {
              if (m.to === "/logout") {
                localStorage.removeItem("access_token");
                window.location.href = "/login";
              }
            }}
          >
            <span className="icon">{m.icon}</span>
            {!collapsed && <span className="label">{m.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">{!collapsed && <small>© The Folks</small>}</div>
    </aside>
  );
};

export default Sidebar;