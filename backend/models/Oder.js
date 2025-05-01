// models/Order.js
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  items: [
    {
      product: String, // hoặc ObjectId nếu bạn dùng ref
      name: String,
      quantity: Number,
      unitPrice: Number,
    },
  ],
  amount: Number,
  status: { type: String, default: 'pending' }, // 'pending', 'paid'
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', OrderSchema);
