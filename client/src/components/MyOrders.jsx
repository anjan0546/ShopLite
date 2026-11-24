import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  IconBox,
  IconSearch,
  IconCheck,
  IconTruck,
  IconArrowLeft,
  IconShoppingBag,
} from "./Icons";
import { useToast } from "../context/ToastContext";
import "./MyOrder.css";
import { API_BASE_URL } from "../config";

function MyOrders({ onAddToCart }) {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    async function fetchOrders() {
      const token = localStorage.getItem("token");

      if (!token) {
        // If not logged in, check if there's a lastOrder in localStorage to show gracefully
        const lastOrder = localStorage.getItem("lastOrder");
        if (lastOrder) {
          try {
            setOrders([JSON.parse(lastOrder)]);
            setLoading(false);
            return;
          } catch {
            // continue
          }
        }
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/orders/my-orders`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
          return;
        }

        if (!response.ok) {
          throw new Error(data.message || "Failed to load orders");
        }

        setOrders(data.orders || []);
      } catch (err) {
        // Fallback to local lastOrder if server is offline
        const lastOrder = localStorage.getItem("lastOrder");
        if (lastOrder) {
          try {
            setOrders([JSON.parse(lastOrder)]);
          } catch {
            setError(err.message || "Something went wrong");
          }
        } else {
          setError(err.message || "Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [navigate]);

  const formatDate = (date) => {
    if (!date) return "Recent";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("en-IN");
  };

  const handleReorder = (order) => {
    if (!order.items || order.items.length === 0) return;
    try {
      const currentCart = JSON.parse(localStorage.getItem("cartItems") || "[]");
      let count = 0;
      order.items.forEach((item) => {
        const prod = {
          _id: item.product || item.productId || item._id || "p-" + Math.random(),
          name: item.name,
          price: item.price,
          image: item.image || "/products/fallback-product.svg",
          quantity: item.quantity || 1,
        };
        const existing = currentCart.find((c) => c._id === prod._id);
        if (existing) {
          existing.quantity += prod.quantity;
        } else {
          currentCart.push(prod);
        }
        count += prod.quantity;
      });
      localStorage.setItem("cartItems", JSON.stringify(currentCart));
      addToast(`Added ${count} items from order #${order._id.slice(-6)} to your cart! 🛍️`, "success");
      navigate("/cart");
    } catch (err) {
      addToast("Failed to re-order items", "error");
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items?.some((i) =>
        i.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "delivered" && order.status?.toLowerCase() === "delivered") ||
      (filterStatus === "active" && order.status?.toLowerCase() !== "delivered");
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="orders-state">
        <div className="orders-spinner"></div>
        <p>Loading your order history...</p>
      </div>
    );
  }

  return (
    <main className="my-orders-container">
      {/* Header */}
      <div className="orders-header">
        <div>
          <span className="orders-eyebrow">ACCOUNT DASHBOARD</span>
          <h1>My Orders</h1>
          <p>Track packages, view receipts, and reorder favourite items.</p>
        </div>

        <div className="orders-count">
          <span>{orders.length}</span>
          <small>Total Purchases</small>
        </div>
      </div>

      {/* Interactive Search & Filters Toolbar */}
      <div className="orders-toolbar">
        <div className="orders-search-box">
          <IconSearch size={18} color="#64748b" />
          <input
            type="text"
            placeholder="Search by order ID or product name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search-btn" onClick={() => setSearchTerm("")}>
              ✕
            </button>
          )}
        </div>

        <div className="orders-status-filters">
          <button
            className={`status-filter-btn ${filterStatus === "all" ? "active" : ""}`}
            onClick={() => setFilterStatus("all")}
          >
            All ({orders.length})
          </button>
          <button
            className={`status-filter-btn ${filterStatus === "active" ? "active" : ""}`}
            onClick={() => setFilterStatus("active")}
          >
            Active & Transit
          </button>
          <button
            className={`status-filter-btn ${filterStatus === "delivered" ? "active" : ""}`}
            onClick={() => setFilterStatus("delivered")}
          >
            Delivered
          </button>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="empty-orders">
          <div className="empty-orders-icon">📦</div>
          <h2>No matching orders found</h2>
          <p>
            {searchTerm
              ? "No orders match your search query. Try clearing the filter."
              : "Looks like you haven't purchased anything yet. Discover our latest collections!"}
          </p>
          <Link to="/" className="shop-now-btn">
            Start Shopping →
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map((order) => (
            <article className="order-card" key={order._id}>
              {/* Order Card Header */}
              <div className="order-card-header">
                <div>
                  <span className="order-label">ORDER ID</span>
                  <h3>#{order._id}</h3>
                  <p className="order-date">Placed on {formatDate(order.createdAt)}</p>
                </div>

                <div className="order-header-right">
                  <span className={`order-status ${order.status?.toLowerCase() === "delivered" ? "delivered" : ""}`}>
                    <span className="status-dot"></span>
                    {order.status || "Confirmed"}
                  </span>
                  <button
                    className="order-reorder-btn"
                    onClick={() => handleReorder(order)}
                    title="Add all items to cart"
                  >
                    <IconShoppingBag size={14} />
                    <span>Reorder</span>
                  </button>
                </div>
              </div>

              {/* Order Items */}
              <div className="order-products">
                <h4>Order Items ({order.items?.length || 0})</h4>

                {order.items?.map((item, index) => (
                  <div className="order-product" key={`${item.product || index}-${index}`}>
                    <div className="order-item-img-box">
                      <img
                        src={item.image || "/products/fallback-product.svg"}
                        alt={item.name}
                        className="order-item-img"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/products/fallback-product.svg";
                        }}
                      />
                    </div>

                    <div className="order-product-info">
                      <h5>{item.name}</h5>
                      <p>Quantity: <strong>{item.quantity}</strong></p>
                      <span>₹{formatPrice(item.price)} each</span>
                    </div>

                    <strong className="product-total">
                      ₹{formatPrice(item.price * item.quantity)}
                    </strong>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="order-card-footer">
                <div className="delivery-details">
                  <h4>📍 Delivery Address</h4>
                  <p><strong>{order.shipping?.fullName}</strong></p>
                  <p>{order.shipping?.address}</p>
                  <p>{order.shipping?.city} - {order.shipping?.pincode}</p>
                </div>

                <div className="order-total-block">
                  <div className="order-total">
                    <span>Grand Total</span>
                    <strong>₹{formatPrice(order.totalAmount)}</strong>
                  </div>
                  <span className="pay-verified-tag">✓ Payment Confirmed</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

export default MyOrders;
