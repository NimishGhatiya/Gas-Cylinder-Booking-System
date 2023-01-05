const mongoose = require("mongoose");

const ReturnSchema = new mongoose.Schema(
  {
    Cylinder_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Cylinders",
    },
    Distributor_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    Company_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

const ReturnCylinders = mongoose.model("Return Cylinders", ReturnSchema);

module.exports = ReturnCylinders;
