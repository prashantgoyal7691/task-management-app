const Task = require("../models/Task");

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await Task.create({
      title,
      description,
      dueDate,
      user: req.user.id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all tasks of logged-in user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user.id,
      abandoned: false,
      completedAt: null,
    }).sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    task.abandoned = true;
    await task.save();

    res.status(200).json({ message: "Task abandoned", id: task._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const completeTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Mark completed (archive)
    task.completedAt = new Date();
    task.abandoned = false;

    await task.save();
    res.status(200).json({ message: "Task archived as completed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update task status
// @route   PUT /api/tasks/:id
// @access  Private
const updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (req.body.dueDate !== undefined) {
      task.dueDate = req.body.dueDate || null;
    }

    if (req.body.action === "next") {
      if (task.status === "Todo") {
        task.status = "In Progress";
      } else if (task.status === "In Progress") {
        task.status = "Done";
        task.abandoned = false;
        task.completedAt = new Date();
      }
    }

    await task.save();
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTaskHistory = async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user.id,
      $or: [{ status: "Done" }, { abandoned: true }],
    }).sort({ completedAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTaskStatus,
  deleteTask,
  getTaskHistory,
  completeTask,
};
