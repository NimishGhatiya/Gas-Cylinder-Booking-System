const { User } = require("../models/user");
const Cylinders = require("../models/cylinders");
const Assign = require("../models/assigned_to");
const ReturnCylinder = require("../models/returncylinder");
const {
  Return_Cylinder_validate,
} = require("../validation/returnCylinder_validate");

module.exports.Return_Cylinder_to_Company = async (req, res) => {
  try {
    const { error } = Return_Cylinder_validate(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    let distributor_admin = await User.findOne(req.user);
    if (!distributor_admin)
      return res.status(404).json("Distributor admin token not found");

    let distributor = await User.findById(req.body.Distributor_id);
    if (!distributor) {
      return res.status(404).json("Distributor not Found");
    }
    let checkdis = req.user._id == req.body.Distributor_id;
    if (!checkdis) {
      return res
        .status(403)
        .json("Distributor Id not match with Distributor token ");
    }

    let company = await User.findById(req.body.Company_id);
    if (!company) {
      return res.status(404).json("Company Not Found");
    }

    let checkcompany = req.user.Company_id == req.body.Company_id;
    if (!checkcompany) {
      return res
        .status(404)
        .json("Company Id Not Match With distributor company Token");
    }

    let cylinder = await Cylinders.findById(req.body.Cylinder_id);
    if (!cylinder) {
      return res.status(404).json("Cylinder Not Found");
    }
    let cylinderstatus =
      req.body.Cylinder_Status == "Empty" ||
      req.body.Cylinder_Status == "Defective";

    if (!cylinderstatus) {
      return res.status(401).json("!!! Return Only Empty/Defective Cylinders");
    }
    cylinder = await Cylinders.findByIdAndUpdate(req.body.Cylinder_id, {
      $set: {
        Status: req.body.Cylinder_Status,
      },
    });

    let checkassign = await Assign.findOne({
      Distributor_id: req.body.Distributor_id,
      Cylinder_id: req.body.Cylinder_id,
      Company_id: req.body.Company_id,
    });
    if (!checkassign) {
      return res.status(401).json("cylinder not assignd ");
    }

    let returncylinder = new ReturnCylinder(req.body);
    returncylinder = await returncylinder.save();
    res.status(201).json(returncylinder);
  } catch (error) {
    res.status(500).json(error.message);
  }
};
module.exports.deleteReturnCylinder = async (req, res) => {
  try {
    let distributor_admin = await User.findOne(req.user);
    if (!distributor_admin)
      return res.status(404).json("Distributor admin token not found");

    let returncylinder = await ReturnCylinder.findById(
      req.params.returncylinder_id
    );
    if (!returncylinder) {
      return res.status(404).json("Return cylinder  Not Found");
    }

    const check = req.user._id == returncylinder.Distributor_id;
    if (!check)
      return res
        .status(404)
        .json(
          " Return Cylinder Not delete--- return  to Company....Company Not Create this Cylinder"
        );

    await ReturnCylinder.findByIdAndDelete(req.params.returncylinder_id);

    res.status(200).json("Return Cylinder deleted successfully");
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports.Find_Return_Cylinders = async (req, res) => {
  try {
    const qCompanyId = req.query.company_id;
    const qDistributor = req.query.distributor_id;
    const qCylinder = req.query.cylinder_id;
    const qReturn = req.query.returncylinder_id;

    let ReturnCylinders, count;

    if (qCompanyId) {
      count = await ReturnCylinder.find({
        Company_id: { $in: qCompanyId },
      }).count();
      ReturnCylinders = await ReturnCylinder.find({
        Company_id: { $in: qCompanyId },
      });
    } else if (qDistributor) {
      count = await ReturnCylinder.find({
        Distributor_id: { $in: qDistributor },
      }).count();
      ReturnCylinders = await ReturnCylinder.find({
        Distributor_id: { $in: qDistributor },
      });
    } else if (qCylinder) {
      count = await ReturnCylinder.find({
        Cylinder_id: { $in: qCylinder },
      }).count();
      ReturnCylinders = await ReturnCylinder.find({
        Cylinder_id: { $in: qCylinder },
      });
    } else if (qReturn) {
      ReturnCylinders = await ReturnCylinder.findById(
        req.query.returncylinder_id
      );
    } else {
      count = await ReturnCylinder.find().count();
      ReturnCylinders = await ReturnCylinder.find();
    }
    if (!ReturnCylinders) {
      ReturnCylinders = "Not Found";
    }
    res.status(200).json({ count, ReturnCylinders });
  } catch (error) {
    res.status(500).json(error.message);
  }
};
