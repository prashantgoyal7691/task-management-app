const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://task-management-app-fae5c.web.app",
      "https://task-management-app-fae5c.firebaseapp.com",
    ],
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Task Manager Backend Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
connectDB();

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});