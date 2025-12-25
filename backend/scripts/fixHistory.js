require("dotenv").config();
const mongoose = require("mongoose");
const Task = require("../models/Task");

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const result = await Task.updateMany(
      { status: "Done" },
      { $set: { abandoned: false } }
    );

    console.log("✔ Fixed documents:", result.modifiedCount);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();