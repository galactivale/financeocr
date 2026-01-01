const crypto = require('crypto');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// GAP 3: Comprehensive Audit Logging System

const AUDIT_ACTIONS = {
  // Upload actions
  'UPLOAD_INITIATED': 'User began file upload',
  'UPLOAD_COMPLETED': 'File successfully uploaded',
  'UPLOAD_FAILED': 'File upload failed',

  // Mapping actions
  'MAPPING_SUGGESTED': 'System suggested column mapping',
  'MAPPING_CONFIRMED': 'User confirmed column mapping',
  'MAPPING_OVERRIDDEN': 'User changed suggested mapping',
  'MAPPING_IGNORED': 'User excluded column from analysis',

  // Normalization
  'STATE_NORMALIZED': 'State name auto-corrected',
  'NORMALIZATION_APPROVED': 'User approved normalizations',

  // Judgment
  'JUDGMENT_REQUIRED': 'System flagged ambiguous case',
  'JUDGMENT_RECORDED': 'User recorded firm position',
  'JUDGMENT_CHANGED': 'User modified previous judgment',

  // Memo actions
  'MEMO_GENERATED': 'System generated memo draft',
  'MEMO_REVIEWED': 'Partner reviewed memo',
  'MEMO_APPROVED': 'Partner approved memo',
  'MEMO_SEALED': 'Memo finalized with hash',
  'MEMO_ACCESSED': 'User viewed memo',
  'MEMO_DOWNLOADED': 'User downloaded PDF',

  // Analysis
  'ANALYSIS_RUN': 'Nexus analysis executed',
  'ALERT_GENERATED': 'System generated alert',
  'ALERT_DISMISSED': 'User dismissed alert',

  // Statute changes
  'STATUTE_OVERRIDE_CREATED': 'Firm guidance override entered',
  'STATUTE_OVERRIDE_VALIDATED': 'Override validated by partner',
  'SUPPLEMENTAL_MEMO_TRIGGERED': 'Statute change triggered supplemental',

  // Security
  'LOGIN': 'User logged in',
  'LOGOUT': 'User logged out',
  'PERMISSION_DENIED': 'User attempted unauthorized action',
  'TAMPER_DETECTED': 'Document hash verification failed',
  'HASH_VERIFIED': 'Document hash verification passed',

  // PII
  'PII_DETECTED': 'PII detected in upload',
  'PII_WARNING_SHOWN': 'PII warning displayed to user',
  'PII_OVERRIDE': 'User proceeded despite PII warning'
};

/**
 * Generate SHA-256 hash for action integrity
 */
function generateActionHash(action) {
  const hashInput = JSON.stringify({
    user_id: action.user_id,
    action: action.action,
    entity_id: action.entity_id,
    timestamp: action.timestamp,
    details: action.details,
    previous_action_id: action.previous_action_id
  });

  return crypto.createHash('sha256').update(hashInput).digest('hex');
}

/**
 * Get the last action for an entity to create chain
 */
