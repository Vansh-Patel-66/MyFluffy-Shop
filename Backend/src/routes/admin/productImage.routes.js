import express from "express";
import upload from "../../utils/cloudinaryConfig.js";
import {
  createProductImage,
  getProductImages,
  getProductImageById,
  updateProductImage,
  deleteProductImage,
} from "../../controllers/admin/productImage.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: ProductImages
 *   description: Product Image management
 */

/**
 * @swagger
 * /api/product-images:
 *   post:
 *     summary: Create a new product image
 *     tags: [ProductImages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               product_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created successfully
 *   get:
 *     summary: Get all product images
 *     tags: [ProductImages]
 *     responses:
 *       200:
 *         description: List of product images
 */
router.post("/", upload.single("image"), createProductImage);
router.get("/", getProductImages);

/**
 * @swagger
 * /api/product-images/{id}:
 *   get:
 *     summary: Get product image by ID
 *     tags: [ProductImages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product image details
 *   put:
 *     summary: Update a product image
 *     tags: [ProductImages]
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
 *     summary: Delete a product image
 *     tags: [ProductImages]
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
router.get("/:id", getProductImageById);
router.put("/:id", updateProductImage);
router.delete("/:id", deleteProductImage);

export default router;
