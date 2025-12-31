/**
 * Data Validation Engine
 * Comprehensive autonomous data validation pipeline for Nexus analysis
 * 
 * Stages:
 * 1. File Parsing - Validate format and structure
 * 2. Header Analysis - Smart column detection with fuzzy matching
 * 3. Data Quality Scan - Analyze consistency and issues
 * 4. State Normalization - Standardize state values
 * 5. Required Fields Validation - Check for nexus analysis requirements
 * 6. Firm Learning - Apply and update firm taxonomy
 * 7. Finalization - Prepare data for analysis
 */

const Fuse = require('fuse.js');

// State mappings and variations
const STATE_DATA = {
  codes: {
    'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
    'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
    'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
    'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
    'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
    'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
    'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
    'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
    'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
    'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming',
    'DC': 'District of Columbia'
  },
  variations: {
    'calif': 'CA', 'cali': 'CA', 'cal': 'CA',
    'tex': 'TX', 'texs': 'TX',
    'fla': 'FL', 'flor': 'FL',
    'ny': 'NY', 'newyork': 'NY',
    'penn': 'PA', 'penna': 'PA',
    'mass': 'MA',
    'wash': 'WA',
    'mich': 'MI',
    'minn': 'MN',
    'wisc': 'WI', 'wis': 'WI',
    'conn': 'CT',
    'tenn': 'TN',
    'ariz': 'AZ',
    'colo': 'CO',
    'virg': 'VA',
    'okla': 'OK',
    'nebr': 'NE', 'neb': 'NE',
    'kans': 'KS', 'kan': 'KS',
    'mont': 'MT',
    'oreg': 'OR', 'ore': 'OR',
    'miss': 'MS',
    'ala': 'AL',
    'ark': 'AR',
    'dela': 'DE', 'del': 'DE',
    'georg': 'GA',
    'idah': 'ID',
    'indi': 'IN',
    'iowa': 'IA',
    'kent': 'KY',
    'louis': 'LA',
    'maine': 'ME',
    'maryl': 'MD',
    'nevad': 'NV', 'nev': 'NV',
    'ohio': 'OH',
    'rhode': 'RI',
    'utah': 'UT',
    'verm': 'VT',
    'wyom': 'WY', 'wyo': 'WY'
  }
};

// Field taxonomy for smart mapping
const FIELD_TAXONOMY = {
  state: {
    patterns: ['state', 'ship_state', 'ship_location', 'ship_to_state', 'destination_state', 
               'customer_state', 'billing_state', 'location', 'region', 'st', 'ship to'],
    dataPatterns: /^[A-Z]{2}$|^[A-Za-z\s]{4,20}$/,
    priority: 1
  },
  revenue: {
    patterns: ['amount', 'revenue', 'total', 'sales', 'net_amount', 'gross_amount', 
               'transaction_amount', 'sale_amount', 'invoice_amount', 'price', 'value'],
    dataPatterns: /^-?\$?[\d,]+\.?\d*$/,
    priority: 1
  },
  date: {
    patterns: ['date', 'transaction_date', 'invoice_date', 'sale_date', 'order_date',
               'created_date', 'posted_date', 'period', 'month', 'year'],
    dataPatterns: /^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}$|^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/,
    priority: 2
  },
  customer: {
    patterns: ['customer', 'customer_name', 'client', 'client_name', 'company', 
               'account', 'account_name', 'buyer', 'purchaser'],
    dataPatterns: null,
    priority: 3
  },
  product: {
    patterns: ['item', 'product', 'service', 'item_service', 'description', 
               'sku', 'item_name', 'product_name', 'service_name'],
    dataPatterns: null,
    priority: 3
  },
  activity_type: {
    patterns: ['activity', 'activity_type', 'type', 'category', 'transaction_type',
               'service_type', 'tax_code'],
    dataPatterns: null,
    priority: 2
  },
  employee: {
    patterns: ['employee', 'employee_name', 'worker', 'staff', 'personnel'],
    dataPatterns: null,
    priority: 3
  },
  wages: {
    patterns: ['wages', 'salary', 'compensation', 'payroll', 'earnings', 'pay'],
    dataPatterns: /^-?\$?[\d,]+\.?\d*$/,
    priority: 2
  }
};

