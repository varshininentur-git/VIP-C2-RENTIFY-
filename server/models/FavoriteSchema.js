const mongoose = require("mongoose");

const FavoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure a user can only add a property to favorites once
FavoriteSchema.index({ user: 1, property: 1 }, { unique: true });

module.exports = mongoose.model("Favorite", FavoriteSchema);
