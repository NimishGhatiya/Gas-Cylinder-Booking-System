const {
  user_login,
  change_password,
  forgetpasslink,
  resetpass,
  setpass,
  FindUsers,
} = require("../controller/authcontroller");
const { verifyToken, authRole_Super_Admin } = require("../middleware/auth");

const express = require("express");
const router = express.Router();

router.post("/login", user_login);
router.post("/password-set/:Contact_Person_Email/:token", setpass);
router.post("/send-email-password-link", forgetpasslink);
router.post("/password-reset/:userId/:token", resetpass);
router.put("/change-password", verifyToken, change_password);

router.get("/", authRole_Super_Admin, FindUsers);
module.exports = router;
