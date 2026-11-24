import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  IconCheck,
  IconShield,
  IconTruck,
  IconSparkles,
  IconShoppingBag,
} from "./Icons";
import { useToast } from "../context/ToastContext";
import "./Seller.css";

function SellerApplication() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [storeName, setStoreName] = useState("");
  const [category, setCategory] = useState("Electronics");

  async function handleApply(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      addToast("Please login first to apply as a seller.", "info");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/sellers/apply", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ storeName, category }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Application failed");
      }

      setSubmitted(true);
      addToast("Seller application submitted! Our team will review shortly.", "success");
    } catch (err) {
      addToast(err.message || "Failed to submit seller application.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="seller-page-container">
      <div className="seller-form-wrapper" style={{ maxWidth: "720px" }}>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
            <Link to="/" title="ShopLite Home">
              <img src="/logo.svg" alt="ShopLite" style={{ height: "46px", width: "auto", objectFit: "contain", borderRadius: "8px" }} />
            </Link>
          </div>
          <span className="section-eyebrow">GROW WITH SHOPLITE</span>
          <h1 style={{ fontSize: "30px", marginTop: "6px" }}>Become a ShopLite Seller Partner</h1>
          <p style={{ maxWidth: "520px", margin: "8px auto 0", fontSize: "15px" }}>
            Reach hundreds of thousands of active shoppers across India with zero onboarding fees
            and automated payouts.
          </p>
        </div>

        {/* Benefits Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "32px" }}>
          <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
            <strong style={{ display: "block", fontSize: "14px", marginBottom: "2px" }}>⚡ 2% Industry-Lowest Fee</strong>
            <span style={{ fontSize: "12px", color: "#64748b" }}>Keep more of your earnings with zero hidden listing charges.</span>
          </div>
          <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
            <strong style={{ display: "block", fontSize: "14px", marginBottom: "2px" }}>📦 Integrated Logistics</strong>
            <span style={{ fontSize: "12px", color: "#64748b" }}>Doorstep courier pickups and automated tracking updates.</span>
          </div>
          <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
            <strong style={{ display: "block", fontSize: "14px", marginBottom: "2px" }}>💰 Daily Bank Payouts</strong>
            <span style={{ fontSize: "12px", color: "#64748b" }}>Fast, reliable direct bank transfers for your sales.</span>
          </div>
          <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
            <strong style={{ display: "block", fontSize: "14px", marginBottom: "2px" }}>🛡️ Merchant Protection</strong>
            <span style={{ fontSize: "12px", color: "#64748b" }}>Guaranteed protection against fraudulent returns and claims.</span>
          </div>
        </div>

        {submitted ? (
          <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", padding: "30px", borderRadius: "12px", textAlign: "center" }}>
            <div style={{ fontSize: "40px", marginBottom: "10px" }}>🎉</div>
            <h3 style={{ color: "#065f46", fontSize: "20px", marginBottom: "8px" }}>Application Received!</h3>
            <p style={{ color: "#047857", fontSize: "14px", maxWidth: "460px", margin: "0 auto 20px" }}>
              Thank you for applying to sell on ShopLite. Our onboarding specialists are reviewing your
              store details. You will receive an approval notification within 24 hours.
            </p>
            <button
              className="seller-action-btn-primary"
              onClick={() => navigate("/")}
              style={{ margin: "0 auto" }}
            >
              Back to Store
            </button>
          </div>
        ) : (
          <form onSubmit={handleApply} className="seller-form">
            <div className="seller-form-group">
              <label htmlFor="storeName">Proposed Store / Business Name *</label>
              <input
                id="storeName"
                placeholder="e.g. Aura Lifestyle & Tech"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                required
              />
            </div>

            <div className="seller-form-group">
              <label htmlFor="category">Primary Product Category *</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Electronics">Electronics & Gadgets</option>
                <option value="Fashion">Fashion & Apparel</option>
                <option value="Footwear">Footwear & Sneakers</option>
                <option value="Accessories">Accessories & Watches</option>
                <option value="Home & Kitchen">Home & Kitchen</option>
                <option value="Sports">Sports & Fitness</option>
              </select>
            </div>

            <button
              type="submit"
              className="seller-action-btn-primary"
              style={{ width: "100%", justifyContent: "center", height: "48px", marginTop: "12px" }}
              disabled={loading}
            >
              {loading ? "Submitting Application..." : "Submit Seller Application →"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default SellerApplication;
