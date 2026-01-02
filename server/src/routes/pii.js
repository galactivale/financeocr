const express = require('express');
const router = express.Router();
const pool = require('../config/database').pool;
const { detectPII } = require('../utils/pii-detector');
const { logAuditAction } = require('../utils/audit-logger');

/**
 * POST /api/pii/detect
 * Detect PII in uploaded file data
 */
router.post('/detect', async (req, res) => {
  try {
    const { fileData, headers } = req.body;

    if (!fileData || !Array.isArray(fileData)) {
      return res.status(400).json({ error: 'fileData must be an array' });
    }

    if (!headers || !Array.isArray(headers)) {
      return res.status(400).json({ error: 'headers must be an array' });
    }

    // Perform PII detection
    const piiDetection = detectPII(fileData, headers);

    res.json(piiDetection);
  } catch (error) {
    console.error('PII detection error:', error);
    res.status(500).json({
      error: 'Failed to detect PII',
      message: error.message
    });
  }
});

/**
 * POST /api/pii/log-warning
 * Log PII warning action (SHOWN, OVERRIDE, AUTO_EXCLUDED)
 */
router.post('/log-warning', async (req, res) => {
  try {
    const { uploadId, piiDetection, action } = req.body;

    if (!uploadId || !piiDetection || !action) {
      return res.status(400).json({
        error: 'uploadId, piiDetection, and action are required'
      });
    }

    if (!['SHOWN', 'OVERRIDE', 'AUTO_EXCLUDED'].includes(action)) {
      return res.status(400).json({
        error: 'action must be SHOWN, OVERRIDE, or AUTO_EXCLUDED'
      });
    }

    // Store PII warning in database
    const query = `
      INSERT INTO pii_detections (
        upload_id,
        severity,
        total_issues,
        columns_detected,
        patterns_detected,
        action_taken,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING *
    `;

    const values = [
      uploadId,
      piiDetection.severity,
      piiDetection.totalIssues,
      JSON.stringify(piiDetection.byColumn || {}),
      JSON.stringify(piiDetection.byPattern || {}),
      action
    ];

    const result = await pool.query(query, values);

    res.json({
      success: true,
      piiDetection: result.rows[0]
    });
  } catch (error) {
    console.error('Failed to log PII warning:', error);
    res.status(500).json({
      error: 'Failed to log PII warning',
      message: error.message
    });
  }
});

/**
 * GET /api/pii/history/:uploadId
 * Get PII detection history for an upload
 */
router.get('/history/:uploadId', async (req, res) => {
  try {
    const { uploadId } = req.params;

    const query = `
      SELECT * FROM pii_detections
      WHERE upload_id = $1
      ORDER BY created_at DESC
    `;

    const result = await pool.query(query, [uploadId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Failed to fetch PII history:', error);
    res.status(500).json({
      error: 'Failed to fetch PII history',
      message: error.message
    });
  }
});

module.exports = router;
