const {
  create_company,
  updateCompany,
  deleteCompany,
  Activate_Deactivate_Company_Account,
  FindCompanies,
  findcountry,
} = require("../controller/company_controller");
const { authRole_Super_Admin } = require("../middleware/auth");

const express = require("express");
const router = express.Router();

router.post("/create", authRole_Super_Admin, create_company);
router.put("/update", authRole_Super_Admin, updateCompany);
router.delete("/delete/:company_id", authRole_Super_Admin, deleteCompany);

router.put(
  "/activate/decative",
  authRole_Super_Admin,
  Activate_Deactivate_Company_Account
);
router.get("/", authRole_Super_Admin, FindCompanies);

module.exports = router;
