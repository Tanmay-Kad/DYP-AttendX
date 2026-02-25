const express = require("express");
const router = express.Router();

const { createSubject, getSubjects, deleteSubject } = require("../controllers/subjectController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Get All Subjects
router.get("/", authMiddleware, getSubjects);

// Admin Only - Create Subject
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createSubject
);

router.delete(
  "/:subjectId",
  authMiddleware,
  roleMiddleware("admin"),
  deleteSubject
);

module.exports = router;