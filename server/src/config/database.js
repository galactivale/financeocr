const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const logger = require('../utils/logger');

// Create PostgreSQL pool for direct queries (used by critical gaps utilities)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Create Prisma client instance
const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'event',
      level: 'error',
    },
    {
      emit: 'event',
      level: 'info',
    },
    {
      emit: 'event',
      level: 'warn',
    },
  ],
});

// Log database queries in development
if (process.env.NODE_ENV === 'development') {
  prisma.$on('query', (e) => {
    console.log('Query: ' + e.query);
    console.log('Params: ' + e.params);
    console.log('Duration: ' + e.duration + 'ms');
  });
}

// Log database errors
prisma.$on('error', (e) => {
  console.error('Database error:', e);
});

// Log database info
prisma.$on('info', (e) => {
  console.log('Database info:', e);
});

// Log database warnings
prisma.$on('warn', (e) => {
  console.warn('Database warning:', e);
});

// Database connection function
async function connectDatabase() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Test the connection
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connection test passed');
    
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}

// Database disconnection function
async function disconnectDatabase() {
  try {
    await prisma.$disconnect();
    console.log('✅ Database disconnected successfully');
  } catch (error) {
    console.error('❌ Database disconnection failed:', error);
    throw error;
  }
}

// Database health check
async function checkDatabaseHealth() {
  try {
    const result = await prisma.$queryRaw`
      SELECT 
        current_database() as database_name,
        current_user as current_user,
        version() as version,
        now() as current_time
    `;
    
    return {
      status: 'healthy',
      ...result[0],
    };
  } catch (error) {
    console.error('Database health check failed:', error);
    return {
      status: 'unhealthy',
      error: error.message,
    };
  }
}

// Transaction helper
async function withTransaction(callback) {
  return await prisma.$transaction(callback);
}

// Raw query helper
async function rawQuery(query, params = []) {
  try {
    if (params.length > 0) {
      return await prisma.$queryRawUnsafe(query, ...params);
    }
    return await prisma.$queryRawUnsafe(query);
  } catch (error) {
    console.error('Raw query failed:', error);
    throw error;
  }
}

// Pagination helper
function getPaginationParams(page = 1, limit = 10) {
  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;
  
  return {
    page: pageNum,
    limit: limitNum,
    skip,
  };
}

// Search helper
function buildSearchCondition(searchTerm, searchFields) {
  if (!searchTerm || !searchFields.length) {
    return {};
  }
  
  return {
    OR: searchFields.map(field => ({
      [field]: {
        contains: searchTerm,
        mode: 'insensitive',
      },
    })),
  };
}

// Sort helper
function buildSortCondition(sortBy, sortOrder = 'asc') {
  if (!sortBy) {
    return { createdAt: 'desc' };
  }
  
  const order = sortOrder.toLowerCase() === 'desc' ? 'desc' : 'asc';
  return { [sortBy]: order };
}

module.exports = {
  prisma,
  pool,
  connectDatabase,
  disconnectDatabase,
  checkDatabaseHealth,
  withTransaction,
  rawQuery,
  getPaginationParams,
  buildSearchCondition,
  buildSortCondition,
};
