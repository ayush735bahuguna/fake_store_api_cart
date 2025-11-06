const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");
const dotenv = require("dotenv");
const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());
mongoose.connect(process.env.MONGODB_URL);

const CartItem = mongoose.model(
  "CartItem",
  new mongoose.Schema({
    productId: String,
    qty: Number,
  })
);

async function getProductDetails(productId) {
  try {
    const res = await axios.get(
      `https://fakestoreapi.com/products/${productId}`
    );
    return res.data;
  } catch (e) {
    console.error(
      `Failed to fetch product ${productId} details from Fake Store API`,
      e
    );
    return null;
  }
}

// Fetch products
app.get("/api/products", async (req, res) => {
  try {
    const response = await axios.get("https://fakestoreapi.com/products");
    res.json(response.data);
  } catch (error) {
    console.error("Failed to fetch products from Fake Store API", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

// POST /api/cart - add item
app.post("/api/cart", async (req, res) => {
  const { productId, qty } = req.body;
  if (!productId || !qty) {
    return res.status(400).json({ message: "ProductId and qty required" });
  }

  const existing = await CartItem.findOne({ productId });
  if (existing) {
    existing.qty += qty;
    await existing.save();
    return res.json(existing);
  }

  const cartItem = new CartItem({ productId, qty });
  await cartItem.save();
  res.json(cartItem);
});

// DELETE /api/cart/:id remove item
app.delete("/api/cart/:id", async (req, res) => {
  await CartItem.findByIdAndDelete(req.params.id);
  res.json({ message: "Item removed" });
});

// GET /api/cart - get cart with live product details + total
app.get("/api/cart", async (req, res) => {
  const cartItems = await CartItem.find();

  // Cache to store product details by productId to avoid duplicate fetches
  const productCache = new Map();

  const detailedItems = await Promise.all(
    cartItems.map(async (item) => {
      // Check cache first
      if (!productCache.has(item.productId)) {
        const product = await getProductDetails(item.productId);
        productCache.set(item.productId, product);
      }

      const product = productCache.get(item.productId);

      if (!product) {
        return null;
      }

      return {
        id: item._id,
        productId: item.productId,
        name: product.title,
        price: product.price,
        qty: item.qty,
        imageUrl: product.image,
        category: product.category,
        description: product.description,
        rating: product.rating ? product.rating.rate : null,
      };
    })
  );

  const filteredItems = detailedItems.filter(Boolean);

  const total = filteredItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  res.json({ items: filteredItems, total });
});

// PUT /api/cart/:id - update quantity of cart item
app.put("/api/cart/:id", async (req, res) => {
  const { qty } = req.body;
  if (typeof qty !== "number" || qty < 1) {
    return res
      .status(400)
      .json({ message: "Quantity must be a number greater than 0" });
  }

  try {
    const updatedItem = await CartItem.findByIdAndUpdate(
      req.params.id,
      { qty },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: "Failed to update quantity", error });
  }
});

// POST /api/checkout - mock receipt
app.post("/api/checkout", (req, res) => {
  const { cartItems } = req.body;
  if (!cartItems || !Array.isArray(cartItems)) {
    return res.status(400).json({ message: "cartItems array required" });
  }

  const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const receipt = {
    total,
    timestamp: new Date().toISOString(),
    items: cartItems,
  };

  res.json(receipt);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
