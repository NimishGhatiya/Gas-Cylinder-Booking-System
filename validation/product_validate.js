const Joi = require("joi");

module.exports.product_create_validate = (data) => {
  const schema = Joi.object({
    Company_id: Joi.string().required(),
    Title: Joi.string().required(),
    Size: Joi.string().required(),
    Rating: Joi.number().required(),
    Type: Joi.string().required(),
  });
  return schema.validate(data);
};

module.exports.product_update_validate = (data) => {
  const schema = Joi.object({
    Product_id: Joi.string().required(),
    Title: Joi.string().required(),
    Size: Joi.string().required(),
    Rating: Joi.number().required(),
    Type: Joi.string().required(),
  });
  return schema.validate(data);
};
