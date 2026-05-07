import Joi from "joi";

export const createProductSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
  cost_price: Joi.number().optional(),
  selling_price: Joi.number().optional(),
  discount: Joi.number().optional(),
  stock: Joi.number().integer().optional(),
  category_id: Joi.string().uuid().optional(),
  image_url: Joi.string().uri().optional(),
  is_active: Joi.boolean().optional(),
});

export const updateProductSchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  cost_price: Joi.number().optional(),
  selling_price: Joi.number().optional(),
  discount: Joi.number().optional(),
  stock: Joi.number().integer().optional(),
  category_id: Joi.string().uuid().optional(),
  image_url: Joi.string().uri().optional(),
  is_active: Joi.boolean().optional(),
});