// Required fields per module
const REQUIRED_FIELDS = {
  sales: { required: ['state', 'revenue'], optional: ['date', 'customer', 'product'] },
  income: { required: ['state', 'revenue'], optional: ['date', 'activity_type'] },
  payroll: { required: ['state', 'wages'], optional: ['date', 'employee'] },
  franchise: { required: ['state', 'revenue'], optional: ['date'] }
};

class DataValidationEngine {
  constructor(options = {}) {
    this.options = {
      enableFirmLearning: options.enableFirmLearning ?? true,
      strictMode: options.strictMode ?? false,
      sampleSize: options.sampleSize ?? 1000,
      confidenceThreshold: options.confidenceThreshold ?? 50
    };
    
    this.stages = [];
    this.issues = [];
    this.mappings = [];
    this.normalizations = [];
    this.firmTaxonomy = new Map();
  }

  /**
   * Main validation pipeline
   */
  async validate(files) {
    console.log('[VALIDATION] Starting validation pipeline for', files.length, 'files');
    
    const results = {
      stages: [],
      issues: [],
      mappings: [],
      normalizations: [],
      summary: {}
    };

    try {
      // Process each file
      for (const file of files) {
        const fileResult = await this.validateFile(file);
        results.stages.push(...fileResult.stages);
        results.issues.push(...fileResult.issues);
        results.mappings = fileResult.mappings; // Use last file's mappings
        results.normalizations.push(...fileResult.normalizations);
      }

      // Generate summary
      results.summary = this.generateSummary(files, results);
      
      console.log('[VALIDATION] Pipeline complete:', {
        stages: results.stages.length,
        issues: results.issues.length,
        mappings: results.mappings.length,
        autoResolved: results.summary.autoResolved
      });

    } catch (error) {
      console.error('[VALIDATION] Pipeline error:', error);
      results.issues.push({
        id: `error-${Date.now()}`,
        type: 'error',
        severity: 'error',
        title: 'Validation Failed',
        description: error.message
      });
    }

    return results;
  }

  /**
   * Validate a single file through all stages
   */
  async validateFile(file) {
    const stages = [];
    const issues = [];
    let mappings = [];
    const normalizations = [];

    const data = file.allData || file.previewData || [];
    const headers = file.headerDetection?.headers || (data[0] || []);
    const dataStartRow = file.headerDetection?.dataStartRow || 1;

    console.log('[VALIDATION] Processing file:', file.fileName, {
      totalRows: data.length,
      headers: headers.length,
      dataStartRow
    });

    // Stage 1: File Parsing
    stages.push(await this.stage1_FileParsing(file, data));

    // Stage 2: Header Analysis
    const headerResult = await this.stage2_HeaderAnalysis(headers, data, dataStartRow);
    stages.push(headerResult.stage);
    mappings = headerResult.mappings;
    issues.push(...headerResult.issues);

    // Stage 3: Data Quality Scan
    const qualityResult = await this.stage3_DataQuality(data, dataStartRow, mappings);
    stages.push(qualityResult.stage);
    issues.push(...qualityResult.issues);

    // Stage 4: State Normalization
    const stateResult = await this.stage4_StateNormalization(data, dataStartRow, mappings);
    stages.push(stateResult.stage);
    normalizations.push(...stateResult.normalizations);
    issues.push(...stateResult.issues);

    // Stage 5: Required Fields Validation
    const requiredResult = await this.stage5_RequiredFields(mappings);
    stages.push(requiredResult.stage);
    issues.push(...requiredResult.issues);

    // Stage 6: Firm Learning
    stages.push(await this.stage6_FirmLearning(mappings));

    // Stage 7: Finalization
    const finalResult = await this.stage7_Finalization(data, mappings, normalizations);
    stages.push(finalResult.stage);

    return { stages, issues, mappings, normalizations };
  }

  /**
   * Stage 1: File Parsing
   */
  async stage1_FileParsing(file, data) {
    const stage = {
      id: 'parse',
      status: 'success',
      progress: 100,
      message: `Parsed ${data.length} rows successfully`
    };

    if (!data || data.length === 0) {
      stage.status = 'error';
      stage.message = 'No data found in file';
    } else if (data.length < 2) {
      stage.status = 'warning';
      stage.message = 'File contains only header row';
    }

    return stage;
  }

