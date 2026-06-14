// Role-based authorization middleware
const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Access denied. Authentication required.",
      });
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required role: ${roles.join(", ")}`,
      });
    }

    next();
  };
};

module.exports = authorize;
