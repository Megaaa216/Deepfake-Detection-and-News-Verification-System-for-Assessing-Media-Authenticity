const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: String,

  code: String,

  type: {
    type: String,
    enum: ["REGISTER", "FORGOT_PASSWORD"]
  },

  expiresAt: Date
});

module.exports = mongoose.model("OTP", otpSchema);