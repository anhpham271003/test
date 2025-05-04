require("dotenv").config();
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const CartProduct = require("../models/CartProduct");
// Get cart information
// router.get("/:userId", async (req, res) => {
  router.get("/:userId", async (req, res) => {
    try {
      // const cartItems = await CartProduct.find({ user: req.params.userId })
      const userId = req.params.userId;
      const cartItems = await CartProduct.find({ userId })
        .populate('product', 'productName productImgs productUnitPrice productSupPrice')
        .lean();

      const cart = cartItems.map(item => ({
        _id: item._id,
        product: item.product._id,
        name: item.product.productName,
        image: item.product.productImgs?.[0]?.link || '',
        quantity: item.quantity,
        unitPrice: item.product.productUnitPrice * (1 - (item.product.productSupPrice || 0) / 100),
        selected: true,
      }));

      res.json(cart);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Lỗi khi lấy giỏ hàng' });
    }

});

router.post("/", async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || typeof quantity !== 'number' || quantity < 1) {
      return res.status(400).json({ message: "Dữ liệu không hợp lệ" });
    }

    // Kiểm tra xem sản phẩm đã có trong giỏ chưa
    let existing = await CartProduct.findOne({ userId, product: productId });

    if (existing) {
      // Nếu có rồi thì cộng thêm số lượng
      existing.quantity += quantity;
      await existing.save();
      return res.json({ message: "Đã cập nhật số lượng", cartItem: existing });
    }

    // Nếu chưa có thì tạo mới
    const newCart = new CartProduct({
      userId,
      product: productId,
      quantity
    });

    await newCart.save();

    res.status(201).json({ message: "Đã thêm vào giỏ hàng", cartItem: newCart });
  } catch (err) {
    console.error("Lỗi khi thêm giỏ hàng:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const cartItemId = req.params.id;
    const { quantity } = req.body;

    // Kiểm tra đầu vào hợp lệ
    if (typeof quantity !== 'number' || quantity < 1) {
      return res.status(400).json({ message: "Số lượng không hợp lệ" });
    }

    const updated = await CartProduct.findByIdAndUpdate(
      cartItemId,
      { quantity },
      { new: true } // trả về bản ghi mới sau khi cập nhật
    );

    if (!updated) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm trong giỏ hàng" });
    }

    res.json({ message: "Cập nhật thành công", item: updated });
  } catch (err) {
    console.error("Lỗi cập nhật giỏ hàng:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await CartProduct.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "CartProduct not found" });
    res.json({ message: "CartProduct deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
