const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// APPLY TO BECOME A SELLER
router.post("/apply", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const { storeName, category } = req.body;

    // Save proposed store details and set status to pending
    user.sellerStatus = "pending";
    if (storeName && storeName.trim()) {
      user.storeName = storeName.trim();
    }
    if (category && category.trim()) {
      user.category = category.trim();
    }

    await user.save();

    return res.status(200).json({
      message: "Seller application submitted successfully!",
      sellerStatus: user.sellerStatus,
      storeName: user.storeName,
      category: user.category,
    });
  } catch (error) {
    console.error("Seller application error:", error.message);

    return res.status(500).json({
      message: "Failed to submit seller application",
    });
  }
});

module.exports = router;
