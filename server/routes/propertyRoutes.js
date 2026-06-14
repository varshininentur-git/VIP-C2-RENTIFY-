const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const cloudinary = require("../config/cloudinary");
const authMiddleware = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");

const {
  addProperty,
  getAllProperties,
  getPropertyById,
  getOwnerProperties,
  editProperty,
  deleteProperty,
} = require("../controllers/propertyController");

// Test Route
router.get("/test", (req, res) => {
  res.send("Property route working");
});

// Upload Image Route
router.post("/upload-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Error:", error);

          return res.status(500).json({
            message: error.message,
          });
        }

        return res.status(200).json({
          success: true,
          imageUrl: result.secure_url,
        });
      }
    );

    stream.end(req.file.buffer);
  } catch (err) {
    console.error("Upload Error:", err);

    return res.status(500).json({
      message: err.message,
    });
  }
});

// Public Routes - No authentication required
router.get("/", getAllProperties); // Get all available properties with filters

// Owner-specific route should be declared before parameterized routes
router.get("/owner/my-properties", authMiddleware, authorize(["owner"]), getOwnerProperties); // Get owner's properties

router.get("/:id", getPropertyById); // Get single property details

// Protected Routes - Authentication required
router.post("/", authMiddleware, authorize(["owner"]), addProperty); // Add new property (Owner only)

router.put("/:id", authMiddleware, authorize(["owner"]), editProperty); // Edit property (Owner only)

router.delete("/:id", authMiddleware, authorize(["owner"]), deleteProperty); // Delete property (Owner only)

router.get("/owner/my-properties", authMiddleware, authorize(["owner"]), getOwnerProperties); // Get owner's properties

module.exports = router;