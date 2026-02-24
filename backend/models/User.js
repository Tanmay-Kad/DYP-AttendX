const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "teacher", "student"],
      required: true,
    },

    // ✅ ADD THIS
    status: {
      type: String,
      enum: ["pending", "approved"],
      default: function () {
        return this.role === "teacher" ? "pending" : "approved";
      },
    },

    // Only for students
    department: {
      type: String,
    },
    year: {
      type: String,
    },
    division: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);