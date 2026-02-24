const AttendanceSession = require("../models/AttendanceSession");
const Subject = require("../models/Subject");
const User = require("../models/User");

// ================= START ATTENDANCE =================

// Helper function to generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Teacher starts attendance
exports.startAttendance = async (req, res) => {
  try {
    const { subjectId } = req.body;

    const subject = await Subject.findById(subjectId);

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    // Ensure logged-in teacher is assigned to this subject
    if (subject.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized for this subject" });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 30 * 1000); // 30 seconds

    const session = await AttendanceSession.create({
      subject: subjectId,
      otp,
      expiresAt,
      studentsPresent: [],
    });

    res.status(201).json({
      message: "Attendance started",
      otp,
      expiresAt,
      sessionId: session._id,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ================= MARK ATTENDANCE =================

exports.markAttendance = async (req, res) => {
  try {
    const { sessionId, otp } = req.body;

    const session = await AttendanceSession.findById(sessionId)
      .populate({
        path: "subject",
        populate: {
          path: "division"
        }
      });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Check OTP match
    if (session.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check expiry
    if (new Date() > session.expiresAt) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // Check student role
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can mark attendance" });
    }

    // Get student
    const student = await User.findById(req.user.id);

    // Division validation
    if (
      !student.division ||
      student.division.toString() !== session.subject.division._id.toString()
    ) {
      return res.status(403).json({ message: "You do not belong to this division" });
    }

    // Prevent duplicate attendance
    if (session.studentsPresent.includes(req.user.id)) {
      return res.status(400).json({ message: "Attendance already marked" });
    }

    // Mark present
    session.studentsPresent.push(req.user.id);
    await session.save();

    res.json({ message: "Attendance marked successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ================= GET SESSIONS (Teacher) =================

exports.getSessionsBySubject = async (req, res) => {
  try {
    const { subjectId } = req.params;

    const subject = await Subject.findById(subjectId);

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    if (subject.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const sessions = await AttendanceSession.find({ subject: subjectId })
      .populate("studentsPresent", "name email");

    res.json(sessions);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ================= STUDENT ATTENDANCE REPORT =================

exports.getStudentAttendance = async (req, res) => {
  try {
    const { subjectId } = req.params;

    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students allowed" });
    }

    // Get all sessions of this subject
    const sessions = await AttendanceSession.find({
      subject: subjectId
    }).sort({ createdAt: 1 });

    const totalSessions = sessions.length;

    let presentSessions = 0;

    const history = sessions.map((session) => {
    const isPresent = session.studentsPresent.some(
      id => id.toString() === req.user.id
      );

      if (isPresent) presentSessions++;

      return {
        date: session.createdAt,
        status: isPresent ? "Present" : "Absent"
      };
    });

    const percentage =
      totalSessions === 0
        ? 0
        : ((presentSessions / totalSessions) * 100).toFixed(2);

    res.json({
      totalSessions,
      presentSessions,
      percentage: Number(percentage),
      history
    });

  } catch (error) {
  console.error("Attendance Error:", error);
  res.status(500).json({ message: error.message });
  }
};

// ================= DEFAULTER LIST =================

exports.getDefaulters = async (req, res) => {
  try {
    const { subjectId } = req.params;

    const subject = await Subject.findById(subjectId)
      .populate("division");

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    if (subject.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const totalSessions = await AttendanceSession.countDocuments({
      subject: subjectId
    });

    if (totalSessions === 0) {
      return res.json({ message: "No sessions conducted yet" });
    }

    const students = await User.find({
      role: "student",
      division: subject.division._id
    }).select("name email");

    const defaulters = [];

    for (let student of students) {
      const presentCount = await AttendanceSession.countDocuments({
        subject: subjectId,
        studentsPresent: student._id
      });

      const percentage = (presentCount / totalSessions) * 100;

      if (percentage < 75) {
        defaulters.push({
          student,
          percentage: percentage.toFixed(2)
        });
      }
    }

    res.json(defaulters);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};