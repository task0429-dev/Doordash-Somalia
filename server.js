// DoorDash Somalia MVP Server - Security Hardened 🛡️
// Load env first
require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const auditMiddleware = require('./middleware/auditLog');
const codGuard = require('./middleware/codAbuseGuard');
const logger = require('./lib/logger');

const app = express();
const PORT = process.env.PORT || 3000;

// Security Headers
app.use(helmet());

// CORS - Somalia-first (restrict to app domains)
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : 'http://localhost:3000',
  credentials: true
}));

// Logging
app.use(morgan('combined', { stream: logger.stream }));

// Rate Limiting - IP-based, Redis optional (memory for MVP)
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60 * 1000, // 1 min
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
  skip: (req) => req.path === '/health' // Skip health checks
});
app.use('/api/', limiter);

// Audit all sensitive endpoints
app.use('/api/orders', auditMiddleware);

// COD Abuse Guards on order endpoints
app.use('/api/orders/cod', codGuard);

// Health/Readiness
app.get('/health', (req, res) => res.status(200).json({ status: 'ok', uptime: process.uptime() }));
app.get('/ready', (req, res) => res.status(200).json({ status: 'ready' }));

// MVP Routes - COD Orders (Somalia location model)
app.post('/api/orders/cod', (req, res) => {
  // Simulate COD order: lat/lng + landmark + phone verify
  const { lat, lng, landmark, phone, amount } = req.body;
  if (!lat || !lng || !landmark || !phone.startsWith('252') || amount < 5000) {
    return res.status(400).json({ error: 'Invalid Somalia location or COD params' });
  }
  logger.info(`COD order: phone=${phone}, amount=${amount}, location=${landmark}`);
  res.json({ orderId: 'mock-' + Date.now(), status: 'accepted' });
});

// Catch-all 404
app.use('*', (req, res) => res.status(404).json({ error: 'Not found' }));

// Error handler (audit errors)
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

module.exports = app;
