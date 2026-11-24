const { GoogleGenAI } = require("@google/genai");

let ai = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  } catch (err) {
    console.error("Error initializing GoogleGenAI:", err.message);
  }
}

// Instant Knowledge & Product Recommendation Engine for ShopLite
const FAQ_PATTERNS = [
  {
    pattern: /\b(hi|hello|hey|greetings|good\s*(morning|afternoon|evening))\b/i,
    reply: "Hello! 👋 Welcome to ShopLite! I can help you with product advice, tracking orders, delivery info, returns, or discount vouchers. What can I help you find today?"
  },
  {
    pattern: /\b(track|tracking|where is my order|order status|order history|my orders)\b/i,
    reply: "📦 You can track all your orders in real time! Simply click **'My Orders'** in the top navigation bar to view your order status, item details, and delivery updates."
  },
  {
    pattern: /\b(return|refund|exchange|replacement|replace|money back)\b/i,
    reply: "🔄 **ShopLite Hassle-Free Returns**: We offer a 7-day easy return and replacement policy on all eligible products. To initiate a return, go to **'My Orders'** or email our support desk at **support@shoplite.com**."
  },
  {
    pattern: /\b(coupon|code|discount|voucher|offer|promo|deal|save)\b/i,
    reply: "🎉 **Special Offer!** Use promo code **SHOPLITE10** at checkout to get an instant **10% discount** on your entire cart! Plus, enjoy free shipping on all orders above ₹1,999."
  },
  {
    pattern: /\b(shipping|delivery|deliver|courier|freight|pincode|charge|ship)\b/i,
    reply: "⚡ **Express Delivery**: We ship across 19,000+ pincodes in India. Standard delivery arrives in **2 to 4 business days**. Orders above **₹1,999 qualify for FREE shipping**!"
  },
  {
    pattern: /\b(payment|pay|cod|cash on delivery|upi|card|net banking|credit card|debit card)\b/i,
    reply: "💳 **Payment Methods**: We accept all major Credit/Debit Cards, UPI (Google Pay, PhonePe, Paytm), Net Banking, and **Cash on Delivery (COD)** with 256-bit encrypted checkout security."
  },
  {
    pattern: /\b(sell|seller|merchant|become a seller|vendor|partner)\b/i,
    reply: "💼 **Sell on ShopLite**: Join our growing community of sellers! Click **'Sell on ShopLite'** in the navigation bar or visit `/become-seller` to apply in under 2 minutes with industry-lowest fees and automated payouts."
  },
  {
    pattern: /\b(contact|support|email|phone|customer care|help desk|helpline)\b/i,
    reply: "📞 **24/7 Customer Support**: Reach our friendly support team at **support@shoplite.com** or call our toll-free helpline. We are always here to assist you!"
  },
  {
    pattern: /\b(headphone|headphones|earphone|earphones|audio|speaker|bluetooth)\b/i,
    reply: "🎧 **Top Audio Gear on ShopLite**:\n• **Wireless Bluetooth Headphones** (₹1,499) – Premium deep bass and 30hr battery life.\n• **Bluetooth Speaker** (₹1,799) – 360° surround audio and IPX7 waterproof.\nCheck out our Electronics section on the homepage!"
  },
  {
    pattern: /\b(watch|watches|smartwatch|wrist watch)\b/i,
    reply: "⌚ **Top Watches on ShopLite**:\n• **Smart Watch Pro** (₹2,999) – Ultra AMOLED display, SpO2, and fitness tracking.\n• **Classic Wrist Watch** (₹1,599) – Elegant analog chronograph with genuine leather strap."
  },
  {
    pattern: /\b(mouse|keyboard|gaming)\b/i,
    reply: "🎮 **Gaming Gear on ShopLite**:\n• **RGB Mechanical Keyboard** (₹2,199) – Tactile blue switches and customizable backlights.\n• **Precision Gaming Mouse** (₹899) – 6400 DPI optical sensor and ergonomic grip."
  },
  {
    pattern: /\b(shoes|shoe|sneaker|sneakers|running|flip flop|slides|boots)\b/i,
    reply: "👟 **Footwear Collection**:\n• **Nike Running Shoes** (₹2,499) – Air-cushioned and ultra-lightweight.\n• **Casual Streetwear Sneakers** (₹1,799) – Everyday modern comfort.\n• **Men Formal Shoes** (₹2,199) & **Comfortable Slides** (₹399)."
  },
  {
    pattern: /\b(shirt|tshirt|t-shirt|jeans|hoodie|dress|jacket|clothes|apparel|fashion)\b/i,
    reply: "👕 **Trending Fashion on ShopLite**:\n• **Men Casual Cotton T-Shirt** (₹699)\n• **Classic Denim Jeans** (₹1,599)\n• **Crisp Oxford Formal Shirt** (₹1,299)\n• **Fleece Zip-Up Hoodie** (₹1,499)\n• **Women's Summer Dress** (₹1,899)"
  },
  {
    pattern: /\b(coffee|cookware|lamp|clock|cushion|kitchen|home)\b/i,
    reply: "🏠 **Home & Kitchen Picks**:\n• **Electric Coffee Maker** (₹2,499)\n• **Non-Stick Cookware Set** (₹1,999)\n• **LED Desk Lamp** (₹799) & **Digital Wall Clock** (₹699)"
  },
  {
    pattern: /\b(gym|fitness|dumbbells|cricket|football|yoga|badminton|sport|sports)\b/i,
    reply: "🏋️ **Sports & Fitness Gear**:\n• **Adjustable Dumbbells** (₹2,499)\n• **Badminton Racket** (₹1,299)\n• **Cricket Bat** (₹1,599)\n• **Pro Football** (₹899)\n• **Eco Alignment Yoga Mat** (₹599)"
  },
  {
    pattern: /\b(category|categories|catalog|shop|items|browse)\b/i,
    reply: "🛍️ **ShopLite Catalog**: Explore our handpicked collections:\n• **Electronics** • **Fashion** • **Footwear** • **Accessories** • **Home & Kitchen** • **Sports**\nUse the category filter tabs on the homepage to explore!"
  },
  {
    pattern: /\b(thank|thanks|great|awesome|helpful|good job)\b/i,
    reply: "You're very welcome! 😊 Happy shopping with ShopLite. Let me know if you need anything else!"
  }
];

