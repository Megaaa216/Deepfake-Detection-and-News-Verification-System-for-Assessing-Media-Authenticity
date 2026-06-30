const express = require("express");
const authRoute = require("./auth.route");
const detectionRoute = require("./detection.route");

const router = express.Router();

router.use("/auth", authRoute);
router.use("/detection", detectionRoute);

module.exports = router;
