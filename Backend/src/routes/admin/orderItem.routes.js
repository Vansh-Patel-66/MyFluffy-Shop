import express from 'express';
import {
  createOrderItem,
  getOrderItems,
  getOrderItemById,
  updateOrderItem,
  deleteOrderItem
} from '../../controllers/admin/orderItem.controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: OrderItems
 *   description: Order Item management
 */

/**
 * @swagger
 * /api/order-items:
 *   post:
 *     summary: Create a new order item
 *     tags: [OrderItems]
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
 *     summary: Get all order items
 *     tags: [OrderItems]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of order items
 */
router.post('/', createOrderItem);
router.get('/', getOrderItems);

/**
 * @swagger
 * /api/order-items/{id}:
 *   get:
 *     summary: Get order item by ID
 *     tags: [OrderItems]
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
 *         description: Order item details
 *   put:
 *     summary: Update an order item
 *     tags: [OrderItems]
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
 *     summary: Delete an order item
 *     tags: [OrderItems]
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
router.get('/:id', getOrderItemById);
router.put('/:id', updateOrderItem);
router.delete('/:id', deleteOrderItem);

export default router;
