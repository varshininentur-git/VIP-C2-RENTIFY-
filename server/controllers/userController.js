const signup = (req, res) => {
  res.json({ message: "User Signup" });
};

const login = (req, res) => {
  res.json({ message: "User Login" });
};

const getProperties = (req, res) => {
  res.json({ message: "View Properties" });
};

module.exports = {
  signup,
  login,
  getProperties,
};