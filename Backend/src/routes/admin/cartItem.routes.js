import express from 'express';
import {
  createCartItem,
  getCartItems,
  getCartItemById,
  updateCartItem,
  deleteCartItem
} from '../controllers/cartItem.controller.js';

const router = express.Router();

router.post('/', createCartItem);
router.get('/', getCartItems);
router.get('/:id', getCartItemById);
router.put('/:id', updateCartItem);
router.delete('/:id', deleteCartItem);

export default router;
