const ApiError = require("../utils/ApiError");
const logger = require("../utils/logger");
const config = require("../config/config");

const errorHandler = (err, req, res, next) => {
  let error = err;

  // If the error is not an instance of ApiError, instantiate one
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    error = new ApiError(statusCode, message, false, err.stack);
  }

  const { statusCode, message } = error;

  // Log the error
  logger.error(`${req.method} ${req.originalUrl} - ${message}`, error);

  const response = {
    success: false,
    message,
    ...(config.env === "development" && { stack: error.stack })
  };

  res.status(statusCode).send(response);
};

module.exports = errorHandler;
