import express from 'express';
import {
  getAnalytics,
  getAnalyticsById
} from '../../controllers/admin/analytics.controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Analytics data management
 */

/**
 * @swagger
 * /api/analytics:
 *   get:
 *     summary: Get analytics overview
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics overview
 */
router.get('/', getAnalytics);

/**
 * @swagger
 * /api/analytics/{id}:
 *   get:
 *     summary: Get analytics by ID
 *     tags: [Analytics]
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
 *         description: Analytics details
 */
router.get('/:id', getAnalyticsById);

export default router;
