const {
  createCylinder,
  updateCylinder,
  deleteCylinder,
  FindCylinders,
  Cylinder_Activate_Deactivate,
  findcylindersdetails,
} = require("../controller/cylinder_controller");
const { authRole_Company_Admin } = require("../middleware/auth");

const express = require("express");
const router = express.Router();

router.post("/", authRole_Company_Admin, createCylinder);
router.put("/", authRole_Company_Admin, updateCylinder);
router.delete("/:cylinder_id", authRole_Company_Admin, deleteCylinder);
router.put(
  "/activate/decative",
  authRole_Company_Admin,
  Cylinder_Activate_Deactivate
);
router.get("/", FindCylinders);
router.get("/cylindersdetails", findcylindersdetails);
module.exports = router;
