const mongoose = require("mongoose");

const UnitSchema = new mongoose.Schema(
  {
    nameUnit: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamp: true }
);

module.exports = mongoose.model("Unit", UnitSchema);
