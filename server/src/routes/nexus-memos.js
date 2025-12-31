const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB limit
});

// Logging utility
function log(context, message, data = {}) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [NEXUS-MEMOS] [${context}] ${message}`, JSON.stringify(data, null, 2));
}

// Document Classifier - Simple version
class DocumentClassifier {
  async classifyDocument(csvData, filename) {
    const headers = csvData[0] || [];
    const sampleRow = csvData[1] || [];

    if (this.hasPLHeaderPattern(headers)) {
      return { type: 'PROFIT_LOSS', subtype: 'STATE_AGGREGATED', confidence: 95, description: 'Profit & Loss statement with state-level breakdown' };
    }
    if (this.hasTransactionHeaders(headers)) {
      return { type: 'TRANSACTION_DETAIL', subtype: 'INVOICE_LEVEL', confidence: 90, description: 'Detailed transaction records with invoice data' };
    }
    if (this.hasChannelBreakdown(headers)) {
      return { type: 'CHANNEL_ANALYSIS', subtype: 'MARKETPLACE', confidence: 85, description: 'Channel breakdown analysis (Amazon, Shopify, etc.)' };
    }
    if (this.hasMonthlyColumns(headers)) {
      return { type: 'MONTHLY_ADJUSTMENTS', subtype: 'GROSS_NET', confidence: 80, description: 'Monthly adjustment reports' };
    }
    if (this.isSimpleStateRevenue(headers)) {
      return { type: 'STATE_SUMMARY', subtype: 'REVENUE_ONLY', confidence: 75, description: 'Simple state-level revenue summary' };
    }
    if (this.hasPayrollHeaders(headers)) {
      return { type: 'PAYROLL_DATA', subtype: 'EMPLOYEE_LEVEL', confidence: 85, description: 'Payroll data with employee information' };
    }
    if (this.hasGLHeaders(headers)) {
      return { type: 'GL_DATA', subtype: 'ACCOUNT_LEVEL', confidence: 80, description: 'General Ledger account data' };
    }
    return { type: 'UNKNOWN', subtype: 'GENERIC', confidence: 30, description: 'Could not determine document type based on patterns' };
  }

  hasPLHeaderPattern(headers) {
    const plPatterns = ['40000 -', '40100 -', 'Profit & Loss', 'Fiscal Year', 'P&L'];
    return headers.some(h => plPatterns.some(pattern => String(h).includes(pattern)));
  }

  hasTransactionHeaders(headers) {
    const txPatterns = ['Invoice', 'Customer', 'Ship', 'Tax Code', 'Subsidiary', 'Transaction'];
    return headers.some(h => txPatterns.some(pattern => String(h).toLowerCase().includes(pattern.toLowerCase())));
  }

  hasChannelBreakdown(headers) {
    const channelPatterns = ['Amazon', 'Shopify', 'Walmart', 'Ebay', 'Channel'];
    return headers.some(h => channelPatterns.some(pattern => String(h).toLowerCase().includes(pattern.toLowerCase())));
  }

  hasMonthlyColumns(headers) {
    return headers.some(h => String(h).includes('Month')) && 
           (headers.some(h => String(h).includes('Gross_Revenue')) || headers.some(h => String(h).includes('Net_Revenue')));
  }

  isSimpleStateRevenue(headers) {
    return headers.length <= 3 && 
           headers.some(h => String(h).toLowerCase().includes('revenue')) && 
           headers.some(h => String(h).toLowerCase().includes('state'));
  }

  hasPayrollHeaders(headers) {
    const payrollPatterns = ['Employee', 'Wages', 'Salary', 'Payroll', 'W-2', 'Compensation'];
    return headers.some(h => payrollPatterns.some(pattern => String(h).toLowerCase().includes(pattern.toLowerCase())));
  }

  hasGLHeaders(headers) {
    const glPatterns = ['GL Account', 'Account Code', 'Ledger', 'Debit', 'Credit'];
    return headers.some(h => glPatterns.some(pattern => String(h).toLowerCase().includes(pattern.toLowerCase())));
  }
}

const documentClassifier = new DocumentClassifier();

// Parse CSV data
function parseCSV(csvText) {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim());
  const rows = lines.map(line => {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  });
  
  return { rows, headers: rows[0] || [] };
}

// Simple header detection - the working version
function detectHeaderRow(parsedData, fileType, sheetName = null) {
  log('HEADER_DETECTION', 'Starting header detection', { 
    totalRows: parsedData.length, 
    fileType, 
    sheetName 
  });

  const headerKeywords = ['state', 'revenue', 'amount', 'location', 'ship', 'entity', 'gl', 'account', 'payroll', 'employee', 'wages', 'date', 'customer', 'invoice', 'total', 'sales', 'tax'];
  const glAccountPatterns = [/\b\d{4,5}\s*-\s*[A-Za-z]/, /\bGL\s*Account/i, /\bAccount\s*Code/i];

  let bestHeaderRowIndex = -1;
  let maxScore = -1;
  let detectedHeaders = [];
  let dataStartRow = -1;

  const rowsToScan = parsedData.slice(0, Math.min(parsedData.length, 20));
  log('HEADER_DETECTION', `Scanning first ${rowsToScan.length} rows`);

  for (let i = 0; i < rowsToScan.length; i++) {
    const row = rowsToScan[i];
    if (!Array.isArray(row) || row.length === 0) continue;

    let currentScore = 0;
    const lowerCaseCells = row.map(cell => String(cell || '').toLowerCase());

    // Score based on keywords
    const keywordMatches = lowerCaseCells.filter(cell => headerKeywords.some(keyword => cell.includes(keyword)));
    currentScore += keywordMatches.length * 5;

    // Score based on GL account patterns
    const glMatches = row.filter(cell => glAccountPatterns.some(pattern => pattern.test(String(cell))));
    currentScore += glMatches.length * 10;

    // Check if subsequent row contains numeric data
    if (i + 1 < parsedData.length) {
      const nextRow = parsedData[i + 1];
      if (Array.isArray(nextRow) && nextRow.length > 0) {
        const numericCellsInNextRow = nextRow.filter(cell => {
          const val = String(cell).replace(/[$,]/g, '');
          return !isNaN(parseFloat(val)) && parseFloat(val) !== 0;
        }).length;
        if (numericCellsInNextRow > nextRow.length * 0.3) {
          currentScore += 20;
        }
      }
    }

    // Prioritize rows with more non-empty cells
    const nonEmptyCells = row.filter(cell => String(cell).trim() !== '').length;
    currentScore += nonEmptyCells;

    log('HEADER_DETECTION', `Row ${i} analysis`, {
      rowIndex: i,
      score: currentScore,
      keywordMatches: keywordMatches.length,
      glMatches: glMatches.length,
      nonEmptyCells,
      sampleCells: row.slice(0, 5).map(c => String(c || '').substring(0, 30))
    });

    if (currentScore > maxScore) {
      maxScore = currentScore;
      bestHeaderRowIndex = i;
      detectedHeaders = row.map(h => String(h || '').trim());
      dataStartRow = i + 1;
    }
  }

  // Fallback
  if (bestHeaderRowIndex === -1) {
    log('HEADER_DETECTION', 'No header found with scoring, using fallback');
    for (let i = 0; i < rowsToScan.length; i++) {
      if (Array.isArray(rowsToScan[i]) && rowsToScan[i].filter(cell => String(cell).trim() !== '').length > 0) {
        bestHeaderRowIndex = i;
        detectedHeaders = rowsToScan[i].map(h => String(h || '').trim());
        dataStartRow = i + 1;
        maxScore = 30;
        break;
      }
    }
  }

  // Check for critical fields
  const criticalFields = {
    hasState: detectedHeaders.some(h => /state|^st$|location|jurisdiction/i.test(h)),
    hasRevenue: detectedHeaders.some(h => /revenue|amount|sales|total/i.test(h)),
    hasDate: detectedHeaders.some(h => /date|month|period|year/i.test(h))
  };

  const confidence = Math.min(Math.round((maxScore / (detectedHeaders.length * 10 + 20)) * 100), 100);

  const result = {
    headerRowIndex: bestHeaderRowIndex,
    confidence,
    headers: detectedHeaders,
    dataStartRow,
    status: bestHeaderRowIndex !== -1 ? 'DETECTED' : 'NEEDS_MAPPING',
    message: bestHeaderRowIndex !== -1 ? 'Header row successfully detected.' : 'Could not confidently detect header row.',
    criticalFields
  };

  log('HEADER_DETECTION', 'Detection complete', {
    headerRowIndex: result.headerRowIndex,
    confidence: result.confidence,
    headersCount: result.headers.length,
    headers: result.headers,
    dataStartRow: result.dataStartRow,
    status: result.status,
    criticalFields: result.criticalFields
  });

  return result;
}

// Upload endpoint
router.post('/upload', upload.single('file'), async (req, res) => {
  log('UPLOAD', '=== FILE UPLOAD REQUEST ===');
  
  try {
    if (!req.file) {
      log('UPLOAD', 'ERROR: No file in request');
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const file = req.file;
    const fileName = file.originalname;
    const fileExt = fileName.split('.').pop().toLowerCase();
    const fileType = ['xlsx', 'xls'].includes(fileExt) ? 'excel' : 'csv';

    log('UPLOAD', 'File received', {
      fileName,
      fileType,
      fileSize: file.size,
      mimeType: file.mimetype
    });

    let csvData = [];
    let sheets = [];
    let documentClassification = { type: 'UNKNOWN', subtype: 'GENERIC', confidence: 30, description: 'Could not determine document type' };
    let headerDetection = { headerRowIndex: -1, confidence: 0, headers: [], dataStartRow: -1, status: 'NEEDS_MAPPING', message: 'No header detected' };
    let previewData = [];

    if (fileType === 'csv') {
      log('UPLOAD', 'Processing CSV file');
      const csvText = file.buffer.toString('utf-8');
      const parsed = parseCSV(csvText);
      csvData = parsed.rows;
      
      log('UPLOAD', 'CSV parsed', { 
        totalRows: csvData.length, 
        firstRowCols: csvData[0]?.length || 0 
      });
      
      log('UPLOAD', 'Classifying document...');
      documentClassification = await documentClassifier.classifyDocument(csvData, fileName);
      log('UPLOAD', 'Document classification result', documentClassification);
      
      log('UPLOAD', 'Detecting headers...');
      headerDetection = detectHeaderRow(csvData, fileType);
      log('UPLOAD', 'Header detection result', {
        headerRowIndex: headerDetection.headerRowIndex,
        confidence: headerDetection.confidence,
        status: headerDetection.status,
        headers: headerDetection.headers,
        criticalFields: headerDetection.criticalFields
      });
      
      previewData = csvData.slice(0, 10);
      sheets = [{ name: 'Sheet1', rowCount: csvData.length, columnCount: csvData[0]?.length || 0, richnessScore: 80 }];
    } else {
      log('UPLOAD', 'Processing Excel file');
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      
      log('UPLOAD', 'Excel sheets found', { sheetNames: workbook.SheetNames });
      
      sheets = workbook.SheetNames.map(name => {
        const sheet = workbook.Sheets[name];
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        return {
          name,
          rowCount: data.length,
          columnCount: data[0]?.length || 0,
          richnessScore: Math.min(100, Math.round((data.length * (data[0]?.length || 0)) / 10))
        };
      });

      // Use first sheet for preview
      if (workbook.SheetNames.length > 0) {
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        csvData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
        
        log('UPLOAD', 'First sheet data', { 
          sheetName: workbook.SheetNames[0],
          totalRows: csvData.length, 
          firstRowCols: csvData[0]?.length || 0 
        });
        
        log('UPLOAD', 'Classifying document...');
        documentClassification = await documentClassifier.classifyDocument(csvData, fileName);
        log('UPLOAD', 'Document classification result', documentClassification);
        
        log('UPLOAD', 'Detecting headers...');
        headerDetection = detectHeaderRow(csvData, fileType);
        log('UPLOAD', 'Header detection result', {
          headerRowIndex: headerDetection.headerRowIndex,
          confidence: headerDetection.confidence,
          status: headerDetection.status,
          headers: headerDetection.headers,
          criticalFields: headerDetection.criticalFields
        });
        
        previewData = csvData.slice(0, 10);
      }
    }

    const uploadId = `upload-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const response = {
      success: true,
      uploadId,
      metadata: {
        fileName,
        fileType,
        fileSize: file.size,
        uploadedAt: new Date().toISOString(),
        headerDetection
      },
      sheets,
      documentClassification,
      headerDetection,
      previewData,
      // Include all data rows for alert generation (not just preview)
      allData: csvData,
      fileBuffer: file.buffer.toString('base64')
    };

    log('UPLOAD', '=== UPLOAD COMPLETE ===', {
      uploadId,
      fileName,
      documentType: documentClassification.type,
      headerRowIndex: headerDetection.headerRowIndex,
      headerConfidence: headerDetection.confidence,
      headersDetected: headerDetection.headers.length,
      criticalFields: headerDetection.criticalFields
    });

    res.json(response);
  } catch (error) {
    log('UPLOAD', 'ERROR', { message: error.message, stack: error.stack });
    console.error('Upload error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Detect sheets endpoint
router.post('/detect-sheets', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const file = req.file;
    const fileType = req.body.fileType || 'excel';

    if (fileType === 'csv') {
      const csvText = file.buffer.toString('utf-8');
      const parsed = parseCSV(csvText);
      return res.json({
        success: true,
        sheets: [{ name: 'Sheet1', rowCount: parsed.rows.length, columnCount: parsed.headers.length, richnessScore: 80 }]
      });
    }

    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheets = workbook.SheetNames.map(name => {
      const sheet = workbook.Sheets[name];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      return {
        name,
        rowCount: data.length,
        columnCount: data[0]?.length || 0,
        richnessScore: Math.min(100, Math.round((data.length * (data[0]?.length || 0)) / 10))
      };
    });

    res.json({ success: true, sheets });
  } catch (error) {
    console.error('Detect sheets error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Detect header endpoint
router.post('/detect-header', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const file = req.file;
    const fileType = req.body.fileType || 'csv';
    const sheetName = req.body.sheetName;

    let csvData = [];

    if (fileType === 'csv') {
      const csvText = file.buffer.toString('utf-8');
      const parsed = parseCSV(csvText);
      csvData = parsed.rows;
    } else {
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const targetSheet = sheetName || workbook.SheetNames[0];
      const sheet = workbook.Sheets[targetSheet];
      csvData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    }

    const headerDetection = detectHeaderRow(csvData, fileType, sheetName);
    const sampleRows = csvData.slice(headerDetection.dataStartRow, headerDetection.dataStartRow + 5);

    res.json({
      success: true,
      ...headerDetection,
      sampleRows
    });
  } catch (error) {
    console.error('Detect header error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Suggest mappings endpoint
router.post('/suggest-mappings', async (req, res) => {
  try {
    const { uploadId, headers, documentType, sampleData } = req.body;

    if (!headers || !Array.isArray(headers)) {
      return res.status(400).json({ success: false, error: 'Headers array is required' });
    }

    const mappableFields = [
      { value: 'state', label: 'State', patterns: ['state', 'st', 'location', 'jurisdiction', 'ship state', 'ship_state'] },
      { value: 'revenue', label: 'Revenue', patterns: ['revenue', 'amount', 'sales', 'total', 'gross', 'net'] },
      { value: 'entity', label: 'Entity', patterns: ['entity', 'company', 'subsidiary', 'business', 'unit'] },
      { value: 'workers', label: 'Workers', patterns: ['employee', 'worker', 'headcount', 'staff', 'personnel'] },
      { value: 'glAccount', label: 'GL Account', patterns: ['gl', 'account', 'ledger', 'code'] },
      { value: 'date', label: 'Date', patterns: ['date', 'period', 'month', 'year', 'quarter'] },
      { value: 'customer', label: 'Customer', patterns: ['customer', 'client', 'buyer', 'purchaser'] },
      { value: 'invoice', label: 'Invoice', patterns: ['invoice', 'order', 'transaction', 'reference'] }
    ];

    const mappings = headers.map((header, index) => {
      const headerLower = String(header).toLowerCase();
      let bestMatch = null;
      let bestConfidence = 0;
      const alternatives = [];

      for (const field of mappableFields) {
        for (const pattern of field.patterns) {
          if (headerLower.includes(pattern)) {
            const confidence = pattern === headerLower ? 95 : 75;
            if (confidence > bestConfidence) {
              if (bestMatch) alternatives.push(bestMatch.value);
              bestMatch = field;
              bestConfidence = confidence;
            } else {
              alternatives.push(field.value);
            }
            break;
          }
        }
      }

      return {
        columnIndex: index,
        columnName: header,
        suggestedField: bestMatch?.value || null,
        confidence: bestConfidence,
        alternatives: alternatives.slice(0, 3)
      };
    });

    res.json({ success: true, mappings });
  } catch (error) {
    console.error('Suggest mappings error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Data Validation endpoint - comprehensive autonomous validation pipeline
router.post('/validate-data', async (req, res) => {
  log('VALIDATE_DATA', '=== DATA VALIDATION REQUEST ===');
  
  try {
    const { files, options } = req.body;
    
    log('VALIDATE_DATA', 'Request received', {
      fileCount: files?.length || 0,
      options
    });

    if (!files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No files provided for validation'
      });
    }

    // Use the DataValidationEngine
    const { DataValidationEngine } = require('../services/data-validation');
    const engine = new DataValidationEngine(options || {});
    
    const result = await engine.validate(files);
    
    log('VALIDATE_DATA', '=== VALIDATION COMPLETE ===', {
      stages: result.stages?.length || 0,
      issues: result.issues?.length || 0,
      mappings: result.mappings?.length || 0,
      summary: result.summary
    });

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    log('VALIDATE_DATA', 'ERROR', { message: error.message, stack: error.stack });
    console.error('Validation error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Process endpoint
router.post('/process', async (req, res) => {
  try {
    const { uploadId, mappings, headerRowIndex } = req.body;

    // For now, return mock processed data
    res.json({
      success: true,
      normalizedData: {
        rows: [],
        summary: { totalRows: 0, processedRows: 0 }
      },
      alerts: [],
      memos: { generated: false, count: 0 }
    });
  } catch (error) {
    console.error('Process error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Generate Alerts endpoint - uses NexusAlertEngine
router.post('/generate-alerts', async (req, res) => {
  log('GENERATE_ALERTS', '=== ALERT GENERATION REQUEST ===');
  
  try {
    const { normalizedData, config } = req.body;
    
    log('GENERATE_ALERTS', 'Request received', {
      dataRows: normalizedData?.length || 0,
      config: config
    });

    if (!normalizedData || !Array.isArray(normalizedData)) {
      log('GENERATE_ALERTS', 'ERROR: No normalized data provided');
      return res.status(400).json({ 
        success: false, 
        error: 'Normalized data array is required' 
      });
    }

    // Try to use the NexusAlertEngine
    let alerts = [];
    let summary = {};
    
    try {
      const { NexusAlertEngine } = require('../services/nexus-alert-engine');
      
      const engine = new NexusAlertEngine({
        firmId: config?.firmId || 'default',
        riskPosture: config?.riskPosture || 'standard',
        enabledModules: config?.enabledModules || {
          sales: true,
          income: true,
          payroll: true,
          franchise: true
        }
      });

      log('GENERATE_ALERTS', 'NexusAlertEngine initialized');

      const result = await engine.processDocument(normalizedData, config?.documentType);
      
      alerts = result.alerts;
      summary = result.summary;
      
      log('GENERATE_ALERTS', 'Detection complete', {
        totalAlerts: alerts.length,
        summary: summary
      });
    } catch (engineError) {
      log('GENERATE_ALERTS', 'NexusAlertEngine error, using fallback', { 
        error: engineError.message 
      });
      
      // Fallback: Generate basic alerts from data
      alerts = generateFallbackAlerts(normalizedData);
      summary = {
        total: alerts.length,
        bySeverity: { HIGH: 0, MEDIUM: 0, LOW: 0 },
        byType: {}
      };
      
      alerts.forEach(a => {
        summary.bySeverity[a.severity] = (summary.bySeverity[a.severity] || 0) + 1;
        summary.byType[a.type] = (summary.byType[a.type] || 0) + 1;
      });
    }

    log('GENERATE_ALERTS', '=== ALERT GENERATION COMPLETE ===', {
      alertCount: alerts.length
    });

    res.json({
      success: true,
      alerts,
      summary
    });
  } catch (error) {
    log('GENERATE_ALERTS', 'ERROR', { message: error.message, stack: error.stack });
    console.error('Generate alerts error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Fallback alert generation when engine fails
function generateFallbackAlerts(normalizedData) {
  const alerts = [];
  const stateData = {};
  
  // Group data by state
  for (const row of normalizedData) {
    const state = row.state || row.ship_state || row.customer_state || row.location;
    if (!state) continue;
    
    const stateCode = String(state).toUpperCase().trim().substring(0, 2);
    if (!stateData[stateCode]) {
      stateData[stateCode] = { revenue: 0, count: 0 };
    }
    
    const revenue = parseFloat(String(row.revenue || row.amount || row.sales || row.total || 0).replace(/[$,]/g, ''));
    if (!isNaN(revenue)) {
      stateData[stateCode].revenue += revenue;
      stateData[stateCode].count++;
    }
  }
  
  // Generate alerts based on thresholds
  const thresholds = {
    CA: 500000, TX: 500000, NY: 500000, FL: 100000,
    IL: 100000, GA: 100000, NC: 100000, PA: 100000
  };
  
  for (const [state, data] of Object.entries(stateData)) {
    const threshold = thresholds[state] || 100000;
    const percentage = (data.revenue / threshold) * 100;
    
    if (data.revenue >= threshold) {
      alerts.push({
        id: `SALES_${state}_${Date.now()}`,
        type: 'SALES_NEXUS',
        subtype: 'ECONOMIC_NEXUS',
        state: state,
        stateName: state,
        severity: 'HIGH',
        title: `${state} Sales Tax Economic Nexus Triggered`,
        description: `Revenue of $${data.revenue.toLocaleString()} exceeds ${state}'s threshold of $${threshold.toLocaleString()}`,
        facts: {
          threshold,
          actualRevenue: data.revenue,
          percentageOver: percentage.toFixed(1)
        },
        recommendation: `Register for sales tax collection in ${state}`,
        judgmentRequired: false,
        requiresAction: true,
        createdDate: new Date().toISOString()
      });
    } else if (percentage >= 80) {
      alerts.push({
        id: `SALES_APPROACHING_${state}_${Date.now()}`,
        type: 'SALES_NEXUS',
        subtype: 'ECONOMIC_NEXUS_APPROACHING',
        state: state,
        stateName: state,
        severity: 'MEDIUM',
        title: `${state} Sales Tax Threshold Approaching`,
        description: `Revenue of $${data.revenue.toLocaleString()} is ${percentage.toFixed(1)}% of ${state}'s threshold`,
        facts: {
          threshold,
          actualRevenue: data.revenue,
          percentageOfThreshold: percentage.toFixed(1)
        },
        recommendation: `Monitor sales activity in ${state}`,
        judgmentRequired: false,
        requiresAction: false,
        createdDate: new Date().toISOString()
      });
    }
  }
  
  return alerts;
}

module.exports = router;
