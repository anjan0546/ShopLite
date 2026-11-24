import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  IconCheck,
  IconCopy,
  IconShoppingBag,
  IconTruck,
  IconBox,
} from "./Icons";
import { useToast } from "../context/ToastContext";
import "./OrderSuccess.css";

function OrderSuccess() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [copied, setCopied] = useState(false);

  let order = null;
  try {
    order = JSON.parse(localStorage.getItem("lastOrder"));
  } catch {
    order = null;
  }

  if (!order) {
    return (
      <main className="order-success-page">
        <div className="order-success-card empty-state">
          <div className="success-icon-wrapper muted">
            <IconBox size={36} color="#64748b" />
          </div>
          <h2>No Recent Order Found</h2>
          <p>You haven't placed an order in this session yet.</p>
          <Link to="/" className="btn-success-primary">
            Start Shopping Now
          </Link>
        </div>
      </main>
    );
  }

  const orderId = order._id || "ORD-" + Math.floor(100000 + Math.random() * 900000);
  const items = order.items || [];
  const shipping = order.shipping || {};
  const total = order.totalAmount || 0;

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    addToast("Order ID copied to clipboard!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Delivery estimation (3 days from now)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);
  const formattedDelivery = deliveryDate.toLocaleDateString("en-IN", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <main className="order-success-page">
      {/* Decorative Celebration Confetti Particles */}
      <div className="confetti-container" aria-hidden="true">
        {[...Array(20)].map((_, i) => (
          <div key={i} className={`confetti-particle p-${i % 5}`}></div>
        ))}
      </div>

      <div className="order-success-container">
        {/* Hero Card */}
        <div className="order-success-card">
          <div className="success-icon-badge">
            <IconCheck size={42} color="#ffffff" />
          </div>

          <span className="success-eyebrow">ORDER CONFIRMED</span>
          <h1 className="success-title">Thank You For Your Order!</h1>
          <p className="success-subtitle">
            We've received your purchase and are preparing it for delivery. A confirmation has been sent to{" "}
            <strong>{shipping.email || "your email address"}</strong>.
          </p>

          <div className="order-id-pill">
            <span>Order ID: <strong>#{orderId}</strong></span>
            <button className="copy-order-btn" onClick={handleCopyOrderId} title="Copy Order ID">
              <IconCopy size={15} />
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          {/* Interactive Delivery Tracker Stepper */}
          <div className="delivery-tracker">
            <div className="tracker-header">
              <div className="tracker-eta">
                <IconTruck size={20} color="#10b981" />
                <span>Estimated Delivery: <strong>{formattedDelivery}</strong></span>
              </div>
              <span className="tracker-badge-status">Standard Express</span>
            </div>

            <div className="tracker-steps">
              <div className="t-step active">
                <div className="t-dot"><IconCheck size={12} color="#ffffff" /></div>
                <span>Order Placed</span>
              </div>
              <div className="t-bar active"></div>
              <div className="t-step active">
                <div className="t-dot"><IconCheck size={12} color="#ffffff" /></div>
                <span>Confirmed</span>
              </div>
              <div className="t-bar"></div>
              <div className="t-step">
                <div className="t-dot"></div>
                <span>Shipped</span>
              </div>
              <div className="t-bar"></div>
              <div className="t-step">
                <div className="t-dot"></div>
                <span>Delivered</span>
              </div>
            </div>
          </div>

          {/* Receipt Breakdown */}
          <div className="success-receipt-box">
            <h3>Items in this Order</h3>

            <div className="receipt-items-list">
              {items.map((item, idx) => (
                <div key={idx} className="receipt-item-row">
                  <div className="receipt-item-info">
                    <strong>{item.name}</strong>
                    <span>Quantity: {item.quantity} × ₹{Number(item.price).toLocaleString("en-IN")}</span>
                  </div>
                  <span className="receipt-item-total">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>

            <div className="receipt-divider"></div>

            <div className="receipt-footer-grid">
              <div className="receipt-address">
                <h4>📍 Shipping Address</h4>
                <p><strong>{shipping.fullName}</strong></p>
                <p>{shipping.address}</p>
                <p>{shipping.city} - {shipping.pincode}</p>
                <p>Phone: {shipping.phone}</p>
              </div>

              <div className="receipt-totals">
                <div className="total-row">
                  <span>Payment Status</span>
                  <span className="status-paid">Confirmed / Authorized</span>
                </div>
                <div className="total-row">
                  <span>Delivery</span>
                  <span className="free-tag">FREE</span>
                </div>
                <div className="total-row final-total">
                  <strong>Total Paid</strong>
                  <strong>₹{Number(total).toLocaleString("en-IN")}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="success-actions-row">
            <button className="btn-success-primary" onClick={() => navigate("/my-orders")}>
              <IconBox size={18} /> View in My Orders
            </button>
            <button className="btn-success-secondary" onClick={() => navigate("/")}>
              <IconShoppingBag size={18} /> Continue Shopping
            </button>
            <button className="btn-success-ghost" onClick={handlePrint}>
              Print Invoice 🖨️
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default OrderSuccess;
