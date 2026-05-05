import express from 'express';
import {
  createFooterContent,
  getFooterContents,
  getFooterContentById,
  updateFooterContent,
  deleteFooterContent
} from '../controllers/footer.controller.js';

const router = express.Router();

router.post('/', createFooterContent);
router.get('/', getFooterContents);
router.get('/:id', getFooterContentById);
router.put('/:id', updateFooterContent);
router.delete('/:id', deleteFooterContent);

export default router;
