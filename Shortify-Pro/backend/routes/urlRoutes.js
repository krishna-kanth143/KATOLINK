import express from 'express';
import {
  createShortUrl,
  bulkCreateUrls,
  deleteUrl,
  getMyUrls,
  redirectShortUrl,
  updateUrl,
  getUrlPreview
} from '../controllers/urlController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', protect, createShortUrl);
router.post('/bulk', protect, bulkCreateUrls);
router.get('/user', protect, getMyUrls);
router.get('/preview/:shortCode', getUrlPreview);
router.put('/:id', protect, updateUrl);
router.delete('/:id', protect, deleteUrl);
router.get('/r/:shortCode', redirectShortUrl);

export default router;
