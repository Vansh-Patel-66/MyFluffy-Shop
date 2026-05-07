import express from 'express';
import {
  createContactUs,
  getContactUs,
  getContactUsById,
  updateContactUs,
  deleteContactUs
} from '../../controllers/admin/contactUs.controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: ContactUs
 *   description: Contact form management
 */

/**
 * @swagger
 * /api/contact-us:
 *   post:
 *     summary: Create a new contact entry
 *     tags: [ContactUs]
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
 *     summary: Get all contact entries
 *     tags: [ContactUs]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of contact entries
 */
router.post('/', createContactUs);
router.get('/', getContactUs);

/**
 * @swagger
 * /api/contact-us/{id}:
 *   get:
 *     summary: Get contact entry by ID
 *     tags: [ContactUs]
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
 *         description: Contact entry details
 *   put:
 *     summary: Update a contact entry
 *     tags: [ContactUs]
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
 *     summary: Delete a contact entry
 *     tags: [ContactUs]
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
router.get('/:id', getContactUsById);
router.put('/:id', updateContactUs);
router.delete('/:id', deleteContactUs);

export default router;
