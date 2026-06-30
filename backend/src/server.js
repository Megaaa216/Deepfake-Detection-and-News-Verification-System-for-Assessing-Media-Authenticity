require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/database");
const config = require("./config/config");
const logger = require("./utils/logger");

let server;

// Connect to Database and start server
connectDB().then(() => {
  server = app.listen(config.port, () => {
    logger.info(`Server running on port ${config.port} in ${config.env} mode`);
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info("Server closed gracefully");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error("Unexpected error caught:", error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  logger.info("SIGTERM received, closing server");
  if (server) {
    server.close();
  }
});