const { validationResult } = require("express-validator");
const ApiError = require("../utils/ApiError");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Map the error messages
    const errorMessage = errors.array().map((err) => err.msg).join(", ");
    return next(new ApiError(400, errorMessage));
  }
  next();
};

module.exports = validate;
