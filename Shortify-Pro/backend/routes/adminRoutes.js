import express from 'express';
import { getAdminDashboard } from '../controllers/adminController.js';
import { allowRoles, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', protect, allowRoles('admin'), getAdminDashboard);

export default router;
