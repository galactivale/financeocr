/**
 * Data Sanitizer - Ensures all data fits database column constraints
 */

// Column length limits for ClientState model
// Based on Prisma schema and PostgreSQL TEXT defaults
// Note: PostgreSQL TEXT is unlimited, but we set conservative limits
const COLUMN_LIMITS = {
  // String fields with their max lengths
  stateCode: 2,           // State abbreviation (e.g., 'CA') - MUST be exactly 2
  stateName: 50,          // Full state name - Conservative limit (longest is "Massachusetts" = 13)
  status: 20,             // Status value (e.g., 'compliant', 'warning', 'critical')
  notes: 500,             // Optional notes field - Conservative limit for TEXT
  description: 500,       // Optional description
  registrationNumber: 50, // Registration/EIN
  
  // Text/JSON fields - typically unlimited but set reasonable limits
  metadata: 10000,        // JSON metadata
  customFields: 10000,    // JSON custom fields
};

/**
 * Sanitizes a string to fit within column limits
 * @param {string} value - The value to sanitize
 * @param {number} maxLength - Maximum allowed length
 * @param {string} fieldName - Name of the field (for logging)
 * @returns {string} - Sanitized value
 */
function sanitizeString(value, maxLength, fieldName = 'unknown') {
  if (!value) return value;
  
  // Convert to string if not already
  const stringValue = String(value);
  
  // Return as-is if within limit
  if (stringValue.length <= maxLength) {
    return stringValue;
  }
  
  // Truncate and add ellipsis
  const truncated = stringValue.substring(0, maxLength - 3) + '...';
  
  console.warn(`⚠️  Truncated ${fieldName}: ${stringValue.length} chars → ${truncated.length} chars`);
  
  return truncated;
}

/**
 * Sanitizes an entire ClientState object
 * Only includes fields that exist in the Prisma schema
 * @param {Object} stateData - The state data object
 * @returns {Object} - Sanitized state data with only valid schema fields
 */
function sanitizeClientState(stateData) {
  // Only include fields that exist in the ClientState schema
  // Schema fields: id, clientId, organizationId, stateCode, stateName, status,
  // registrationRequired, registrationDate, registrationNumber, thresholdAmount,
  // currentAmount, lastUpdated, notes, createdAt, updatedAt
  const sanitized = {};
  
  // Required fields - UUIDs should be exactly 36 characters (with dashes)
  if (stateData.organizationId) {
    const orgId = String(stateData.organizationId).trim();
    if (orgId.length > 36) {
      console.error(`❌ organizationId too long: ${orgId.length} chars - "${orgId}"`);
      throw new Error(`Invalid organizationId length: ${orgId.length} (expected 36 for UUID)`);
    }
    sanitized.organizationId = orgId;
  } else {
    throw new Error('Missing required field: organizationId');
  }
  
  if (stateData.clientId) {
    const clientId = String(stateData.clientId).trim();
    if (clientId.length > 36) {
      console.error(`❌ clientId too long: ${clientId.length} chars - "${clientId}"`);
      throw new Error(`Invalid clientId length: ${clientId.length} (expected 36 for UUID)`);
    }
    sanitized.clientId = clientId;
  } else {
    throw new Error('Missing required field: clientId');
  }
  
  // String fields with limits - be very strict
  if (stateData.stateCode) {
    const code = String(stateData.stateCode).toUpperCase().trim();
    // State code MUST be exactly 2 characters
    if (code.length > 2) {
      console.warn(`⚠️  stateCode too long: "${code}" (${code.length} chars), truncating to 2`);
      sanitized.stateCode = code.substring(0, 2);
    } else {
      sanitized.stateCode = code;
    }
  }
  
  if (stateData.stateName) {
    const name = String(stateData.stateName).trim();
    // State names should be short, but allow up to 50 chars
    if (name.length > COLUMN_LIMITS.stateName) {
      console.warn(`⚠️  stateName too long: "${name}" (${name.length} chars), truncating to ${COLUMN_LIMITS.stateName}`);
      sanitized.stateName = name.substring(0, COLUMN_LIMITS.stateName - 3) + '...';
    } else {
      sanitized.stateName = name;
    }
  }
  
  if (stateData.status) {
    const status = String(stateData.status).toLowerCase().trim();
    // Status should be short
    if (status.length > COLUMN_LIMITS.status) {
      console.warn(`⚠️  status too long: "${status}" (${status.length} chars), truncating to ${COLUMN_LIMITS.status}`);
      sanitized.status = status.substring(0, COLUMN_LIMITS.status - 3) + '...';
    } else {
      sanitized.status = status;
    }
  }
  
  // Optional string fields
  if (stateData.notes !== undefined && stateData.notes !== null) {
    const notes = String(stateData.notes).trim();
    if (notes.length > COLUMN_LIMITS.notes) {
      console.warn(`⚠️  notes too long: ${notes.length} chars, truncating to ${COLUMN_LIMITS.notes}`);
      sanitized.notes = notes.substring(0, COLUMN_LIMITS.notes - 3) + '...';
    } else {
      sanitized.notes = notes;
    }
  }
  
  if (stateData.registrationNumber !== undefined && stateData.registrationNumber !== null) {
    const regNum = String(stateData.registrationNumber).trim();
    if (regNum.length > COLUMN_LIMITS.registrationNumber) {
      console.warn(`⚠️  registrationNumber too long: ${regNum.length} chars, truncating`);
      sanitized.registrationNumber = regNum.substring(0, COLUMN_LIMITS.registrationNumber - 3) + '...';
    } else {
      sanitized.registrationNumber = regNum;
    }
  }
  
  // Decimal fields - must be numbers (Prisma Decimal type)
  if (stateData.thresholdAmount !== undefined && stateData.thresholdAmount !== null) {
    const num = Number(stateData.thresholdAmount);
    if (isNaN(num)) {
      console.error('❌ Invalid thresholdAmount, setting to null');
      sanitized.thresholdAmount = null;
    } else {
      sanitized.thresholdAmount = num;
    }
  }
  
  if (stateData.currentAmount !== undefined && stateData.currentAmount !== null) {
    const num = Number(stateData.currentAmount);
    if (isNaN(num)) {
      console.error('❌ Invalid currentAmount, setting to 0');
      sanitized.currentAmount = 0;
    } else {
      sanitized.currentAmount = num;
    }
  }
  
  // Boolean field
  if (stateData.registrationRequired !== undefined && stateData.registrationRequired !== null) {
    sanitized.registrationRequired = Boolean(stateData.registrationRequired);
  } else {
    sanitized.registrationRequired = false; // Default from schema
  }
  
  // DateTime fields
  if (stateData.lastUpdated) {
    sanitized.lastUpdated = stateData.lastUpdated instanceof Date 
      ? stateData.lastUpdated 
      : new Date(stateData.lastUpdated);
  } else {
    sanitized.lastUpdated = new Date();
  }
  
  if (stateData.registrationDate !== undefined && stateData.registrationDate !== null) {
    sanitized.registrationDate = stateData.registrationDate instanceof Date
      ? stateData.registrationDate
      : new Date(stateData.registrationDate);
  }
  
  // Explicitly exclude fields that don't exist in schema
  // (excessAmount, penaltyRisk, metadata are NOT in ClientState schema)
  
  return sanitized;
}