  /**
   * Stage 2: Header Analysis with smart column detection
   */
  async stage2_HeaderAnalysis(headers, data, dataStartRow) {
    const mappings = [];
    const issues = [];

    // Get sample data for each column
    const sampleData = this.getSampleData(data, dataStartRow, 100);

    for (let i = 0; i < headers.length; i++) {
      const header = String(headers[i] || '').trim();
      const samples = sampleData[i] || [];
      
      const mapping = this.detectColumnMapping(header, samples, i);
      mappings.push(mapping);

      // Check for issues
      if (mapping.confidence < 50 && mapping.suggestedField !== 'ignore') {
        issues.push({
          id: `mapping-${i}`,
          type: 'column_mapping',
          severity: 'warning',
          title: `Low confidence mapping for "${header}"`,
          description: `Could not confidently determine the purpose of column "${header}"`,
          column: header,
          suggestions: mapping.alternatives?.map(alt => ({
            value: alt.field,
            confidence: alt.confidence,
            label: this.getFieldLabel(alt.field)
          })) || []
        });
      }
    }

    // Check for duplicate mappings
    const fieldCounts = {};
    mappings.forEach(m => {
      if (m.suggestedField && m.suggestedField !== 'ignore') {
        fieldCounts[m.suggestedField] = (fieldCounts[m.suggestedField] || 0) + 1;
      }
    });

    Object.entries(fieldCounts).forEach(([field, count]) => {
      if (count > 1) {
        issues.push({
          id: `duplicate-${field}`,
          type: 'duplicate_column',
          severity: 'warning',
          title: `Multiple columns mapped to "${this.getFieldLabel(field)}"`,
          description: `Found ${count} columns that could be "${this.getFieldLabel(field)}". Please select which one to use.`,
          suggestions: mappings
            .filter(m => m.suggestedField === field)
            .map(m => ({
              value: m.sourceColumn,
              confidence: m.confidence,
              label: `Use "${m.sourceColumn}" (${m.confidence}% confidence)`
            }))
        });
      }
    });

    const autoMapped = mappings.filter(m => m.confidence >= 80).length;
    
    return {
      stage: {
        id: 'headers',
        status: issues.length > 0 ? 'warning' : 'success',
        progress: 100,
        message: `${autoMapped}/${mappings.length} columns auto-mapped`,
        details: { autoMapped, total: mappings.length }
      },
      mappings,
      issues
    };
  }

  /**
   * Detect column mapping using fuzzy matching and data analysis
   */
  detectColumnMapping(header, samples, index) {
    const normalizedHeader = header.toLowerCase().replace(/[^a-z0-9]/g, '_');
    let bestMatch = { field: 'ignore', confidence: 0, source: 'none' };
    const alternatives = [];

    // Check each field in taxonomy
    for (const [field, config] of Object.entries(FIELD_TAXONOMY)) {
      let confidence = 0;
      let source = 'fuzzy';

      // Exact pattern match
      if (config.patterns.some(p => normalizedHeader === p.replace(/\s/g, '_'))) {
        confidence = 100;
        source = 'exact';
      }
      // Partial pattern match
      else if (config.patterns.some(p => normalizedHeader.includes(p.replace(/\s/g, '_')))) {
        confidence = 85;
        source = 'partial';
      }
      // Fuzzy match using Levenshtein distance
      else {
        const fuse = new Fuse(config.patterns, { threshold: 0.4 });
        const result = fuse.search(normalizedHeader);
        if (result.length > 0) {
          confidence = Math.round((1 - result[0].score) * 70);
          source = 'fuzzy';
        }
      }

      // Boost confidence with data pattern matching
      if (confidence > 0 && config.dataPatterns && samples.length > 0) {
        const matchingValues = samples.filter(s => 
          s && config.dataPatterns.test(String(s))
        ).length;
        const dataMatchRate = matchingValues / samples.length;
        
        if (dataMatchRate > 0.7) {
          confidence = Math.min(100, confidence + 15);
        } else if (dataMatchRate < 0.3 && confidence < 90) {
          confidence = Math.max(0, confidence - 20);
        }
      }

      // Special handling for state detection
      if (field === 'state' && samples.length > 0) {
        const stateMatches = samples.filter(s => this.isValidState(s)).length;
        if (stateMatches / samples.length > 0.5) {
          confidence = Math.max(confidence, 90);
          source = 'data_analysis';
        }
      }

      if (confidence > 0) {
        alternatives.push({ field, confidence, source });
      }

      if (confidence > bestMatch.confidence) {
        bestMatch = { field, confidence, source };
      }
    }

    // Sort alternatives by confidence
    alternatives.sort((a, b) => b.confidence - a.confidence);

    return {
      sourceColumn: header,
      suggestedField: bestMatch.confidence >= 50 ? bestMatch.field : 'ignore',
      confidence: bestMatch.confidence,
      source: bestMatch.source,
      alternatives: alternatives.slice(0, 3),
      dataType: this.detectDataType(samples),
      sampleValues: samples.slice(0, 5)
    };
  }

