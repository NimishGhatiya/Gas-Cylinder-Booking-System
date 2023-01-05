const {
  CreateCustomer,
  UpateCustomer,
  deleteCustomer,
  Activate_Deactivate_Customer_Account,
  FindCustomers,
} = require("../controller/customer_controller");
const { authRole_distributor_Admin } = require("../middleware/auth");

const express = require("express");
const { find } = require("lodash");
const router = express.Router();

router.post("/create", authRole_distributor_Admin, CreateCustomer);
router.put("/update", authRole_distributor_Admin, UpateCustomer);
router.delete(
  "/delete/:customer_id",
  authRole_distributor_Admin,
  deleteCustomer
);
router.put(
  "/activate/decative",
  authRole_distributor_Admin,
  Activate_Deactivate_Customer_Account
);
router.get("/", authRole_distributor_Admin, FindCustomers);
module.exports = router;