/**
 * Sanitizes a Client object
 * @param {Object} clientData - The client data object
 * @returns {Object} - Sanitized client data
 */
function sanitizeClient(clientData) {
  const CLIENT_LIMITS = {
    name: 200,
    legalName: 200,
    email: 255,
    phone: 20,
    address: 500,
    city: 100,
    state: 2,
    zipCode: 10,
    taxId: 20,
    industry: 100,
    riskLevel: 20,
    qualificationStrategy: 50
  };
  
  const sanitized = { ...clientData };
  
  // Sanitize all string fields
  Object.keys(CLIENT_LIMITS).forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = sanitizeString(
        sanitized[field], 
        CLIENT_LIMITS[field], 
        field
      );
    }
  });
  
  // Validate numeric fields
  if (sanitized.annualRevenue !== undefined && sanitized.annualRevenue !== null) {
    sanitized.annualRevenue = Number(String(sanitized.annualRevenue).replace(/[^\d]/g, ''));
    if (isNaN(sanitized.annualRevenue)) {
      console.error('❌ Invalid annualRevenue, setting to 0');
      sanitized.annualRevenue = 0;
    }
  }
  
  if (sanitized.qualityScore !== undefined && sanitized.qualityScore !== null) {
    sanitized.qualityScore = Number(sanitized.qualityScore);
    if (isNaN(sanitized.qualityScore)) {
      sanitized.qualityScore = 0;
    }
  }
  
  if (sanitized.penaltyExposure !== undefined && sanitized.penaltyExposure !== null) {
    sanitized.penaltyExposure = Number(sanitized.penaltyExposure);
    if (isNaN(sanitized.penaltyExposure)) {
      sanitized.penaltyExposure = 0;
    }
  }
  
  return sanitized;
}

/**
 * Sanitizes a NexusAlert object
 * Must match NexusAlert Prisma schema exactly
 * @param {Object} alertData - The alert data object
 * @returns {Object} - Sanitized alert data with only valid schema fields
 */
