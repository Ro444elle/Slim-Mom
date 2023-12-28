const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");

const {
  createIntakeProfileController,
  createUserController,
  loginUserController,
  logoutUserController,
  verifyEmailController,
  resendVerificationEmailController,
} = require("../controllers/userController");

router.post("/", createIntakeProfileController);
router.post("/calculator", auth, createIntakeProfileController);
router.post("/signup", createUserController);
router.post("/login", loginUserController);
router.post("/logout", auth, logoutUserController);
router.get("/verify/:verificationToken", verifyEmailController);
router.post("/verify/", resendVerificationEmailController);

module.exports = router;
