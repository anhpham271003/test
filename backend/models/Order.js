// // models/Order.js
// const mongoose = require('mongoose');

// const OrderSchema = new mongoose.Schema({
//   // userId: { type: String, required: true },
//   items: [
//     {
//       product: String, // hoặc ObjectId nếu bạn dùng ref
//       name: String,
//       quantity: Number,
//       unitPrice: Number,
//     },
//   ],
//   amount: Number,
//   status: { type: String, default: 'pending' }, // 'pending', 'paid'
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model('Order', OrderSchema);

const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderDetails: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        productName: { type: String, required: true }, // Lưu tên sản phẩm tại thời điểm đặt hàng
        productImage: { type: String, required: true }, // Lưu ảnh sản phẩm
        quantity: { type: Number, required: true, min: 1 },
        unitPrice: { type: Number, required: true }, // Lưu giá tại thời điểm đặt hàng
        totalPrice: { type: Number, required: true }, // = quantity * unitPrice
      },
    ],
    totalAmount: { type: Number, required: true }, // Tổng tiền của đơn hàng
    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "vnpay", "paypal"],
      default: "cod",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
    shippingAddress: {
      fullAddress: { type: String, required: true },
      // phoneNumber: { type: String, required: true },
      // address: { type: String, required: true },
      // city: { type: String, required: true },
      // country: { type: String, required: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
