const bcrypt = require('bcryptjs');
const { prisma } = require('../config/database');
const { generateToken, generateRefreshToken, verifyRefreshToken } = require('../middleware/auth');
const logger = require('../utils/logger');

// Register new user
const register = async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      organizationId,
      role = 'tax-manager',
    } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
        organizationId,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User already exists in this organization',
      });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        firstName,
        lastName,
        displayName: `${firstName} ${lastName}`.trim(),
        organizationId,
        role,
        status: 'active',
      },
      include: {
        organization: true,
      },
    });

    // Generate tokens
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    // Create session
    await prisma.userSession.create({
      data: {
        userId: user.id,
        token: refreshToken,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    // Update login count
    await prisma.user.update({
      where: { id: user.id },
      data: {
        loginCount: { increment: 1 },
        lastLogin: new Date(),
      },
    });

    logger.info('User registered successfully', {
      userId: user.id,
      email: user.email,
      organizationId: user.organizationId,
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          displayName: user.displayName,
          role: user.role,
          organization: {
            id: user.organization.id,
            name: user.organization.name,
            slug: user.organization.slug,
          },
        },
        token,
        refreshToken,
      },
    });
  } catch (error) {
    logger.error('Registration error:', error);
    throw error;
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password, organizationSlug } = req.body;

    // Find organization by slug
    const organization = await prisma.organization.findUnique({
      where: { slug: organizationSlug },
    });

    if (!organization) {
      return res.status(400).json({
        success: false,
        error: 'Organization not found',
      });
    }

    // Find user
    const user = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
        organizationId: organization.id,
      },
      include: {
        organization: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    // Check user status
    if (user.status !== 'active') {
      return res.status(401).json({
        success: false,
        error: 'Account is not active',
      });
    }

    // Generate tokens
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    // Create session
    await prisma.userSession.create({
      data: {
        userId: user.id,
        token: refreshToken,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    // Update login count and last login
    await prisma.user.update({
      where: { id: user.id },
      data: {
        loginCount: { increment: 1 },
        lastLogin: new Date(),
      },
    });

    logger.info('User logged in successfully', {
      userId: user.id,
      email: user.email,
      organizationId: user.organizationId,
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          displayName: user.displayName,
          role: user.role,
          organization: {
            id: user.organization.id,
            name: user.organization.name,
            slug: user.organization.slug,
          },
        },
        token,
        refreshToken,
      },
    });
  } catch (error) {
    logger.error('Login error:', error);
    throw error;
  }
};

// Refresh token
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: 'Refresh token required',
      });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Check if session exists
    const session = await prisma.userSession.findFirst({
      where: {
        token: refreshToken,
        expiresAt: { gt: new Date() },
      },
      include: {
        user: {
          include: {
            organization: true,
          },
        },
      },
    });

    if (!session) {
      return res.status(401).json({
        success: false,
        error: 'Invalid refresh token',
      });
    }

    // Generate new tokens
    const newToken = generateToken(session.user);
    const newRefreshToken = generateRefreshToken(session.user);

    // Update session
    await prisma.userSession.update({
      where: { id: session.id },
      data: {
        token: newRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        token: newToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    logger.error('Token refresh error:', error);
    throw error;
  }
};

// Logout user
const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      // Delete session
      await prisma.userSession.deleteMany({
        where: {
          token: refreshToken,
        },
      });
    }

    logger.info('User logged out', {
      userId: req.user?.id,
    });

    res.json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    logger.error('Logout error:', error);
    throw error;
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        organization: true,
        userPermissions: true,
      },
    });

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          displayName: user.displayName,
          avatarUrl: user.avatarUrl,
          title: user.title,
          department: user.department,
          cpaLicense: user.cpaLicense,
          cpaState: user.cpaState,
          cpaExpiration: user.cpaExpiration,
          role: user.role,
          status: user.status,
          lastLogin: user.lastLogin,
          loginCount: user.loginCount,
          organization: {
            id: user.organization.id,
            name: user.organization.name,
            slug: user.organization.slug,
            subscriptionTier: user.organization.subscriptionTier,
          },
          permissions: user.userPermissions,
        },
      },
    });
  } catch (error) {
    logger.error('Get profile error:', error);
    throw error;
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      displayName,
      title,
      department,
      cpaLicense,
      cpaState,
      cpaExpiration,
    } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        firstName,
        lastName,
        displayName: displayName || `${firstName} ${lastName}`.trim(),
        title,
        department,
        cpaLicense,
        cpaState,
        cpaExpiration: cpaExpiration ? new Date(cpaExpiration) : null,
      },
      include: {
        organization: true,
      },
    });

    logger.info('User profile updated', {
      userId: user.id,
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          displayName: user.displayName,
          title: user.title,
          department: user.department,
          cpaLicense: user.cpaLicense,
          cpaState: user.cpaState,
          cpaExpiration: user.cpaExpiration,
          role: user.role,
          organization: {
            id: user.organization.id,
            name: user.organization.name,
            slug: user.organization.slug,
          },
        },
      },
    });
  } catch (error) {
    logger.error('Update profile error:', error);
    throw error;
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get user with password hash
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        error: 'Current password is incorrect',
      });
    }

    // Hash new password
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        passwordHash: newPasswordHash,
      },
    });

    // Delete all user sessions to force re-login
    await prisma.userSession.deleteMany({
      where: {
        userId: req.user.id,
      },
    });

    logger.info('User password changed', {
      userId: req.user.id,
    });

    res.json({
      success: true,
      message: 'Password changed successfully. Please login again.',
    });
  } catch (error) {
    logger.error('Change password error:', error);
    throw error;
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  getProfile,
  updateProfile,
  changePassword,
};
