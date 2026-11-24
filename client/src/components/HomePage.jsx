import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import QuickViewModal from "./QuickViewModal";
import {
  IconSearch,
  IconSparkles,
  IconTruck,
  IconShield,
  IconRotateCcw,
  IconLock,
  IconTag,
  IconCopy,
  IconGrid,
  IconList,
  IconArrowRight,
} from "./Icons";
import { useToast } from "../context/ToastContext";

function HomePage({
  products,
  loading,
  filteredProducts,
  categories,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  maxPrice,
  setMaxPrice,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  addToCart,
  wishlistItems,
  toggleWishlist,
}) {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [copiedCoupon, setCopiedCoupon] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText("SHOPLITE10");
    setCopiedCoupon(true);
    addToast("Coupon code SHOPLITE10 copied! Apply at checkout.", "success");
    setTimeout(() => setCopiedCoupon(false), 2000);
  };

  const handleCategoryChipClick = (cat) => {
    setSelectedCategory(cat);
    document.getElementById("shop-products")?.scrollIntoView({ behavior: "smooth" });
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setMaxPrice(3000);
    setSortBy("featured");
  };

  return (
    <main className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-chip-badge">
            <IconSparkles size={14} color="#818cf8" />
            <span>SHOPLITE CURATED DISCOVERY</span>
          </div>

          <h1>
            Elevate Your Everyday <span className="hero-highlight">Style & Tech.</span>
          </h1>

          <p>
            Explore top-tier electronics, modern fashion, and premium lifestyle essentials
            crafted for effortless comfort and unmatched performance.
          </p>

          {/* Interactive category quick chips */}
          <div className="hero-quick-chips">
            <button onClick={() => handleCategoryChipClick("Electronics")}>
              ⚡ Electronics
            </button>
            <button onClick={() => handleCategoryChipClick("Fashion")}>
              👕 Fashion
            </button>
            <button onClick={() => handleCategoryChipClick("Footwear")}>
              👟 Footwear
            </button>
            <button onClick={() => handleCategoryChipClick("Accessories")}>
              ⌚ Accessories
            </button>
          </div>

          <div className="hero-cta-group">
            <button
              className="hero-primary-button"
              onClick={() =>
                document.getElementById("shop-products")?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <span>Explore Collection</span>
              <IconArrowRight size={18} />
            </button>
            <button
              className="hero-secondary-button"
              onClick={handleCopyCoupon}
            >
              <IconTag size={16} />
              <span>{copiedCoupon ? "Copied SHOPLITE10!" : "Claim 10% Voucher"}</span>
            </button>
          </div>
        </div>

        <div className="hero-visual-card">
          <div className="hero-badge-float top-badge">
            <span className="badge-icon">⚡</span>
            <div>
              <strong>Free Express Delivery</strong>
              <small>On orders over ₹1,999</small>
            </div>
          </div>

          <div className="hero-emoji-circle">
            <span className="big-emoji">🛍️</span>
          </div>

          <div className="hero-badge-float bottom-badge">
            <span className="badge-icon">🛡️</span>
            <div>
              <strong>100% Buyer Protection</strong>
              <small>7-Day Easy Replacements</small>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Strip */}
      <section className="value-props-strip">
        <div className="value-prop-item">
          <div className="vp-icon-box">
            <IconTruck size={22} color="#4f46e5" />
          </div>
          <div>
            <h4>Free Express Shipping</h4>
            <p>Across 19,000+ pincodes in India</p>
          </div>
        </div>
        <div className="value-prop-item">
          <div className="vp-icon-box">
            <IconShield size={22} color="#06b6d4" />
          </div>
          <div>
            <h4>1-Year Official Warranty</h4>
            <p>100% Genuine, verified authentic</p>
          </div>
        </div>
        <div className="value-prop-item">
          <div className="vp-icon-box">
            <IconRotateCcw size={22} color="#10b981" />
          </div>
          <div>
            <h4>7-Day Easy Returns</h4>
            <p>No questions asked instant refunds</p>
          </div>
        </div>
        <div className="value-prop-item">
          <div className="vp-icon-box">
            <IconLock size={22} color="#f59e0b" />
          </div>
          <div>
            <h4>Secure Payments</h4>
            <p>UPI, RuPay, Cards & Net Banking</p>
          </div>
        </div>
      </section>

      {/* Shop Collection Section */}
      <section className="shop-section" id="shop-products">
        <div className="shop-header-row">
          <div>
            <span className="section-eyebrow">CURATED CATALOG</span>
            <h2>Explore Products</h2>
            <p>Filter by category, search by keyword, or sort by price.</p>
          </div>

          <div className="shop-header-stats">
            <span className="product-count-badge">
              {filteredProducts.length} {filteredProducts.length === 1 ? "Product" : "Products"} Available
            </span>
          </div>
        </div>

        {/* Interactive Category Pills */}
        <div className="category-pills-bar">
          {categories.map((cat) => {
            const count =
              cat === "All"
                ? products.length
                : products.filter((p) => p.category === cat).length;
            return (
              <button
                key={cat}
                className={`category-pill ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                <span>{cat}</span>
                <span className="pill-count">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Filter & Search Hub */}
        <div className="filter-hub-card">
          {/* Search Input */}
          <div className="hub-search-box">
            <IconSearch size={19} color="#64748b" />
            <input
              type="text"
              placeholder="Search products by title, category, keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="hub-clear-search" onClick={() => setSearchTerm("")}>
                ✕
              </button>
            )}
          </div>

          {/* Price Slider */}
          <div className="hub-price-slider">
            <div className="slider-label-row">
              <span>Max Budget:</span>
              <strong>₹{maxPrice.toLocaleString("en-IN")}</strong>
            </div>
            <input
              type="range"
              min="400"
              max="3000"
              step="100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
          </div>

          {/* Sort Dropdown */}
          <div className="hub-sort-box">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="featured">Sort: Featured Picks</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-asc">Alphabetical (A - Z)</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="hub-view-mode">
            <button
              className={`view-mode-btn ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
              title="Grid View"
            >
              <IconGrid size={18} />
            </button>
            <button
              className={`view-mode-btn ${viewMode === "list" ? "active" : ""}`}
              onClick={() => setViewMode("list")}
              title="List View"
            >
              <IconList size={18} />
            </button>
          </div>

          {/* Active Filters Reset */}
          {(searchTerm || selectedCategory !== "All" || maxPrice < 3000) && (
            <button className="hub-reset-btn" onClick={resetFilters}>
              Clear Filters ✕
            </button>
          )}
        </div>

        {/* Product Grid / List Display */}
        {loading ? (
          <div className="products-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: "360px", borderRadius: "16px" }}></div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-catalog-card">
            <div className="empty-catalog-icon">🔍</div>
            <h3>No products match your criteria</h3>
            <p>Try resetting the category filter, raising your price ceiling, or clearing the search bar.</p>
            <button className="reset-search-btn" onClick={resetFilters}>
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className={viewMode === "grid" ? "products-grid" : "products-list"}>
            {filteredProducts.map((product) => {
              const isWishlisted = wishlistItems.some((item) => item._id === product._id);
              return (
                <div
                  key={product._id}
                  className="product-card-wrapper"
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  <ProductCard
                    product={product}
                    onAddToCart={() => addToCart(product)}
                    onQuickView={() => setQuickViewProduct(product)}
                    isWishlisted={isWishlisted}
                    onToggleWishlist={() => toggleWishlist(product)}
                  />
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Interactive Promo Banner */}
      <section className="promo-banner-section">
        <div className="promo-banner-card">
          <div className="promo-text-side">
            <span className="promo-tag">LIMITED TIME OFFER</span>
            <h2>Enjoy 10% Off Your Entire Order</h2>
            <p>Apply our welcome voucher at checkout to receive an instant discount on all electronics, apparel, and home essentials.</p>
            <div className="promo-code-pill-row">
              <span className="code-display">SHOPLITE10</span>
              <button className="copy-promo-btn" onClick={handleCopyCoupon}>
                <IconCopy size={16} />
                <span>{copiedCoupon ? "Copied!" : "Copy Code"}</span>
              </button>
            </div>
          </div>
          <div className="promo-icon-side">
            <span className="promo-emoji">🎁</span>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={addToCart}
      />
    </main>
  );
}

export default HomePage;
