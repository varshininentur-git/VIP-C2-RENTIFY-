const express = require("express");

const {
  addProperty,
  updateProperty,
  deleteProperty,
} = require("../controllers/ownerController");

const router = express.Router();

router.post("/add-property", addProperty);
router.put("/update-property/:id", updateProperty);
router.delete("/delete-property/:id", deleteProperty);

module.exports = router;