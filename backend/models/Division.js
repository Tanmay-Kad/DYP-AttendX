const mongoose = require("mongoose");

const divisionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    year: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Year",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Division", divisionSchema);