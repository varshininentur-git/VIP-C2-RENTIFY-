const addProperty = (req, res) => {
  res.json({ message: "Add Property" });
};

const updateProperty = (req, res) => {
  res.json({ message: "Update Property" });
};

const deleteProperty = (req, res) => {
  res.json({ message: "Delete Property" });
};

module.exports = {
  addProperty,
  updateProperty,
  deleteProperty,
};