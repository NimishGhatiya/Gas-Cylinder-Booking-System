const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const uniqueValidator = require("mongoose-unique-validator");

const UserSchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      uppercase: true,
    },
    Contact_Person_Name: {
      type: String,
    },
    Contact_Person_Email: {
      type: String,
      lowercase: true,
      unique: true,
    },
    Role: {
      type: String,
      enum: ["super_admin", "company_admin", "distributor_admin", "customer"],
    },
    EPA_Reclaimer_Number: {
      type: String,
      trim: true,
    },
    Address: {
      type: String,
      uppercase: true,
    },
    Phone: {
      type: Number,
      unique: true,
    },
    Website: {
      type: String,
      lowercase: true,
      trim: true,
    },
    Max_Units: {
      type: Number,
    },
    Password: {
      type: String,
    },
    Current_Status: {
      type: String,
      enum: ["Activated", "Deactivated"],
      default: "Activated",
    },
    Company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    Distributor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

UserSchema.methods.genAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      Role: this.Role,
      Company_id: this.Company_id,
    },
    process.env.ACCESS_TOKEN
  );
  return token;
};

UserSchema.plugin(uniqueValidator);

const User = mongoose.model("User", UserSchema);

exports.User = User;
exports.UserSchema = UserSchema;