function sanitizeAlert(alertData) {
  const ALERT_LIMITS = {
    stateCode: 2,        // Required - must be exactly 2 chars
    alertType: 50,
    priority: 20,
    severity: 20,
    status: 20,
    title: 200,           // Required
    description: 1000
  };
  
  // Only include fields that exist in NexusAlert schema
  const sanitized = {};
  
  // Required fields
  if (!alertData.organizationId) {
    throw new Error('Missing required field: organizationId');
  }
  sanitized.organizationId = String(alertData.organizationId);
  
  if (!alertData.clientId) {
    throw new Error('Missing required field: clientId');
  }
  sanitized.clientId = String(alertData.clientId);
  
  // stateCode is required - cannot be null
  if (!alertData.stateCode) {
    // Use a default if not provided (for monitoring alerts)
    sanitized.stateCode = 'US'; // Default to 'US' for general alerts
    console.warn(`⚠️  Alert missing stateCode, using default 'US'`);
  } else {
    const code = String(alertData.stateCode).toUpperCase().trim();
    if (code.length > 2) {
      console.warn(`⚠️  Alert stateCode too long: "${code}", truncating to 2 chars`);
      sanitized.stateCode = code.substring(0, 2);
    } else {
      sanitized.stateCode = code;
    }
  }
  
  // Required string fields
  if (alertData.alertType) {
    sanitized.alertType = sanitizeString(String(alertData.alertType), ALERT_LIMITS.alertType, 'alertType');
  } else {
    throw new Error('Missing required field: alertType');
  }
  
  if (alertData.priority) {
    sanitized.priority = sanitizeString(String(alertData.priority), ALERT_LIMITS.priority, 'priority');
  } else {
    sanitized.priority = 'medium'; // Default from schema
  }
  
  if (alertData.severity) {
    sanitized.severity = sanitizeString(String(alertData.severity), ALERT_LIMITS.severity, 'severity');
  } else {
    sanitized.severity = alertData.priority || 'medium'; // Default from schema
  }
  
  if (alertData.status) {
    sanitized.status = sanitizeString(String(alertData.status), ALERT_LIMITS.status, 'status');
  } else {
    sanitized.status = 'open'; // Default from schema
  }
  
  if (alertData.title) {
    sanitized.title = sanitizeString(String(alertData.title), ALERT_LIMITS.title, 'title');
  } else {
    throw new Error('Missing required field: title');
  }
  
  // Optional string fields
  if (alertData.description !== undefined && alertData.description !== null) {
    sanitized.description = sanitizeString(String(alertData.description), ALERT_LIMITS.description, 'description');
  }
  
  // currentAmount is required (Decimal, default 0) - cannot be null
  if (alertData.currentAmount !== undefined && alertData.currentAmount !== null) {
    const num = Number(alertData.currentAmount);
    if (isNaN(num)) {
      console.warn('⚠️  Invalid currentAmount, setting to 0');
      sanitized.currentAmount = 0;
    } else {
      sanitized.currentAmount = num;
    }
  } else {
    sanitized.currentAmount = 0; // Required field - default to 0
  }
  
  // Optional Decimal fields
  if (alertData.thresholdAmount !== undefined && alertData.thresholdAmount !== null) {
    const num = Number(alertData.thresholdAmount);
    if (!isNaN(num)) {
      sanitized.thresholdAmount = num;
    }
  }
  
  if (alertData.penaltyRisk !== undefined && alertData.penaltyRisk !== null) {
    const num = Number(alertData.penaltyRisk);
    if (!isNaN(num)) {
      sanitized.penaltyRisk = num;
    }
  }
  
  // Optional DateTime fields
  if (alertData.deadline) {
    sanitized.deadline = alertData.deadline instanceof Date
      ? alertData.deadline
      : new Date(alertData.deadline);
  }
  
  // Boolean field
  if (alertData.isActive !== undefined && alertData.isActive !== null) {
    sanitized.isActive = Boolean(alertData.isActive);
  } else {
    sanitized.isActive = true; // Default from schema
  }
  
  // Explicitly exclude fields that don't exist in schema
  // (excessAmount, metadata, createdAt are NOT in NexusAlert schema as direct fields)
  // createdAt is auto-generated, metadata might be stored elsewhere
  
  return sanitized;
}

/**
 * Validates all data before database insertion
 * @param {Object} data - The complete generated data
 * @returns {Object} - Sanitized data ready for database
 */
function sanitizeAllData(data) {
  console.log('🧹 Sanitizing all generated data...');
  
  const sanitized = {
    clients: data.clients ? data.clients.map(sanitizeClient) : [],
    clientStates: data.clientStates ? data.clientStates.map(sanitizeClientState) : [],
    alerts: data.alerts ? data.alerts.map(sanitizeAlert) : [],
    nexusAlerts: data.nexusAlerts ? data.nexusAlerts.map(sanitizeAlert) : [],
    // Add other entities as needed
  };
  
  console.log('✅ Data sanitization complete');
  
  return sanitized;
}

/**
 * Gets the database schema column limits for debugging
 */
function getColumnLimits() {
  return {
    ClientState: COLUMN_LIMITS,
    // Add other models as needed
  };
}

module.exports = {
  sanitizeClientState,
  sanitizeClient,
  sanitizeAlert,
  sanitizeAllData,
  getColumnLimits,
  COLUMN_LIMITS
};

