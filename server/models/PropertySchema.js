const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema(
  {
    title: String,
    address: String,
    price: Number,
    propertyType: String,
    owner: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Property", PropertySchema);