const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    rent: {
      type: Number,
      required: true,
    },

    bedrooms: {
      type: Number,
      required: true,
    },

    bathrooms: {
      type: Number,
      required: true,
    },

    furnishing: {
      type: String,
      enum: ["Fully Furnished", "Semi Furnished", "Unfurnished"],
    },

    parking: {
      type: Boolean,
      default: false,
    },

    contactNumber: {
      type: String,
      required: true,
    },

    propertyType: {
      type: String,
      enum: ["Apartment", "House", "Villa", "PG"],
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    availability: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Property", PropertySchema);