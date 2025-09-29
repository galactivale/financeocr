const jwt = require('jsonwebtoken');
const { prisma } = require('../config/database');
const logger = require('../utils/logger');

// Authenticate JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: 'Access token required',
        code: 'MISSING_TOKEN',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        organization: true,
        userPermissions: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        error: 'Invalid token - user not found',
        code: 'INVALID_TOKEN',
      });
    }

    if (user.status !== 'active') {
      return res.status(401).json({
        error: 'Account is not active',
        code: 'ACCOUNT_INACTIVE',
      });
    }

    // Add user and organization to request
    req.user = user;
    req.organization = user.organization;
    req.organizationId = user.organizationId;

    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token',
        code: 'INVALID_TOKEN',
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expired',
        code: 'TOKEN_EXPIRED',
      });
    }

    return res.status(500).json({
      error: 'Authentication failed',
      code: 'AUTH_ERROR',
    });
  }
};

// Check if user has specific permission
const requirePermission = (resource, action) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        code: 'AUTH_REQUIRED',
      });
    }

    // Check if user has the required permission
    const hasPermission = req.user.userPermissions.some(permission => 
      permission.resource === resource && 
      permission.action === action && 
      permission.granted
    );

    if (!hasPermission) {
      return res.status(403).json({
        error: `Permission denied: ${action} on ${resource}`,
        code: 'PERMISSION_DENIED',
        required: { resource, action },
      });
    }

    next();
  };
};

// Check if user has specific role
const requireRole = (roles) => {
  const roleArray = Array.isArray(roles) ? roles : [roles];
  
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        code: 'AUTH_REQUIRED',
      });
    }

    if (!roleArray.includes(req.user.role)) {
      return res.status(403).json({
        error: `Role required: ${roleArray.join(' or ')}`,
        code: 'ROLE_REQUIRED',
        userRole: req.user.role,
        requiredRoles: roleArray,
      });
    }

    next();
  };
};

// Check if user belongs to specific organization
const requireOrganization = (req, res, next) => {
  if (!req.user || !req.organization) {
    return res.status(401).json({
      error: 'Organization context required',
      code: 'ORG_REQUIRED',
    });
  }

  next();
};

// Optional authentication (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: {
          organization: true,
          userPermissions: true,
        },
      });

      if (user && user.status === 'active') {
        req.user = user;
        req.organization = user.organization;
        req.organizationId = user.organizationId;
      }
    }

    next();
  } catch (error) {
    // Continue without authentication for optional auth
    next();
  }
};

// Generate JWT token
const generateToken = (user) => {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    organizationId: user.organizationId,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  });
};

// Generate refresh token
const generateRefreshToken = (user) => {
  const payload = {
    userId: user.id,
    type: 'refresh',
  };

  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });
};

// Verify refresh token
const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
};

module.exports = {
  authenticateToken,
  requirePermission,
  requireRole,
  requireOrganization,
  optionalAuth,
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
};
