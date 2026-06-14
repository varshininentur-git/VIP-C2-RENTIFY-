const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");

const {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
} = require("../controllers/bookingController");

// Protected Routes - Authentication required
router.post("/", authMiddleware, authorize(["user"]), createBooking); // Create booking request

router.get("/", authMiddleware, getUserBookings); // Get user's bookings

router.get("/:id", authMiddleware, getBookingById); // Get booking details

router.delete("/:id", authMiddleware, cancelBooking); // Cancel booking

module.exports = router;
