const mongoose = require("mongoose");

const ReviewImgSchema = new mongoose.Schema({
  link: String,
  alt: String,
});

const ReviewSchema = new mongoose.Schema({
  product_id: mongoose.Schema.Types.ObjectId,
  product_variant_id: mongoose.Schema.Types.ObjectId,
  user_id: mongoose.Schema.Types.ObjectId,
  user_name: String,
  user_avatar: String,
  review_rating: Number,
  review_content: String,
  review_imgs: [ReviewImgSchema],
  review_videos: [String],
  createdAt: Date,
  updatedAt: Date,
});

module.exports = mongoose.model("Review", ReviewSchema);
