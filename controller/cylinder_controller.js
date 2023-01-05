const Product = require("../models/product");
const { User } = require("../models/user");
const Cylinders = require("../models/cylinders");
const {
  Cylinder_create_validate,
  Cylinder_Update_validate,
  Cylinder_act_dea,
} = require("../validation/cylinders_validate");

module.exports.createCylinder = async (req, res) => {
  try {
    const { error } = Cylinder_create_validate(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    let companyadmin = await User.findOne(req.user);
    if (!companyadmin)
      return res.status(404).json("company admin token not found");

    let supplier = await User.findById(req.body.Supplier);
    if (!supplier) {
      return res.status(404).json("Supplier Not Found");
    }

    let current_status = supplier.Current_Status == "Activated";
    if (!current_status)
      return res.status(400).json("Supplier Account Deactivated Currently");

    const check = req.user._id == req.body.Supplier;
    if (!check)
      return res
        .status(404)
        .json("Cylinder not created ....Company token & Company id Not match ");

    let product = await Product.findById(req.body.Product);
    if (!product) return res.status(404).json("Product not found");

    const checkproduct = req.user._id == product.Company_id;
    if (!checkproduct)
      return res
        .status(401)
        .json(
          "Cylinder Not Created ....This Product Not Created By This Company "
        );

    let cylinder = new Cylinders(req.body);
    cylinder = await cylinder.save();
    res.status(201).json(cylinder);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports.updateCylinder = async (req, res) => {
  try {
    const { error } = Cylinder_Update_validate(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    let companyadmin = await User.findOne(req.user);
    if (!companyadmin)
      return res.status(404).json("company admin token not found");

    let cylinder = await Cylinders.findById(req.body.Cylinder_id);
    if (!cylinder) return res.status(404).json("Cylinder not found");

    const check = req.user._id == cylinder.Supplier;
    if (!check)
      return res
        .status(404)
        .json(
          "Cylinder not Updated ...Company token not match with Cylinder company id"
        );

    let current_status = companyadmin.Current_Status == "Activated";
    if (!current_status)
      return res.status(400).json("Company Account Deactivated Currently");

    let product = await Product.findById(req.body.Product);
    if (!product) return res.status(404).json("Product not found");

    const checkproduct = req.user._id == product.Company_id;
    if (!checkproduct)
      return res
        .status(401)
        .json(
          "Cylinder Not Updated ....This Product Not Created By This Company "
        );

    let status =
      req.body.Status == "Full" ||
      req.body.Status == "Empty" ||
      req.body.Status == "Defective";
    if (!status) {
      return res
        .status(404)
        .json("Please Enter Right Status...(Full/Empty/Defective)");
    }
    await Cylinders.findByIdAndUpdate(
      req.body.Cylinder_id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json("Cylinder  Updated successfully");
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports.deleteCylinder = async (req, res) => {
  try {
    let companyadmin = await User.findOne(req.user);
    if (!companyadmin)
      return res.status(404).json("company admin token not found");

    let cylinder = await Cylinders.findById(req.params.cylinder_id);
    if (!cylinder) return res.status(404).json("Cylinder not found");

    const check = req.user._id == cylinder.Company_id;
    if (!check)
      return res
        .status(404)
        .json(
          "Cylinder not Deleted ...Company token not match with Cylinder company id"
        );

    await Cylinders.findByIdAndDelete(req.params.cylinder_id);

    res.status(200).json("Cylinder deleted successfully");
  } catch (error) {
    res.status(500).json(error.message);
  }
};
module.exports.Cylinder_Activate_Deactivate = async (req, res) => {
  try {
    const { error } = Cylinder_act_dea(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    let companyadmin = await User.findOne(req.user);
    if (!companyadmin)
      return res.status(404).json("company admin token not found");

    let cylinder = await Cylinders.findById(req.body.Cylinder_id);
    if (!cylinder) {
      return res.status(404).json("Cylinder not found");
    }
    const check = req.user._id == cylinder.Supplier;
    if (!check)
      return res
        .status(404)
        .json(
          "Cylinder Current Status not changed....Company token & Company id Not match "
        );

    let status = cylinder.Current_Status;
    if (status == "Activated") {
      status = "Deactivated";
    } else {
      status = "Activated";
    }
    await Cylinders.findByIdAndUpdate(
      req.body.Cylinder_id,
      { $set: { Current_Status: status } },
      { new: true }
    );
    res.status(200).json(status);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports.FindCylinders = async (req, res) => {
  try {
    const qproductid = req.query.product_id;
    const qCompanyId = req.query.company_id;
    const qCylinder = req.query.cylinder_id;
    const qStatus = req.query.status;
    const qcurrentStatus = req.query.current_status;

    let cylinders;
    let count;
    if (qCompanyId) {
      count = await Cylinders.find({
        Supplier: { $in: qCompanyId },
      }).count();
      cylinders = await Cylinders.find({
        Supplier: { $in: qCompanyId },
      });
    } else if (qproductid) {
      count = await Cylinders.find({
        Product: { $in: qproductid },
      }).count();
      cylinders = await Cylinders.find({
        Product: { $in: qproductid },
      });
    } else if (qStatus) {
      count = await Cylinders.find({
        Status: { $in: qStatus },
      }).count();
      cylinders = await Cylinders.find({
        Status: { $in: qStatus },
      });
    } else if (qCylinder) {
      cylinders = await Cylinders.findById(req.query.cylinder_id)
        .populate("Product", ["Title", "Size", "Rating", "Type"])
        .populate("Supplier", "Name");
    } else if (qcurrentStatus) {
      count = await Cylinders.find({
        Current_Status: { $in: qcurrentStatus },
      }).count();
      cylinders = await Cylinders.find({
        Current_Status: { $in: qcurrentStatus },
      });
    } else {
      count = await Cylinders.find().count();
      cylinders = await Cylinders.find()
        .populate("Product", ["Title", "Size", "Rating", "Type"])
        .populate("Supplier", "Name");
    }
    if (!cylinders) {
      cylinders = "Not Found";
    }
    res.status(200).json({ count, cylinders });
  } catch (error) {
    res.status(500).json(error.message);
  }
};
