
const express = require("express");

const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// ADMIN DASHBOARD STATISTICS
router.get(
  "/stats",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const totalUsers = await User.countDocuments();
      const totalProducts = await Product.countDocuments();
      const totalOrders = await Order.countDocuments();

      const revenueResult = await Order.aggregate([
        {
          $match: {
            status: { $ne: "Cancelled" },
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalAmount" },
          },
        },
      ]);

      const totalRevenue =
        revenueResult.length > 0
          ? revenueResult[0].totalRevenue
          : 0;

      res.json({
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
      });
    } catch (error) {
      console.error("Admin dashboard error:", error.message);

      res.status(500).json({
        message: "Failed to fetch dashboard statistics",
      });
    }
  }
);

// ADD NEW PRODUCT
router.post(
  "/products",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { name, price, image, category } = req.body;

      if (
        !name?.trim() ||
        price === undefined ||
        price === null ||
        price === "" ||
        !image?.trim() ||
        !category?.trim()
      ) {
        return res.status(400).json({
          message: "All product fields are required",
        });
      }

      const productPrice = Number(price);

      if (!Number.isFinite(productPrice) || productPrice < 0) {
        return res.status(400).json({
          message: "Enter a valid product price",
        });
      }

      const product = await Product.create({
        name: name.trim(),
        price: productPrice,
        image: image.trim(),
        category: category.trim(),
      });

      return res.status(201).json({
        message: "Product added successfully",
        product,
      });
    } catch (error) {
      console.error("Add product error:", error.message);

      return res.status(500).json({
        message: "Failed to add product",
      });
    }
  }
);

// GET ALL PRODUCTS (ADMIN)
router.get(
  "/products",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const products = await Product.find().sort({
        _id: -1,
      });

      return res.status(200).json({
        products,
      });
    } catch (error) {
      console.error("Fetch products error:", error.message);

      return res.status(500).json({
        message: "Failed to fetch products",
      });
    }
  }
);
// DELETE PRODUCT (ADMIN)
router.delete(
  "/products/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      return res.status(200).json({
        message: "Product deleted successfully",
      });
    } catch (error) {
      console.error("Delete product error:", error.message);

      return res.status(500).json({
        message: "Failed to delete product",
      });
    }
  }
);
// UPDATE PRODUCT (ADMIN)
router.put(
  "/products/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { name, price, image, category } = req.body;

      if (!name || !price || !image || !category) {
        return res.status(400).json({
          message: "All fields are required",
        });
      }

      const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
          name,
          price: Number(price),
          image,
          category,
        },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      return res.status(200).json({
        message: "Product updated successfully",
        product,
      });
    } catch (error) {
      console.error("Update product error:", error.message);

      return res.status(500).json({
        message: "Failed to update product",
      });
    }
  }
);


// GET ALL SELLER APPLICATIONS
router.get(
  "/seller-applications",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const applications = await User.find({
        sellerStatus: { $in: ["pending", "approved", "rejected"] },
      })
        .select("name email role sellerStatus storeName category createdAt updatedAt")
        .sort({ updatedAt: -1, createdAt: -1 });

      return res.status(200).json({
        applications,
      });
    } catch (error) {
      console.error("Fetch seller applications:", error.message);

      return res.status(500).json({
        message: "Failed to fetch seller applications",
      });
    }
  }
);


// APPROVE OR REJECT SELLER APPLICATION
router.patch(
  "/seller-applications/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { status } = req.body;

      if (!["approved", "rejected", "pending"].includes(status)) {
        return res.status(400).json({
          message: "Invalid application status",
        });
      }

      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      user.sellerStatus = status;

      // Only elevate to seller if user is currently customer
      if (status === "approved" && user.role === "customer") {
        user.role = "seller";
      }

      await user.save();

      return res.status(200).json({
        message: `Seller application ${status} successfully`,
        user: {
          id: user._id,
          name: user.name,
          role: user.role,
          sellerStatus: user.sellerStatus,
          storeName: user.storeName,
          category: user.category,
        },
      });
    } catch (error) {
      console.error("Seller approval error:", error.message);

      return res.status(500).json({
        message: "Failed to update seller application",
      });
    }
  }
);

module.exports = router;
