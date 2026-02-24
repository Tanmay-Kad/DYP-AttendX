const express = require("express");
const router = express.Router();

const { createYear, getYears } = require("../controllers/yearController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Get All Years
router.get("/", authMiddleware, getYears);

// Admin Only - Create Year
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createYear
);

module.exports = router;