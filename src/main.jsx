import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CartProvider } from "./shop/context/CartContext";
import "./index.css"; // your global styles

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </React.StrictMode>
);
