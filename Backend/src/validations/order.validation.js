import Joi from "joi";

export const createOrderSchema = Joi.object({
  user_id: Joi.string().uuid().required(),
  sub_total_amount: Joi.number().required(),
  discount_amount: Joi.number().optional(),
  delivery_charge: Joi.number().optional(),
  finale_amount: Joi.number().required(),
  tax_amount: Joi.number().optional(),
  payment_status: Joi.string().optional(),
  order_status: Joi.string().optional(),
});

export const updateOrderSchema = Joi.object({
  sub_total_amount: Joi.number().optional(),
  discount_amount: Joi.number().optional(),
  delivery_charge: Joi.number().optional(),
  finale_amount: Joi.number().optional(),
  tax_amount: Joi.number().optional(),
  payment_status: Joi.string().optional(),
  order_status: Joi.string().optional(),
});
