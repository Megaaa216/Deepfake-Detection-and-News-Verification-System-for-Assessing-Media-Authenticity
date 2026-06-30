const mongoose = require("mongoose");
const config = require("./config");
const logger = require("../utils/logger");

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoose.url);
    logger.info("MongoDB Connected successfully");
  } catch (error) {
    logger.error("MongoDB Connection Error: ", error);
    process.exit(1);
  }
};

module.exports = connectDB;