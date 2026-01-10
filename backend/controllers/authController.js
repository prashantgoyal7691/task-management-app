const User = require("../models/User");
const bcrypt = require("bcryptjs");
const admin = require("../config/firebaseAdmin");
const jwt = require("jsonwebtoken");

/* =========================
   REGISTER (EMAIL/PASSWORD)
========================= */
const signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name || email.split("@")[0],
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   LOGIN (EMAIL/PASSWORD)
========================= */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let user = await User.findOne({ email });

    // 🔹 IF USER DOES NOT EXIST → CREATE ACCOUNT
    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10);

      user = await User.create({
        name: email.split("@")[0], // simple default name
        email,
        password: hashedPassword,
      });
    }

    // 🔹 CHECK PASSWORD
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 🔹 ISSUE JWT
    const token = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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
  signupUser,
  loginUser,
  googleLogin,
};