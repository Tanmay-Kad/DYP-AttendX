const Department = require("../models/Department");

// Create Department (Admin only)
exports.createDepartment = async (req, res) => {
  try {
    const { name, code } = req.body;

    // Check if already exists
    const existingDept = await Department.findOne({ name });
    if (existingDept) {
      return res.status(400).json({ message: "Department already exists" });
    }

    const department = await Department.create({
      name,
      code,
    });

    res.status(201).json({
      message: "Department created successfully",
      department,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Departments
exports.getDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};




exports.deleteDepartment = async (req, res) => {
  try {
    const Department = require("../models/Department");
    const { departmentId } = req.params;

    const department = await Department.findById(departmentId);

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    await department.deleteOne();

    res.json({ message: "Department deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};