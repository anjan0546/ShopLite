const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const authMiddleware = require("../middleware/authMiddleware");
const sellerMiddleware = require("../middleware/sellerMiddleware");

// ADD PRODUCT
router.post(
  "/products",
  authMiddleware,
  sellerMiddleware,
  async (req, res) => {
    try {
      const { name, price, image, category } = req.body;

      const product = await Product.create({
        name,
        price,
        image,
        category,
        seller: req.user.userId,
      });

      res.status(201).json({
        message: "Product added successfully",
        product,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// GET SELLER'S OWN PRODUCTS
router.get(
  "/products",
  authMiddleware,
  sellerMiddleware,
  async (req, res) => {
    try {
      const products = await Product.find({
        seller: req.user.userId,
      }).sort({ createdAt: -1 });

      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// UPDATE OWN PRODUCT
router.put(
  "/products/:id",
  authMiddleware,
  sellerMiddleware,
  async (req, res) => {
    try {
      const { name, price, image, category } = req.body;

      const product = await Product.findOneAndUpdate(
        {
          _id: req.params.id,
          seller: req.user.userId,
        },
        { name, price, image, category },
        { new: true, runValidators: true }
      );

      if (!product) {
        return res.status(404).json({
          message: "Product not found or you don't own this product",
        });
      }

      res.status(200).json({
        message: "Product updated successfully",
        product,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// DELETE OWN PRODUCT
router.delete(
  "/products/:id",
  authMiddleware,
  sellerMiddleware,
  async (req, res) => {
    try {
      const product = await Product.findOneAndDelete({
        _id: req.params.id,
        seller: req.user.userId,
      });

      if (!product) {
        return res.status(404).json({
          message: "Product not found or you don't own this product",
        });
      }

      res.status(200).json({
        message: "Product deleted successfully",
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);
// GET SELLER'S OWN ORDERS
router.get(
  "/orders",
  authMiddleware,
  sellerMiddleware,
  async (req, res) => {
    try {
      const orders = await Order.find({
        "items.seller": req.user.userId,
      })
        .sort({ createdAt: -1 })
        .lean();

      const sellerOrders = orders.map((order) => {
        const sellerItems = order.items.filter(
          (item) =>
            item.seller &&
            item.seller.toString() === req.user.userId
        );

        const sellerTotal = sellerItems.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );

        return {
          _id: order._id,
          shipping: order.shipping,
          items: sellerItems,
          sellerTotal,
          createdAt: order.createdAt,
        };
      });

      return res.status(200).json({
        orders: sellerOrders,
      });
    } catch (error) {
      console.error("Fetch seller orders error:", error.message);

      return res.status(500).json({
        message: "Failed to fetch seller orders",
      });
    }
  }
);

module.exports = router;