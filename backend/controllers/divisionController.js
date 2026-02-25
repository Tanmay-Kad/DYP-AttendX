const Division = require("../models/Division");
const Department = require("../models/Department");
const Year = require("../models/Year");

// Create Division (Admin only)
exports.createDivision = async (req, res) => {
  try {
    const { name, departmentId, yearId } = req.body;

    // Check if department exists
    const department = await Department.findById(departmentId);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    // Check if year exists
    const year = await Year.findById(yearId);
    if (!year) {
      return res.status(404).json({ message: "Year not found" });
    }

    const division = await Division.create({
      name,
      department: departmentId,
      year: yearId,
    });

    res.status(201).json({
      message: "Division created successfully",
      division,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Divisions
exports.getDivisions = async (req, res) => {
  try {
    const divisions = await Division.find()
      .populate("department", "name code")
      .populate("year", "name order");

    res.json(divisions);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};



exports.deleteDivision = async (req, res) => {
  try {
    const Division = require("../models/Division");
    const { divisionId } = req.params;

    const division = await Division.findById(divisionId);

    if (!division) {
      return res.status(404).json({ message: "Division not found" });
    }

    await division.deleteOne();

    res.json({ message: "Division deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};