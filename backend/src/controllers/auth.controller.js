const authService = require("../services/auth.service");
const asyncHandler = require("../utils/asyncHandler");

exports.register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  return res.status(201).json(result);
});

exports.verifyEmail = asyncHandler(async (req, res) => {
  const result = await authService.verifyEmail(req.body);
  return res.status(200).json(result);
});

exports.login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  return res.status(200).json(result);
});

exports.forgotPassword = asyncHandler(async (req, res) => {
  const result = await authService.forgotPassword(req.body);
  return res.status(200).json(result);
});

exports.verifyForgotPassword = asyncHandler(async (req, res) => {
  const result = await authService.verifyForgotPassword(req.body);
  return res.status(200).json(result);
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const result = await authService.resetPassword(req.body);
  return res.status(200).json(result);
});

exports.changePassword = asyncHandler(async (req, res) => {
  const result = await authService.changePassword(
    req.user.id,
    req.body
  );
  return res.status(200).json(result);
});

exports.refreshToken = asyncHandler(async (req, res) => {
  const result = await authService.refreshToken(req.body);
  return res.status(200).json(result);
});

exports.logout = asyncHandler(async (req, res) => {
  const result = await authService.logout(req.body);
  return res.status(200).json(result);
});