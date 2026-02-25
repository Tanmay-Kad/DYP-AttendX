const Subject = require("../models/Subject");
const Division = require("../models/Division");
const User = require("../models/User");

// Create Subject (Admin only)
exports.createSubject = async (req, res) => {
  try {
    const { name, code, divisionId, teacherId } = req.body;

    // Check division exists
    const division = await Division.findById(divisionId);
    if (!division) {
      return res.status(404).json({ message: "Division not found" });
    }

    // Check teacher exists and role is teacher
    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== "teacher") {
      return res.status(404).json({ message: "Valid teacher not found" });
    }

    const subject = await Subject.create({
      name,
      code,
      division: divisionId,
      teacher: teacherId,
    });

    res.status(201).json({
      message: "Subject created successfully",
      subject,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Subjects
exports.getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find()
      .populate({
        path: "division",
        populate: [
          { path: "department", select: "name code" },
          { path: "year", select: "name order" }
        ]
      })
      .populate("teacher", "name email");

    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


exports.deleteSubject = async (req, res) => {
  try {
    const Subject = require("../models/Subject");
    const { subjectId } = req.params;

    const subject = await Subject.findById(subjectId);

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    await subject.deleteOne();

    res.json({ message: "Subject deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};