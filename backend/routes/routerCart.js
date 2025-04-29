require("dotenv").config();
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const CartProduct = require("../models/CartProduct");
// Get cart information
// router.get("/:userId", async (req, res) => {
  router.get("/", async (req, res) => {
    try {
      // const cartItems = await CartProduct.find({ user: req.params.userId })
      const cartItems = await CartProduct.find()
        .populate('product', 'productName productImgs productUnitPrice')
        .lean();

      const cart = cartItems.map(item => ({
        _id: item._id,
        product: item.product._id,
        name: item.product.productName,
        image: item.product.productImgs?.[0]?.link || '',
        quantity: item.quantity,
        unitPrice: item.product.productUnitPrice,
        selected: true,
      }));

      const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = cart.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

      res.json({ cart, totalQuantity, totalPrice });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Lỗi khi lấy giỏ hàng' });
    }

});


module.exports = router;
