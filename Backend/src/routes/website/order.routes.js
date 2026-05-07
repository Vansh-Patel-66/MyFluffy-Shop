import express from 'express';
import validate from '../../middleware/validate.middleware.js';
import { createOrderSchema, updateOrderSchema } from '../../validations/order.validation.js';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder
} from '../../controllers/website/order.controller.js';

const router = express.Router();

router.post('/', validate(createOrderSchema), createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.put('/:id', validate(updateOrderSchema), updateOrder);
router.delete('/:id', deleteOrder);

export default router;
