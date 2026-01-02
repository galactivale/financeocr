const express = require('express');
const router = express.Router();
const pool = require('../config/database').pool;
const { sealMemo, verifyMemoIntegrity, generateMemoHash } = require('../utils/document-hash');
const { logAuditAction } = require('../utils/audit-logger');
const multer = require('multer');

// Configure multer for PDF uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit for PDFs
});

/**
 * POST /api/memos
 * Create a new nexus memo
 */
router.post('/', async (req, res) => {
  try {
    const {
      organizationId,
      clientId,
      title,
      memoType,
      sections,
      conclusion,
      recommendations,
      statuteVersions,
      isSupplemental,
      supersedes_memo_id
    } = req.body;

    if (!organizationId || !clientId || !title || !sections) {
      return res.status(400).json({
        error: 'organizationId, clientId, title, and sections are required'
      });
    }

    const query = `
      INSERT INTO nexus_memos (
        organization_id,
        client_id,
        title,
        memo_type,
        sections,
        conclusion,
        recommendations,
        statute_versions,
        is_supplemental,
        supersedes_memo_id,
        status,
        is_editable,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'DRAFT', true, NOW())
      RETURNING *
    `;

    const values = [
      organizationId,
      clientId,
      title,
      memoType || 'INITIAL',
      JSON.stringify(sections),
      conclusion || null,
      recommendations && Array.isArray(recommendations) ? recommendations : null,
      statuteVersions ? JSON.stringify(statuteVersions) : null,
      isSupplemental || false,
      supersedes_memo_id || null
    ];

    const result = await pool.query(query, values);

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Failed to create nexus memo:', error);
    res.status(500).json({
      error: 'Failed to create nexus memo',
      message: error.message
    });
  }
});

/**
 * GET /api/memos
 * Get nexus memos with optional filters
 */
router.get('/', async (req, res) => {
  try {
    const { organizationId, clientId, status } = req.query;

    if (!organizationId) {
      return res.status(400).json({
        error: 'organizationId is required'
      });
    }

    let query = `
      SELECT nm.*,
        c.name as client_name,
        c.legal_entity_name
      FROM nexus_memos nm
      LEFT JOIN clients c ON nm.client_id = c.id
      WHERE nm.organization_id = $1
    `;

    const params = [organizationId];
    let paramCount = 1;

    if (clientId) {
      paramCount++;
      query += ` AND nm.client_id = $${paramCount}`;
      params.push(clientId);
    }

    if (status) {
      paramCount++;
      query += ` AND nm.status = $${paramCount}`;
      params.push(status);
    }

    query += ' ORDER BY nm.created_at DESC';

    const result = await pool.query(query, params);

    res.json(result.rows);
  } catch (error) {
    console.error('Failed to fetch nexus memos:', error);
    res.status(500).json({
      error: 'Failed to fetch nexus memos',
      message: error.message
    });
  }
});

/**
 * GET /api/memos/:id
 * Get a specific memo by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT nm.*,
        c.name as client_name,
        c.legal_entity_name,
        u1.name as sealed_by_name
      FROM nexus_memos nm
      LEFT JOIN clients c ON nm.client_id = c.id
      LEFT JOIN users u1 ON nm.sealed_by = u1.id
      WHERE nm.id = $1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Memo not found'
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Failed to fetch memo:', error);
    res.status(500).json({
      error: 'Failed to fetch memo',
      message: error.message
    });
  }
});

/**
 * POST /api/memos/:id/seal
 * Seal a memo with cryptographic hash
 */
router.post('/:id/seal', upload.single('pdf'), async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        error: 'userId is required'
      });
    }

    // Get PDF buffer if provided
    const pdfBuffer = req.file ? req.file.buffer : null;

    // Seal the memo
    const result = await sealMemo(id, userId, pdfBuffer);

    res.json(result);
  } catch (error) {
    console.error('Failed to seal memo:', error);
    res.status(500).json({
      error: 'Failed to seal memo',
      message: error.message
    });
  }
});

/**
 * POST /api/memos/:id/verify
 * Verify memo integrity
 */
router.post('/:id/verify', upload.single('pdf'), async (req, res) => {
  try {
    const { id } = req.params;

    // Get PDF buffer if provided
    const pdfBuffer = req.file ? req.file.buffer : null;

    // Verify the memo
    const result = await verifyMemoIntegrity(id, pdfBuffer);

    res.json(result);
  } catch (error) {
    console.error('Failed to verify memo:', error);
    res.status(500).json({
      error: 'Failed to verify memo',
      message: error.message
    });
  }
});

