const { User } = require("../models/user");
const Cylinders = require("../models/cylinders");
const Assign = require("../models/assigned_to");
const {
  assignedCylinder_validate,
  assignedCylinderUpdate_validate,
} = require("../validation/assigned_to_validate");

module.exports.AssignedCylindertodis = async (req, res) => {
  try {
    const { error } = assignedCylinder_validate(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    let companyadmin = await User.findOne(req.user);
    if (!companyadmin)
      return res.status(404).json("company admin token not found");

    let company = await User.findById(req.body.Company_id);
    if (!company) {
      return res.status(404).json("Company Not Found");
    }
    let checkrole = company.Role == "company_admin";
    if (!checkrole) {
      return res.status(404).json("This is Not a Company");
    }

    let checkcompany = req.user._id == req.body.Company_id;
    if (!checkcompany) {
      return res.status(404).json("Company Id Not Match With Company Token");
    }

    let cylinder = await Cylinders.findById(req.body.Cylinder_id);
    if (!cylinder) {
      return res.status(404).json("Cylinder Not Found");
    }
    let current_status = cylinder.Current_Status == "Activated";
    if (!current_status)
      return res.status(400).json("Cylinder  Deactivated Currently");

    let status = cylinder.Status == "Full";
    if (!status) {
      return res
        .status(404)
        .json(
          "!!! Cylinder is Empty/Defective Please Supply Full Cylinder to Distributor"
        );
    }

    const check = req.user._id == cylinder.Supplier;
    if (!check)
      return res
        .status(404)
        .json(
          "Cylinder Not Assigned  to distributor....Company not create this Cylinder "
        );

    let distributor = await User.findById(req.body.Distributor_id);
    if (!distributor) {
      return res.status(404).json("Distributor not found");
    }
    let checkroledis = distributor.Role == "distributor_admin";
    if (!checkroledis) {
      return res.status(404).json("This is Not a Distributor");
    }

    const checkdis = req.user._id == distributor.Company_id;
    if (!checkdis) {
      return res
        .status(401)
        .json(
          "!!!!You Enter wrong Distributor ....company not create this distributor"
        );
    }

    let assign = new Assign(req.body);
    
    assign = await assign.save();
    res.status(201).json(assign);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports.updateAssigned_Cylinder = async (req, res) => {
  try {
    const { error } = assignedCylinderUpdate_validate(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    let companyadmin = await User.findOne(req.user);
    if (!companyadmin)
      return res.status(404).json("company admin token not found");

    let assign = await Assign.findById(req.body.AssignCylinder_id);
    if (!assign) {
      return res.status(404).json("Assign cylinder Id Not Found");
    }

    const check = req.user._id == assign.Company_id;
    if (!check)
      return res
        .status(404)
        .json(
          "Cylinder Not Updated--- Assigned  to distributor....Company Not Create this Cylinder "
        );

    let distributor = await User.findById(req.body.Distributor_id);
    if (!distributor) {
      return res.status(404).json("Distributor not found");
    }
    let checkroledis = distributor.Role == "distributor_admin";
    if (!checkroledis) {
      return res.status(404).json("This is Not a Distributor");
    }

    const checkdis = req.user._id == distributor.Company_id;
    if (!checkdis) {
      return res
        .status(401)
        .json(
          "!!!!You Enter wrong Distributor ....company not create this distributor"
        );
    }
    await Assign.findByIdAndUpdate(
      req.body.AssignCylinder_id,
      { $set: req.body },
      { new: true }
    );

    res
      .status(200)
      .json("Cylinder Assigned to Distributor Updated successfully");
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports.deleteAssignCylinder = async (req, res) => {
  try {
    let companyadmin = await User.findOne(req.user);
    if (!companyadmin)
      return res.status(404).json("company admin token not found");

    let assign = await Assign.findById(req.params.assigncylinder_id);
    if (!assign) {
      return res.status(404).json("Assign cylinder Id Not Found");
    }

    const check = req.user._id == assign.Company_id;
    if (!check)
      return res
        .status(404)
        .json(
          "Cylinder Not delete--- Assigned  to distributor....Company Not Create this Cylinder "
        );

    await Assign.findByIdAndDelete(req.params.assigncylinder_id);

    res.status(200).json("Assign Cylinder deleted successfully");
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports.Find_Assigned_Cylinders = async (req, res) => {
  try {
    const qCompanyId = req.query.company_id;
    const qDistributor = req.query.distributor_id;
    const qCylinder = req.query.cylinder_id;
    const qAssigned = req.query.assigncylinder_id;

    let AssignedCylinders, count;

    if (qCompanyId) {
      count = await Assign.find({
        Company_id: { $in: qCompanyId },
      }).count();
      AssignedCylinders = await Assign.find({
        Company_id: { $in: qCompanyId },
      });
    } else if (qDistributor) {
      count = await Assign.find({
        Distributor_id: { $in: qDistributor },
      }).count();
      AssignedCylinders = await Assign.find({
        Distributor_id: { $in: qDistributor },
      });
    } else if (qCylinder) {
      count = await Assign.find({
        Cylinder_id: { $in: qCylinder },
      }).count();
      AssignedCylinders = await Assign.find({
        Cylinder_id: { $in: qCylinder },
      });
    } else if (qAssigned) {
      AssignedCylinders = await Assign.findById(req.query.assigncylinder_id);
    } else {
      count = await Assign.find().count();
      AssignedCylinders = await Assign.find();
    }
    if (!AssignedCylinders) {
      AssignedCylinders = "Not Found";
    }
    res.status(200).json({ count, AssignedCylinders });
  } catch (error) {
    res.status(500).json(error.message);
  }
};
