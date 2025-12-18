import React from "react";
import "../styles/Footer.css";

const Footer = () => (
  <footer className="footer">
    <div className="footer-container">
      <h3>The Folks</h3>
      <p>Premium Men's Clothing Brand</p>
      <div className="footer-links">
        <span>Privacy Policy</span>
        <span>Terms & Conditions</span>
        <span>Contact Us</span>
      </div>
      <p>© {new Date().getFullYear()} The Folks. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
