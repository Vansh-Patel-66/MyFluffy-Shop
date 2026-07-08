import Joi from "joi";

export const createCategorySchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  image_url: Joi.string().allow(null, '').optional(),
});

export const updateCategorySchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
  image_url: Joi.string().allow(null, '').optional(),
});
