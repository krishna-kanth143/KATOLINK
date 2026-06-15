import express from 'express';
import { shortenUrlV1 } from '../controllers/apiController.js';
import { apiKeyAuth } from '../middleware/apiAuthMiddleware.js';

const router = express.Router();

router.post('/shorten', apiKeyAuth, shortenUrlV1);

export default router;
