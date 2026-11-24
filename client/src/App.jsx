import React, { useState, useEffect, useMemo } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import "./App.css";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./components/HomePage";
import CartPage from "./components/CartPage";
import ProductDetails from "./components/ProductDetails";
import Register from "./components/Register";
import Login from "./components/Login";
import Checkout from "./components/Checkout";
import OrderSuccess from "./components/OrderSuccess";
import MyOrders from "./components/MyOrders";
import AdminDashboard from "./components/AdminDashboard";
import AddProduct from "./components/AddProduct";
import ManageProducts from "./components/ManageProducts";
import EditProduct from "./components/EditProduct";
import SellerApplication from "./components/SellerApplication";
import SellerDashboard from "./components/SellerDashboard";
import SellerApplications from "./components/SellerApplications";
import SellerAddProduct from "./components/SellerAddProduct";
import SellerProducts from "./components/SellerProducts";
import SellerEditProduct from "./components/SellerEditProduct";

import { useToast } from "./context/ToastContext";
import { initialMockProducts } from "./data/mockProducts";
import Chatbot from "./components/Chatbot";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();

  // Cart state
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cartItems");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  // Wishlist state
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const saved = localStorage.getItem("shoplite_wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // User state
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState(3000);
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"

  // Products state
  const [products, setProducts] = useState(initialMockProducts);
  const [loading, setLoading] = useState(false);

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Sync wishlist to localStorage
  useEffect(() => {
    localStorage.setItem("shoplite_wishlist", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // Fetch products from server, fallback smoothly to mock dataset
  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:5000/api/products")
      .then((res) => {
        if (!res.ok) throw new Error("Server responded with error");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        } else {
          setProducts(initialMockProducts);
        }
      })
      .catch((err) => {
        console.warn("Backend API not reachable, using offline catalog:", err.message);
        setProducts(initialMockProducts);
      })
      .finally(() => setLoading(false));
  }, []);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlistItems.length;

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
    addToast("You have been signed out.", "info");
    navigate("/login");
  }

  function addToCart(product, silent = false) {
    setCartItems((items) => {
      const existingItem = items.find((item) => item._id === product._id);
      if (existingItem) {
        return items.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...items, { ...product, quantity: 1 }];
    });
    if (!silent) {
      addToast(`Added "${product.name}" to cart! 🛍️`, "success");
    }
  }

  function removeFromCart(productId, name) {
    setCartItems((items) => items.filter((item) => item._id !== productId));
    addToast(`Removed ${name || "item"} from cart.`, "info");
  }

  function updateQuantity(productId, change) {
    setCartItems((items) =>
      items
        .map((item) =>
          item._id === productId ? { ...item, quantity: item.quantity + change } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function toggleWishlist(product) {
    setWishlistItems((prev) => {
      const exists = prev.some((item) => item._id === product._id);
      if (exists) {
        addToast(`Removed "${product.name}" from wishlist`, "info");
        return prev.filter((item) => item._id !== product._id);
      } else {
        addToast(`Added "${product.name}" to wishlist! ❤️`, "success");
        return [...prev, product];
      }
    });
  }

  // Derive unique categories
  const categories = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ["All", ...Array.from(set)];
  }, [products]);

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;

      const matchesPrice = product.price <= maxPrice;

      return matchesSearch && matchesCategory && matchesPrice;
    });

    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, searchTerm, selectedCategory, maxPrice, sortBy]);

  return (
    <div>
      <Navbar
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              products={products}
              loading={loading}
              filteredProducts={filteredProducts}
              categories={categories}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              sortBy={sortBy}
              setSortBy={setSortBy}
              viewMode={viewMode}
              setViewMode={setViewMode}
              addToCart={addToCart}
              wishlistItems={wishlistItems}
              toggleWishlist={toggleWishlist}
            />
          }
        />
        <Route
          path="/product/:id"
          element={<ProductDetails onAddToCart={addToCart} allProducts={products} />}
        />
        <Route
          path="/cart"
          element={
            <CartPage
              cartItems={cartItems}
              cartCount={cartCount}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
            />
          }
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/login"
          element={<Login onLoginSuccess={(user) => setCurrentUser(user)} />}
        />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/my-orders" element={<MyOrders onAddToCart={addToCart} />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/add-product" element={<AddProduct />} />
        <Route path="/admin/products" element={<ManageProducts />} />
        <Route path="/admin/edit-product/:id" element={<EditProduct />} />
        <Route path="/admin/seller-applications" element={<SellerApplications />} />
        <Route path="/seller" element={<SellerDashboard />} />
        <Route path="/seller/products" element={<SellerProducts />} />
        <Route path="/seller/add-product" element={<SellerAddProduct />} />
        <Route path="/seller/edit-product/:id" element={<SellerEditProduct />} />
        <Route path="/become-seller" element={<SellerApplication />} />
      </Routes>
       <Chatbot />
       {!location.pathname.startsWith("/admin") && <Footer />}
    </div>
  );
}

export default App;