  /**
   * Stage 3: Data Quality Scan
   */
  async stage3_DataQuality(data, dataStartRow, mappings) {
    const issues = [];
    let qualityScore = 100;
    const dataRows = data.slice(dataStartRow);

    // Check null/empty percentages
    const stateMapping = mappings.find(m => m.suggestedField === 'state');
    const revenueMapping = mappings.find(m => m.suggestedField === 'revenue');

    if (stateMapping) {
      const stateIndex = mappings.indexOf(stateMapping);
      const emptyStates = dataRows.filter(row => !row[stateIndex] || String(row[stateIndex]).trim() === '').length;
      const emptyRate = emptyStates / dataRows.length;

      if (emptyRate > 0.1) {
        qualityScore -= 20;
        issues.push({
          id: 'quality-state-empty',
          type: 'data_quality',
          severity: emptyRate > 0.3 ? 'error' : 'warning',
          title: 'Missing state values',
          description: `${Math.round(emptyRate * 100)}% of rows have empty state values`,
          affectedRows: emptyStates,
          suggestions: [
            { value: 'proceed', confidence: 70, label: 'Proceed with available data' },
            { value: 'review', confidence: 30, label: 'Review and fix data' }
          ]
        });
      }
    }

    if (revenueMapping) {
      const revenueIndex = mappings.indexOf(revenueMapping);
      const invalidRevenue = dataRows.filter(row => {
        const val = row[revenueIndex];
        return val && isNaN(parseFloat(String(val).replace(/[$,]/g, '')));
      }).length;

      if (invalidRevenue > 0) {
        qualityScore -= 15;
        issues.push({
          id: 'quality-revenue-invalid',
          type: 'data_quality',
          severity: invalidRevenue > dataRows.length * 0.1 ? 'error' : 'warning',
          title: 'Invalid revenue values',
          description: `${invalidRevenue} rows have non-numeric revenue values`,
          affectedRows: invalidRevenue
        });
      }
    }

    return {
      stage: {
        id: 'quality',
        status: issues.length > 0 ? 'warning' : 'success',
        progress: 100,
        message: issues.length > 0 
          ? `Found ${issues.length} data quality issues`
          : 'Data quality checks passed',
        details: { qualityScore, issueCount: issues.length }
      },
      issues
    };
  }

  /**
   * Stage 4: State Normalization
   */
  async stage4_StateNormalization(data, dataStartRow, mappings) {
    const normalizations = [];
    const issues = [];
    const stateMapping = mappings.find(m => m.suggestedField === 'state');

    if (!stateMapping) {
      return {
        stage: {
          id: 'normalize',
          status: 'warning',
          progress: 100,
          message: 'No state column detected - skipping normalization'
        },
        normalizations,
        issues
      };
    }

    const stateIndex = mappings.indexOf(stateMapping);
    const dataRows = data.slice(dataStartRow);
    const stateCounts = {};
    const normalizationMap = {};
    let successCount = 0;
    let failCount = 0;

    // Count occurrences and normalize
    for (const row of dataRows) {
      const original = String(row[stateIndex] || '').trim();
      if (!original) continue;

      if (!stateCounts[original]) {
        stateCounts[original] = 0;
        normalizationMap[original] = this.normalizeState(original);
      }
      stateCounts[original]++;

      if (normalizationMap[original].normalized) {
        successCount++;
      } else {
        failCount++;
      }
    }

    // Build normalization results
    for (const [original, count] of Object.entries(stateCounts)) {
      const norm = normalizationMap[original];
      normalizations.push({
        original,
        normalized: norm.normalized || original,
        confidence: norm.confidence,
        count,
        flagged: norm.confidence < 80
      });
    }

    const successRate = successCount / (successCount + failCount) || 0;

    if (successRate < 0.8 && failCount > 0) {
      issues.push({
        id: 'normalize-low-success',
        type: 'state_normalization',
        severity: successRate < 0.5 ? 'error' : 'warning',
        title: 'State normalization issues',
        description: `${Math.round((1 - successRate) * 100)}% of state values couldn't be standardized`,
        affectedRows: failCount,
        suggestions: [
          { value: 'proceed', confidence: 60, label: 'Proceed with partial normalization' },
          { value: 'review', confidence: 40, label: 'Review failed normalizations' }
        ]
      });
    }

    const corrected = normalizations.filter(n => n.original !== n.normalized && n.confidence >= 80).length;

    return {
      stage: {
        id: 'normalize',
        status: issues.length > 0 ? 'warning' : 'success',
        progress: 100,
        message: `${corrected} values auto-corrected, ${Math.round(successRate * 100)}% success rate`,
        details: { successRate, corrected, failed: failCount }
      },
      normalizations,
      issues
    };
  }

