const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
require("dotenv").config();

// Get all 
router.get("/:userId", async (req, res) => {
  try {
    // console.log("uer" , req.params.userId)
    const orderList = await Order.find({ user: req.params.userId })
      .populate('user', 'userName userPhone')
      .lean();

      console.log(orderList);

      const order = orderList.map(item => ({
        name: item.user.userName,
        address: item.shippingAddress,
        phone: item.user.userPhone,
        _id: item._id,
        date: item.createdAt,
        totalAmount: item.totalAmount,
        orderStatus: item.orderStatus,
      }));
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;