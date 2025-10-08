const express = require('express');
const { body } = require('express-validator');
const {
  register,
  login,
  refreshToken,
  logout,
  getProfile,
  updateProfile,
  changePassword,
} = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  body('firstName')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('First name is required and must be less than 100 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Last name is required and must be less than 100 characters'),
  body('organizationId')
    .isUUID()
    .withMessage('Valid organization ID is required'),
  body('role')
    .optional()
    .isIn(['managing-partner', 'tax-manager', 'system-admin'])
    .withMessage('Invalid role'),
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  body('organizationSlug')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Organization slug is required'),
];

const refreshTokenValidation = [
  body('refreshToken')
    .notEmpty()
    .withMessage('Refresh token is required'),
];

const updateProfileValidation = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('First name must be less than 100 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Last name must be less than 100 characters'),
  body('displayName')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Display name must be less than 255 characters'),
  body('title')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Title must be less than 100 characters'),
  body('department')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Department must be less than 100 characters'),
  body('cpaLicense')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('CPA license must be less than 100 characters'),
  body('cpaState')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('CPA state must be less than 50 characters'),
  body('cpaExpiration')
    .optional()
    .isISO8601()
    .withMessage('CPA expiration must be a valid date'),
];

const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
];

// Routes
router.post('/register', registerValidation, validateRequest, register);
router.post('/login', loginValidation, validateRequest, login);
router.post('/refresh', refreshTokenValidation, validateRequest, refreshToken);
router.post('/logout', authenticateToken, logout);
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfileValidation, validateRequest, updateProfile);
router.put('/change-password', authenticateToken, changePasswordValidation, validateRequest, changePassword);

module.exports = router;
