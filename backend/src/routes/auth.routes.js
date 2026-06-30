const router = require("express").Router();

const authController =
  require("../controllers/auth.controller");

const authMiddleware =
  require("../middlewares/auth.middleware");

router.post("/register", authController.register);

router.post(
  "/verify-email",
  authController.verifyEmail
);

router.post("/login", authController.login);

router.post(
  "/forgot-password",
  authController.forgotPassword
);

router.post(
  "/verify-forgot-password",
  authController.verifyForgotPassword
);

router.post(
  "/reset-password",
  authController.resetPassword
);

router.post(
  "/refresh-token",
  authController.refreshToken
);

router.post("/logout", authController.logout);

router.post(
  "/change-password",
  authMiddleware,
  authController.changePassword
);

module.exports = router;