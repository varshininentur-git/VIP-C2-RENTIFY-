const express = require("express");
const router = express.Router();
const Property = require("../models/Property");

// =======================
// ADD PROPERTY
// POST /api/property/add
// =======================
router.post("/add", async (req, res) => {
  try {
    const property = new Property(req.body);
    const savedProperty = await property.save();

    res.status(201).json({
      message: "Property added successfully",
      data: savedProperty,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding property",
      error: error.message,
    });
  }
});

// =======================
// GET ALL PROPERTIES
// GET /api/property
// =======================
router.get("/", async (req, res) => {
  try {
    const properties = await Property.find();

    res.status(200).json({
      message: "Properties fetched successfully",
      data: properties,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching properties",
      error: error.message,
    });
  }
});

module.exports = router;