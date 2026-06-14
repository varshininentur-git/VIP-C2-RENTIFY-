const Property = require("../models/PropertySchema");

// Add a new property (Owner/Landlord only)
const addProperty = async (req, res) => {
  try {
    const { title, description, address, city, rent, bedrooms, bathrooms, furnishing, parking, contactNumber, propertyType, image } = req.body;

    // Validation
    if (!title || !description || !address || !city || !rent || !bedrooms || !bathrooms || !contactNumber || !propertyType) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    const property = await Property.create({
      title,
      description,
      address,
      city,
      rent,
      bedrooms,
      bathrooms,
      furnishing: furnishing || "Unfurnished",
      parking: parking || false,
      contactNumber,
      propertyType,
      image: image || "",
      owner: req.user.id,
      availability: true,
    });

    res.status(201).json({
      message: "Property added successfully",
      property,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get all properties with search and filter
const getAllProperties = async (req, res) => {
  try {
    const { city, minRent, maxRent, propertyType, furnishing, bedrooms } = req.query;
    let query = { availability: true };

    // Filter by city
    if (city) {
      query.city = { $regex: city, $options: "i" };
    }

    // Filter by rent range
    if (minRent || maxRent) {
      query.rent = {};
      if (minRent) query.rent.$gte = parseInt(minRent);
      if (maxRent) query.rent.$lte = parseInt(maxRent);
    }

    // Filter by property type
    if (propertyType) {
      query.propertyType = propertyType;
    }

    // Filter by furnishing
    if (furnishing) {
      query.furnishing = furnishing;
    }

    // Filter by bedrooms
    if (bedrooms) {
      query.bedrooms = parseInt(bedrooms);
    }

    const properties = await Property.find(query).populate("owner", "name phone email");

    res.status(200).json({
      count: properties.length,
      properties,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get property by ID
const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await Property.findById(id).populate("owner", "name phone email");

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get properties by owner
const getOwnerProperties = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user.id });

    res.status(200).json({
      count: properties.length,
      properties,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Edit property (Owner only)
const editProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, address, city, rent, bedrooms, bathrooms, furnishing, parking, contactNumber, propertyType, image, availability } = req.body;

    // Check if property exists
    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    // Check if user is the owner
    if (property.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized. You can only edit your own properties",
      });
    }

    // Update property
    const updatedProperty = await Property.findByIdAndUpdate(
      id,
      {
        title: title || property.title,
        description: description || property.description,
        address: address || property.address,
        city: city || property.city,
        rent: rent || property.rent,
        bedrooms: bedrooms || property.bedrooms,
        bathrooms: bathrooms || property.bathrooms,
        furnishing: furnishing || property.furnishing,
        parking: parking !== undefined ? parking : property.parking,
        contactNumber: contactNumber || property.contactNumber,
        propertyType: propertyType || property.propertyType,
        image: image || property.image,
        availability: availability !== undefined ? availability : property.availability,
      },
      { new: true }
    );

    res.status(200).json({
      message: "Property updated successfully",
      property: updatedProperty,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete property (Owner only)
const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if property exists
    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    // Check if user is the owner
    if (property.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized. You can only delete your own properties",
      });
    }

    await Property.findByIdAndDelete(id);

    res.status(200).json({
      message: "Property deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addProperty,
  getAllProperties,
  getPropertyById,
  getOwnerProperties,
  editProperty,
  deleteProperty,
};