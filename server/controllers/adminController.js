const getAllUsers = (req, res) => {
  res.json({ message: "All Users" });
};

const manageProperties = (req, res) => {
  res.json({ message: "Manage Properties" });
};

const manageBookings = (req, res) => {
  res.json({ message: "Manage Bookings" });
};

module.exports = {
  getAllUsers,
  manageProperties,
  manageBookings,
};