/**
 * GET /api/memos/:id/verification-history
 * Get verification history for a memo
 */
router.get('/:id/verification-history', async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT *
      FROM memo_hash_verifications
      WHERE memo_id = $1
      ORDER BY verified_at DESC
    `;

    const result = await pool.query(query, [id]);

    res.json(result.rows);
  } catch (error) {
    console.error('Failed to fetch verification history:', error);
    res.status(500).json({
      error: 'Failed to fetch verification history',
      message: error.message
    });
  }
});

/**
 * PUT /api/memos/:id
 * Update a memo (only if not sealed)
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, sections, conclusion, recommendations } = req.body;

    // Check if memo is sealed
    const checkQuery = 'SELECT is_sealed, is_editable FROM nexus_memos WHERE id = $1';
    const checkResult = await pool.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Memo not found'
      });
    }

    if (checkResult.rows[0].is_sealed) {
      return res.status(403).json({
        error: 'Cannot update sealed memo',
        message: 'This memo has been sealed and is read-only'
      });
    }

    // Update the memo
    const updateQuery = `
      UPDATE nexus_memos
      SET title = COALESCE($1, title),
          sections = COALESCE($2, sections),
          conclusion = COALESCE($3, conclusion),
          recommendations = COALESCE($4, recommendations),
          updated_at = NOW()
      WHERE id = $5
      RETURNING *
    `;

    const updateValues = [
      title || null,
      sections ? JSON.stringify(sections) : null,
      conclusion || null,
      recommendations ? JSON.stringify(recommendations) : null,
      id
    ];

    const result = await pool.query(updateQuery, updateValues);

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Failed to update memo:', error);
    res.status(500).json({
      error: 'Failed to update memo',
      message: error.message
    });
  }
});

/**
 * GET /api/memos/:id/versions
 * Get all versions of a memo (including superseded ones)
 */
router.get('/:id/versions', async (req, res) => {
  try {
    const { id } = req.params;

    // Get the memo chain (current memo and all previous versions)
    const query = `
      WITH RECURSIVE memo_chain AS (
        -- Start with the given memo
        SELECT * FROM nexus_memos WHERE id = $1

        UNION ALL

        -- Find all memos that this one supersedes
        SELECT nm.*
        FROM nexus_memos nm
        INNER JOIN memo_chain mc ON nm.id = mc.supersedes_memo_id
      )
      SELECT * FROM memo_chain
      ORDER BY created_at DESC
    `;

    const result = await pool.query(query, [id]);

    res.json(result.rows);
  } catch (error) {
    console.error('Failed to fetch memo versions:', error);
    res.status(500).json({
      error: 'Failed to fetch memo versions',
      message: error.message
    });
  }
});

/**
 * POST /api/memos/:id/create-supplemental
 * Create a supplemental memo that supersedes the current one
 */
router.post('/:id/create-supplemental', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      organizationId,
      title,
      sections,
      conclusion,
      recommendations
    } = req.body;

    if (!organizationId || !title || !sections) {
      return res.status(400).json({
        error: 'organizationId, title, and sections are required'
      });
    }

    // Get the original memo
    const originalQuery = 'SELECT * FROM nexus_memos WHERE id = $1';
    const originalResult = await pool.query(originalQuery, [id]);

    if (originalResult.rows.length === 0) {
      return res.status(404).json({
        error: 'Original memo not found'
      });
    }

    const originalMemo = originalResult.rows[0];

    // Create the supplemental memo
    const createQuery = `
      INSERT INTO nexus_memos (
        organization_id,
        client_id,
        title,
        memo_type,
        sections,
        conclusion,
        recommendations,
        is_supplemental,
        supersedes_memo_id,
        status,
        is_editable,
        created_at
      ) VALUES ($1, $2, $3, 'SUPPLEMENTAL', $4, $5, $6, true, $7, 'DRAFT', true, NOW())
      RETURNING *
    `;

    const createValues = [
      organizationId,
      originalMemo.client_id,
      title,
      JSON.stringify(sections),
      conclusion || null,
      recommendations ? JSON.stringify(recommendations) : null,
      id
    ];

    const result = await pool.query(createQuery, createValues);

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Failed to create supplemental memo:', error);
    res.status(500).json({
      error: 'Failed to create supplemental memo',
      message: error.message
    });
  }
});

module.exports = router;
