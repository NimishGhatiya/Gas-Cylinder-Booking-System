const Joi = require("joi");

module.exports.assignedCylinder_validate = (data) => {
  const schema = Joi.object({
    Company_id: Joi.string().required(),
    Cylinder_id: Joi.string().required(),
    Distributor_id: Joi.string().required(),
  });
  return schema.validate(data);
};

module.exports.assignedCylinderUpdate_validate = (data) => {
  const schema = Joi.object({
    AssignCylinder_id: Joi.string().required(),
    Distributor_id: Joi.string().required(),
  });
  return schema.validate(data);
};
