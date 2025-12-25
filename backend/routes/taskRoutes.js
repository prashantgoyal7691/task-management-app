const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  createTask,
  getTasks,
  updateTaskStatus,
  deleteTask,
  getTaskHistory,
  completeTask,
} = require("../controllers/taskController");

const router = express.Router();

router.route("/")
  .get(protect, getTasks)
  .post(protect, createTask);



router.get("/history", protect, getTaskHistory);
router.put("/:id/complete", protect, completeTask);
router.put("/:id", protect, updateTaskStatus);
router.delete("/:id", protect, deleteTask);

module.exports = router;