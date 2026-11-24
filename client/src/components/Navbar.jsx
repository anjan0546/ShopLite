import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  IconShoppingBag,
  IconHeart,
  IconLogOut,
  IconBox,
  IconMenu,
  IconX,
  IconChevronDown,
  IconSparkles,
} from "./Icons";
import "./Navbar.css";

function Navbar({ cartCount = 0, wishlistCount = 0, currentUser, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  // Close menus on route change
  useEffect(() => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle sticky scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  let user = currentUser;
  if (!user) {
    try {
      user = JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      user = null;
    }
  }

  function handleLogoutClick() {
    setDropdownOpen(false);
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  }

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className={`navbar-header ${scrolled ? "navbar-scrolled" : ""}`}>
      {/* Top Banner Announcement */}
      <div className="navbar-announcement">
        <div className="announcement-content">
          <IconSparkles size={14} color="#818cf8" />
          <span>Special Offer: Use code <strong className="code-pill">SHOPLITE10</strong> for 10% off • Free delivery on orders over ₹1,999!</span>
        </div>
      </div>

      <nav className="navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand" aria-label="ShopLite Home">
          <img src="/logo.svg" alt="ShopLite" className="navbar-brand-logo" />
        </Link>

        {/* Desktop Navigation Links */}
        <div className="navbar-center-links">
          <Link
            to="/"
            className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
          >
            Home
          </Link>
          <a
            href="/#shop-products"
            className="nav-link"
            onClick={(e) => {
              if (location.pathname === "/") {
                e.preventDefault();
                document.getElementById("shop-products")?.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            Explore Store
          </a>
          <Link
            to="/my-orders"
            className={`nav-link ${location.pathname === "/my-orders" ? "active" : ""}`}
          >
            <IconBox size={16} />
            <span>My Orders</span>
          </Link>
          {user?.role === "seller" ? (
            <Link
              to="/seller"
              className={`nav-link ${location.pathname.startsWith("/seller") ? "active" : ""}`}
            >
              Seller Center
            </Link>
          ) : (
            <Link
              to="/become-seller"
              className={`nav-link ${location.pathname === "/become-seller" ? "active" : ""}`}
            >
              Sell on ShopLite
            </Link>
          )}
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className={`nav-link admin-nav-link ${location.pathname.startsWith("/admin") ? "active" : ""}`}
            >
              Admin Panel
            </Link>
          )}
        </div>

        {/* Right Actions */}
        <div className="navbar-actions">
          {/* My Orders Quick Link */}
          <Link
            to="/my-orders"
            className={`action-button orders-button ${location.pathname === "/my-orders" ? "active" : ""}`}
            title="My Orders & Tracking"
          >
            <IconBox size={19} />
          </Link>

          {/* Wishlist Link */}
          <Link to="/#shop-products" className="action-button wishlist-button" title="Saved Wishlist">
            <IconHeart size={20} />
            {wishlistCount > 0 && <span className="action-badge badge-heart">{wishlistCount}</span>}
          </Link>

          {/* Cart Link with Animated Counter */}
          <Link to="/cart" className="action-button cart-button" title="View Cart">
            <IconShoppingBag size={20} />
            <span className={`action-badge ${cartCount > 0 ? "badge-pop" : ""}`}>
              {cartCount}
            </span>
          </Link>

          {/* User Account / Dropdown */}
          {user ? (
            <div className="user-dropdown-container" ref={dropdownRef}>
              <button
                className="user-profile-trigger"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-expanded={dropdownOpen}
              >
                <div className="user-avatar-badge">
                  {getInitials(user.name)}
                </div>
                <div className="user-info-brief">
                  <span className="user-name-label">{user.name}</span>
                  <span className="user-role-pill">{user.role || "customer"}</span>
                </div>
                <IconChevronDown
                  size={14}
                  className={`dropdown-chevron ${dropdownOpen ? "chevron-open" : ""}`}
                />
              </button>

              {dropdownOpen && (
                <div className="user-dropdown-menu">
                  <div className="dropdown-user-header">
                    <div className="header-avatar">{getInitials(user.name)}</div>
                    <div className="header-details">
                      <p className="header-name">{user.name}</p>
                      <p className="header-email">{user.email || "Shopper"}</p>
                      <span className="header-role-badge">
                        {user.role === "admin" ? "⚙️ Administrator" : user.role === "seller" ? "🏪 Verified Seller" : "🛍️ Customer"}
                      </span>
                    </div>
                  </div>

                  <div className="dropdown-divider"></div>

                  <div className="dropdown-links-list">
                    <Link
                      to="/my-orders"
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <IconBox size={17} color="#4f46e5" />
                      <span>My Orders</span>
                    </Link>

                    {user.role === "seller" ? (
                      <>
                        <Link
                          to="/seller"
                          className="dropdown-item"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <IconSparkles size={17} color="#06b6d4" />
                          <span>Seller Dashboard</span>
                        </Link>
                        <Link
                          to="/seller/products"
                          className="dropdown-item"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <IconBox size={17} color="#06b6d4" />
                          <span>My Store Products</span>
                        </Link>
                      </>
                    ) : (
                      <Link
                        to="/become-seller"
                        className="dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <IconSparkles size={17} color="#06b6d4" />
                        <span>Become a Seller</span>
                      </Link>
                    )}

                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        className="dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <IconSparkles size={17} color="#f59e0b" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                  </div>

                  <div className="dropdown-divider"></div>

                  <button className="dropdown-item logout-item" onClick={handleLogoutClick}>
                    <IconLogOut size={17} color="#ef4444" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-action-group">
              <Link to="/login" className="btn-nav-login">
                Sign In
              </Link>
              <Link to="/register" className="btn-nav-register">
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            className="mobile-hamburger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <IconX size={24} /> : <IconMenu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu-backdrop" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-menu-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <Link to="/" className="navbar-brand" onClick={() => setMobileMenuOpen(false)} aria-label="ShopLite Home">
                <img src="/logo.svg" alt="ShopLite" className="navbar-brand-logo" />
              </Link>
              <button className="drawer-close" onClick={() => setMobileMenuOpen(false)}>
                <IconX size={20} />
              </button>
            </div>

            <div className="drawer-body">
              {user && (
                <div className="drawer-user-info">
                  <div className="user-avatar-badge">{getInitials(user.name)}</div>
                  <div>
                    <p className="drawer-user-name">{user.name}</p>
                    <p className="drawer-user-email">{user.email || ""}</p>
                  </div>
                </div>
              )}

              <div className="drawer-links">
                <Link to="/" className="drawer-link" onClick={() => setMobileMenuOpen(false)}>
                  Home
                </Link>
                <a
                  href="/#shop-products"
                  className="drawer-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Explore Products
                </a>
                <Link
                  to="/my-orders"
                  className={`drawer-link ${location.pathname === "/my-orders" ? "active" : ""}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                    <IconBox size={18} color="#4f46e5" />
                    <span>My Orders</span>
                  </span>
                </Link>
                <Link to="/cart" className="drawer-link" onClick={() => setMobileMenuOpen(false)}>
                  Shopping Cart ({cartCount})
                </Link>

                {user ? (
                  <>
                    {user.role === "seller" ? (
                      <Link
                        to="/seller"
                        className="drawer-link"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Seller Dashboard
                      </Link>
                    ) : (
                      <Link
                        to="/become-seller"
                        className="drawer-link"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Become a Seller
                      </Link>
                    )}
                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        className="drawer-link"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button className="drawer-link drawer-logout" onClick={handleLogoutClick}>
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="drawer-auth-buttons">
                    <Link
                      to="/login"
                      className="drawer-btn-login"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="drawer-btn-register"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Create Account
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
