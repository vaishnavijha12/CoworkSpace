const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const compression = require('compression');
const helmet = require('helmet');
const connectDB = require('./config/database');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize express
const app = express();

// Performance & Security Middleware
app.use(helmet()); // Security headers
app.use(compression()); // Compress responses
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Response time tracking (optional)
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (duration > 1000) {
      console.log(`⚠️  Slow request: ${req.method} ${req.path} - ${duration}ms`);
    }
  });
  next();
});

// Cache control for static responses
app.use((req, res, next) => {
  if (req.method === 'GET') {
    res.set('Cache-Control', 'public, max-age=300'); // 5 min cache
  }
  next();
});

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Coworking Space Management API', status: 'running' });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Define routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/desks', require('./routes/desk'));
app.use('/api/rooms', require('./routes/meetingRoom'));
app.use('/api/announcements', require('./routes/announcement'));
app.use('/api/bookings', require('./routes/booking'));
app.use('/api/billing', require('./routes/billing'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : null,
  });
});

const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
  console.log('\n' + '='.repeat(50));
  console.log('🚀 OPTIMIZED COWORKING SPACE API');
  console.log('='.repeat(50));
  console.log(`✅ Server: http://localhost:${PORT}`);
  console.log(`🔗 Frontend: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
  console.log('⚡ Performance optimizations enabled');
  console.log('='.repeat(50) + '\n');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use.`);
    process.exit(1);
  }
  throw err;
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});