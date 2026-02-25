const express = require("express");
const router = express.Router();

const { startAttendance, markAttendance, getSessionsBySubject, getStudentAttendance, getDefaulters, getSessionDetails, exportAttendanceCSV, updateSessionAttendance    } = require("../controllers/attendanceController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Teacher Only - Start Attendance
router.post(
  "/start",
  authMiddleware,
  roleMiddleware("teacher"),
  startAttendance
);

// Student Only - Mark Attendance
router.post(
  "/mark",
  authMiddleware,
  roleMiddleware("student"),
  markAttendance
);

// Teacher Only - Get Sessions by Subject
router.get(
  "/subject/:subjectId",
  authMiddleware,
  roleMiddleware("teacher"),
  getSessionsBySubject
);

// Student Only - Get Attendance Report for a Subject
router.get(
  "/report/:subjectId",
  authMiddleware,
  roleMiddleware("student"),
  getStudentAttendance
);

// Teacher Only - Get Defaulters (<75%)
router.get(
  "/defaulters/:subjectId",
  authMiddleware,
  roleMiddleware("teacher"),
  getDefaulters
);

router.get(
  "/session-details/:sessionId",
  authMiddleware,
  roleMiddleware("teacher"),
  getSessionDetails
);

router.get(
  "/export/:subjectId",
  authMiddleware,
  roleMiddleware("teacher"),
  exportAttendanceCSV
);


router.put(
  "/update-session/:sessionId",
  authMiddleware,
  roleMiddleware("teacher"),
  updateSessionAttendance
);

module.exports = router;