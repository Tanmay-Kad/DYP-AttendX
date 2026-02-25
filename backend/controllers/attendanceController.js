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


exports.getSessionDetails = async (req, res) => {
  try {
    const AttendanceSession = require("../models/AttendanceSession");
    const Subject = require("../models/Subject");
    const User = require("../models/User");

    const { sessionId } = req.params;

    const session = await AttendanceSession.findById(sessionId)
      .populate({
        path: "subject",
        populate: { path: "division" }
      });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const divisionId = session.subject.division._id;

    // Get all students in that division
    const students = await User.find({
      role: "student",
      division: divisionId
    }).select("name email");

    const presentIds = session.studentsPresent.map(id => id.toString());

    const studentList = students.map(student => ({
      _id: student._id,
      name: student.name,
      email: student.email,
      status: presentIds.includes(student._id.toString())
        ? "Present"
        : "Absent"
    }));

    res.json({
      sessionId: session._id, 
      sessionDate: session.createdAt,
      students: studentList
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


const csv = require("json2csv").Parser;

exports.exportAttendanceCSV = async (req, res) => {
  try {
    const AttendanceSession = require("../models/AttendanceSession");
    const Subject = require("../models/Subject");
    const User = require("../models/User");

    const { subjectId } = req.params;

    const sessions = await AttendanceSession.find({ subject: subjectId });

    if (!sessions.length) {
      return res.status(404).json({ message: "No sessions found" });
    }

    const subject = await Subject.findById(subjectId)
      .populate("division");

    const students = await User.find({
      role: "student",
      division: subject.division._id
    });

    const data = students.map(student => {
      let presentCount = 0;

      sessions.forEach(session => {
        if (session.studentsPresent
            .map(id => id.toString())
            .includes(student._id.toString())
        ) {
          presentCount++;
        }
      });

      const percentage = ((presentCount / sessions.length) * 100).toFixed(2);

      return {
        Name: student.name,
        Email: student.email,
        TotalSessions: sessions.length,
        Present: presentCount,
        Percentage: percentage
      };
    });

    const json2csv = new csv();
    const csvData = json2csv.parse(data);

    res.header("Content-Type", "text/csv");
    res.attachment("attendance_report.csv");
    res.send(csvData);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.updateSessionAttendance = async (req, res) => {
  try {
    const AttendanceSession = require("../models/AttendanceSession");

    const { sessionId } = req.params;
    const { updatedStudents } = req.body;
    // updatedStudents = [{ studentId, status }]

    const session = await AttendanceSession.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Build new studentsPresent array
    const presentIds = updatedStudents
      .filter(student => student.status === "Present")
      .map(student => student.studentId);

    session.studentsPresent = presentIds;

    await session.save();

    res.json({ message: "Attendance updated successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



exports.deleteSession = async (req, res) => {
  try {
    const AttendanceSession = require("../models/AttendanceSession");

    const { sessionId } = req.params;

    const session = await AttendanceSession.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    await AttendanceSession.findByIdAndDelete(sessionId);

    res.json({ message: "Session deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};