import express from 'express';
import validate from '../../middleware/validate.middleware.js';
import { createCategorySchema, updateCategorySchema } from '../../validations/category.validation.js';
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} from '../../controllers/admin/category.controller.js';

const router = express.Router();

router.post('/', validate(createCategorySchema), createCategory);
router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.put('/:id', validate(updateCategorySchema), updateCategory);
router.delete('/:id', deleteCategory);

export default router;
