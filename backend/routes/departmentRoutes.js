const express = require("express");
const router = express.Router();

const { createDepartment, getDepartments } = require("../controllers/departmentController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Get All Departments (Logged-in users)
router.get("/", authMiddleware, getDepartments);

// Admin Only - Create Department
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createDepartment
);

module.exports = router;