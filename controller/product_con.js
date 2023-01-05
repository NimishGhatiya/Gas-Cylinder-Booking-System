const Product = require("../models/product");
const { User } = require("../models/user");
const {
  product_create_validate,
  product_update_validate,
} = require("../validation/product_validate");

//create product by Company Admin
module.exports.createProduct = async (req, res) => {
  try {
    const { error } = product_create_validate(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    let companyadmin = await User.findOne(req.user);
    if (!companyadmin)
      return res.status(404).json("company admin token not found");

    let company = await User.findById(req.body.Company_id);
    if (!company) return res.status(404).json("Company not found");

    let current_status = company.Current_Status == "Activated";
    if (!current_status)
      return res.status(400).json("Company Account Deactivated Currently");

    const check = req.user._id == req.body.Company_id;
    if (!check)
      return res
        .status(404)
        .json("Product not created ....Company token & Company id Not match ");

    let product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports.updateProduct = async (req, res) => {
  try {
    const { error } = product_update_validate(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    let companyadmin = await User.findOne(req.user);
    if (!companyadmin)
      return res.status(404).json("company admin token not found");

    let product = await Product.findById(req.body.Product_id);
    if (!product) return res.status(404).json("Product not found");

    const check = req.user._id == product.Company_id;
    if (!check)
      return res
        .status(404)
        .json(
          "Product not Updated ...Company token not match with product company id"
        );

    let current_status = companyadmin.Current_Status == "Activated";
    if (!current_status)
      return res.status(400).json("Company Account Deactivated Currently");

    await Product.findByIdAndUpdate(
      req.body.Product_id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json("Product  Updated successfully");
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports.deleteProduct = async (req, res) => {
  try {
    let companyadmin = await User.findOne(req.user);
    if (!companyadmin)
      return res.status(404).json("company admin token not found");

    let product = await Product.findById(req.params.product_id);
    if (!product) return res.status(404).json("Product not found");

    const check = req.user._id == product.Company_id;
    if (!check)
      return res
        .status(404)
        .json(
          "Product not Deleted ...Company token not match with product company id"
        );

    await Product.findByIdAndDelete(req.params.product_id);

    res.status(200).json("product deleted successfully");
  } catch (error) {
    res.status(500).json(error.message);
  }
};
module.exports.FindProducts = async (req, res) => {
  try {
    const qproductid = req.query.product_id;
    const qCompanyId = req.query.company_id;
    let products;
    let count;
    if (qproductid) {
      products = await Product.findById(req.query.product_id).populate(
        "Company_id",
        "Name"
      );
    } else if (qCompanyId) {
      count = await Product.find({
        Company_id: { $in: qCompanyId },
      }).count();
      products = await Product.find({
        Company_id: { $in: qCompanyId },
      });
    } else {
      count = await Product.find().count();
      products = await Product.find().populate("Company_id", "Name");
    }
    if (!products) {
      products = "Not Found";
    }
    res.status(200).json({ count, products });
  } catch (error) {
    res.status(500).json(error.message);
  }
};
