import express from 'express';
import {
  getAnalytics,
  getAnalyticsById
} from '../../controllers/admin/analytics.controller.js';

const router = express.Router();

router.get('/', getAnalytics);
router.get('/:id', getAnalyticsById);

export default router;
