const express = require("express");
const router = express.Router();

const generateChatResponse = require("../services/chatbotService");

// POST: Process customer message with lightning speed and zero 500 errors
router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Please enter a message."
      });
    }

    const reply = await generateChatResponse(message);

    return res.status(200).json({
      reply
    });

  } catch (error) {
    console.error("Chat route caught error:", error.message);

    // Guaranteed fallback response so customer never receives a 500 or broken experience
    return res.status(200).json({
      reply: "Hi! I'm here to help you shop with ease on ShopLite. You can browse our wide catalog, track purchases in 'My Orders', or use coupon code **SHOPLITE10** for 10% off. For urgent queries, reach us at support@shoplite.com."
    });
  }
});

module.exports = router;
