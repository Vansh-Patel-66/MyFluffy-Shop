import express from 'express';
import {
  createOrderItem,
  getOrderItems,
  getOrderItemById,
  updateOrderItem,
  deleteOrderItem
} from '../../controllers/admin/orderItem.controller.js';

const router = express.Router();

router.post('/', createOrderItem);
router.get('/', getOrderItems);
router.get('/:id', getOrderItemById);
router.put('/:id', updateOrderItem);
router.delete('/:id', deleteOrderItem);

export default router;
