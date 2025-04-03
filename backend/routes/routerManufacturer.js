const express = require("express");
const router = express.Router();
const Manufacturer = require("../models/Manufacturer");
router.get("/", async (req, res) => {
  try {
    const categories = await Manufacturer.find();
    res.json(categories); // Trả về danh sách tên và id
  } catch (err) {
    res.status(500).send("Lỗi khi lấy danh mục sản phẩm.");
  }
});

module.exports = router;
