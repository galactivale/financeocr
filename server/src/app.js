const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('express-async-errors');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const organizationRoutes = require('./routes/organizations');
const userRoutes = require('./routes/users');
const clientRoutes = require('./routes/clients');
const alertRoutes = require('./routes/alerts');
const taskRoutes = require('./routes/tasks');
const documentRoutes = require('./routes/documents');
const decisionRoutes = require('./routes/decisions');
const complianceRoutes = require('./routes/compliance');
const integrationRoutes = require('./routes/integrations');
const analyticsRoutes = require('./routes/analytics');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');
const { authenticateToken } = require('./middleware/auth');

// Import database connection
const { connectDatabase } = require('./config/database');

// Import logger
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim()),
  },
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/organizations', authenticateToken, organizationRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/clients', authenticateToken, clientRoutes);
app.use('/api/alerts', authenticateToken, alertRoutes);
app.use('/api/tasks', authenticateToken, taskRoutes);
app.use('/api/documents', authenticateToken, documentRoutes);
app.use('/api/decisions', authenticateToken, decisionRoutes);
app.use('/api/compliance', authenticateToken, complianceRoutes);
app.use('/api/integrations', authenticateToken, integrationRoutes);
app.use('/api/analytics', authenticateToken, analyticsRoutes);

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'VaultCPA API',
    version: '1.0.0',
    description: 'VaultCPA Backend API Server',
    endpoints: {
      auth: '/api/auth',
      organizations: '/api/organizations',
      users: '/api/users',
      clients: '/api/clients',
      alerts: '/api/alerts',
      tasks: '/api/tasks',
      documents: '/api/documents',
      decisions: '/api/decisions',
      compliance: '/api/compliance',
      integrations: '/api/integrations',
      analytics: '/api/analytics',
    },
    documentation: '/api/docs',
  });
});

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Database connection and server startup
async function startServer() {
  try {
    // Connect to database
    await connectDatabase();
    console.log('Database connected successfully');

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 VaultCPA Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      console.log(`📚 API documentation: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Start the server
startServer();

module.exports = app;
