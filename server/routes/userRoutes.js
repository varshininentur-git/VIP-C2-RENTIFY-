const express = require("express");

const {
  signup,
  login,
  getProperties,
} = require("../controllers/userController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/properties", getProperties);

module.exports = router;