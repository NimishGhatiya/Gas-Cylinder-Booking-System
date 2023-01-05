const Joi = require("joi");

module.exports.Cylinder_create_validate = (data) => {
  const schema = Joi.object({
    Product: Joi.string().required(),
    Cylinder_Manufacturing_Serial_Number: Joi.string().required(),
    Supplier: Joi.string().required(),
    Status: Joi.string(),
  });
  return schema.validate(data);
};

module.exports.Cylinder_Update_validate = (data) => {
  const schema = Joi.object({
    Cylinder_id: Joi.string().required(),
    Product: Joi.string().required(),
    Cylinder_Manufacturing_Serial_Number: Joi.string().required(),
    Status: Joi.string().required(),
  });
  return schema.validate(data);
};
module.exports.Cylinder_act_dea = (data) => {
  const schema = Joi.object({
    Cylinder_id: Joi.string().required(),
  });
  return schema.validate(data);
};