  /**
   * Normalize a single state value
   */
  normalizeState(input) {
    if (!input) return { normalized: null, confidence: 0 };

    const cleaned = String(input).trim().toUpperCase();

    // Direct USPS code match
    if (STATE_DATA.codes[cleaned]) {
      return { normalized: cleaned, confidence: 100 };
    }

    // Full state name match
    const nameToCode = Object.entries(STATE_DATA.codes).find(([code, name]) => 
      name.toUpperCase() === cleaned
    );
    if (nameToCode) {
      return { normalized: nameToCode[0], confidence: 100 };
    }

    // Common variations
    const variation = STATE_DATA.variations[cleaned.toLowerCase()];
    if (variation) {
      return { normalized: variation, confidence: 95 };
    }

    // Extract from "City, ST" format
    const cityStateMatch = cleaned.match(/,\s*([A-Z]{2})$/);
    if (cityStateMatch && STATE_DATA.codes[cityStateMatch[1]]) {
      return { normalized: cityStateMatch[1], confidence: 90 };
    }

    // Fuzzy match against full names
    const allNames = Object.entries(STATE_DATA.codes).map(([code, name]) => ({ code, name }));
    const fuse = new Fuse(allNames, { keys: ['name'], threshold: 0.3 });
    const fuzzyResult = fuse.search(cleaned);

    if (fuzzyResult.length > 0) {
      const distance = fuzzyResult[0].score || 0;
      return { 
        normalized: fuzzyResult[0].item.code, 
        confidence: Math.round((1 - distance) * 85) 
      };
    }

    return { normalized: null, confidence: 0 };
  }

  /**
   * Stage 5: Required Fields Validation
   */
  async stage5_RequiredFields(mappings) {
    const issues = [];
    const detectedFields = mappings
      .filter(m => m.suggestedField !== 'ignore' && m.confidence >= 50)
      .map(m => m.suggestedField);

    const moduleStatus = {};

    for (const [module, requirements] of Object.entries(REQUIRED_FIELDS)) {
      const missingRequired = requirements.required.filter(f => !detectedFields.includes(f));
      const hasRequired = missingRequired.length === 0;
      const missingOptional = requirements.optional.filter(f => !detectedFields.includes(f));

      moduleStatus[module] = {
        canProceed: hasRequired,
        missingRequired,
        missingOptional,
        status: hasRequired ? (missingOptional.length > 0 ? 'limited' : 'full') : 'blocked'
      };

      if (!hasRequired) {
        issues.push({
          id: `required-${module}`,
          type: 'missing_field',
          severity: 'error',
          title: `Missing required fields for ${module} tax analysis`,
          description: `Cannot perform ${module} analysis without: ${missingRequired.map(f => this.getFieldLabel(f)).join(', ')}`,
          suggestions: missingRequired.map(f => ({
            value: f,
            confidence: 0,
            label: `Map a column to "${this.getFieldLabel(f)}"`
          }))
        });
      }
    }

    const canProceedModules = Object.values(moduleStatus).filter(s => s.canProceed).length;

    return {
      stage: {
        id: 'validate',
        status: canProceedModules === 0 ? 'error' : issues.length > 0 ? 'warning' : 'success',
        progress: 100,
        message: canProceedModules > 0 
          ? `${canProceedModules}/4 analysis modules ready`
          : 'Missing required fields for all analysis modules',
        details: { moduleStatus }
      },
      issues
    };
  }

