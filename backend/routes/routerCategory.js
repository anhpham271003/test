// productController.js
const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
// Lấy danh sách các categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories); // Trả về danh sách tên và id
  } catch (err) {
    res.status(500).send("Lỗi khi lấy danh mục sản phẩm.");
  }
});

module.exports = router;
