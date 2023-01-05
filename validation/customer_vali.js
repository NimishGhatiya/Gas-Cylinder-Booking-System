const Joi = require("joi");

module.exports.createCustomer_validate = (data) => {
  const schema = Joi.object({
    Company_id: Joi.string().required(),
    Distributor_id: Joi.string().required(),
    Name: Joi.string().min(5).max(30).uppercase().required(),
    Contact_Person_Name: Joi.string().required(),
    Contact_Person_Email: Joi.string().lowercase().required().email(),
    EPA_Reclaimer_Number: Joi.string().required(),
    Address: Joi.string().uppercase().min(5).max(50).required(),
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
    Name: Joi.string().min(5).max(30).uppercase().required(),
    Contact_Person_Name: Joi.string().required(),
    EPA_Reclaimer_Number: Joi.string().required(),
    Address: Joi.string().uppercase().min(5).max(50).required(),
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
