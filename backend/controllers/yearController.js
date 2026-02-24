const Year = require("../models/Year");

// Create Year (Admin only)
exports.createYear = async (req, res) => {
  try {
    const { name, order } = req.body;

    const existingYear = await Year.findOne({ name });
    if (existingYear) {
      return res.status(400).json({ message: "Year already exists" });
    }

    const year = await Year.create({
      name,
      order,
    });

    res.status(201).json({
      message: "Year created successfully",
      year,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Years
exports.getYears = async (req, res) => {
  try {
    const years = await Year.find().sort({ order: 1 });
    res.json(years);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};