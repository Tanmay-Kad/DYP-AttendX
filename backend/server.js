const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const departmentRoutes = require("./routes/departmentRoutes");
app.use("/api/departments", departmentRoutes);

const yearRoutes = require("./routes/yearRoutes");
app.use("/api/years", yearRoutes);

const divisionRoutes = require("./routes/divisionRoutes");
app.use("/api/divisions", divisionRoutes);

const subjectRoutes = require("./routes/subjectRoutes");
app.use("/api/subjects", subjectRoutes);

const attendanceRoutes = require("./routes/attendanceRoutes");
app.use("/api/attendance", attendanceRoutes);

const authMiddleware = require("./middleware/authMiddleware");

app.get("/api/test", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route working ✅",
    user: req.user
  });
});

const roleMiddleware = require("./middleware/roleMiddleware");

app.get(
  "/api/admin-only",
  authMiddleware,
  roleMiddleware("admin"),
  (req, res) => {
    res.json({ message: "Welcome Admin 👑" });
  }
);

// Test Route
app.get("/", (req, res) => {
  res.send("DYP-AttendX Backend Running 🚀");
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log("DB Error:", err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});