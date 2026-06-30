const express = require("express");
const cors = require("cors");
const apiRouter = require("./routes");
const errorHandler = require("./middlewares/error.middleware");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// Serve processed face crop frames statically from Python service's folder
app.use("/processed-frames", express.static(path.join(__dirname, "../../ai_service/processed_frames")));

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