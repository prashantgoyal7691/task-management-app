const User = require("../models/User");
const admin = require("../config/firebaseAdmin");
const jwt = require("jsonwebtoken");

/* =========================
   GOOGLE LOGIN (FIREBASE)
========================= */
const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    const decoded = await admin.auth().verifyIdToken(token);
    const { email, name } = decoded;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        password: "GOOGLE_AUTH",
      });
    }

    const appToken = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token: appToken });
  } catch (error) {
    res.status(401).json({ message: "Google authentication failed" });
  }
};

module.exports = {
  googleLogin,
};