const User = require("../models/User");

async function sellerMiddleware(req, res, next) {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (
      user.role !== "seller" ||
      user.sellerStatus !== "approved"
    ) {
      return res.status(403).json({
        message: "Access denied. Approved sellers only.",
      });
    }

    next();
  } catch (error) {
    console.error("Seller middleware error:", error.message);

    return res.status(500).json({
      message: "Server error while verifying seller access",
    });
  }
}

module.exports = sellerMiddleware;