async function getLastActionForEntity(entityType, entityId) {
  if (!entityType || !entityId) return null;

  const query = `
    SELECT id, action_hash
    FROM audit_log
    WHERE entity_type = $1 AND entity_id = $2
    ORDER BY created_at DESC
    LIMIT 1
  `;

  try {
    const result = await pool.query(query, [entityType, entityId]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error getting last action:', error);
    return null;
  }
}

/**
 * Main audit logging function
 * @param {string} actionType - Action type from AUDIT_ACTIONS
 * @param {object} details - Action details
 * @param {object} req - Express request object (optional, for automatic extraction)
 */
async function logAuditAction(actionType, details, req = null) {
  try {
    const user = req?.user || details.user || {};
    const previousAction = await getLastActionForEntity(
      details.entity_type,
      details.entity_id
    );

    const action = {
      organization_id: user.organizationId || details.organizationId,
      user_id: user.id || details.userId,
      action: actionType,
      resource_type: details.entity_type || details.resourceType || 'UNKNOWN',
      resource_id: details.entity_id || details.resourceId,
      entity_type: details.entity_type,
      entity_id: details.entity_id,
      old_values: details.previous_value || details.oldValues,
      new_values: details.new_value || details.newValues,
      previous_value: details.previous_value,
      new_value: details.new_value,
      details: JSON.stringify(details.details || {}),
      severity: details.severity || 'INFO',
      ip_address: req?.ip || req?.connection?.remoteAddress || details.ip_address,
      user_agent: req?.get?.('user-agent') || details.user_agent,
      client_id: details.client_id,
      upload_id: details.upload_id,
      memo_id: details.memo_id,
      previous_action_id: previousAction?.id,
      created_at: new Date()
    };

    // Generate hash for integrity
    action.action_hash = generateActionHash({
      user_id: action.user_id,
      action: action.action,
      entity_id: action.entity_id,
      timestamp: action.created_at,
      details: action.details,
      previous_action_id: action.previous_action_id
    });

    // Store in database
    const query = `
      INSERT INTO audit_log (
        organization_id, user_id, action, resource_type, resource_id,
        entity_type, entity_id, old_values, new_values,
        previous_value, new_value, details, severity,
        ip_address, user_agent, client_id, upload_id, memo_id,
        action_hash, previous_action_id, created_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,
        $14, $15, $16, $17, $18, $19, $20, $21
      ) RETURNING id
    `;

    const values = [
      action.organization_id, action.user_id, action.action, action.resource_type,
      action.resource_id, action.entity_type, action.entity_id,
      action.old_values, action.new_values, action.previous_value, action.new_value,
      action.details, action.severity, action.ip_address, action.user_agent,
      action.client_id, action.upload_id, action.memo_id, action.action_hash,
      action.previous_action_id, action.created_at
    ];

    const result = await pool.query(query, values);

    return {
      ...action,
      id: result.rows[0].id
    };
  } catch (error) {
    console.error('Audit logging error:', error);
    // Don't throw - logging failure shouldn't break the application
    return null;
  }
}

/**
 * Get audit trail for an entity
 */
async function getAuditTrail(entityType, entityId, options = {}) {
  const { limit = 100, offset = 0, orderBy = 'created_at', order = 'DESC' } = options;

  const query = `
    SELECT
      al.*,
      u.email as user_email,
      u.first_name,
      u.last_name,
      u.role as user_role
    FROM audit_log al
    LEFT JOIN users u ON al.user_id = u.id
    WHERE al.entity_type = $1 AND al.entity_id = $2
    ORDER BY ${orderBy} ${order}
    LIMIT $3 OFFSET $4
  `;

  const result = await pool.query(query, [entityType, entityId, limit, offset]);
  return result.rows;
}

/**
 * Verify audit chain integrity
 */
async function verifyAuditChain(entityType, entityId) {
  const trail = await getAuditTrail(entityType, entityId, { limit: 10000, order: 'ASC' });

  for (let i = 0; i < trail.length; i++) {
    const entry = trail[i];

    // Verify hash
    const calculatedHash = generateActionHash({
      user_id: entry.user_id,
      action: entry.action,
      entity_id: entry.entity_id,
      timestamp: entry.created_at,
      details: entry.details,
      previous_action_id: entry.previous_action_id
    });

    if (calculatedHash !== entry.action_hash) {
      return {
        verified: false,
        tampered_entry: entry.id,
        position: i,
        message: 'Hash mismatch detected'
      };
    }

    // Verify chain
    if (i > 0 && entry.previous_action_id !== trail[i - 1].id) {
      return {
        verified: false,
        tampered_entry: entry.id,
        position: i,
        message: 'Chain break detected'
      };
    }
  }

  return {
    verified: true,
    entries_verified: trail.length,
    message: 'Audit chain integrity verified'
  };
}

module.exports = {
  AUDIT_ACTIONS,
  logAuditAction,
  getAuditTrail,
  verifyAuditChain,
  generateActionHash
};
