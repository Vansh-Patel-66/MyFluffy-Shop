import express from 'express';
import validate from '../../middleware/validate.middleware.js';
import { createAddressSchema, updateAddressSchema } from '../../validations/address.validation.js';
import {
  createAddress,
  getAddresses,
  getAddressById,
  updateAddress,
  deleteAddress
} from '../../controllers/admin/address.controller.js';

const router = express.Router();

router.post('/', validate(createAddressSchema), createAddress);
router.get('/', getAddresses);
router.get('/:id', getAddressById);
router.put('/:id', validate(updateAddressSchema), updateAddress);
router.delete('/:id', deleteAddress);

export default router;
