const Joi = require("joi");

module.exports.createDistributor_validate = (data) => {
  const schema = Joi.object({
    Company_id: Joi.string().required(),
    Name: Joi.string()
      .min(5)
      .max(30)
      .uppercase()
      .required()
      .regex(
        /^[a-z]|\d?[a-zA-Z0-9]?[a-zA-Z0-9\s&@.]+$/,
        "....................Please Enter Valid Distributor Company Name"
      ),
    Contact_Person_Name: Joi.string()
      .required()
      .regex(
        /^[A-Z]{1}[a-z]+((\s)[A-Z]{1}[a-z]*)+$/,
        "................Please Enter a Valid Name"
      ),
    Contact_Person_Email: Joi.string()
      .lowercase()
      .required()
      .email()
      .regex(/[a-z0-9]+@[a-z]+.[a-z]{2,3}/, "Enter Valid Email"),
    EPA_Reclaimer_Number: Joi.string().required(),
    Address: Joi.required(),
    Phone: Joi.string()
      .required()
      .regex(
        /^[6789][0-9]{9}$/,
        "............Please Enter a Valid Phone Number"
      ),
    Website: Joi.string()
      .lowercase()
      .required()
      .trim()
      .regex(
        /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$/,
        "Enter valid Website"
      ),
    Current_Status: Joi.string(),
  });
  return schema.validate(data);
};

module.exports.UpdateDistributor_validate = (data) => {
  const schema = Joi.object({
    distributor_id: Joi.string().required(),
    Name: Joi.string()
      .min(5)
      .max(30)
      .uppercase()
      .required()
      .regex(
        /^[a-z]|\d?[a-zA-Z0-9]?[a-zA-Z0-9\s&@.]+$/,
        "....................Please Enter Valid Distributor Company Name"
      ),
    Contact_Person_Name: Joi.string()
      .required()
      .regex(
        /^[A-Z]{1}[a-z]+((\s)[A-Z]{1}[a-z]*)+$/,
        "................Please Enter a Valid Name"
      ),
    EPA_Reclaimer_Number: Joi.string().required(),
    Address: Joi.required(),
    Website: Joi.string()
      .lowercase()
      .required()
      .trim()
      .regex(
        /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$/,
        "Enter valid Website"
      ),
  });
  return schema.validate(data);
};

module.exports.Distributor_ac_de_Account = (data) => {
  const schema = Joi.object({
    Distributor_id: Joi.string().required(),
  });
  return schema.validate(data);
};
