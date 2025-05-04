
// const express = require("express");
// const router = express.Router();
// const Order = require("../models/Order");

// // POST /api/checkout
// router.post("/", async (req, res) => {
//   try {
//     const { userId, items, address, shippingMethod, shippingFee, finalTotal, selectedPaymentMethod } = req.body;

//     const order = new Order({
//       // orderId: uuidv4(),
//       // userId,
//       items: items.map(item => ({
//         product: item._id,
//         name: item.name,
//         quantity: item.quantity,
//         unitPrice: item.unitPrice
//       })),
//       amount: finalTotal,
//       status: selectedPaymentMethod === 'paypal' || selectedPaymentMethod === 'vnpay' ? 'paid' : 'pending',
//     });

//     const savedOrder = await order.save();
//     res.status(201).json({ success: true, order: savedOrder });
//   } catch (error) {
//     console.error("❌ Lỗi khi tạo đơn hàng:", error);
//     res.status(500).json({ success: false, message: "Lỗi server" });
//   }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Order = require("../models/Order");
const CartProduct = require("../models/CartProduct");

// POST /api/checkout
router.post("/", async (req, res) => {
  
  try {
    const {
      userId,
      orderItems,       // từ Checkout.js: cartItems.map...
      shippingAddress,  // là string địa chỉ, không phải object
      paymentMethod,
      shippingPrice,
      totalPrice,
      isPaid,
      paidAt,
      orderStatus
    } = req.body;

    const order = new Order({
      user: userId,
      orderDetails: orderItems.map(item => ({
        product: item.productId,
        productName: item.name,
        productImage: item.productImage, 
        quantity: item.quantity,
        unitPrice: item.price,
        totalPrice: item.quantity * item.price
      })),
      totalAmount: totalPrice,
      shippingPrice,
      shippingAddress: {
        fullAddress: shippingAddress // đơn giản hóa
      },
      paymentMethod,
      paymentStatus: isPaid ? "completed" : "pending",
      paidAt: isPaid ? paidAt : null,
      orderStatus
      }
    );

    const savedOrder = await order.save();
    console.log(userId);
    console.log("🛒 Danh sách productId để xóa:", orderItems.map(item => item.cartId));
    await CartProduct.deleteMany({
      userId: userId,
      _id: { $in: orderItems.map(item => item.cartId) }
    });
    res.status(201).json({ success: true, order: savedOrder });
  } catch (error) {
    console.error("❌ Lỗi khi tạo đơn hàng:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
});

module.exports = router;
