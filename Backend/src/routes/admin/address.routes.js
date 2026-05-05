import express from 'express';
import {
  createAddress,
  getAddresses,
  getAddressById,
  updateAddress,
  deleteAddress
} from '../../controllers/admin/address.controller.js';

const router = express.Router();

router.post('/', createAddress);
router.get('/', getAddresses);
router.get('/:id', getAddressById);
router.put('/:id', updateAddress);
router.delete('/:id', deleteAddress);

export default router;
