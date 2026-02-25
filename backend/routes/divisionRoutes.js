const express = require("express");
const router = express.Router();

const { createDivision, getDivisions, deleteDivision } = require("../controllers/divisionController");
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

router.delete(
  "/:divisionId",
  authMiddleware,
  roleMiddleware("admin"),
  deleteDivision
);

module.exports = router;