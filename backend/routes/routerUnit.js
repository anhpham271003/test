const express = require("express");
const router = express.Router();
const Unit = require("../models/Unit");
router.get("/", async (req, res) => {
  try {
    const categories = await Unit.find();
    res.json(categories);
  } catch (err) {
    res.status(500).send("Lỗi khi lấy danh mục sản phẩm.");
  }
});

module.exports = router;
