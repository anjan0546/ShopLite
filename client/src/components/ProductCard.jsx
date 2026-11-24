import React, { useState } from "react";
import {
  IconHeart,
  IconShoppingBag,
  IconCheck,
  IconEye,
  IconStar,
} from "./Icons";
import "./ProductCard.css";

function ProductCard({
  product,
  onAddToCart,
  onQuickView,
  isWishlisted = false,
  onToggleWishlist,
}) {
  const [added, setAdded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Fallback defaults if simple props passed
  const {
    _id,
    name = "Product Name",
    price = 0,
    image = "",
    category = "General",
  } = product || {};

  // Simulated original price and rating for rich ecommerce realism
  const originalPrice = Math.round(price * 1.25);
  const discountPercent = Math.round(((originalPrice - price) / originalPrice) * 100);
  // deterministic rating based on name length
  const rating = (4.3 + (name.length % 7) * 0.1).toFixed(1);
  const reviewCount = 20 + (name.length * 7);

  const handleAddClick = (e) => {
    e.stopPropagation();
    if (added) return;

    if (onAddToCart) {
      onAddToCart(product);
    }

    setAdded(true);
    setTimeout(() => {
      setAdded(false);
    }, 1600);
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    if (onToggleWishlist) {
      onToggleWishlist(product);
    }
  };

  const handleQuickViewClick = (e) => {
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    }
  };

  return (
    <div className="product-card-innovative">
      {/* Top Media Area */}
      <div className="card-media-wrapper">
        {/* Badges */}
        <div className="card-badge-row">
          <span className="card-category-badge">{category}</span>
          {discountPercent > 0 && (
            <span className="card-discount-badge">{discountPercent}% OFF</span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          className={`card-wishlist-btn ${isWishlisted ? "is-active" : ""}`}
          onClick={handleWishlistClick}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <IconHeart size={18} filled={isWishlisted} color={isWishlisted ? "#ef4444" : "#475569"} />
        </button>

        {/* Product Image */}
        <div className="image-aspect-box">
          {!imageLoaded && <div className="skeleton image-skeleton"></div>}
          <img
            src={image || "/products/fallback-product.svg"}
            alt={name}
            className={`card-image ${imageLoaded ? "image-ready" : "image-hidden"}`}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/products/fallback-product.svg";
              setImageLoaded(true);
            }}
            loading="lazy"
          />
        </div>

        {/* Quick View Hover Action */}
        <div className="card-hover-actions">
          <button className="quick-view-btn" onClick={handleQuickViewClick}>
            <IconEye size={16} />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Details Area */}
      <div className="card-content">
        {/* Rating and Reviews */}
        <div className="card-rating-row">
          <div className="star-rating-pill">
            <IconStar size={13} filled={true} />
            <span className="rating-score">{rating}</span>
          </div>
          <span className="rating-count">({reviewCount})</span>
          <span className="delivery-tag">⚡ Fast Delivery</span>
        </div>

        {/* Title */}
        <h3 className="card-title" title={name}>
          {name}
        </h3>

        {/* Price & Action Row */}
        <div className="card-footer-row">
          <div className="price-block">
            <div className="current-price">₹{Number(price).toLocaleString("en-IN")}</div>
            {originalPrice > price && (
              <div className="original-price">₹{originalPrice.toLocaleString("en-IN")}</div>
            )}
          </div>

          <button
            className={`card-add-btn ${added ? "btn-added" : ""}`}
            onClick={handleAddClick}
            aria-label="Add to cart"
          >
            {added ? (
              <>
                <IconCheck size={16} color="#ffffff" />
                <span>Added</span>
              </>
            ) : (
              <>
                <IconShoppingBag size={16} />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
