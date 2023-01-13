const Joi = require("joi");

module.exports.createCustomer_validate = (data) => {
  const schema = Joi.object({
    Company_id: Joi.string().required(),
    Distributor_id: Joi.string().required(),
    Name: Joi.string()
      .min(5)
      .max(30)
      .uppercase()
      .required()
      .regex(
        /^[a-z]|\d?[a-zA-Z0-9]?[a-zA-Z0-9\s&@.]+$/,
        "....................Please Enter Valid Customer Name"
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
    Max_Units: Joi.number().required(),
    Current_Status: Joi.string(),
  });
  return schema.validate(data);
};

module.exports.updateCustomer_validate = (data) => {
  const schema = Joi.object({
    Customer_id: Joi.string().required(),
    Name: Joi.string()
      .min(5)
      .max(30)
      .uppercase()
      .required()
      .regex(
        /^[a-z]|\d?[a-zA-Z0-9]?[a-zA-Z0-9\s&@.]+$/,
        "....................Please Enter Valid  Customer Name"
      ),
    Contact_Person_Name: Joi.string()
      .required()
      .regex(
        /^[A-Z]{1}[a-z]+((\s)[A-Z]{1}[a-z]*)+$/,
        "................Please Enter a Valid Name"
      ),
    EPA_Reclaimer_Number: Joi.string().required(),
    Address: Joi.required(),
    Max_Units: Joi.number().required(),
  });
  return schema.validate(data);
};
module.exports.Customer_ac_de_Account_validate = (data) => {
  const schema = Joi.object({
    Customer_id: Joi.string().required(),
  });
  return schema.validate(data);
};
