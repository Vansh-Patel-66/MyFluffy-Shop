import express from 'express';
import {
  createCart,
  getCarts,
  getCartById,
  deleteCart
} from '../../controllers/admin/cart.controller.js';

const router = express.Router();

router.post('/', createCart);
router.get('/', getCarts);
router.get('/:id', getCartById);
router.delete('/:id', deleteCart);

export default router;
