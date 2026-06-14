const Favorite = require("../models/FavoriteSchema");
const Property = require("../models/PropertySchema");

// Add property to favorites
const addToFavorites = async (req, res) => {
  try {
    const { propertyId } = req.body;

    if (!propertyId) {
      return res.status(400).json({
        message: "Please provide propertyId",
      });
    }

    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    // Check if already in favorites
    const existingFavorite = await Favorite.findOne({
      user: req.user.id,
      property: propertyId,
    });

    if (existingFavorite) {
      return res.status(400).json({
        message: "This property is already in your favorites",
      });
    }

    const favorite = await Favorite.create({
      user: req.user.id,
      property: propertyId,
    });

    const populatedFavorite = await favorite.populate("property");

    res.status(201).json({
      message: "Property added to favorites",
      favorite: populatedFavorite,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Remove property from favorites
const removeFromFavorites = async (req, res) => {
  try {
    const { propertyId } = req.body;

    if (!propertyId) {
      return res.status(400).json({
        message: "Please provide propertyId",
      });
    }

    const favorite = await Favorite.findOne({
      user: req.user.id,
      property: propertyId,
    });

    if (!favorite) {
      return res.status(404).json({
        message: "This property is not in your favorites",
      });
    }

    await Favorite.findByIdAndDelete(favorite._id);

    res.status(200).json({
      message: "Property removed from favorites",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get user's favorite properties
const getUserFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user.id })
      .populate({
        path: "property",
        select: "title address city rent image availability propertyType bedrooms bathrooms",
      })
      .sort({ createdAt: -1 });

    const properties = favorites.map((fav) => fav.property);

    res.status(200).json({
      count: properties.length,
      favorites: properties,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Check if property is in user's favorites
const isFavorite = async (req, res) => {
  try {
    const { propertyId } = req.params;

    if (!propertyId) {
      return res.status(400).json({
        message: "Please provide propertyId",
      });
    }

    const favorite = await Favorite.findOne({
      user: req.user.id,
      property: propertyId,
    });

    res.status(200).json({
      isFavorite: !!favorite,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addToFavorites,
  removeFromFavorites,
  getUserFavorites,
  isFavorite,
};
