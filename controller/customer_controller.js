const crypto = require("crypto");
const { User } = require("../models/user");
const {
  createCustomer_validate,
  updateCustomer_validate,
  Customer_ac_de_Account_validate,
} = require("../validation/customer_vali");
const { sendEmail } = require("./Email");
const Token = require("../models/token");
const { findById, findOne } = require("../models/token");

module.exports.CreateCustomer = async (req, res) => {
  try {
    const { error } = createCustomer_validate(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    let distributor_admin = await User.findOne(req.user);
    if (!distributor_admin)
      return res.status(404).json("Distributor admin token not found");

    let company = await User.findById(req.body.Company_id);
    if (!company) return res.status(404).json("Company not found");

    const checkCompany = req.user.Company_id == req.body.Company_id;
    if (!checkCompany)
      return res
        .status(400)
        .json(
          "Customer not created ...In distributor comapny id not match with you enterd company id"
        );

    let distributor = await User.findById(req.body.Distributor_id);
    if (!distributor) return res.status(404).json("Distributor not found");

    let current_status = distributor.Current_Status == "Activated";
    if (!current_status)
      return res.status(400).json("Distributor Account Deactivated Currently");

    const check = req.user._id == req.body.Distributor_id;
    if (!check)
      return res
        .status(404)
        .json(
          "Customer not created ....Distributor token id not match with you Entered distributor Id"
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
      "Congratulations Your Customer Account Created......please click here link & set your password ...............Set your password Before  5 Minutes ",
      link
    );

    let customer = new User(req.body);
    customer.Role = "customer";
    const savecus = await customer.save();
    res.status(201).json(savecus);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports.UpateCustomer = async (req, res) => {
  try {
    const { error } = updateCustomer_validate(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    let distributor_admin = await User.findOne(req.user);
    if (!distributor_admin)
      return res.status(404).json("Distributor admin token not found");

    let customer = await User.findById(req.body.Customer_id);
    if (!customer) return res.status(404).json("Customer not found");

    const check = req.user._id == customer.Distributor_id;
    if (!check)
      return res
        .status(404)
        .json(
          "Customer not Updated ...Distributor token Not Match With Distributor Id"
        );

    let current_status = distributor_admin.Current_Status == "Activated";
    if (!current_status)
      return res.status(400).json("Distributor Account Deactivated Currently");

    await User.findByIdAndUpdate(
      req.body.Customer_id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json("Customer details Update successfully");
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports.deleteCustomer = async (req, res) => {
  try {
    let distributor_admin = await User.findOne(req.user);
    if (!distributor_admin)
      return res.status(404).json("Distributor admin token not found");

    let customer = await User.findById(req.params.customer_id);
    if (!customer) return res.status(404).json("Customer not found");

    const check = req.user._id == customer.Distributor_id;
    if (!check)
      return res
        .status(404)
        .json(
          "Customer not DELETED ....Distributor token & Distributor Id Not Match"
        );

    await User.findByIdAndDelete(req.params.customer_id);
    res.status(200).json("Customer deleted successfully");
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports.Activate_Deactivate_Customer_Account = async (req, res) => {
  try {
    const { error } = Customer_ac_de_Account_validate(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    let distributor_admin = await User.findOne(req.user);
    if (!distributor_admin)
      return res.status(404).json("Distributor admin token not found");

    let customer = await User.findById(req.body.Customer_id);
    if (!customer) return res.status(404).json("Customer not found");

    const check = req.user._id == customer.Distributor_id;
    if (!check)
      return res
        .status(404)
        .json(
          "Customer Status Not Changed ....Distributor token & Distributor Id Not Match"
        );

    let status = customer.Current_Status;
    if (status == "Activated") {
      status = "Deactivated";
    } else {
      status = "Activated";
    }
    await User.findByIdAndUpdate(
      req.body.Customer_id,
      { $set: { Current_Status: status } },
      { new: true }
    );
    res.status(200).json(status);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports.FindCustomers = async (req, res) => {
  try {
    let distributor_admin = await User.findOne(req.user);
    if (!distributor_admin)
      return res.status(404).json("Distributor admin token not found");

    const qdistributorId = req.query.distributor_id;
    const qRole = req.query.role;
    const qStatus = req.query.status;

    let count, customers;
    if (qdistributorId && qRole && qStatus) {
      count = await User.find({
        Role: { $in: qRole },
        Distributor_id: { $in: qdistributorId },
        Current_Status: { $in: qStatus },
      }).count();
      customers = await User.find({
        Role: { $in: qRole },
        Distributor_id: { $in: qdistributorId },
        Current_Status: { $in: qStatus },
      });
    } else if (qdistributorId && qRole) {
      count = await User.find({
        Role: { $in: qRole },
        Distributor_id: { $in: qdistributorId },
      }).count();
      customers = await User.find({
        Role: { $in: qRole },
        Distributor_id: { $in: qdistributorId },
      });
    } else {
      customers = await User.findById(req.query.customer_id);
    }

    res.status(200).json({ count, customers });
  } catch (error) {
    res.status(200).json(error.message);
  }
};
