const express = require("express");
const router = express.Router();
const Origin = require("../models/Origin");
router.get("/", async (req, res) => {
  try {
    const categories = await Origin.find();
    res.json(categories); // Trả về danh sách tên và id
  } catch (err) {
    res.status(500).send("Lỗi khi lấy danh mục sản phẩm.");
  }
});

module.exports = router;
