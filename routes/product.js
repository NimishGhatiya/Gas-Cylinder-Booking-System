const {
  createProduct,
  updateProduct,
  deleteProduct,
  FindProducts,
  datajoin2tables,
} = require("../controller/product_con");
const { authRole_Company_Admin } = require("../middleware/auth");

const express = require("express");
const router = express.Router();

router.post("/", authRole_Company_Admin, createProduct);
router.put("/", authRole_Company_Admin, updateProduct);
router.delete("/:product_id", authRole_Company_Admin, deleteProduct);
router.get("/", FindProducts);
router.get("/products", datajoin2tables);
module.exports = router;
