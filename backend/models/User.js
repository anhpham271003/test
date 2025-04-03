const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    userName: { type: String },
    userEmail: { type: String },
    userNameAccount: { type: String },
    userPassword: { type: String },
    userPhone: { type: Number },
    userBirthday: { type: Date },
    userGender: { type: String },
    userRole: { type: String },
    userStatus: { type: String },
    userPoint: { type: Number },
    userAvatar: {
      link: { type: String },
      alt: { type: String },
    },
    cart: {
      type: [
        {
          product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
          quantity: { type: Number, default: 1 },
          unitPrice: { type: Number, default: 0 },
        },
      ],
      default: [], // Mặc định giỏ hàng là mảng rỗng
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
