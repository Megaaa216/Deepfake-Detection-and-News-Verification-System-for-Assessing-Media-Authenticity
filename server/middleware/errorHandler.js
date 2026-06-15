const logger = require('../utils/logger');

/**
 * Centralized error handler. Logs the error and returns a JSON payload.
 * In development, the stack trace is included in the response for debugging.
 */
module.exports = (err, req, res, next) => {
  logger.error(err.stack || err.message || err);
  const status = err.status || 500;
  const payload = { error: err.message || 'Internal Server Error' };
  if (process.env.NODE_ENV === 'development') payload.stack = err.stack;
  res.status(status).json(payload);
};
