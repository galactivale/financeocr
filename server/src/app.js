const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
require('express-async-errors');
require('dotenv').config();

// Import routes
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
const nexusRoutes = require('./routes/nexus');
const consultationRoutes = require('./routes/consultations');
const communicationRoutes = require('./routes/communications');
const dashboardRoutes = require('./routes/dashboards');
const personalizedDashboardRoutes = require('./routes/personalized-dashboard');
const enhancedClientRoutes = require('./routes/enhanced-clients');
const enhancedSystemRoutes = require('./routes/enhanced-system');
const enhancedNexusRoutes = require('./routes/enhanced-nexus');
const riskPortfolioRoutes = require('./routes/risk-portfolio');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

// Import database connection
const { connectDatabase } = require('./config/database');

// Import logger
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 3080;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://ray.st"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "data:", "https://ray.st"],
      connectSrc: ["'self'", "https:"],
    },
  },
}));

// Rate limiting removed

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'https://financeocr.com',
      'http://financeocr.com',
      'https://www.financeocr.com',
      'http://www.financeocr.com'
    ];
    
    // Check if the origin is in the allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // For development, also allow any localhost origin
    if (process.env.NODE_ENV === 'development' && origin.includes('localhost')) {
      return callback(null, true);
    }
    
    // Check environment variable for additional origins
    const envOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : [];
    if (envOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Length', 'Content-Type'],
  maxAge: 86400, // 24 hours
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan('combined', {
  stream: {
    write: (message) => console.log(message.trim()),
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

// API routes (no authentication required for demo)
app.use('/api/organizations', organizationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/decisions', decisionRoutes);
app.use('/api/compliance', complianceRoutes);
app.use('/api/integrations', integrationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/nexus', nexusRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/communications', communicationRoutes);
app.use('/api/dashboards', dashboardRoutes);
app.use('/api/personalized-dashboard', personalizedDashboardRoutes);
app.use('/api/enhanced-clients', enhancedClientRoutes);
app.use('/api/enhanced-system', enhancedSystemRoutes);
app.use('/api/enhanced-nexus', enhancedNexusRoutes);
app.use('/api/risk-portfolio', riskPortfolioRoutes);

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'VaultCPA API',
    version: '1.0.0',
    description: 'VaultCPA Backend API Server - Demo Mode (No Authentication Required)',
    endpoints: {
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
      nexus: '/api/nexus',
      dashboards: '/api/dashboards',
      personalizedDashboard: '/api/personalized-dashboard',
      enhancedClients: '/api/enhanced-clients',
      enhancedSystem: '/api/enhanced-system',
      enhancedNexus: '/api/enhanced-nexus',
      riskPortfolio: '/api/risk-portfolio',
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
