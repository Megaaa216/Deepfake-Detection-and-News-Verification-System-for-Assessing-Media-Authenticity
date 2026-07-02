const { body } = require("express-validator");

const register = [
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required"),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
];

const verifyEmail = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address"),
  body("code")
    .trim()
    .notEmpty()
    .withMessage("Verification code is required")
];

const login = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
];

const forgotPassword = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address")
];

const verifyForgotPassword = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address"),
  body("code")
    .trim()
    .notEmpty()
    .withMessage("Verification code is required")
];

const resetPassword = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address"),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long")
];

const changePassword = [
  body("oldPassword")
    .notEmpty()
    .withMessage("Old password is required"),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long")
];

const refreshToken = [
  body("refreshToken")
    .trim()
    .notEmpty()
    .withMessage("Refresh token is required")
];

const logout = [
  body("refreshToken")
    .trim()
    .notEmpty()
    .withMessage("Refresh token is required")
];

module.exports = {
  register,
  verifyEmail,
  login,
  forgotPassword,
  verifyForgotPassword,
  resetPassword,
  changePassword,
  refreshToken,
  logout
};
