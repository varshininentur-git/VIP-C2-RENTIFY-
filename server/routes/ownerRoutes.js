const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");

const {
  getOwnerInquiries,
  updateBookingStatus,
} = require("../controllers/bookingController");

// Protected Routes - Owner only
router.get("/inquiries", authMiddleware, authorize(["owner"]), getOwnerInquiries); // Get all inquiries for owner's properties

router.patch("/inquiries/:id/status", authMiddleware, authorize(["owner"]), updateBookingStatus); // Update booking status

module.exports = router;