const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Admin only - Get all students
router.get(
  "/students",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const students = await User.find({ role: "student" });
      res.json(students);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;