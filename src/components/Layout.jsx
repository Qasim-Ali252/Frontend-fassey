import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Breadcrumb from "./Breadcrumb";
import "../styles/dashboard.css"; // make sure this path is correct

const Layout = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-main">
        <Topbar title="Dashboard" />
        <main className="app-content">
          <Breadcrumb />
          <Outlet /> {/* Page content will render here */}
        </main>
      </div>
    </div>
  );
};

export default Layout;
