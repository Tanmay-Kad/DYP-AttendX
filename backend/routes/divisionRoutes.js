const express = require("express");
const router = express.Router();

const { createDivision, getDivisions } = require("../controllers/divisionController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Get All Divisions
router.get("/", authMiddleware, getDivisions);

// Admin Only - Create Division
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createDivision
);

module.exports = router;