const express = require('express');
const router = express.Router();
const pool = require('../config/database').pool;
const { logAuditAction } = require('../utils/audit-logger');

/**
 * POST /api/approvals/requirements
 * Create an approval requirement
 */
router.post('/requirements', async (req, res) => {
  try {
    const {
      entity_type,
      entity_id,
      approval_type,
      required_role,
      organizationId,
      clientId
    } = req.body;

    if (!entity_type || !entity_id || !approval_type || !required_role || !organizationId) {
      return res.status(400).json({
        error: 'entity_type, entity_id, approval_type, required_role, and organizationId are required'
      });
    }

    const query = `
      INSERT INTO approval_requirements (
        organization_id,
        entity_type,
        entity_id,
        approval_type,
        required_role,
        client_id,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING *
    `;

    const values = [
      organizationId,
      entity_type,
      entity_id,
      approval_type,
      required_role,
      clientId || null
    ];

    const result = await pool.query(query, values);

    // Log audit action
    await logAuditAction('APPROVAL_CREATED', {
      entity_type,
      entity_id,
      organizationId,
      details: {
        approval_type,
        required_role
      }
    });

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Failed to create approval requirement:', error);
    res.status(500).json({
      error: 'Failed to create approval requirement',
      message: error.message
    });
  }
});

/**
 * POST /api/approvals
 * Submit an approval
 */
router.post('/', async (req, res) => {
  try {
    const { approvalId, userId, notes } = req.body;

    if (!approvalId || !userId) {
      return res.status(400).json({
        error: 'approvalId and userId are required'
      });
    }

    // First, get the approval requirement
    const requirementQuery = `
      SELECT * FROM approval_requirements
      WHERE id = $1
    `;
    const requirementResult = await pool.query(requirementQuery, [approvalId]);

    if (requirementResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Approval requirement not found'
      });
    }

    const requirement = requirementResult.rows[0];

    // Create the approval
    const approvalQuery = `
      INSERT INTO approvals (
        organization_id,
        entity_type,
        entity_id,
        approval_type,
        required_role,
        approved_by,
        approved_at,
        notes,
        status
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7, 'APPROVED')
      RETURNING *
    `;

    const approvalValues = [
      requirement.organization_id,
      requirement.entity_type,
      requirement.entity_id,
      requirement.approval_type,
      requirement.required_role,
      userId,
      notes || null
    ];

    const approvalResult = await pool.query(approvalQuery, approvalValues);

    // Update the requirement status
    await pool.query(
      `UPDATE approval_requirements SET status = 'APPROVED' WHERE id = $1`,
      [approvalId]
    );

    // Log audit action
    await logAuditAction('APPROVAL_SUBMITTED', {
      entity_type: requirement.entity_type,
      entity_id: requirement.entity_id,
      organizationId: requirement.organization_id,
      userId,
      details: {
        approval_type: requirement.approval_type,
        notes
      }
    });

    res.json(approvalResult.rows[0]);
  } catch (error) {
    console.error('Failed to submit approval:', error);
    res.status(500).json({
      error: 'Failed to submit approval',
      message: error.message
    });
  }
});

/**
 * GET /api/approvals/status/:entityType/:entityId
 * Check approval status for an entity
 */
router.get('/status/:entityType/:entityId', async (req, res) => {
  try {
    const { entityType, entityId } = req.params;

    // Check if approval is required
    const requirementQuery = `
      SELECT * FROM approval_requirements
      WHERE entity_type = $1 AND entity_id = $2
      ORDER BY created_at DESC
    `;
    const requirementResult = await pool.query(requirementQuery, [entityType, entityId]);

    if (requirementResult.rows.length === 0) {
      return res.json({
        required: false,
        approved: false,
        approvals: []
      });
    }

    // Get all approvals for this entity
    const approvalsQuery = `
      SELECT * FROM approvals
      WHERE entity_type = $1 AND entity_id = $2
      ORDER BY approved_at DESC
    `;
    const approvalsResult = await pool.query(approvalsQuery, [entityType, entityId]);

    const approved = approvalsResult.rows.length > 0 &&
      approvalsResult.rows.some(a => a.status === 'APPROVED');

    res.json({
      required: true,
      approved,
      requirements: requirementResult.rows,
      approvals: approvalsResult.rows
    });
  } catch (error) {
    console.error('Failed to check approval status:', error);
    res.status(500).json({
      error: 'Failed to check approval status',
      message: error.message
    });
  }
});

/**
 * GET /api/approvals/pending
 * Get all pending approvals for an organization
 */
router.get('/pending', async (req, res) => {
  try {
    const { organizationId } = req.query;

    if (!organizationId) {
      return res.status(400).json({
        error: 'organizationId is required'
      });
    }

    const query = `
      SELECT ar.*,
        COALESCE(
          (SELECT COUNT(*) FROM approvals a
           WHERE a.entity_type = ar.entity_type
           AND a.entity_id = ar.entity_id
           AND a.status = 'APPROVED'), 0
        ) as approval_count
      FROM approval_requirements ar
      WHERE ar.organization_id = $1
      AND ar.status = 'PENDING'
      ORDER BY ar.created_at DESC
    `;

    const result = await pool.query(query, [organizationId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Failed to fetch pending approvals:', error);
    res.status(500).json({
      error: 'Failed to fetch pending approvals',
      message: error.message
    });
  }
});

module.exports = router;
