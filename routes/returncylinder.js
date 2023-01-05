const {
  Return_Cylinder_to_Company,
  deleteReturnCylinder,
  Find_Return_Cylinders,
} = require("../controller/return_cylinder_con");
const { authRole_distributor_Admin } = require("../middleware/auth");

const express = require("express");
const router = express.Router();

router.post("/", authRole_distributor_Admin, Return_Cylinder_to_Company);

router.delete(
  "/:returncylinder_id",
  authRole_distributor_Admin,
  deleteReturnCylinder
);

router.get("/", Find_Return_Cylinders);
module.exports = router;
