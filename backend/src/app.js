const express = require("express");
const cors = require("cors");
const apiRouter = require("./routes");
const errorHandler = require("./middlewares/error.middleware");
const ApiError = require("./utils/ApiError");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Centralized API routes
app.use("/api", apiRouter);

// Unhandled route handler (404)
app.use((req, res, next) => {
  next(new ApiError(404, "Not Found"));
});

// Global error handler
app.use(errorHandler);

module.exports = app;