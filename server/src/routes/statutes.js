const express = require('express');
const router = express.Router();
const pool = require('../config/database').pool;
const { logAuditAction } = require('../utils/audit-logger');

/**
 * POST /api/statutes/overrides
 * Create a statute override entry
 */
router.post('/overrides', async (req, res) => {
  try {
    const {
      stateCode,
      taxType,
      changeType,
      previousValue,
      newValue,
      effectiveDate,
      source,
      citation,
      notes,
      organizationId,
      enteredBy
    } = req.body;

    if (!stateCode || !taxType || !changeType || !effectiveDate || !organizationId || !enteredBy) {
      return res.status(400).json({
        error: 'stateCode, taxType, changeType, effectiveDate, organizationId, and enteredBy are required'
      });
    }

    const query = `
      INSERT INTO statute_overrides (
        organization_id,
        state_code,
        tax_type,
        change_type,
        previous_value,
        new_value,
        effective_date,
        source,
        citation,
        notes,
        entered_by,
        validation_status,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'PENDING', NOW())
      RETURNING *
    `;

    const values = [
      organizationId,
      stateCode,
      taxType,
      changeType,
      previousValue || null,
      newValue || null,
      effectiveDate,
      source || null,
      citation || null,
      notes || null,
      enteredBy
    ];

    const result = await pool.query(query, values);

    // Log audit action
    await logAuditAction('STATUTE_OVERRIDE_CREATED', {
      entity_type: 'STATUTE_OVERRIDE',
      entity_id: result.rows[0].id,
      organizationId,
      userId: enteredBy,
      details: {
        stateCode,
        taxType,
        changeType,
        effectiveDate
      },
      severity: 'INFO'
    });

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Failed to create statute override:', error);
    res.status(500).json({
      error: 'Failed to create statute override',
      message: error.message
    });
  }
});

/**
 * GET /api/statutes/overrides
 * Get statute overrides with optional filters
 */
router.get('/overrides', async (req, res) => {
  try {
    const { organizationId, stateCode, taxType, validationStatus } = req.query;

    if (!organizationId) {
      return res.status(400).json({
        error: 'organizationId is required'
      });
    }

    let query = `
      SELECT so.*,
        u1.name as entered_by_name,
        u2.name as validated_by_name
      FROM statute_overrides so
      LEFT JOIN users u1 ON so.entered_by = u1.id
      LEFT JOIN users u2 ON so.validated_by = u2.id
      WHERE so.organization_id = $1
    `;

    const params = [organizationId];
    let paramCount = 1;

    if (stateCode) {
      paramCount++;
      query += ` AND so.state_code = $${paramCount}`;
      params.push(stateCode);
    }

    if (taxType) {
      paramCount++;
      query += ` AND so.tax_type = $${paramCount}`;
      params.push(taxType);
    }

    if (validationStatus) {
      paramCount++;
      query += ` AND so.validation_status = $${paramCount}`;
      params.push(validationStatus);
    }

    query += ' ORDER BY so.created_at DESC';

    const result = await pool.query(query, params);

    res.json(result.rows);
  } catch (error) {
    console.error('Failed to fetch statute overrides:', error);
    res.status(500).json({
      error: 'Failed to fetch statute overrides',
      message: error.message
    });
  }
});

/**
 * POST /api/statutes/overrides/:id/validate
 * Validate a statute override (requires supervisor)
 */
router.post('/overrides/:id/validate', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: 'userId is required'
      });
    }

    // Get the override first
    const getQuery = 'SELECT * FROM statute_overrides WHERE id = $1';
    const getResult = await pool.query(getQuery, [id]);

    if (getResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Statute override not found'
      });
    }

    const override = getResult.rows[0];

    // Update validation status
    const updateQuery = `
      UPDATE statute_overrides
      SET validation_status = 'VALIDATED',
          validated_by = $1,
          validated_at = NOW()
      WHERE id = $2
      RETURNING *
    `;

    const updateResult = await pool.query(updateQuery, [userId, id]);

    // Log audit action
    await logAuditAction('STATUTE_OVERRIDE_VALIDATED', {
      entity_type: 'STATUTE_OVERRIDE',
      entity_id: id,
      organizationId: override.organization_id,
      userId,
      details: {
        stateCode: override.state_code,
        taxType: override.tax_type
      },
      severity: 'INFO'
    });

    res.json(updateResult.rows[0]);
  } catch (error) {
    console.error('Failed to validate statute override:', error);
    res.status(500).json({
      error: 'Failed to validate statute override',
      message: error.message
    });
  }
});

/**
 * GET /api/statutes/overrides/:id/affected-clients
 * Get clients affected by a statute override
 */
router.get('/overrides/:id/affected-clients', async (req, res) => {
  try {
    const { id } = req.params;

    // Get the override
    const overrideQuery = 'SELECT * FROM statute_overrides WHERE id = $1';
    const overrideResult = await pool.query(overrideQuery, [id]);

    if (overrideResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Statute override not found'
      });
    }

    const override = overrideResult.rows[0];

    // Find affected clients (clients with nexus in that state)
    const clientsQuery = `
      SELECT DISTINCT c.id, c.name, c.legal_entity_name
      FROM clients c
      JOIN nexus_memos nm ON nm.client_id = c.id
      WHERE c.organization_id = $1
      AND nm.sections::text LIKE $2
      ORDER BY c.name
    `;

    const clientsResult = await pool.query(clientsQuery, [
      override.organization_id,
      `%${override.state_code}%`
    ]);

    res.json({
      override: overrideResult.rows[0],
      affectedClients: clientsResult.rows,
      count: clientsResult.rows.length
    });
  } catch (error) {
    console.error('Failed to fetch affected clients:', error);
    res.status(500).json({
      error: 'Failed to fetch affected clients',
      message: error.message
    });
  }
});

/**
 * DELETE /api/statutes/overrides/:id
 * Delete a statute override (soft delete by setting status to REJECTED)
 */
router.delete('/overrides/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, reason } = req.body;

    const query = `
      UPDATE statute_overrides
      SET validation_status = 'REJECTED',
          validated_by = $1,
          validated_at = NOW(),
          notes = COALESCE(notes || E'\\n\\n', '') || 'REJECTED: ' || $2
      WHERE id = $3
      RETURNING *
    `;

    const result = await pool.query(query, [userId, reason || 'No reason provided', id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Statute override not found'
      });
    }

    res.json({
      success: true,
      override: result.rows[0]
    });
  } catch (error) {
    console.error('Failed to delete statute override:', error);
    res.status(500).json({
      error: 'Failed to delete statute override',
      message: error.message
    });
  }
});

module.exports = router;
