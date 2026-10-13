require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const { connectDB, getIsMongoConnected } = require('./config/db');

// Route imports
const authRoutes = require('./routes/authRoutes');
const issueRoutes = require('./routes/issueRoutes');
const userRoutes = require('./routes/userRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
// In production, app.listen() is deferred until after the DB confirms ready,
// so no HTTP requests are accepted before MongoDB is connected.
// In development, listen() starts immediately (JSON fallback is acceptable).
const isProduction = process.env.NODE_ENV === 'production';

// Create server early so startListening() can reference it via closure.
const server = require('http').createServer(app);

const startListening = () => {
  server.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 CivicConnect API Server running on port ${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/api/health`);
    console.log(`======================================================\n`);
  });
};

if (isProduction) {
  // In production: only start listening after DB is confirmed ready.
  connectDB(startListening);
} else {
  // In development: start listening immediately; DB connects in background.
  connectDB();
  startListening();
}

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const multer = require('multer');

// CORS configuration supporting local development and configurable production origins
const clientUrl = process.env.CLIENT_URL;
const allowedOrigins = [
  clientUrl,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (tools, tests, postman)
    if (!origin) return callback(null, true);

    if (
      allowedOrigins.includes(origin) ||
      (process.env.NODE_ENV !== 'production' && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin))
    ) {
      return callback(null, true);
    }

    if (process.env.NODE_ENV === 'production') {
      return callback(new Error(`CORS policy blocked access from origin: ${origin}`));
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Serve uploaded images statically
app.use('/uploads', express.static(uploadsDir));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// Health check route — reports real DB status without exposing credentials
app.get('/api/health', (req, res) => {
  const mongoConnected = getIsMongoConnected();
  res.status(200).json({
    status: 'online',
    system: 'CivicConnect API',
    version: '1.0.0',
    database: mongoConnected ? 'connected' : 'json_fallback',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date()
  });
});

// Root API information
app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'Welcome to CivicConnect API',
    documentation: '/api/health'
  });
});

// 404 handler for unmatched routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.method} ${req.originalUrl}`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  // Handle multer file upload errors with 400 Bad Request
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size exceeds maximum allowed limit of 5 MB'
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message || 'File upload error'
    });
  }

  // Handle image mime-type filter errors with 400 Bad Request
  if (err.message && err.message.includes('Only image files')) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  console.error('Unhandled server error:', err);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error occurred'
  });
});


module.exports = app;
