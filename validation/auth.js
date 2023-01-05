const Joi = require("joi");

module.exports.validateLogin = (data) => {
  const schema = Joi.object({
    Email: Joi.string().min(5).max(40).lowercase().required(),
    Password: Joi.string().min(6).max(15).required(),
  });
  return schema.validate(data);
};

module.exports.changepass = (data) => {
  const schema = Joi.object({
    Oldpassword: Joi.string()
      .min(6)
      .max(15)
      .required()
      .regex(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,15}$/,
        "Enter Strong Password......Must Enter Atleast 1 UpperCase 1 LowerCase ,1 Digit & 1 Special Character"
      ),
    Newpassword: Joi.string()
      .min(6)
      .max(15)
      .required()
      .regex(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,15}$/,
        "Enter Strong Password......Must Enter Atleast 1 UpperCase 1 LowerCase ,1 Digit & 1 Special Character"
      ),
  });
  return schema.validate(data);
};

module.exports.sendmailpass = (data) => {
  const schema = Joi.object({
    Email: Joi.string().min(5).max(40).lowercase().required(),
  });
  return schema.validate(data);
};

module.exports.resetpassvalidate = (data) => {
  const schema = Joi.object({
    Password: Joi.string()
      .min(6)
      .max(15)
      .required()
      .regex(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,15}$/,
        "Enter Strong Password......Must Enter Atleast 1 UpperCase 1 LowerCase ,1 Digit & 1 Special Character"
      ),
    ConfirmPassword: Joi.string()
      .min(6)
      .max(15)
      .required()
      .regex(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{6,15}$/,
        "Enter Strong Password......Must Enter Atleast 1 UpperCase 1 LowerCase ,1 Digit & 1 Special Character"
      ),
  });
  return schema.validate(data);
};
