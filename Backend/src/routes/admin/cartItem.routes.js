import express from 'express';
import {
  createCartItem,
  getCartItems,
  getCartItemById,
  updateCartItem,
  deleteCartItem
} from '../../controllers/admin/cartItem.controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: CartItems
 *   description: Cart Item management
 */

/**
 * @swagger
 * /api/cart-items:
 *   post:
 *     summary: Create a new cart item
 *     tags: [CartItems]
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
 *     summary: Get all cart items
 *     tags: [CartItems]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of cart items
 */
router.post('/', createCartItem);
router.get('/', getCartItems);

/**
 * @swagger
 * /api/cart-items/{id}:
 *   get:
 *     summary: Get cart item by ID
 *     tags: [CartItems]
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
 *         description: Cart item details
 *   put:
 *     summary: Update a cart item
 *     tags: [CartItems]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Updated successfully
 *   delete:
 *     summary: Delete a cart item
 *     tags: [CartItems]
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
router.get('/:id', getCartItemById);
router.put('/:id', updateCartItem);
router.delete('/:id', deleteCartItem);

export default router;
