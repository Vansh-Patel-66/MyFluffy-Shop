import Joi from "joi";

const imageUrlValidation = Joi.string().custom((val, helpers) => {
  if (!val) return val;
  if (val.startsWith('/public/') || /^https?:\/\//.test(val)) return val;
  return helpers.error('string.uri');
}).allow(null, '').optional();

export const createProductSchema = Joi.object({
  name: Joi.string().required(),
  slug: Joi.string().optional(),
  description: Joi.string().optional(),
  cost_price: Joi.number().optional(),
  selling_price: Joi.number().optional(),
  discount: Joi.number().optional(),
  stock: Joi.number().integer().optional(),
  category_id: Joi.string().uuid().allow(null, '').optional(),
  image_url: imageUrlValidation,
  image_urls: Joi.array().items(imageUrlValidation).optional(),
  badge: Joi.string().optional(),
  rating: Joi.number().optional(),
  number_of_ratings: Joi.number().integer().optional(),
  sizes: Joi.string().optional(),
  colors: Joi.string().optional(),
  material: Joi.string().optional(),
  care: Joi.string().optional(),
  featured_on_homepage: Joi.boolean().optional(),
  is_active: Joi.boolean().optional(),
});

export const updateProductSchema = Joi.object({
  name: Joi.string().optional(),
  slug: Joi.string().optional(),
  description: Joi.string().optional(),
  cost_price: Joi.number().optional(),
  selling_price: Joi.number().optional(),
  discount: Joi.number().optional(),
  stock: Joi.number().integer().optional(),
  category_id: Joi.string().uuid().allow(null, '').optional(),
  image_url: imageUrlValidation,
  image_urls: Joi.array().items(imageUrlValidation).optional(),
  badge: Joi.string().optional(),
  rating: Joi.number().optional(),
  number_of_ratings: Joi.number().integer().optional(),
  sizes: Joi.string().optional(),
  colors: Joi.string().optional(),
  material: Joi.string().optional(),
  care: Joi.string().optional(),
  featured_on_homepage: Joi.boolean().optional(),
  is_active: Joi.boolean().optional(),
});
