require("node:dns").setServers(["1.1.1.1", "8.8.8.8"]);
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const connectDB = require("./config/db");
const Product = require("./models/Product");
const sellerRoutes = require("./routes/sellerRoutes");
const sellerProductRoutes = require("./routes/sellerProductRoutes");
const chatRoutes = require("./routes/chatRoutes");


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/sellers", sellerRoutes);
app.use("/api/sellers", sellerProductRoutes);
app.use("/api/chat", chatRoutes);



app.get("/", (req, res) => {
  res.send("ShopLite backend is running!");
});


app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch products",
      error: error.message,
    });
  }
});


connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error.message);
  });

  