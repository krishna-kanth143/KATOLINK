import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import urlRoutes from './routes/urlRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import apiRoutes from './routes/apiRoutes.js';
import { redirectShortUrl } from './controllers/urlController.js';

import { createServer } from 'http';
import { initSocket } from './services/socketService.js';

dotenv.config();

// Startup Checks
if (!process.env.JWT_SECRET) {
  console.error('[CRITICAL] JWT_SECRET is not defined!');
  process.exit(1);
}

connectDB();
console.log("Mongo URI loaded:", !!process.env.MONGODB_URI);

const app = express();
const httpServer = createServer(app);
initSocket(httpServer);

console.log('[SYSTEM] KatoLink Engine Initialized');

app.use(helmet());
app.use(cors({ 
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', 
  credentials: true 
}));
app.use(express.json({ limit: '10kb' })); // Rate limit payload size
app.use(morgan('[:timestamp] :method :url :status :response-time ms'));

// Custom Timestamp for Morgan
morgan.token('timestamp', () => new Date().toISOString());

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes' }
});

// Apply limiter to auth and creation routes
app.use('/api/auth', limiter);
app.use('/api/url/create', limiter);
app.use('/api/url/bulk', limiter);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Shortify Pro API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/url', urlRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/dashboard', analyticsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/v1', apiRoutes);

// Public redirect endpoint requested in Phase 6.
app.get('/:shortCode', redirectShortUrl);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
