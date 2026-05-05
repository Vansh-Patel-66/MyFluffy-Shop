import express from 'express';
import {
  createContactUs,
  getContactUs,
  getContactUsById,
  updateContactUs,
  deleteContactUs
} from '../controllers/contactUs.controller.js';

const router = express.Router();

router.post('/', createContactUs);
router.get('/', getContactUs);
router.get('/:id', getContactUsById);
router.put('/:id', updateContactUs);
router.delete('/:id', deleteContactUs);

export default router;
