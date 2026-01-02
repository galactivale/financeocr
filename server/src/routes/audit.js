const express = require('express');
const router = express.Router();
const pool = require('../config/database').pool;
const { logAuditAction, getAuditTrail, verifyAuditChain } = require('../utils/audit-logger');

/**
 * POST /api/audit/log
 * Log an audit action
 */
router.post('/log', async (req, res) => {
  try {
    const {
      action,
      entity_type,
      entity_id,
      client_id,
      upload_id,
      memo_id,
      details,
      severity,
      userId,
      organizationId
    } = req.body;

    if (!action || !entity_type || !entity_id) {
      return res.status(400).json({
        error: 'action, entity_type, and entity_id are required'
      });
    }

    // Log the action using the audit logger utility
    await logAuditAction(action, {
      entity_type,
      entity_id,
      client_id,
      upload_id,
      memo_id,
      details,
      severity: severity || 'INFO',
      userId,
      organizationId
    }, req);

    res.json({
      success: true,
      message: 'Audit action logged successfully'
    });
  } catch (error) {
    console.error('Failed to log audit action:', error);
    res.status(500).json({
      error: 'Failed to log audit action',
      message: error.message
    });
  }
});

/**
 * GET /api/audit/trail/:entityType/:entityId
 * Get audit trail for a specific entity
 */
router.get('/trail/:entityType/:entityId', async (req, res) => {
  try {
    const { entityType, entityId } = req.params;
    const { order = 'DESC', limit } = req.query;

    const trail = await getAuditTrail(entityType, entityId, {
      order,
      limit: limit ? parseInt(limit) : null
    });

    res.json(trail);
  } catch (error) {
    console.error('Failed to fetch audit trail:', error);
    res.status(500).json({
      error: 'Failed to fetch audit trail',
      message: error.message
    });
  }
});

/**
 * POST /api/audit/verify-chain
 * Verify the integrity of an audit chain for an entity
 */
router.post('/verify-chain', async (req, res) => {
  try {
    const { entityType, entityId } = req.body;

    if (!entityType || !entityId) {
      return res.status(400).json({
        error: 'entityType and entityId are required'
      });
    }

    const verificationResult = await verifyAuditChain(entityType, entityId);

    res.json(verificationResult);
  } catch (error) {
    console.error('Failed to verify audit chain:', error);
    res.status(500).json({
      error: 'Failed to verify audit chain',
      message: error.message
    });
  }
});

/**
 * GET /api/audit/actions
 * Get all available audit action types
 */
router.get('/actions', async (req, res) => {
  try {
    const { logAuditAction } = require('../utils/audit-logger');

    // Return the audit actions dictionary
    res.json({
      actions: {
        'UPLOAD_INITIATED': 'User began file upload',
        'PII_DETECTED': 'PII detected in upload',
        'PII_OVERRIDE': 'User proceeded despite PII warning',
        'PII_AUTO_EXCLUDED': 'PII columns automatically excluded',
        'MAPPING_CONFIRMED': 'User confirmed column mapping',
        'NORMALIZATION_APPROVED': 'User approved normalizations',
        'MEMO_GENERATED': 'Nexus memo generated',
        'MEMO_SEALED': 'Memo finalized with hash',
        'HASH_VERIFIED': 'Document hash verification passed',
        'TAMPER_DETECTED': 'Document hash verification failed',
        'STATUTE_OVERRIDE_CREATED': 'Firm guidance override entered',
        'STATUTE_OVERRIDE_VALIDATED': 'Statute override validated by supervisor',
        'APPROVAL_CREATED': 'Approval requirement created',
        'APPROVAL_SUBMITTED': 'Approval submitted by authorized user'
      }
    });
  } catch (error) {
    console.error('Failed to fetch audit actions:', error);
    res.status(500).json({
      error: 'Failed to fetch audit actions',
      message: error.message
    });
  }
});

module.exports = router;
