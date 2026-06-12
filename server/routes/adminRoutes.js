const express = require("express");

const {
  getAllUsers,
  manageProperties,
  manageBookings,
} = require("../controllers/adminController");

const router = express.Router();

router.get("/users", getAllUsers);
router.get("/properties", manageProperties);
router.get("/bookings", manageBookings);

module.exports = router;