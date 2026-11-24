import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconTruck,
  IconMinus,
  IconPlus,
  IconTrash,
  IconArrowRight,
  IconLock,
  IconShield,
} from "./Icons";
import { useToast } from "../context/ToastContext";

function CartPage({ cartItems, cartCount, updateQuantity, removeFromCart }) {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0); // in percent
  const [couponError, setCouponError] = useState("");

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const discountAmount = Math.round((subtotal * appliedDiscount) / 100);
  const freeShippingThreshold = 1999;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingFee = subtotal > freeShippingThreshold || subtotal === 0 ? 0 : 99;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError("");
    const normalized = couponCode.trim().toUpperCase();
    if (normalized === "SHOPLITE10") {
      setAppliedDiscount(10);
      addToast("🎉 10% discount applied successfully: SHOPLITE10", "success");
    } else if (normalized === "FREESHIP") {
      setAppliedDiscount(5);
      addToast("🎉 Voucher FREESHIP applied!", "success");
    } else {
      setCouponError("Invalid coupon code. Try 'SHOPLITE10'.");
    }
  };

  return (
    <main className="cart-page">
      <div className="cart-header">
        <div>
          <span className="section-eyebrow">SHOPPING BAG</span>
          <h1>Your Shopping Cart</h1>
          <p>Review items, adjust quantities, and apply discount vouchers.</p>
        </div>

        <button className="continue-shopping-btn" onClick={() => navigate("/")}>
          ← Continue Shopping
        </button>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart-card">
          <span className="empty-cart-icon">🛒</span>
          <h2>Your cart is empty</h2>
          <p>
            Looks like you haven't added anything to your cart yet. Explore our curated
            collections to find your next favourite item.
          </p>
          <button className="btn-explore-cart" onClick={() => navigate("/")}>
            Start Shopping Now
          </button>
        </div>
      ) : (
        <div className="cart-layout">
          <section className="cart-items-section">
            {/* Free Delivery Interactive Progress Bar */}
            <div className="free-shipping-progress-card">
              {amountNeededForFreeShipping === 0 ? (
                <div className="fs-unlocked">
                  <IconTruck size={20} color="#10b981" />
                  <strong>🎉 Congratulations! You have unlocked Free Express Delivery!</strong>
                </div>
              ) : (
                <div>
                  <div className="fs-text-row">
                    <span>
                      Add <strong>₹{amountNeededForFreeShipping.toLocaleString("en-IN")}</strong> more to get{" "}
                      <strong>Free Express Delivery!</strong>
                    </span>
                    <IconTruck size={18} color="#4f46e5" />
                  </div>
                  <div className="fs-progress-track">
                    <div
                      className="fs-progress-fill"
                      style={{
                        width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Items List */}
            <div className="cart-items-header-bar">
              <h2>Cart Items</h2>
              <span>{cartCount} items</span>
            </div>

            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div className="cart-item-row" key={item._id}>
                  <img
                    src={item.image || "/products/fallback-product.svg"}
                    alt={item.name}
                    className="cart-item-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/products/fallback-product.svg";
                    }}
                  />

                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    <p className="cart-item-unit-price">
                      ₹{Number(item.price).toLocaleString("en-IN")} each
                    </p>

                    <div className="cart-item-stepper">
                      <button
                        onClick={() => updateQuantity(item._id, -1)}
                        aria-label="Decrease quantity"
                      >
                        <IconMinus size={14} />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, 1)}
                        aria-label="Increase quantity"
                      >
                        <IconPlus size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="cart-item-end-col">
                    <strong className="cart-item-subtotal">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </strong>
                    <button
                      className="btn-remove-item"
                      onClick={() => removeFromCart(item._id, item.name)}
                      title="Remove from cart"
                    >
                      <IconTrash size={15} />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Summary Sidebar */}
          <aside className="cart-summary-sidebar">
            <div className="cart-summary-card">
              <h2>Order Summary</h2>

              {/* Promo Code Form */}
              <form className="cart-promo-form" onSubmit={handleApplyCoupon}>
                <div className="promo-input-group">
                  <input
                    type="text"
                    placeholder="Coupon (e.g. SHOPLITE10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button type="submit">Apply</button>
                </div>
                {appliedDiscount > 0 && (
                  <div className="promo-success-tag">
                    ✓ {appliedDiscount}% discount applied!
                  </div>
                )}
                {couponError && <div className="promo-error-tag">{couponError}</div>}
              </form>

              <div className="summary-breakdown">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>

                {appliedDiscount > 0 && (
                  <div className="summary-row discount-row">
                    <span>Voucher Discount</span>
                    <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                  </div>
                )}

                <div className="summary-row">
                  <span>Shipping</span>
                  {shippingFee === 0 ? (
                    <span className="free-shipping-tag">FREE</span>
                  ) : (
                    <span>₹{shippingFee}</span>
                  )}
                </div>

                <div className="summary-row">
                  <span>Estimated Tax</span>
                  <span className="tax-included">Included</span>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-total-row">
                  <strong>Total Amount</strong>
                  <strong className="grand-total-price">
                    ₹{finalTotal.toLocaleString("en-IN")}
                  </strong>
                </div>
              </div>

              <button
                className="cart-checkout-button"
                onClick={() => navigate("/checkout")}
              >
                <span>Proceed to Checkout</span>
                <IconArrowRight size={18} />
              </button>

              <div className="cart-trust-badges">
                <div className="ct-badge">
                  <IconLock size={15} color="#10b981" />
                  <span>256-Bit SSL Encrypted Checkout</span>
                </div>
                <div className="ct-badge">
                  <IconShield size={15} color="#4f46e5" />
                  <span>Guaranteed Safe & Verified Delivery</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}

export default CartPage;
