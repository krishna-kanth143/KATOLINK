import express from 'express';
import { 
  getDashboardAnalytics, 
  getSingleUrlAnalytics, 
  getQrAnalytics, 
  getDashboardMetrics, 
  getRecentLinksList, 
  getAnalyticsOverview 
} from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', protect, getDashboardAnalytics);
router.get('/metrics', protect, getDashboardMetrics);
router.get('/recent-links', protect, getRecentLinksList);
router.get('/overview', protect, getAnalyticsOverview);
router.get('/url/:id', protect, getSingleUrlAnalytics);
router.get('/qr', protect, getQrAnalytics);

export default router;
