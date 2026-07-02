const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user.model");
const OTP = require("../models/otp.model");
const RefreshToken = require("../models/refresh-token.model");

const generateOTP = require("../utils/generate-otp");
const ApiError = require("../utils/ApiError");

const {
  generateAccessToken,
  generateRefreshToken
} = require("./token.service");

const {
  sendOTP
} = require("./email.service");

exports.register = async (data) => {
  const { fullName, email, password } = data;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(400, "Email already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    fullName,
    email,
    password: hashedPassword
  });

  const otp = generateOTP();

  await OTP.create({
    email,
    code: otp,
    type: "REGISTER",
    expiresAt: new Date(Date.now() + 5 * 60 * 1000)
  });

  await sendOTP(email, otp);

  return {
    success: true,
    message: "OTP sent to email"
  };
};

exports.verifyEmail = async (data) => {
  const { email, code } = data;

  const otpRecord = await OTP.findOne({
    email,
    code,
    type: "REGISTER"
  });

  if (!otpRecord) {
    throw new ApiError(400, "Invalid OTP");
  }

  if (otpRecord.expiresAt < new Date()) {
    throw new ApiError(400, "OTP expired");
  }

  await User.updateOne(
    { email },
    { isVerified: true }
  );

  await OTP.deleteOne({
    _id: otpRecord._id
  });

  return {
    success: true,
    message: "Email verified"
  };
};

exports.login = async (data) => {
  const { email, password } = data;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!user.isVerified) {
    throw new ApiError(400, "Email not verified");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new ApiError(401, "Invalid password");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  await RefreshToken.create({
    userId: user._id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  });

  return {
    success: true,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email
    },
    accessToken,
    refreshToken
  };
};

exports.forgotPassword = async (data) => {
  const { email } = data;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const otp = generateOTP();

  await OTP.create({
    email,
    code: otp,
    type: "FORGOT_PASSWORD",
    expiresAt: new Date(Date.now() + 5 * 60 * 1000)
  });

  await sendOTP(email, otp);

  return {
    success: true,
    message: "OTP sent"
  };
};

exports.verifyForgotPassword = async (data) => {
  const { email, code } = data;

  const otpRecord = await OTP.findOne({
    email,
    code,
    type: "FORGOT_PASSWORD"
  });

  if (!otpRecord) {
    throw new ApiError(400, "Invalid OTP");
  }

  if (otpRecord.expiresAt < new Date()) {
    throw new ApiError(400, "OTP expired");
  }

  return {
    success: true,
    message: "OTP verified"
  };
};

exports.resetPassword = async (data) => {
  const { email, newPassword } = data;

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await User.updateOne(
    { email },
    { password: hashedPassword }
  );

  await OTP.deleteMany({
    email,
    type: "FORGOT_PASSWORD"
  });

  return {
    success: true,
    message: "Password updated"
  };
};

exports.changePassword = async (userId, data) => {
  const { oldPassword, newPassword } = data;

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);

  if (!isMatch) {
    throw new ApiError(400, "Old password incorrect");
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  return {
    success: true,
    message: "Password changed"
  };
};

exports.refreshToken = async (data) => {
  const { refreshToken } = data;

  const tokenRecord = await RefreshToken.findOne({
    token: refreshToken
  });

  if (!tokenRecord) {
    throw new ApiError(401, "Invalid refresh token");
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const accessToken = generateAccessToken(user);

  return {
    success: true,
    accessToken
  };
};

exports.logout = async (data) => {
  const { refreshToken } = data;

  await RefreshToken.deleteOne({
    token: refreshToken
  });

  return {
    success: true,
    message: "Logout successful"
  };
};