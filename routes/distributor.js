const {
  createDistributor,
  updateDistributor,
  deleteDistributor,
  Activate_Deactivate_Distributor_Account,
  FindDistributors,
} = require("../controller/distributor_controller");
const { authRole_Company_Admin } = require("../middleware/auth");

const express = require("express");
const router = express.Router();

router.post("/create", authRole_Company_Admin, createDistributor);
router.put("/update", authRole_Company_Admin, updateDistributor);
router.delete(
  "/delete/:distributor_id",
  authRole_Company_Admin,
  deleteDistributor
);
router.put(
  "/activate/decative",
  authRole_Company_Admin,
  Activate_Deactivate_Distributor_Account
);

router.get("/", authRole_Company_Admin, FindDistributors);
module.exports = router;
