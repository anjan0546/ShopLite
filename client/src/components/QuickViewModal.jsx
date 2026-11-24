import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconX,
  IconStar,
  IconShoppingBag,
  IconCheck,
  IconTruck,
  IconShield,
  IconPlus,
  IconMinus,
} from "./Icons";
import "./QuickViewModal.css";

function QuickViewModal({ product, isOpen, onClose, onAddToCart }) {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setQuantity(1);
    setAdded(false);
  }, [product]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const originalPrice = Math.round(product.price * 1.25);
  const discountPercent = Math.round(((originalPrice - product.price) / originalPrice) * 100);

  const handleAdd = () => {
    if (onAddToCart) {
      for (let i = 0; i < quantity; i++) {
        onAddToCart(product);
      }
    }
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  const handleViewFullDetails = () => {
    onClose();
    navigate(`/product/${product._id}`);
  };

  return (
    <div className="quickview-backdrop" onClick={onClose}>
      <div className="quickview-modal" onClick={(e) => e.stopPropagation()}>
        <button className="quickview-close-btn" onClick={onClose} aria-label="Close modal">
          <IconX size={20} />
        </button>

        <div className="quickview-grid">
          {/* Left Media */}
          <div className="quickview-image-container">
            <span className="quickview-category-badge">{product.category}</span>
            <img
              src={product.image || "/products/fallback-product.svg"}
              alt={product.name}
              className="quickview-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/products/fallback-product.svg";
              }}
            />
          </div>

          {/* Right Details */}
          <div className="quickview-content">
            <div className="quickview-header">
              <span className="quickview-tag">ShopLite Verified</span>
              <h2 className="quickview-title">{product.name}</h2>

              <div className="quickview-rating-row">
                <div className="quickview-stars">
                  <IconStar size={15} filled={true} />
                  <span className="quickview-score">4.8</span>
                </div>
                <span className="quickview-reviews">• 128 verified customer reviews</span>
              </div>
            </div>

            <div className="quickview-price-box">
              <span className="quickview-price">₹{Number(product.price).toLocaleString("en-IN")}</span>
              <span className="quickview-original">₹{originalPrice.toLocaleString("en-IN")}</span>
              <span className="quickview-discount-pill">{discountPercent}% OFF</span>
            </div>

            <p className="quickview-desc">
              Experience exceptional quality with the {product.name}. Designed for everyday style,
              performance and long-lasting durability.
            </p>

            <div className="quickview-perks">
              <div className="perk-item">
                <IconTruck size={17} color="#4f46e5" />
                <span>Free Express Delivery Available</span>
              </div>
              <div className="perk-item">
                <IconShield size={17} color="#10b981" />
                <span>1-Year Official Warranty Included</span>
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="quickview-actions-section">
              <div className="quickview-qty-selector">
                <button
                  className="qty-btn"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  <IconMinus size={14} />
                </button>
                <span className="qty-value">{quantity}</span>
                <button
                  className="qty-btn"
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  <IconPlus size={14} />
                </button>
              </div>

              <button
                className={`quickview-add-cart-btn ${added ? "is-added" : ""}`}
                onClick={handleAdd}
              >
                {added ? (
                  <>
                    <IconCheck size={18} color="#ffffff" />
                    <span>Added {quantity} to Cart!</span>
                  </>
                ) : (
                  <>
                    <IconShoppingBag size={18} />
                    <span>Add to Cart • ₹{(product.price * quantity).toLocaleString("en-IN")}</span>
                  </>
                )}
              </button>
            </div>

            <button className="view-full-details-btn" onClick={handleViewFullDetails}>
              View Full Product Specifications →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuickViewModal;
