const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
// Get cart information
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .populate(
        "cart.product",
        "productName productImgs productUnitPrice productSupPrice"
      )
      .lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    const cart = user.cart.map((item) => ({
      ...item,
      unitPrice: item.product.productSupPrice || item.product.productUnitPrice,
    }));

    const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cart.reduce(
      (acc, item) => acc + item.quantity * item.unitPrice,
      0
    );

    res.json({ cart, totalQuantity, totalPrice });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add product to cart
router.post("/add", async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const unitPrice = product.productSupPrice || product.productUnitPrice;
    const cartItem = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity, unitPrice });
    }

    await user.save();
    res.json({ message: "Added to cart successfully", cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update product quantity in cart
router.post("/update", async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const cartItem = user.cart.find(
      (item) => item.product.toString() === productId
    );
    if (!cartItem)
      return res.status(404).json({ message: "Product not found in cart" });

    if (quantity <= 0) {
      user.cart = user.cart.filter(
        (item) => item.product.toString() !== productId
      );
    } else {
      const product = await Product.findById(productId);
      cartItem.quantity = quantity;
      cartItem.unitPrice = product.productSupPrice || product.productUnitPrice;
    }

    await user.save();
    res.json({ message: "Cart updated successfully", cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove product from cart
router.post("/remove", async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.cart = user.cart.filter(
      (item) => item.product.toString() !== productId
    );
    await user.save();
    res.json({ message: "Removed from cart successfully", cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Checkout: Convert cart to order
router.post("/checkout", async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId).populate("cart.product");
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.cart.length === 0)
      return res.status(400).json({ message: "Cart is empty" });
    const orderDetails = user.cart.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      unitPrice: item.product.productSupPrice || item.product.productUnitPrice,
      totalPrice:
        item.quantity *
        (item.product.productSupPrice || item.product.productUnitPrice),
    }));
    const totalAmount = orderDetails.reduce(
      (acc, item) => acc + item.totalPrice,
      0
    );
    const newOrder = new Order({
      user: userId,
      orderDetails,
      totalAmount,
      orderStatus: "pending",
    });
    await newOrder.save();
    // Clear cart after order
    user.cart = [];
    await user.save();

    res.json({
      message: "Order placed successfully",
      orderId: newOrder._id,
      orderDetails: newOrder.orderDetails,
      totalAmount: newOrder.totalAmount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
