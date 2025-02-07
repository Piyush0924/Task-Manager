const { TaskModel } = require("../models/Task");

// Get all tasks for a user
const getAllTasks = async (req, res) => {
  try {

    const { user } = req.body;
    const tasks = await TaskModel.find({ user });
    res.json({ success: true, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Add a new task
const addTask = async (req, res) => {
  try {
    console.log('addtask',req.body)
    const { title, description, status, priority, dueDate, user } = req.body;
    if (!title || !user) {
      return res.status(400).json({ success: false, message: "Title and user are required" });
    }
    const newTask = new TaskModel({ title, description, status, priority, dueDate, user });
    await newTask.save();
    res.json({ success: true, message: "Task added successfully", task: newTask });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const { _id } = req.body;
    if (!_id) {
      return res.status(400).json({ success: false, message: "Task ID is required" });
    }
    const result = await TaskModel.findByIdAndDelete(_id);
    if (!result) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }
    res.json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Update a task
const updateTask = async (req, res) => {
  try {
    const { _id, title, description, status, priority, dueDate } = req.body;
    if (!_id) {
      return res.status(400).json({ success: false, message: "Task ID is required" });
    }
    const updatedTask = await TaskModel.findByIdAndUpdate(
      _id,
      { title, description, status, priority, dueDate },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }
    res.json({ success: true, message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = { getAllTasks, addTask, deleteTask, updateTask };
