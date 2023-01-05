const mongoose = require("mongoose");

const AssignedSchema = new mongoose.Schema(
  {
    Cylinder_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Cylinders",
    },
    Company_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    Distributor_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Assign = mongoose.model("Assign Cylinders", AssignedSchema);

module.exports = Assign;
