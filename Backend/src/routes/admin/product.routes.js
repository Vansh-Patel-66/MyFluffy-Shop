import express from 'express';
import validate from '../../middleware/validate.middleware.js';
import { createProductSchema, updateProductSchema } from '../../validations/product.validation.js';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from '../../controllers/admin/product.controller.js';

const router = express.Router();

router.post('/', validate(createProductSchema), createProduct);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.put('/:id', validate(updateProductSchema), updateProduct);
router.delete('/:id', deleteProduct);

export default router;
