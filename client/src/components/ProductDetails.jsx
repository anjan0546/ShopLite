import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  IconArrowLeft,
  IconStar,
  IconShoppingBag,
  IconCheck,
  IconHeart,
  IconTruck,
  IconShield,
  IconRotateCcw,
  IconLock,
  IconPlus,
  IconMinus,
  IconSparkles,
  IconTag,
} from "./Icons";
import ProductCard from "./ProductCard";
import { useToast } from "../context/ToastContext";
import "./ProductDetails.css";

function ProductDetails({ onAddToCart, allProducts = [] }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("overview");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [added, setAdded] = useState(false);

  // Review state
  const [reviews, setReviews] = useState([
    {
      id: 1,
      author: "Priya Sharma",
      rating: 5,
      date: "3 days ago",
      comment: "Absolutely in love with this product! The quality exceeded my expectations. Delivery was super fast.",
    },
    {
      id: 2,
      author: "Rahul Verma",
      rating: 5,
      date: "1 week ago",
      comment: "Great value for money. Built very sturdy and looks premium. Highly recommended for daily use.",
    },
    {
      id: 3,
      author: "Aman Gupta",
      rating: 4,
      date: "2 weeks ago",
      comment: "Good experience overall. Packaging was secure and the product works as advertised.",
    },
  ]);
  const [newReviewAuthor, setNewReviewAuthor] = useState("");
  const [newReviewComment, setNewReviewComment] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);

  useEffect(() => {
    setLoading(true);
    setError("");
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Check wishlist from localStorage
    try {
      const savedWishlist = JSON.parse(localStorage.getItem("shoplite_wishlist") || "[]");
      setIsWishlisted(savedWishlist.some((item) => item._id === id));
    } catch {
      setIsWishlisted(false);
    }

    // Attempt to fetch from API, with fallback to allProducts prop or seed
    fetch("http://localhost:5000/api/products")
      .then((res) => {
        if (!res.ok) throw new Error("Could not connect to server");
        return res.json();
      })
      .then((data) => {
        const found = data.find((item) => item._id === id);
        if (found) {
          setProduct(found);
        } else {
          throw new Error("Product not found");
        }
      })
      .catch(() => {
        // Fallback from passed allProducts prop or mock
        const fallback = allProducts.find((item) => item._id === id);
        if (fallback) {
          setProduct(fallback);
        } else {
          setError("Product not found. It may have been removed or updated.");
        }
      })
      .finally(() => setLoading(false));
  }, [id, allProducts]);

  const toggleWishlist = () => {
    try {
      const savedWishlist = JSON.parse(localStorage.getItem("shoplite_wishlist") || "[]");
      let updated;
      if (isWishlisted) {
        updated = savedWishlist.filter((item) => item._id !== product._id);
        setIsWishlisted(false);
        addToast(`Removed ${product.name} from wishlist`, "info");
      } else {
        updated = [...savedWishlist, product];
        setIsWishlisted(true);
        addToast(`Added ${product.name} to wishlist! ❤️`, "success");
      }
      localStorage.setItem("shoplite_wishlist", JSON.stringify(updated));
    } catch {
      setIsWishlisted(!isWishlisted);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product);
    }
    setAdded(true);
    addToast(`Added ${quantity} × ${product.name} to cart!`, "success");
    setTimeout(() => setAdded(false), 1600);
  };

  const handleBuyNow = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product);
    }
    navigate("/checkout");
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;

    const newRev = {
      id: Date.now(),
      author: newReviewAuthor.trim(),
      rating: newReviewRating,
      date: "Just now",
      comment: newReviewComment.trim(),
    };

    setReviews([newRev, ...reviews]);
    setNewReviewAuthor("");
    setNewReviewComment("");
    addToast("Thank you! Your review has been submitted.", "success");
  };

  if (loading) {
    return (
      <div className="product-details-container">
        <div className="pd-skeleton-layout">
          <div className="skeleton pd-skeleton-img"></div>
          <div className="pd-skeleton-info">
            <div className="skeleton" style={{ height: "24px", width: "40%" }}></div>
            <div className="skeleton" style={{ height: "40px", width: "80%" }}></div>
            <div className="skeleton" style={{ height: "30px", width: "30%" }}></div>
            <div className="skeleton" style={{ height: "120px", width: "100%" }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-details-container">
        <div className="pd-error-card">
          <h2>Oops! Product Unavailable</h2>
          <p>{error || "Unable to find the requested product."}</p>
          <button className="pd-back-btn" onClick={() => navigate("/")}>
            <IconArrowLeft size={16} /> Return to Store
          </button>
        </div>
      </div>
    );
  }

  const originalPrice = Math.round(product.price * 1.3);
  const discountAmount = originalPrice - product.price;
  const discountPercent = Math.round((discountAmount / originalPrice) * 100);

  // Related products
  const related = allProducts
    .filter((p) => p._id !== product._id && (p.category === product.category || true))
    .slice(0, 4);

  return (
    <main className="product-details-page">
      {/* Breadcrumb Navigation */}
      <div className="pd-breadcrumb-bar">
        <div className="pd-breadcrumbs">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/#shop-products">{product.category || "Products"}</Link>
          <span>/</span>
          <span className="current-crumb">{product.name}</span>
        </div>
        <button className="pd-back-link" onClick={() => navigate(-1)}>
          <IconArrowLeft size={16} /> Back
        </button>
      </div>

      <div className="product-details-container">
        <div className="pd-hero-grid">
          {/* Left: Product Showcase Gallery */}
          <div className="pd-gallery-section">
            <div className="pd-main-image-card">
              <span className="pd-category-tag">{product.category}</span>
              <button
                className={`pd-wishlist-float ${isWishlisted ? "active" : ""}`}
                onClick={toggleWishlist}
                aria-label="Toggle Wishlist"
              >
                <IconHeart size={20} filled={isWishlisted} color={isWishlisted ? "#ef4444" : "#475569"} />
              </button>
              <img
                src={product.image || "/products/fallback-product.svg"}
                alt={product.name}
                className="pd-main-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/products/fallback-product.svg";
                }}
              />
            </div>

            {/* Micro badges below image */}
            <div className="pd-badges-strip">
              <div className="pd-badge-pill">
                <IconCheck size={14} color="#10b981" />
                <span>100% Genuine</span>
              </div>
              <div className="pd-badge-pill">
                <IconSparkles size={14} color="#6366f1" />
                <span>Top Seller</span>
              </div>
              <div className="pd-badge-pill">
                <IconShield size={14} color="#059669" />
                <span>Buyer Protected</span>
              </div>
            </div>
          </div>

          {/* Right: Product Purchase & Info Panel */}
          <div className="pd-info-section">
            <div className="pd-header-group">
              <span className="pd-eyebrow">PREMIUM COLLECTION</span>
              <h1 className="pd-title">{product.name}</h1>

              {/* Rating and Reviews */}
              <div className="pd-rating-block">
                <div className="pd-star-badge">
                  <IconStar size={14} filled={true} />
                  <span>4.8</span>
                </div>
                <span className="pd-review-text">128 Verified Ratings</span>
                <span className="pd-dot-sep">•</span>
                <span className="pd-stock-status">🟢 In Stock, Ready to Ship</span>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="pd-pricing-card">
              <div className="pd-price-row">
                <span className="pd-main-price">
                  ₹{Number(product.price).toLocaleString("en-IN")}
                </span>
                <span className="pd-original-price">
                  ₹{originalPrice.toLocaleString("en-IN")}
                </span>
                <span className="pd-discount-badge">{discountPercent}% OFF</span>
              </div>
              <p className="pd-tax-note">Inclusive of all taxes • Free Shipping on this order</p>
            </div>

            {/* Short Description */}
            <p className="pd-description">
              Upgrade your everyday experience with the {product.name}. Carefully crafted with high-grade
              materials and ergonomic design for optimal comfort, versatility, and unmatched longevity.
            </p>

            {/* Special Promo Snippet */}
            <div className="pd-coupon-box">
              <IconTag size={18} color="#4f46e5" />
              <div className="pd-coupon-text">
                <strong>Extra 10% Off</strong> with coupon code <code className="pd-coupon-code">SHOPLITE10</code> at checkout!
              </div>
            </div>

            {/* Quantity Stepper & Actions */}
            <div className="pd-buy-controls">
              <div className="pd-quantity-wrapper">
                <label className="pd-qty-label">Quantity</label>
                <div className="pd-quantity-stepper">
                  <button
                    className="pd-qty-btn"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >
                    <IconMinus size={14} />
                  </button>
                  <span className="pd-qty-num">{quantity}</span>
                  <button
                    className="pd-qty-btn"
                    onClick={() => setQuantity((q) => q + 1)}
                  >
                    <IconPlus size={14} />
                  </button>
                </div>
              </div>

              <div className="pd-action-buttons">
                <button
                  className={`pd-add-cart-button ${added ? "added" : ""}`}
                  onClick={handleAddToCart}
                >
                  {added ? (
                    <>
                      <IconCheck size={18} color="#ffffff" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <IconShoppingBag size={18} />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                <button className="pd-buy-now-button" onClick={handleBuyNow}>
                  ⚡ Buy Now
                </button>
              </div>
            </div>

            {/* Value Trust Grid */}
            <div className="pd-trust-grid">
              <div className="trust-cell">
                <IconTruck size={20} color="#4f46e5" />
                <div>
                  <strong>Free Express Shipping</strong>
                  <span>Delivered in 2-4 business days</span>
                </div>
              </div>
              <div className="trust-cell">
                <IconRotateCcw size={20} color="#06b6d4" />
                <div>
                  <strong>7 Days Easy Return</strong>
                  <span>Hassle-free replacement policy</span>
                </div>
              </div>
              <div className="trust-cell">
                <IconShield size={20} color="#10b981" />
                <div>
                  <strong>1-Year Warranty</strong>
                  <span>Guaranteed quality assurance</span>
                </div>
              </div>
              <div className="trust-cell">
                <IconLock size={20} color="#f59e0b" />
                <div>
                  <strong>Secure Checkout</strong>
                  <span>UPI, Cards & Net Banking</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Tabs Section */}
        <section className="pd-tabs-section">
          <div className="pd-tabs-nav">
            <button
              className={`pd-tab-btn ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              Overview & Specs
            </button>
            <button
              className={`pd-tab-btn ${activeTab === "shipping" ? "active" : ""}`}
              onClick={() => setActiveTab("shipping")}
            >
              Shipping & Delivery
            </button>
            <button
              className={`pd-tab-btn ${activeTab === "reviews" ? "active" : ""}`}
              onClick={() => setActiveTab("reviews")}
            >
              Customer Reviews ({reviews.length})
            </button>
          </div>

          <div className="pd-tab-body">
            {activeTab === "overview" && (
              <div className="tab-pane-overview">
                <h3>Product Specifications</h3>
                <div className="specs-table">
                  <div className="specs-row">
                    <span className="spec-label">Product Name</span>
                    <span className="spec-val">{product.name}</span>
                  </div>
                  <div className="specs-row">
                    <span className="spec-label">Category</span>
                    <span className="spec-val">{product.category}</span>
                  </div>
                  <div className="specs-row">
                    <span className="spec-label">Price</span>
                    <span className="spec-val">₹{Number(product.price).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="specs-row">
                    <span className="spec-label">Condition</span>
                    <span className="spec-val">Brand New (Factory Sealed)</span>
                  </div>
                  <div className="specs-row">
                    <span className="spec-label">Warranty</span>
                    <span className="spec-val">12 Months Manufacturer Warranty</span>
                  </div>
                  <div className="specs-row">
                    <span className="spec-label">Standard Delivery</span>
                    <span className="spec-val">2 - 4 Business Days</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="tab-pane-shipping">
                <h3>Delivery & Return Information</h3>
                <p>
                  All ShopLite orders are processed and packed with utmost care. Standard orders
                  placed before 2:00 PM IST are dispatched on the same business day.
                </p>
                <div className="shipping-perks-list">
                  <div className="s-perk">
                    <strong>🚚 Pan-India Shipping:</strong> We deliver to over 19,000+ pincodes across India.
                  </div>
                  <div className="s-perk">
                    <strong>⚡ Express Dispatch:</strong> Metro cities receive delivery in 24-48 hours.
                  </div>
                  <div className="s-perk">
                    <strong>🔄 Easy Returns:</strong> If you're not completely delighted, request a return within 7 days of delivery for a full refund or instant replacement.
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="tab-pane-reviews">
                <div className="reviews-summary-card">
                  <div className="reviews-aggregate">
                    <h2>4.8</h2>
                    <div className="stars-row">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <IconStar key={s} size={18} filled={true} />
                      ))}
                    </div>
                    <span>Based on {reviews.length} customer reviews</span>
                  </div>

                  <form className="add-review-form" onSubmit={handleAddReview}>
                    <h4>Write a Review</h4>
                    <div className="review-inputs-row">
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={newReviewAuthor}
                        onChange={(e) => setNewReviewAuthor(e.target.value)}
                        required
                      />
                      <select
                        value={newReviewRating}
                        onChange={(e) => setNewReviewRating(Number(e.target.value))}
                      >
                        <option value={5}>★★★★★ (5 Stars - Excellent)</option>
                        <option value={4}>★★★★☆ (4 Stars - Good)</option>
                        <option value={3}>★★★☆☆ (3 Stars - Average)</option>
                      </select>
                    </div>
                    <textarea
                      placeholder="Share your experience with this product..."
                      rows="3"
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      required
                    ></textarea>
                    <button type="submit" className="submit-review-btn">
                      Submit Review
                    </button>
                  </form>
                </div>

                <div className="reviews-feed">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="review-card">
                      <div className="rev-header">
                        <div>
                          <strong>{rev.author}</strong>
                          <span className="rev-date">{rev.date}</span>
                        </div>
                        <div className="rev-stars">
                          {[...Array(rev.rating)].map((_, i) => (
                            <IconStar key={i} size={14} filled={true} />
                          ))}
                        </div>
                      </div>
                      <p className="rev-comment">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Related Products Showcase */}
        {related.length > 0 && (
          <section className="pd-related-section">
            <div className="pd-related-header">
              <div>
                <span className="pd-eyebrow">SIMILAR RECOMMENDATIONS</span>
                <h2>You Might Also Like</h2>
              </div>
              <Link to="/#shop-products" className="view-more-link">
                View All Products →
              </Link>
            </div>

            <div className="pd-related-grid">
              {related.map((item) => (
                <div
                  key={item._id}
                  onClick={() => navigate(`/product/${item._id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <ProductCard
                    product={item}
                    onAddToCart={() => onAddToCart(item)}
                    isWishlisted={false}
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default ProductDetails;
