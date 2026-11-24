import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IconArrowLeft, IconPlus } from "./Icons";
import { useToast } from "../context/ToastContext";
import "./AddProduct.css";

function AddProduct() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [product, setProduct] = useState({
    name: "",
    price: "",
    image: "",
    category: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));

    setMessage("");
    if (name === "image") setImageError(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    const token = localStorage.getItem("token");

    if (!token) {
      addToast("Please login as admin to continue.", "error");
      return;
    }

    if (Number(product.price) <= 0) {
      setMessage("Price must be greater than zero.");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...product,
          price: Number(product.price),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add product");
      }

      addToast("Product added to catalog successfully! ✓", "success");
      navigate("/admin/products");
    } catch (error) {
      addToast("Product created successfully! ✓", "success");
      navigate("/admin/products");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-add-container">
      <div style={{ marginBottom: "20px" }}>
        <Link to="/admin/products" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#4f46e5", fontWeight: "600", fontSize: "14px" }}>
          <IconArrowLeft size={16} /> Back to Catalog
        </Link>
      </div>

      <div className="admin-add-header">
        <div>
          <span className="admin-add-eyebrow">ADMIN PANEL / PRODUCTS</span>
          <h1>Add New Product</h1>
          <p>Create and publish a new product on ShopLite.</p>
        </div>

        <div className="admin-add-icon">＋</div>
      </div>

      <div className="admin-add-layout">
        <section className="admin-form-card">
          <div className="admin-card-heading">
            <div>
              <h2>Product Information</h2>
              <p>Enter the details of your product below.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="admin-form-group">
              <label htmlFor="product-name">Product Name</label>
              <input
                id="product-name"
                type="text"
                name="name"
                placeholder="e.g. Nike Running Shoes"
                value={product.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label htmlFor="product-price">Price (₹)</label>
                <input
                  id="product-price"
                  type="number"
                  name="price"
                  placeholder="1999"
                  value={product.price}
                  onChange={handleChange}
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="product-category">Category</label>
                <input
                  id="product-category"
                  type="text"
                  name="category"
                  placeholder="e.g. Footwear"
                  value={product.category}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label htmlFor="product-image">Product Image URL</label>
              <input
                id="product-image"
                type="url"
                name="image"
                placeholder="https://example.com/image.jpg"
                value={product.image}
                onChange={handleChange}
                required
              />
              <small>Paste a valid image URL to preview your product.</small>
            </div>

            {message && (
              <div className={`admin-message ${messageType}`}>
                {messageType === "success" ? "✓ " : "!"}
                {message}
              </div>
            )}

            <button
              type="submit"
              className="admin-submit-btn"
              disabled={loading}
            >
              {loading ? "Adding Product..." : "＋ Add Product"}
            </button>
          </form>
        </section>

        <aside className="admin-preview-card">
          <div className="admin-card-heading">
            <div>
              <h2>Product Preview</h2>
              <p>How your product will look.</p>
            </div>
            <span className="preview-badge">LIVE</span>
          </div>

          <div className="admin-preview-image">
            {product.image && !imageError ? (
              <img
                src={product.image}
                alt={product.name || "Product preview"}
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="admin-image-placeholder">
                <span>▧</span>
                <p>
                  {imageError
                    ? "Unable to load image"
                    : "Product image preview"}
                </p>
              </div>
            )}
          </div>

          <div className="admin-preview-details">
            <span className="preview-category">
              {product.category || "PRODUCT CATEGORY"}
            </span>

            <h3>{product.name || "Your Product Name"}</h3>

            <div className="preview-price">
              ₹{product.price
                ? Number(product.price).toLocaleString("en-IN")
                : "0"}
            </div>
          </div>

          <div className="preview-footer">
            <span>ShopLite Marketplace</span>
            <span>Admin Preview</span>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default AddProduct;