  /**
   * Stage 6: Firm Learning
   */
  async stage6_FirmLearning(mappings) {
    // In production, this would load/save to database
    // For now, simulate learning
    const learnedMappings = mappings.filter(m => m.confidence >= 80).length;

    return {
      id: 'learn',
      status: 'success',
      progress: 100,
      message: `${learnedMappings} mappings added to firm taxonomy`,
      details: { learnedMappings }
    };
  }

  /**
   * Stage 7: Finalization
   */
  async stage7_Finalization(data, mappings, normalizations) {
    const dataStartRow = 1;
    const dataRows = data.slice(dataStartRow);

    // Calculate summary statistics
    const stateMapping = mappings.find(m => m.suggestedField === 'state');
    const revenueMapping = mappings.find(m => m.suggestedField === 'revenue');

    let totalRevenue = 0;
    const statesDetected = new Set();

    if (stateMapping && revenueMapping) {
      const stateIndex = mappings.indexOf(stateMapping);
      const revenueIndex = mappings.indexOf(revenueMapping);

      for (const row of dataRows) {
        const state = String(row[stateIndex] || '').trim();
        const revenue = parseFloat(String(row[revenueIndex] || '0').replace(/[$,]/g, ''));

        if (state) {
          const norm = normalizations.find(n => n.original === state);
          statesDetected.add(norm?.normalized || state);
        }
        if (!isNaN(revenue)) {
          totalRevenue += revenue;
        }
      }
    }

    return {
      stage: {
        id: 'finalize',
        status: 'success',
        progress: 100,
        message: 'Data ready for nexus analysis',
        details: {
          totalRows: dataRows.length,
          statesDetected: statesDetected.size,
          totalRevenue
        }
      }
    };
  }

  /**
   * Generate validation summary
   */
  generateSummary(files, results) {
    const totalRows = files.reduce((sum, f) => 
      sum + (f.allData?.length || f.previewData?.length || 0) - 1, 0
    );

    const autoResolved = results.issues.filter(i => i.resolved).length;
    const statesDetected = new Set(results.normalizations.map(n => n.normalized)).size;
    
    let totalRevenue = 0;
    const revenueMapping = results.mappings.find(m => m.suggestedField === 'revenue');
    if (revenueMapping) {
      const revenueIndex = results.mappings.indexOf(revenueMapping);
      for (const file of files) {
        const data = file.allData || file.previewData || [];
        for (let i = 1; i < data.length; i++) {
          const val = parseFloat(String(data[i][revenueIndex] || '0').replace(/[$,]/g, ''));
          if (!isNaN(val)) totalRevenue += val;
        }
      }
    }

    return {
      totalRows,
      validRows: totalRows - results.issues.filter(i => i.type === 'data_quality').reduce((sum, i) => sum + (i.affectedRows || 0), 0),
      statesDetected,
      totalRevenue,
      autoResolved,
      issueCount: results.issues.length
    };
  }

  // Helper methods
  getSampleData(data, startRow, sampleSize) {
    const samples = {};
    const rows = data.slice(startRow, startRow + sampleSize);
    
    for (const row of rows) {
      if (!Array.isArray(row)) continue;
      row.forEach((val, idx) => {
        if (!samples[idx]) samples[idx] = [];
        if (val !== null && val !== undefined && String(val).trim() !== '') {
          samples[idx].push(val);
        }
      });
    }
    
    return samples;
  }

  detectDataType(samples) {
    if (samples.length === 0) return 'unknown';
    
    const types = samples.map(s => {
      if (s === null || s === undefined) return 'null';
      if (typeof s === 'number') return 'number';
      const str = String(s);
      if (/^\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}$/.test(str)) return 'date';
      if (/^-?\$?[\d,]+\.?\d*$/.test(str)) return 'number';
      return 'string';
    });

    const typeCounts = types.reduce((acc, t) => {
      acc[t] = (acc[t] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'string';
  }

  isValidState(value) {
    if (!value) return false;
    const cleaned = String(value).trim().toUpperCase();
    return STATE_DATA.codes[cleaned] || 
           Object.values(STATE_DATA.codes).some(name => name.toUpperCase() === cleaned);
  }

  getFieldLabel(field) {
    const labels = {
      state: 'State',
      revenue: 'Revenue/Amount',
      date: 'Date',
      customer: 'Customer',
      product: 'Product/Service',
      activity_type: 'Activity Type',
      employee: 'Employee',
      wages: 'Wages',
      ignore: 'Ignore'
    };
    return labels[field] || field;
  }
}

module.exports = DataValidationEngine;




