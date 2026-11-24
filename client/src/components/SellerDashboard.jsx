import React from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  IconBox,
  IconPlus,
  IconShoppingBag,
  IconArrowRight,
} from "./Icons";
import "./Seller.css";

function SellerDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <div className="seller-page-container">
      <div className="seller-header">
        <div className="seller-header-brand-block">
          <div className="seller-brand-identity">
            <Link to="/" title="ShopLite Home">
              <img src="/logo.svg" alt="ShopLite" className="seller-brand-logo" />
            </Link>
            <span className="seller-portal-badge">Merchant Portal</span>
          </div>
          <h1>Welcome, {user?.name || "Partner"}! 👋</h1>
          <p>Manage your product listings, inventory levels, and customer orders.</p>
        </div>

        <button
          className="seller-action-btn-primary"
          onClick={() => navigate("/seller/add-product")}
        >
          <IconPlus size={16} />
          <span>Add New Product</span>
        </button>
      </div>

      <div className="seller-dash-grid">
        <div className="seller-dash-card">
          <div className="seller-card-icon" style={{ background: "#eef2ff" }}>
            <IconBox size={24} color="#4f46e5" />
          </div>
          <h3>Product Inventory</h3>
          <p>Inspect active catalog items, update prices, adjust descriptions, and monitor stock availability.</p>
          <button
            className="seller-card-link-btn"
            onClick={() => navigate("/seller/products")}
          >
            Manage Products <IconArrowRight size={15} />
          </button>
        </div>

        <div className="seller-dash-card">
          <div className="seller-card-icon" style={{ background: "#ecfeff" }}>
            <IconPlus size={24} color="#06b6d4" />
          </div>
          <h3>List a Product</h3>
          <p>Add new electronics, apparel, or lifestyle products to the ShopLite marketplace catalog.</p>
          <button
            className="seller-card-link-btn"
            onClick={() => navigate("/seller/add-product")}
          >
            Create Listing <IconArrowRight size={15} />
          </button>
        </div>

        <div className="seller-dash-card">
          <div className="seller-card-icon" style={{ background: "#ecfdf5" }}>
            <IconShoppingBag size={24} color="#10b981" />
          </div>
          <h3>Customer Orders</h3>
          <p>View fulfillment orders, customer delivery addresses, and shipment status.</p>
          <button
            className="seller-card-link-btn"
            onClick={() => navigate("/my-orders")}
          >
            View Orders <IconArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default SellerDashboard;
