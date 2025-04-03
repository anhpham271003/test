const mongoose = require("mongoose");

const OriginSchema = new mongoose.Schema(
  {
    nameOrigin: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamp: true }
);

module.exports = mongoose.model("Origin", OriginSchema);
