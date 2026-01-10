const express = require("express");
const router = express.Router();
const {
  signupUser,
  loginUser,
  googleLogin,
} = require("../controllers/authController");

router.post("/signin", loginUser);
router.post("/signup", signupUser);
router.post("/google", googleLogin);

module.exports = router;