const crypto = require("crypto");
const { User } = require("../models/user");
const {
  createDistributor_validate,
  UpdateDistributor_validate,
  Distributor_ac_de_Account,
} = require("../validation/distributor_vali");
const { sendEmail } = require("./Email");
const Token = require("../models/token");

module.exports.createDistributor = async (req, res) => {
  try {
    const { error } = createDistributor_validate(req.body);
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
        .json(
          "Distributor not create ....Company token Not match with Company id "
        );
    let user = await User.findOne({
      Contact_Person_Email: req.body.Contact_Person_Email,
    });
    if (user)
      return res
        .status(400)
        .json("User already Registered with this E-mail Id");

    user = await User.findOne({ Phone: req.body.Phone });
    if (user)
      return res
        .status(400)
        .json("User already Registered with this Phone Number");

    let token = await Token.findOne({ Email: req.body.Contact_Person_Email });

    if (!token) {
      token = await new Token({
        Email: req.body.Contact_Person_Email,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }
    let Email = req.body.Contact_Person_Email;
    const link = `${process.env.BASE_URL}/password-set/${Email}/${token.token}`;

    await sendEmail(
      Email,
      "Congratulations Your Distributor Account Created......please click here link & set your password ...............Set your password Before  5 Minutes ",
      link
    );

    user = new User(req.body);
    user.Role = "distributor_admin";
    const savedis = await user.save();
    res.status(201).json(savedis);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports.updateDistributor = async (req, res) => {
  try {
    const { error } = UpdateDistributor_validate(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    let admin = await User.findOne(req.user);
    if (!admin)
      return res
        .status(404)
        .json("company admin or super admin token not found");

    const role = admin.Role == "company_admin";

    if (role) {
      let current_status = admin.Current_Status == "Activated";
      if (!current_status)
        return res.status(400).json("Company Account Deactivated Currently");

      let dist = await User.findById(req.body.distributor_id);
      if (!dist) return res.status(404).json("Distributor not found");

      const check = req.user._id == dist.Company_id;
      if (!check)
        return res
          .status(404)
          .json(
            "Distributor not Updated ....Company token Not Match with Distributor Company Id "
          );

      await User.findByIdAndUpdate(
        req.body.distributor_id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json("Distributor  details  update Successfully");
    } else {
      let dist = await User.findById(req.body.distributor_id);
      if (!dist) return res.status(404).json("Distributor not found");
      const drole = dist.Role == "distributor_admin";
      if (!drole) return res.status(400).json("this is not a distributor");

      await User.findByIdAndUpdate(
        req.body.distributor_id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json("Distributor  details  update Successfully");
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports.deleteDistributor = async (req, res) => {
  try {
    let admin = await User.findOne(req.user);
    if (!admin)
      return res
        .status(404)
        .json("company admin or super admin token not found");

    const role = admin.Role == "company_admin";

    if (role) {
      let distributor = await User.findById(req.params.distributor_id);
      if (!distributor) return res.status(404).json("Distributor not found");

      const check = req.user._id == distributor.Company_id;
      if (!check)
        return res
          .status(404)
          .json(
            "Distributor not DELETED....Company token & Company id Not match "
          );

      await User.findByIdAndDelete(req.params.distributor_id);
      res.status(200).json("Distributor deleted successfully");
    } else {
      let dist = await User.findById(req.params.distributor_id);
      if (!dist) return res.status(404).json("Distributor not found");
      const drole = dist.Role == "distributor_admin";
      if (!drole) return res.status(400).json("this is not a distributor");

      await User.findByIdAndDelete(req.params.distributor_id);
      res.status(200).json("Distributor deleted successfully");
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports.Activate_Deactivate_Distributor_Account = async (req, res) => {
  try {
    const { error } = Distributor_ac_de_Account(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    let admin = await User.findOne(req.user);
    if (!admin)
      return res
        .status(404)
        .json("company admin or super admin token not found");

    const role = admin.Role == "company_admin";

    if (role) {
      let dist = await User.findById(req.body.Distributor_id);
      if (!dist) return res.status(404).json("Distributor not found");

      const check = req.user._id == dist.Company_id;
      if (!check)
        return res
          .status(404)
          .json(
            "Distributor Current Status not changed....Company token & Company id Not match "
          );

      let status = dist.Current_Status;
      if (status == "Activated") {
        status = "Deactivated";
      } else {
        status = "Activated";
      }
      await User.findByIdAndUpdate(
        req.body.Distributor_id,
        { $set: { Current_Status: status } },
        { new: true }
      );
      res.status(200).json(status);
    } else {
      let dist = await User.findById(req.body.Distributor_id);
      if (!dist) return res.status(404).json("Distributor not found");

      const drole = dist.Role == "distributor_admin";
      if (!drole) return res.status(400).json("this is not a distributor");

      let status = dist.Current_Status;
      if (status == "Activated") {
        status = "Deactivated";
      } else {
        status = "Activated";
      }
      await User.findByIdAndUpdate(
        req.body.Distributor_id,
        { $set: { Current_Status: status } },
        { new: true }
      );
      res.status(200).json(status);
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports.FindDistributors = async (req, res) => {
  try {
    let companyadmin = await User.findOne(req.user);
    if (!companyadmin)
      return res.status(404).json("Company admin token not found");

    const qId = req.query.distributor_id;
    const qCompanyId = req.query.Company_id;
    const qRole = req.query.role;
    const qStatus = req.query.status;

    let users, count;
    if (qId) {
      users = await User.findById(req.query.distributor_id);
    } else if (qCompanyId && qRole && qStatus) {
      count = await User.find({
        Role: { $in: qRole },
        Company_id: { $in: qCompanyId },
        Current_Status: { $in: qStatus },
      }).count();

      users = await User.find({
        Role: { $in: qRole },
        Company_id: { $in: qCompanyId },
        Current_Status: { $in: qStatus },
      });
    } else if (qRole && qCompanyId) {
      count = await User.find({
        Role: { $in: qRole },
        Company_id: { $in: qCompanyId },
      }).count();

      users = await User.find({
        Role: { $in: qRole },
        Company_id: { $in: qCompanyId },
      });
    } else {
      users = "Not Found";
    }

    res.status(200).json({ count, users });
  } catch (error) {
    res.status(200).json(error.message);
  }
};
