const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    user: String,
    property: String,
    bookingDate: Date,
    status: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Booking", BookingSchema);