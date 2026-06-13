const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    type: { type: String }, // rent / sale
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", propertySchema);