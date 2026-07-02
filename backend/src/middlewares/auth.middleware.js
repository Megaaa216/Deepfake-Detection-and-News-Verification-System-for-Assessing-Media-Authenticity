const jwt = require("jsonwebtoken");
const config = require("../config/config");
const ApiError = require("../utils/ApiError");

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(new ApiError(401, "Unauthorized"));
  }

  try {
    req.user = jwt.verify(token, config.jwt.accessSecret);
    next();
  } catch (error) {
    return next(new ApiError(401, "Invalid Token"));
  }
};