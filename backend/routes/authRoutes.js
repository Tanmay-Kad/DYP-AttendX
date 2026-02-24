const express = require("express");
const router = express.Router();

const { 
  register, 
  login, 
  getTeachers, 
  getMe 
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Register Route
router.post("/register", register);

// Login Route
router.post("/login", login);

// Get Logged-in User
router.get("/me", authMiddleware, getMe);

// Admin Only - Get Teachers
router.get(
  "/teachers",
  authMiddleware,
  roleMiddleware("admin"),
  getTeachers
);

module.exports = router;