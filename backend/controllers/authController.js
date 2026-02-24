const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, department, year, division } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      department,
      year,
      division,
      // status automatically handled by schema
    });

    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 🔴 Block pending teachers
    if (user.role === "teacher" && user.status !== "approved") {
      return res.status(403).json({
        message: "Your account is pending admin approval"
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      role: user.role,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// ================= GET ALL TEACHERS (Admin) =================
exports.getTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: "teacher" })
      .select("-password");

    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// ================= GET PENDING TEACHERS (Admin) =================
exports.getPendingTeachers = async (req, res) => {
  try {
    const teachers = await User.find({
      role: "teacher",
      status: "pending"
    }).select("-password");

    res.json(teachers);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// ================= APPROVE TEACHER (Admin) =================
exports.approveTeacher = async (req, res) => {
  try {
    const { teacherId } = req.params;

    const teacher = await User.findById(teacherId);

    if (!teacher || teacher.role !== "teacher") {
      return res.status(404).json({ message: "Teacher not found" });
    }

    teacher.status = "approved";
    await teacher.save();

    res.json({ message: "Teacher approved successfully" });

  } catch (error) {
    console.error(error); // 🔥 ADD THIS
    res.status(500).json({ message: "Server error" });
  }
};


// ================= GET LOGGED-IN USER =================
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password");

    res.json(user);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


exports.getPendingTeachers = async (req, res) => {
  try {
    const User = require("../models/User");

    const teachers = await User.find({
      role: "teacher",
      status: "pending"
    }).select("-password");

    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


exports.approveTeacher = async (req, res) => {
  try {
    const User = require("../models/User");
    const { teacherId } = req.params;

    const teacher = await User.findById(teacherId);

    if (!teacher || teacher.role !== "teacher") {
      return res.status(404).json({ message: "Teacher not found" });
    }

    teacher.status = "approved";
    await teacher.save();

    res.json({ message: "Teacher approved successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};