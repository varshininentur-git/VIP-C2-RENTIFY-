const Property = require("../models/PropertySchema");

const addProperty = async (req, res) => {
  try {
    const property = await Property.create(req.body);

    res.status(201).json({
      message: "Property Added Successfully",
      property,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find();

    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addProperty,
  getAllProperties,
};