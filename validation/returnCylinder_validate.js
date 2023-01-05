const Joi = require("joi");

module.exports.Return_Cylinder_validate = (data) => {
  const schema = Joi.object({
    Company_id: Joi.string().required(),
    Cylinder_id: Joi.string().required(),
    Distributor_id: Joi.string().required(),
    Cylinder_Status: Joi.string().required(),
  });
  return schema.validate(data);
};
