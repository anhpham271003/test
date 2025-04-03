const mongoose = require("mongoose");

const ManufacturerSchema = new mongoose.Schema(
  {
    nameManufacturer: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamp: true }
);

module.exports = mongoose.model("Manufacturer", ManufacturerSchema);
