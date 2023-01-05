const crypto = require("crypto");
const { User } = require("../models/user");
const {
  createCompany_validate,
  UpdateCompany_validate,
  Company_ac_de_Account,
} = require("../validation/company_validate");
const { sendEmail } = require("./Email");
const Token = require("../models/token");

module.exports.create_company = async (req, res) => {
  try {
    const { error } = createCompany_validate(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    const superadmintoken = await User.findOne(req.user);
    if (!superadmintoken)
      return res.status(404).json("super admin token was invalid");

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
    Email = req.body.Contact_Person_Email;
    const link = `${process.env.BASE_URL}/password-set/${Email}/${token.token}`;

    await sendEmail(
      Email,
      "Congratulations Your Company Account Created......please click here link & set your password.............Set your password Before  5 Minutes ..",
      link
    );

    user = new User(req.body);
    user.Role = "company_admin";
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports.updateCompany = async (req, res) => {
  try {
    const { error } = UpdateCompany_validate(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    const superadmintoken = await User.findOne(req.user);
    if (!superadmintoken)
      return res.status(404).json("super admin token was invalid");

    let company = await User.findByIdAndUpdate(
      req.body.company_id,
      { $set: req.body },
      { new: true }
    );
    if (!company) return res.status(404).json("Company not found");

    res.status(200).json("Company  details  update Successfully");
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports.deleteCompany = async (req, res) => {
  try {
    let superadmintoken = await User.findOne(req.user);
    if (!superadmintoken) return res.status(404).json("Super Admin not found");

    let user = await User.findByIdAndDelete(req.params.company_id);
    if (!user) return res.status(404).json("Company Not found");

    res.status(200).json("Company deleted successfully");
  } catch (error) {
    res.status(500).json(error.message);
  }
};

//find all user

module.exports.Activate_Deactivate_Company_Account = async (req, res) => {
  try {
    const { error } = Company_ac_de_Account(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    let superadmintoken = await User.findOne(req.user);
    if (!superadmintoken)
      return res.status(404).json("super admin token  not found");

    let user = await User.findById(req.body.Company_id);
    if (!user) return res.status(400).json("Company Not Found");

    let status = user.Current_Status;
    if (status == "Activated") {
      status = "Deactivated";
    } else {
      status = "Activated";
    }
    user = await User.findByIdAndUpdate(
      req.body.Company_id,
      { $set: { Current_Status: status } },
      { new: true }
    );
    res.status(200).json(status);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports.FindCompanies = async (req, res) => {
  try {
    let user = await User.findOne(req.user);
    if (!user) return res.status(404).json("SUPER ADMIN  not found");

    const qCompanyId = req.query.Company_id;
    const qRole = req.query.role;
    const qStatus = req.query.status;

    let company, companies;
    if (qCompanyId) {
      company = await User.findById(req.query.Company_id);
    } else if (qRole && qStatus) {
      companies = await User.find({
        Role: { $in: qRole },
        Current_Status: { $in: qStatus },
      }).count();

      company = await User.find({
        Role: { $in: qRole },
        Current_Status: { $in: qStatus },
      });
    } else if (qRole) {
      companies = await User.find({
        Role: { $in: qRole },
      }).count();

      company = await User.find({
        Role: { $in: qRole },
      });
    } else {
      company = "Not Found";
    }

    res.status(200).json({ companies, company });
  } catch (error) {
    res.status(200).json(error.message);
  }
};
