import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IconPlus, IconSearch, IconArrowLeft, IconBox } from "./Icons";
import { useToast } from "../context/ToastContext";
import { initialMockProducts } from "../data/mockProducts";
import "./ManageProducts.css";
import { API_BASE_URL } from "../config";

function ManageProducts() {
  const [products, setProducts] = useState(initialMockProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    async function fetchProducts() {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/products`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok && data.products && data.products.length > 0) {
          setProducts(data.products);
        }
      } catch (err) {
        console.warn("Backend offline, using sample product inventory:", err.message);
      }
    }

    fetchProducts();
  }, []);

  async function handleDelete(productId, name) {
    const confirmed = window.confirm(`Are you sure you want to delete "${name}" from the store catalog?`);
    if (!confirmed) return;

    try {
      await fetch(`${API_BASE_URL}/api/admin/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    } catch {
      // offline fallback
    }

    setProducts((previous) => previous.filter((product) => product._id !== productId));
    addToast(`Product "${name}" deleted from catalog.`, "info");
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <main className="manage-page">
      <div style={{ marginBottom: "20px" }}>
        <Link to="/admin" className="seller-card-link-btn" style={{ color: "#4f46e5" }}>
          <IconArrowLeft size={16} /> Back to Admin Dashboard
        </Link>
      </div>

      <header className="manage-header">
        <div>
          <span className="manage-eyebrow">STORE INVENTORY</span>
          <h1>Product Catalog Management</h1>
          <p>Inspect, edit, update, or remove live items across the ShopLite marketplace.</p>
        </div>

        <Link to="/admin/add-product" className="add-product-btn">
          <IconPlus size={16} /> Add New Product
        </Link>
      </header>

      <section className="manage-toolbar">
        <div>
          <h2>All Catalog Products</h2>
          <p>{filteredProducts.length} items visible</p>
        </div>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", flex: 1, justifyContent: "flex-end" }}>
          <input
            type="text"
            placeholder="Search products by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>

      {filteredProducts.length === 0 ? (
        <div className="manage-empty">
          <span>📦</span>
          <h3>No products found</h3>
          <p>Try another search or add a new product to your inventory.</p>
        </div>
      ) : (
        <section className="manage-product-grid">
          {filteredProducts.map((product) => (
            <article className="manage-product-card" key={product._id}>
              <div className="manage-image-box">
                <img
                  src={product.image || "/products/fallback-product.svg"}
                  alt={product.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/products/fallback-product.svg";
                  }}
                />
              </div>

              <div className="manage-product-info">
                <span className="category-label">{product.category}</span>

                <h3>{product.name}</h3>

                <p className="manage-price">
                  ₹{Number(product.price).toLocaleString("en-IN")}
                </p>

                <div className="manage-actions">
                  <button
                    className="edit-product-btn"
                    onClick={() => navigate(`/admin/edit-product/${product._id}`)}
                  >
                    Edit Product
                  </button>

                  <button
                    className="delete-product-btn"
                    onClick={() => handleDelete(product._id, product.name)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default ManageProducts;