function getQuickResponse(message) {
  const cleanMsg = message.trim();
  for (const item of FAQ_PATTERNS) {
    if (item.pattern.test(cleanMsg)) {
      return item.reply;
    }
  }
  return null;
}

// Call Gemini with strict fast timeout (1500ms) to ensure lightning-fast UI response
async function callGemini(message, timeoutMs = 1500) {
  if (!ai) return null;

  try {
    const responsePromise = ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: message,
      config: {
        systemInstruction: `You are ShopLite's official customer support assistant.
ShopLite is a premier Indian e-commerce platform offering Electronics, Fashion, Footwear, Home & Kitchen, and Sports products.
Rules:
- Be concise (1-3 sentences max).
- Mention promo code SHOPLITE10 for 10% off when relevant.
- Mention 7-day easy returns and free shipping over ₹1,999 when relevant.
- Keep tone cheerful, professional, and helpful.`,
      },
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("AI timeout")), timeoutMs)
    );

    const response = await Promise.race([responsePromise, timeoutPromise]);
    if (response && response.text) {
      return response.text.trim();
    }
  } catch (err) {
    console.warn("AI generation note:", err.message);
  }

  return null;
}

async function generateChatResponse(message) {
  if (!message || !message.trim()) {
    return "Please enter a message so I can assist you!";
  }

  // 1. Check instant knowledge base (ultra-fast: < 2ms)
  const quickReply = getQuickResponse(message);
  if (quickReply) {
    return quickReply;
  }

  // 2. Try fast AI response with strict timeout (max 1.5s)
  try {
    const aiReply = await callGemini(message);
    if (aiReply) {
      return aiReply;
    }
  } catch (err) {
    console.warn("AI generation failed:", err.message);
  }

  // 3. Guaranteed reliable, context-aware fallback (never returns 500 error)
  return "I'm here to assist you with anything related to ShopLite! You can explore our catalog in Electronics, Fashion, Footwear, and Home essentials. Use code **SHOPLITE10** for an extra 10% off, track your orders in 'My Orders', or contact our support team at **support@shoplite.com**.";
}

module.exports = generateChatResponse;
