import express from 'express';
import {
  createFooterContent,
  getFooterContents,
  getFooterContentById,
  updateFooterContent,
  deleteFooterContent
} from '../../controllers/website/footer.controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Footer
 *   description: Footer content management
 */

/**
 * @swagger
 * /api/footer:
 *   post:
 *     summary: Create new footer content
 *     tags: [Footer]
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
 *     summary: Get all footer contents
 *     tags: [Footer]
 *     responses:
 *       200:
 *         description: List of footer contents
 */
router.post('/', createFooterContent);
router.get('/', getFooterContents);

/**
 * @swagger
 * /api/footer/{id}:
 *   get:
 *     summary: Get footer content by ID
 *     tags: [Footer]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Footer content details
 *   put:
 *     summary: Update a footer content
 *     tags: [Footer]
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
 *     summary: Delete a footer content
 *     tags: [Footer]
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
router.get('/:id', getFooterContentById);
router.put('/:id', updateFooterContent);
router.delete('/:id', deleteFooterContent);

export default router;
