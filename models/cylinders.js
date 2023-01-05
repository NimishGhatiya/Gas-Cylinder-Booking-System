const mongoose = require("mongoose");

const CylindersSchema = new mongoose.Schema(
  {
    Product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    Cylinder_Manufacturing_Serial_Number: {
      type: String,
      required: true,
      unique: true,
    },
    Supplier: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    Status: {
      type: String,
      default: "Full",
      enum: ["Full", "Empty", "Defective"],
    },
    Current_Status: {
      type: String,
      enum: ["Activated", "Deactivated"],
      default: "Activated",
    },
  },
  { timestamps: true }
);

const Cylinders = mongoose.model("Cylinders", CylindersSchema);

module.exports = Cylinders;
