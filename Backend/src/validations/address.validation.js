import Joi from "joi";

export const createAddressSchema = Joi.object({
  user_id: Joi.string().uuid().required(),
  full_name: Joi.string().required(),
  phone: Joi.string().optional(),
  address_line: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  country: Joi.string().optional(),
  pincode: Joi.string().required(),
  is_default: Joi.boolean().optional(),
});

export const updateAddressSchema = Joi.object({
  full_name: Joi.string().optional(),
  phone: Joi.string().optional(),
  address_line: Joi.string().optional(),
  city: Joi.string().optional(),
  state: Joi.string().optional(),
  country: Joi.string().optional(),
  pincode: Joi.string().optional(),
  is_default: Joi.boolean().optional(),
});
