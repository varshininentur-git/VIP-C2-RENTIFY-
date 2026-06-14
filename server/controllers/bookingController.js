const Booking = require("../models/BookingSchema");
const Property = require("../models/PropertySchema");

// Create a booking/inquiry request (Tenant)
const createBooking = async (req, res) => {
  try {
    const { propertyId, visitDate } = req.body;

    if (!propertyId || !visitDate) {
      return res.status(400).json({
        message: "Please provide propertyId and visitDate",
      });
    }

    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        message: "Property not found",
      });
    }

    // Check if user already has a pending booking for this property
    const existingBooking = await Booking.findOne({
      user: req.user.id,
      property: propertyId,
      status: "Pending",
    });

    if (existingBooking) {
      return res.status(400).json({
        message: "You already have a pending booking for this property",
      });
    }

    const booking = await Booking.create({
      user: req.user.id,
      property: propertyId,
      visitDate: new Date(visitDate),
      status: "Pending",
    });

    const populatedBooking = await booking.populate("user", "name email phone").populate("property", "title address rent");

    res.status(201).json({
      message: "Booking request created successfully",
      booking: populatedBooking,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get user's bookings
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("property", "title address city rent image")
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get owner's inquiries for their properties
const getOwnerInquiries = async (req, res) => {
  try {
    // Get all properties owned by this user
    const properties = await Property.find({ owner: req.user.id });
    const propertyIds = properties.map((p) => p._id);

    // Get all bookings for these properties
    const inquiries = await Booking.find({ property: { $in: propertyIds } })
      .populate("property", "title address rent image")
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: inquiries.length,
      inquiries,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get single booking details
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id)
      .populate("property")
      .populate("user", "name email phone");

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Check if user is owner of property or user who made booking
    if (booking.user._id.toString() !== req.user.id && booking.property.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized. You can only view your own bookings or inquiries",
      });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update booking status (Owner only)
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !["Pending", "Approved", "Rejected"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Must be one of: Pending, Approved, Rejected",
      });
    }

    const booking = await Booking.findById(id).populate("property");

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Check if user is the owner of the property
    if (booking.property.owner.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized. Only property owner can update booking status",
      });
    }

    booking.status = status;
    await booking.save();

    const updatedBooking = await booking.populate("property", "title address rent image").populate("user", "name email phone");

    res.status(200).json({
      message: "Booking status updated successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Cancel booking (User only)
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Check if user is the one who created the booking
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized. You can only cancel your own bookings",
      });
    }

    // Can only cancel pending bookings
    if (booking.status !== "Pending") {
      return res.status(400).json({
        message: "You can only cancel pending bookings",
      });
    }

    await Booking.findByIdAndDelete(id);

    res.status(200).json({
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getOwnerInquiries,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
};
