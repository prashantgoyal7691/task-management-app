require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const Task = require("../models/Task");

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await User.deleteMany({});
    await Task.deleteMany({});

    console.log("✅ All users and tasks deleted successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Error resetting database:", err);
    process.exit(1);
  }
})();