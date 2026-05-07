import express from 'express';
import {
  createCart,
  getCarts,
  getCartById,
  deleteCart
} from '../../controllers/admin/cart.controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Carts
 *   description: Cart management
 */

/**
 * @swagger
 * /api/carts:
 *   post:
 *     summary: Create a new cart
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Created successfully
 *   get:
 *     summary: Get all carts
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of carts
 */
router.post('/', createCart);
router.get('/', getCarts);

/**
 * @swagger
 * /api/carts/{id}:
 *   get:
 *     summary: Get cart by ID
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cart details
 *   delete:
 *     summary: Delete a cart
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Deleted successfully
 */
router.get('/:id', getCartById);
router.delete('/:id', deleteCart);

export default router;
