const authMiddleware = (req, res, next) => {
  console.log("Authentication Middleware");

  next();
};

module.exports = authMiddleware;