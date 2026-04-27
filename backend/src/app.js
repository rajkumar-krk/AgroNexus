import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';

import errorHandler from './middleware/errorHandler.js';
import { errorResponse } from './utils/apiResponse.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import farmRoutes from './routes/farmRoutes.js';
import cropRoutes from './routes/cropRoutes.js';
import diseaseRoutes from './routes/diseaseRoutes.js';
import pestRoutes from './routes/pestRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import weatherRoutes from './routes/weatherRoutes.js';
import advisoryRoutes from './routes/advisoryRoutes.js';
import marketRoutes from './routes/marketRoutes.js';
import listingRoutes from './routes/listingRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import groupOrderRoutes from './routes/groupOrderRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import batchRoutes from './routes/batchRoutes.js';
import telemetryRoutes from './routes/telemetryRoutes.js';
import spoilageRoutes from './routes/spoilageRoutes.js';
import shipmentRoutes from './routes/shipmentRoutes.js';
import thingspeakRoutes from './routes/thingspeakRoutes.js';
import sensorRoutes from './routes/sensorRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

const app = express();

// Security headers
app.use(helmet());

// CORS — supports comma-separated CLIENT_URL for multiple origins
const allowedOrigins = (process.env.CLIENT_URL || '')
    .split(',')
    .map((u) => u.trim())
    .filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, Render health checks)
        if (!origin) return callback(null, true);
        if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
}));

// Logging — only in development
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiter — 100 requests per 15 min window per IP
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: process.env.NODE_ENV === 'development' ? 10000 : 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests. Try again later.' },
});
app.use('/api/', limiter);

// Root route to prevent 404 on base URL
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to the AgroNexus API Server! The server is running successfully.',
        healthCheck: '/api/v1/health',
        apiDocs: '/api/v1/'
    });
});

// Health check
app.get('/api/v1/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        environment: process.env.NODE_ENV,
        version: '1.0.0',
    });
});

// API documentation
app.get('/api/v1', (req, res) => {
    res.json({
        name: 'FarmOS API',
        version: '1.0.0',
        description: 'Agricultural platform backend for Indian farmers',
        endpoints: {
            auth: { base: '/api/v1/auth', routes: ['POST /register', 'POST /verify-phone', 'POST /resend-otp', 'POST /login', 'POST /refresh', 'POST /logout', 'GET /me', 'POST /forgot-password', 'POST /reset-password'] },
            farms: { base: '/api/v1/farms', routes: ['GET /my', 'POST /', 'GET /nearby', 'GET /:farmId', 'PUT /:farmId', 'DELETE /:farmId'] },
            crops: { base: '/api/v1/crops', routes: ['POST /', 'GET /', 'GET /analytics/farm/:farmId', 'GET /:cropId', 'PUT /:cropId', 'DELETE /:cropId', 'POST /:cropId/inputs', 'GET /:cropId/analytics'] },
            diseases: { base: '/api/v1/diseases', routes: ['GET /', 'GET /:id', 'POST /diagnose', 'GET /reports/my'] },
            pests: { base: '/api/v1/pests', routes: ['POST /report', 'GET /nearby', 'GET /my', 'PUT /:alertId/status'] },
            notifications: { base: '/api/v1/notifications', routes: ['GET /', 'PUT /read-all', 'PUT /:id/read'] },
            weather: { base: '/api/v1/weather', routes: ['GET /current', 'GET /forecast', 'GET /alerts', 'GET /spray-windows', 'GET /history'] },
            advisories: { base: '/api/v1/advisories', routes: ['GET /', 'GET /search', 'GET /:id', 'POST /'] },
            market: { base: '/api/v1/market', routes: ['GET /prices', 'GET /latest', 'GET /trend', 'GET /best-sell-day'] },
            listings: { base: '/api/v1/listings', routes: ['GET /', 'POST /', 'GET /my', 'GET /demands', 'GET /:id', 'PUT /:id', 'DELETE /:id', 'POST /:id/lock-price'] },
            orders: { base: '/api/v1/orders', routes: ['POST /', 'GET /', 'GET /stats', 'GET /:orderId', 'PUT /:orderId/status'] },
            groupOrders: { base: '/api/v1/group-orders', routes: ['GET /', 'POST /', 'GET /my', 'GET /:id', 'POST /:id/join', 'DELETE /:id/leave', 'PUT /:id/close'] },
            analytics: { base: '/api/v1/analytics', routes: ['GET /dashboard', 'GET /profitability', 'GET /crop-calendar', 'GET /inputs', 'GET /yield-dna'] },
        },
    });
});

// Mount routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/farms', farmRoutes);
app.use('/api/v1/crops', cropRoutes);
app.use('/api/v1/diseases', diseaseRoutes);
app.use('/api/v1/pests', pestRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/weather', weatherRoutes);
app.use('/api/v1/advisories', advisoryRoutes);
app.use('/api/v1/market', marketRoutes);
app.use('/api/v1/listings', listingRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/group-orders', groupOrderRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/batches', batchRoutes);
app.use('/api/v1/telemetry', telemetryRoutes);
app.use('/api/v1/spoilage', spoilageRoutes);
app.use('/api/v1/shipments', shipmentRoutes);
app.use('/api/v1/thingspeak', thingspeakRoutes);
app.use('/api/v1/sensor', sensorRoutes);
app.use('/api/v1/alerts', alertRoutes);
app.use('/api/v1/ai', aiRoutes);

// 404 handler
app.use('*', (req, res) => {
    errorResponse(res, `Route not found: ${req.originalUrl}`, 404);
});

// Global error handler
app.use(errorHandler);

export default app;
