const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

const {
  addToFavorites,
  removeFromFavorites,
  getUserFavorites,
  isFavorite,
} = require("../controllers/favoriteController");

// Protected Routes - Authentication required
router.post("/", authMiddleware, addToFavorites); // Add property to favorites

router.delete("/", authMiddleware, removeFromFavorites); // Remove from favorites

router.get("/", authMiddleware, getUserFavorites); // Get user's favorite properties

router.get("/:propertyId/check", authMiddleware, isFavorite); // Check if property is favorite

module.exports = router;
