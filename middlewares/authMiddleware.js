const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");

const authenticate = asyncHandler(async (req, res, next) => {
  let token;
  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized.");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized. There is no token.");
  }
});

const authorizedAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({ message: "Not authorized as an admin." });
  }
};

module.exports = { authenticate, authorizedAdmin };
