const express = require("express");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const authValidator = require("../validators/auth.validator");
const validate = require("../middlewares/validate.middleware");

const router = express.Router();

router.post(
  "/register",
  authValidator.register,
  validate,
  authController.register
);

router.post(
  "/verify-email",
  authValidator.verifyEmail,
  validate,
  authController.verifyEmail
);

router.post(
  "/login",
  authValidator.login,
  validate,
  authController.login
);

router.post(
  "/forgot-password",
  authValidator.forgotPassword,
  validate,
  authController.forgotPassword
);

router.post(
  "/verify-forgot-password",
  authValidator.verifyForgotPassword,
  validate,
  authController.verifyForgotPassword
);

router.post(
  "/reset-password",
  authValidator.resetPassword,
  validate,
  authController.resetPassword
);

router.post(
  "/refresh-token",
  authValidator.refreshToken,
  validate,
  authController.refreshToken
);

router.post(
  "/logout",
  authValidator.logout,
  validate,
  authController.logout
);

router.post(
  "/change-password",
  authMiddleware,
  authValidator.changePassword,
  validate,
  authController.changePassword
);

module.exports = router;
