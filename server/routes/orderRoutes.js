
const express = require("express");
const mongoose = require("mongoose");

const Order = require("../models/Order");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// CREATE ORDER
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { items, shipping } = req.body;

    if (
      !Array.isArray(items) ||
      items.length === 0 ||
      !shipping ||
      !shipping.fullName?.trim() ||
      !shipping.email?.trim() ||
      !shipping.phone?.trim() ||
      !shipping.address?.trim() ||
      !shipping.city?.trim() ||
      !shipping.pincode?.trim()
    ) {
      return res.status(400).json({
        message: "Valid cart items and shipping details are required",
      });
    }

    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      if (
        !mongoose.isValidObjectId(item.productId) ||
        !Number.isSafeInteger(item.quantity) ||
        item.quantity < 1
      ) {
        return res.status(400).json({
          message: "Invalid product or quantity",
        });
      }

      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(400).json({
          message: "A product in your cart no longer exists",
        });
      }
if (!product.seller) {
  return res.status(400).json({
    message: `${product.name} is currently unavailable for purchase.`,
  });
}
      const price = Number(product.price);

      if (!Number.isFinite(price) || price < 0) {
        return res.status(400).json({
          message: "Invalid product price",
        });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        price,
        quantity: item.quantity,
      });

      totalAmount += price * item.quantity;
    }

    if (!Number.isFinite(totalAmount)) {
      return res.status(400).json({
        message: "Invalid order total",
      });
    }

    const order = await Order.create({
      user: req.user.userId,
      items: orderItems,
      shipping: {
        fullName: shipping.fullName.trim(),
        email: shipping.email.trim().toLowerCase(),
        phone: shipping.phone.trim(),
        address: shipping.address.trim(),
        city: shipping.city.trim(),
        pincode: shipping.pincode.trim(),
      },
      totalAmount,
    });

    return res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Create order error:", error.message);

    return res.status(500).json({
      message: "Failed to place order",
    });
  }
});

 // GET MY ORDERS
router.get("/my-orders", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.userId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      orders,
    });
  } catch (error) {
    console.error("Fetch orders error:", error.message);

    return res.status(500).json({
      message: "Failed to fetch orders",
    });
  }
});


module.exports = router;
