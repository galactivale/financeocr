// GAP 2: PII Detection & Redaction System

// PII patterns to detect
const PII_PATTERNS = {
  ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  phone: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
  address: /\b\d+\s+[\w\s]+(?:street|st|avenue|ave|road|rd|boulevard|blvd|lane|ln|drive|dr|court|ct|circle|cir|way)\b/gi,
  zipcode: /\b\d{5}(?:-\d{4})?\b/g,
  creditcard: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g
};

const PII_COLUMN_NAMES = [
  'name', 'first_name', 'last_name', 'full_name', 'fname', 'lname',
  'ssn', 'social_security', 'tax_id', 'ein',
  'address', 'street', 'city', 'zip', 'postal', 'zipcode',
  'email', 'e-mail', 'email_address',
  'phone', 'mobile', 'telephone', 'cell',
  'dob', 'date_of_birth', 'birthdate', 'birth_date',
  'employee_id', 'emp_id', 'employee_number', 'employee_name',
  'customer_name', 'client_name', 'contact_name'
];

/**
 * Detect PII in uploaded data
 * @param {Array<Array>} fileData - Parsed CSV data
 * @param {Array} headers - Column headers
 * @returns {Object} PII detection results
 */
function detectPII(fileData, headers) {
  const piiDetected = {
    byColumn: {},
    byPattern: {},
    severity: 'NONE',
    totalIssues: 0
  };

  // 1. Check column headers
  headers.forEach((header, index) => {
    const normalizedHeader = header.toLowerCase().replace(/[_\s-]/g, '');

    const matchesPIIName = PII_COLUMN_NAMES.some(pii => {
      const normalizedPII = pii.replace(/[_\s-]/g, '');
      return normalizedHeader.includes(normalizedPII) || normalizedPII.includes(normalizedHeader);
    });

    if (matchesPIIName) {
      const sampleValues = fileData.slice(1, 4).map(row => row[index] || '');

      piiDetected.byColumn[header] = {
        index,
        type: 'COLUMN_NAME',
        risk: 'HIGH',
        sampleValues: sampleValues.map(v => maskValue(String(v)))
      };

      piiDetected.severity = 'HIGH';
      piiDetected.totalIssues++;
    }
  });

  // 2. Check data patterns (sample first 100 rows)
  const sampleData = fileData.slice(1, Math.min(101, fileData.length));

  sampleData.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (!cell) return;

      const cellStr = String(cell);

      Object.entries(PII_PATTERNS).forEach(([type, pattern]) => {
        // Reset pattern regex
        pattern.lastIndex = 0;

        if (pattern.test(cellStr)) {
          if (!piiDetected.byPattern[type]) {
            piiDetected.byPattern[type] = [];
          }

          // Limit to 5 examples per pattern
          if (piiDetected.byPattern[type].length < 5) {
            piiDetected.byPattern[type].push({
              column: headers[colIndex],
              columnIndex: colIndex,
              row: rowIndex + 1, // +1 because we sliced off headers
              value: maskValue(cellStr)
            });
          }

          // Update severity
          if (type === 'ssn' || type === 'creditcard') {
            piiDetected.severity = 'HIGH';
          } else if (piiDetected.severity !== 'HIGH' && (type === 'email' || type === 'phone')) {
            piiDetected.severity = 'MEDIUM';
          } else if (piiDetected.severity === 'NONE') {
            piiDetected.severity = 'LOW';
          }

          piiDetected.totalIssues++;
        }
      });
    });
  });

  return piiDetected;
}

/**
 * Mask value for display
 * @param {string} value - Value to mask
 * @returns {string} Masked value
 */
function maskValue(value) {
  if (!value || value.length <= 4) return '****';

  // Show last 4 characters
  return value.replace(/.(?=.{4})/g, '*');
}

/**
 * Get PII field recommendations
 * @returns {Object} Field recommendations
 */
function getFieldRecommendations() {
  return {
    required: [
      { field: 'State/Jurisdiction', description: 'Where activity occurred' },
      { field: 'Amount/Revenue', description: 'Transaction or aggregate amount' },
      { field: 'Date/Period', description: 'When activity occurred' }
    ],
    optional: [
      { field: 'Product Type', description: 'Tangible vs services vs SaaS' },
      { field: 'Sales Channel', description: 'Direct, marketplace, etc.' },
      { field: 'Job Role/Title', description: 'For employee activity classification' },
      { field: 'GL Code', description: 'For revenue categorization' }
    ],
    excluded: [
      { field: 'Employee names', reason: 'Use employee IDs or roles instead' },
      { field: 'Social Security Numbers', reason: 'Not required for nexus analysis' },
      { field: 'Home addresses', reason: 'Use business locations only' },
      { field: 'Email addresses (personal)', reason: 'Not needed for compliance' },
      { field: 'Phone numbers', reason: 'Not relevant to tax nexus' },
      { field: 'Dates of birth', reason: 'Not required' },
      { field: 'Employee IDs (when linked to names)', reason: 'Use aggregated data' }
    ]
  };
}

/**
 * Auto-exclude PII columns
 * @param {Array} headers - Column headers
 * @param {Object} piiDetection - PII detection results
 * @returns {Array} Filtered headers (non-PII columns)
 */
function autoExcludePIIColumns(headers, piiDetection) {
  const excludedIndices = new Set();

  // Exclude columns identified as PII
  Object.entries(piiDetection.byColumn).forEach(([column, info]) => {
    if (info.risk === 'HIGH') {
      excludedIndices.add(info.index);
    }
  });

  // Return filtered list
  return headers.filter((_, index) => !excludedIndices.has(index));
}

/**
 * Generate PII warning message
 * @param {Object} piiDetection - PII detection results
 * @returns {string} Warning message
 */
function generatePIIWarning(piiDetection) {
  if (piiDetection.severity === 'NONE') {
    return null;
  }

  const columnCount = Object.keys(piiDetection.byColumn).length;
  const patternCount = Object.keys(piiDetection.byPattern).length;

  let message = `⚠️ Potential PII Detected (${piiDetection.severity} Risk)\n\n`;
  message += `We detected ${piiDetection.totalIssues} potential PII issue(s) in your data.\n\n`;

  if (columnCount > 0) {
    message += `Columns with PII:\n`;
    Object.entries(piiDetection.byColumn).forEach(([column, info]) => {
      message += `  • ${column} (${info.type})\n`;
    });
    message += '\n';
  }

  if (patternCount > 0) {
    message += `Detected patterns:\n`;
    Object.entries(piiDetection.byPattern).forEach(([type, instances]) => {
      message += `  • ${type}: ${instances.length} instance(s)\n`;
    });
    message += '\n';
  }

  message += `Recommended actions:\n`;
  message += `  • Remove PII columns before upload\n`;
  message += `  • Use client IDs instead of names\n`;
  message += `  • Aggregate data to remove individual identifiers\n`;

  return message;
}

module.exports = {
  detectPII,
  maskValue,
  getFieldRecommendations,
  autoExcludePIIColumns,
  generatePIIWarning,
  PII_PATTERNS,
  PII_COLUMN_NAMES
};
