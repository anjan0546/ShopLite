import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IconArrowLeft } from "./Icons";
import { useToast } from "../context/ToastContext";
import "./Seller.css";
import { API_BASE_URL } from "../config";

function formatAppDate(dateStr) {
  if (!dateStr) return "Recently";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function SellerApplications() {
  const { addToast } = useToast();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  async function fetchApplications() {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/seller-applications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        const list = Array.isArray(data) ? data : (data.applications || []);
        setApplications(list);
      } else {
        addToast(data.message || "Failed to load seller applications", "error");
      }
    } catch (err) {
      console.warn("Fetch applications error:", err.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateApplication(id, status) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/seller-applications/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update application");
      }

      setApplications((prev) =>
        prev.map((app) => (app._id === id ? { ...app, sellerStatus: status } : app))
      );
      addToast(
        `Seller application ${status === "approved" ? "Approved! ✓" : "Rejected"}`,
        status === "approved" ? "success" : "info"
      );
    } catch (err) {
      addToast(err.message, "error");
    }
  }

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <div className="seller-page-container">
      <div style={{ marginBottom: "20px" }}>
        <Link to="/admin" className="seller-card-link-btn">
          <IconArrowLeft size={16} /> Back to Admin Dashboard
        </Link>
      </div>

      <div className="seller-header">
        <div>
          <span className="section-eyebrow">ADMINISTRATION</span>
          <h1>Seller Partner Applications</h1>
          <p>Review merchant credentials and manage onboarding requests.</p>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
          <p>Loading seller applications...</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="empty-catalog-card">
          <div className="empty-catalog-icon">📋</div>
          <h3>No pending seller applications</h3>
          <p>All merchant applications have been reviewed or no new requests have been submitted.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {applications.map((app) => (
            <div
              key={app._id}
              style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "14px",
                padding: "24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "16px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                  <h3 style={{ fontSize: "17px", margin: 0 }}>
                    {app.storeName || (app.name ? `${app.name}'s Store` : "Merchant Store")}
                  </h3>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      padding: "3px 9px",
                      borderRadius: "9999px",
                      background:
                        app.sellerStatus === "approved"
                          ? "#dcfce7"
                          : app.sellerStatus === "rejected"
                          ? "#fee2e2"
                          : "#fef3c7",
                      color:
                        app.sellerStatus === "approved"
                          ? "#15803d"
                          : app.sellerStatus === "rejected"
                          ? "#b91c1c"
                          : "#b45309",
                    }}
                  >
                    {app.sellerStatus || "pending"}
                  </span>
                </div>
                <p style={{ fontSize: "13px", color: "#64748b", margin: "2px 0" }}>
                  Applicant: <strong>{app.name}</strong> • Email: {app.email} • Submitted: {formatAppDate(app.updatedAt || app.createdAt)}
                </p>
                {app.category && (
                  <span style={{ fontSize: "12px", color: "#4f46e5", fontWeight: "600" }}>
                    Category: {app.category}
                  </span>
                )}
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                {app.sellerStatus !== "approved" && (
                  <button
                    onClick={() => updateApplication(app._id, "approved")}
                    style={{
                      background: "#10b981",
                      color: "white",
                      border: "none",
                      padding: "9px 18px",
                      borderRadius: "8px",
                      fontWeight: "700",
                      fontSize: "13px",
                      cursor: "pointer",
                      transition: "opacity 0.2s",
                    }}
                  >
                    ✓ Approve Merchant
                  </button>
                )}
                {app.sellerStatus !== "rejected" && (
                  <button
                    onClick={() => updateApplication(app._id, "rejected")}
                    style={{
                      background: "#fef2f2",
                      border: "1px solid #fecdd3",
                      color: "#dc2626",
                      padding: "9px 16px",
                      borderRadius: "8px",
                      fontWeight: "600",
                      fontSize: "13px",
                      cursor: "pointer",
                      transition: "opacity 0.2s",
                    }}
                  >
                    Reject
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SellerApplications;
