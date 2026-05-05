import express from 'express';
import {
  createProductImage,
  getProductImages,
  getProductImageById,
  updateProductImage,
  deleteProductImage
} from '../controllers/productImage.controller.js';

const router = express.Router();

router.post('/', createProductImage);
router.get('/', getProductImages);
router.get('/:id', getProductImageById);
router.put('/:id', updateProductImage);
router.delete('/:id', deleteProductImage);

export default router;
