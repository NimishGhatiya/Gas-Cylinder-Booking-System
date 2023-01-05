const {
  AssignedCylindertodis,
  updateAssigned_Cylinder,
  deleteAssignCylinder,
  Find_Assigned_Cylinders,
} = require("../controller/assigned_cylinder_con");
const { authRole_Company_Admin } = require("../middleware/auth");

const express = require("express");
const router = express.Router();

router.post("/", authRole_Company_Admin, AssignedCylindertodis);
router.put("/", authRole_Company_Admin, updateAssigned_Cylinder);
router.delete(
  "/:assigncylinder_id",
  authRole_Company_Admin,
  deleteAssignCylinder
);

router.get("/", Find_Assigned_Cylinders);
module.exports = router;
