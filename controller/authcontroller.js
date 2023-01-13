const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const {
  validateLogin,
  changepass,
  sendmailpass,
  resetpassvalidate,
} = require("../validation/auth");
const { sendEmail } = require("./Email");
const Token = require("../models/token");

module.exports.user_login = async (req, res) => {
  try {
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    let user = await User.findOne({
      Contact_Person_Email: req.body.Email,
    });
    if (!user) res.status(400).json("Please Enter Valid Username");

    const validpass = await bcrypt.compare(req.body.Password, user.Password);
    if (!validpass) return res.status(401).json("Please Enter Valid Password");

    const token = await user.genAuthToken();
    const { ...others } = user._doc;
    res.status(200).json({ ...others, token });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports.setpass = async (req, res) => {
  try {
    const { error } = resetpassvalidate(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    let user = await User.findOne({
      Contact_Person_Email: req.params.Contact_Person_Email,
    });
    if (!user) return res.status(400).json("Invalid link or expired");

    const token = await Token.findOne({
      Email: req.params.Contact_Person_Email,
      token: req.params.token,
    });

    if (!token) return res.status(400).json("Invalid link or expired");

    const matchpass = req.body.Password === req.body.ConfirmPassword;
    if (!matchpass)
      return res
        .status(400)
        .json("Password not match......Please Enter Same Password");

    const salt = await bcrypt.genSalt(10);
    user.Password = await bcrypt.hash(req.body.Password, salt);

    await user.save();
    await token.delete();

    res.status(200).json("password set successfully");
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports.forgetpasslink = async (req, res) => {
  try {
    const { error } = sendmailpass(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    let user = await User.findOne({ Contact_Person_Email: req.body.Email });
    if (!user) return res.status(400).json("User not found");

    let token = await Token.findOne({ userId: user._id });

    if (!token) {
      token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }
    Email = user.Contact_Person_Email;
    const link = `${process.env.BASE_URL}/password-reset/${user._id}/${token.token}`;

    await sendEmail(Email, "password reset link", link);

    res.status(200).json("password reset link sent to your G-mail account");
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports.resetpass = async (req, res) => {
  try {
    const { error } = resetpassvalidate(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    const user = await User.findById(req.params.userId);
    if (!user) return res.status(400).json("Invalid link or expired");

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });

    if (!token) return res.status(400).json("Invalid link or expired");
    const matchpass = req.body.Password === req.body.ConfirmPassword;
    if (!matchpass)
      return res
        .status(400)
        .json("Password not match......Please Enter Same Password");

    const salt = await bcrypt.genSalt(10);
    user.Password = await bcrypt.hash(req.body.Password, salt);

    await user.save();
    await token.delete();

    res.status(200).json("password reset successfully");
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports.change_password = async (req, res) => {
  try {
    const { error } = changepass(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    let user = await User.findOne(req.user);
    if (!user) return res.status(404).json("user  not found");

    const validpass = await bcrypt.compare(req.body.Oldpassword, user.Password);
    if (!validpass) return res.status(401).json("old password was wrong");

    const matchpass = req.body.Newpassword === req.body.ConfirmPassword;
    if (!matchpass)
      return res
        .status(400)
        .json("Password not match......Please Enter Same Password");

    user = await User.findOneAndUpdate(
      req.user,
      {
        $set: {
          Password: req.body.Newpassword,
        },
      },
      { new: true }
    );

    const salt = await bcrypt.genSalt(10);
    user.Password = await bcrypt.hash(req.body.Newpassword, salt);
    await user.save();
    res.status(200).json("password Changed successfully");
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports.FindUsers = async (req, res) => {
  try {
    let userss = await User.findOne(req.user);
    if (!userss) return res.status(404).json("SUPER ADMIN  not found");

    const qId = req.query.id;
    const qRole = req.query.role;
    const qStatus = req.query.status;

    let user, users;
    if (qId) {
      user = await User.findById(req.query.id);
    } else if (qStatus) {
      users = await User.find({
        Current_Status: { $in: qStatus },
      }).count();

      user = await User.find({
        Current_Status: { $in: qStatus },
      });
    } else if (qRole) {
      users = await User.find({
        Role: { $in: qRole },
      }).count();

      user = await User.find({
        Role: { $in: qRole },
      });
    } else {
      users = await User.find().count();
      user = await User.find();
    }

    res.status(200).json({ users, user });
  } catch (error) {
    res.status(200).json(error.message);
  }
};
