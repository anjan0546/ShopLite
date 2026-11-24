import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="shoplite-footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand-col">
            <Link to="/" className="footer-brand" aria-label="ShopLite Home">
              <img src="/logo.svg" alt="ShopLite" className="footer-logo" />
            </Link>
            <p className="footer-desc">
              Your premier online shopping destination. Delivering genuine electronics, trendy fashion, and quality lifestyle products directly to your doorstep.
            </p>
          </div>

          <div className="footer-nav-col">
            <h4 className="footer-col-title">Quick Explore</h4>
            <ul className="footer-links">
              <li><Link to="/#shop-products">Shop Catalog</Link></li>
              <li><Link to="/cart">Shopping Cart</Link></li>
              <li><Link to="/my-orders">My Orders & Tracking</Link></li>
            </ul>
          </div>

          <div className="footer-nav-col">
            <h4 className="footer-col-title">For Sellers</h4>
            <ul className="footer-links">
              <li><Link to="/become-seller">Sell on ShopLite</Link></li>
              <li><Link to="/seller">Merchant Portal</Link></li>
              <li><Link to="/admin">Admin Dashboard</Link></li>
            </ul>
          </div>

          <div className="footer-nav-col">
            <h4 className="footer-col-title">Customer First</h4>
            <ul className="footer-links">
              <li><span>🛡️ 100% Genuine Guarantee</span></li>
              <li><span>⚡ Express Pan-India Delivery</span></li>
              <li><span>🔒 256-Bit Secure Payments</span></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} ShopLite Inc. All rights reserved. Crafted for smart modern shopping.</p>
          <div className="footer-meta-links">
            <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
            <span>•</span>
            <a href="#terms" onClick={(e) => e.preventDefault()}>Terms of Service</a>
            <span>•</span>
            <a href="#support" onClick={(e) => e.preventDefault()}>Help & Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
