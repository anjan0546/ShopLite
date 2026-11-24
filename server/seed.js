const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");

dotenv.config();

const products = [
  // ELECTRONICS
  {
    name: "Wireless Bluetooth Headphones",
    price: 1499,
    image: "/products/headphones.jpg",
    category: "Electronics",
  },
  {
    name: "Smart Watch Pro",
    price: 2999,
    image: "/products/smartwatch.jpg",
    category: "Electronics",
  },
  {
    name: "Gaming Mouse",
    price: 899,
    image: "/products/gaming-mouse.jpg",
    category: "Electronics",
  },
  {
    name: "Mechanical Keyboard",
    price: 2199,
    image: "/products/keyboard.jpg",
    category: "Electronics",
  },
  {
    name: "Bluetooth Speaker",
    price: 1799,
    image: "/products/speaker.jpg",
    category: "Electronics",
  },

  // FASHION
  {
    name: "Men Casual T-Shirt",
    price: 699,
    image: "/products/tshirt.jpg",
    category: "Fashion",
  },
  {
    name: "Classic Denim Jeans",
    price: 1599,
    image: "/products/jeans.jpg",
    category: "Fashion",
  },
  {
    name: "Men Formal Shirt",
    price: 1299,
    image: "/products/casual-shirt.jpg",
    category: "Fashion",
  },
  {
    name: "Women's Summer Dress",
    price: 1899,
    image: "/products/summer-dress.jpg",
    category: "Fashion",
  },
  {
    name: "Cotton Hoodie",
    price: 1499,
    image: "/products/hoodie.jpg",
    category: "Fashion",
  },

  // FOOTWEAR
  {
    name: "Nike Running Shoes",
    price: 2499,
    image: "/products/running-shoes.jpg",
    category: "Footwear",
  },
  {
    name: "Casual Sneakers",
    price: 1799,
    image: "/products/sneakers.jpg",
    category: "Footwear",
  },
  {
    name: "Men Formal Shoes",
    price: 2199,
    image: "/products/formal-shoes.jpg",
    category: "Footwear",
  },
  {
    name: "Women's Sports Shoes",
    price: 1999,
    image: "/products/womens-sports-shoes.jpg",
    category: "Footwear",
  },
  {
    name: "Comfortable Flip Flops",
    price: 399,
    image: "/products/slides.jpg",
    category: "Footwear",
  },

  // ACCESSORIES
  {
    name: "Leather Office Backpack",
    price: 1199,
    image: "/products/backpack.jpg",
    category: "Accessories",
  },
  {
    name: "Premium Sunglasses",
    price: 999,
    image: "/products/sunglasses.jpg",
    category: "Accessories",
  },
  {
    name: "Classic Wrist Watch",
    price: 1599,
    image: "/products/wrist-watch.jpg",
    category: "Accessories",
  },
  {
    name: "Women's Handbag",
    price: 1899,
    image: "/products/handbag.jpg",
    category: "Accessories",
  },
  {
    name: "Stainless Steel Bottle",
    price: 499,
    image: "/products/water-bottle.jpg",
    category: "Accessories",
  },

  // HOME & KITCHEN
  {
    name: "Electric Coffee Maker",
    price: 2499,
    image: "/products/coffee-maker.jpg",
    category: "Home & Kitchen",
  },
  {
    name: "Non Stick Cookware Set",
    price: 1999,
    image: "/products/cookware.jpg",
    category: "Home & Kitchen",
  },
  {
    name: "LED Desk Lamp",
    price: 799,
    image: "/products/desk-lamp.jpg",
    category: "Home & Kitchen",
  },
  {
    name: "Digital Wall Clock",
    price: 699,
    image: "/products/wall-clock.jpg",
    category: "Home & Kitchen",
  },
  {
    name: "Soft Cushion Set",
    price: 899,
    image: "/products/cushions.jpg",
    category: "Home & Kitchen",
  },

  // SPORTS
  {
    name: "Cricket Bat",
    price: 1599,
    image: "/products/cricket-bat.jpg",
    category: "Sports",
  },
  {
    name: "Football",
    price: 899,
    image: "/products/football.jpg",
    category: "Sports",
  },
  {
    name: "Yoga Mat",
    price: 599,
    image: "/products/yoga-mat.jpg",
    category: "Sports",
  },
  {
    name: "Adjustable Dumbbells",
    price: 2499,
    image: "/products/dumbbells.jpg",
    category: "Sports",
  },
  {
    name: "Badminton Racket",
    price: 1299,
    image: "/products/badminton-racket.jpg",
    category: "Sports",
  },
];

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const result = await Product.insertMany(products);

    console.log(`${result.length} products inserted successfully!`);
  } catch (error) {
    console.error("Seeding error:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

// Only run if called directly from CLI
if (require.main === module) {
  seedProducts();
}

module.exports = products;
