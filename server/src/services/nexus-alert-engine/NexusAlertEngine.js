/**
 * Nexus Alert Engine
 * 
 * Main orchestrator for detecting state tax nexus obligations across:
 * - Sales Tax
 * - Income Tax (with PL 86-272)
 * - Payroll Tax
 * - Franchise Tax
 */

const SalesNexusDetector = require('./detectors/SalesNexusDetector');
const IncomeNexusDetector = require('./detectors/IncomeNexusDetector');
const PayrollNexusDetector = require('./detectors/PayrollNexusDetector');
const FranchiseNexusDetector = require('./detectors/FranchiseNexusDetector');
const { STATE_RULES, SEVERITY_THRESHOLDS } = require('./rules/stateRules');

class NexusAlertEngine {
  constructor(config = {}) {
    this.config = {
      firmId: config.firmId || 'default',
      riskPosture: config.riskPosture || 'standard', // 'conservative' | 'standard' | 'aggressive'
      enabledModules: {
        sales: config.enabledModules?.sales !== false,
        income: config.enabledModules?.income !== false,
        payroll: config.enabledModules?.payroll !== false,
        franchise: config.enabledModules?.franchise !== false
      },
      office: config.office || null,
      client: config.client || null,
      ...config
    };

    this.stateRules = STATE_RULES;
    
    // Initialize detectors
    this.salesDetector = new SalesNexusDetector(this.config);
    this.incomeDetector = new IncomeNexusDetector(this.config);
    this.payrollDetector = new PayrollNexusDetector(this.config);
    this.franchiseDetector = new FranchiseNexusDetector(this.config);

    console.log('[NEXUS_ENGINE] Initialized with config:', {
      firmId: this.config.firmId,
      riskPosture: this.config.riskPosture,
      enabledModules: this.config.enabledModules
    });
  }

  /**
   * Main detection method - processes normalized data and returns alerts
   */
  async detectNexus(normalizedData) {
    console.log('[NEXUS_ENGINE] Starting nexus detection...');
    console.log('[NEXUS_ENGINE] Data rows:', normalizedData.length);

    const alerts = [];

    // Group data by state for analysis
    const dataByState = this.groupByState(normalizedData);
    const statesWithActivity = Object.keys(dataByState);

    console.log('[NEXUS_ENGINE] States with activity:', statesWithActivity);

    // For each state with activity
    for (const [state, stateData] of Object.entries(dataByState)) {
      console.log(`[NEXUS_ENGINE] Analyzing state: ${state} (${stateData.length} rows)`);

      try {
        // 1. Sales Tax Nexus Detection
        if (this.config.enabledModules.sales) {
          const salesAlerts = await this.salesDetector.detect(state, stateData, this.config);
          alerts.push(...salesAlerts);
          console.log(`[NEXUS_ENGINE] ${state} - Sales alerts: ${salesAlerts.length}`);
        }

        // 2. Income Tax Nexus Detection (with PL 86-272)
        if (this.config.enabledModules.income) {
          const incomeAlerts = await this.incomeDetector.detect(state, stateData, this.config);
          alerts.push(...incomeAlerts);
          console.log(`[NEXUS_ENGINE] ${state} - Income alerts: ${incomeAlerts.length}`);
        }

        // 3. Payroll Tax Nexus Detection
        if (this.config.enabledModules.payroll) {
          const payrollAlerts = await this.payrollDetector.detect(state, stateData, this.config);
          alerts.push(...payrollAlerts);
          console.log(`[NEXUS_ENGINE] ${state} - Payroll alerts: ${payrollAlerts.length}`);
        }

        // 4. Franchise Tax Nexus Detection
        if (this.config.enabledModules.franchise) {
          const franchiseAlerts = await this.franchiseDetector.detect(state, stateData, this.config);
          alerts.push(...franchiseAlerts);
          console.log(`[NEXUS_ENGINE] ${state} - Franchise alerts: ${franchiseAlerts.length}`);
        }
      } catch (error) {
        console.error(`[NEXUS_ENGINE] Error analyzing state ${state}:`, error);
      }
    }

    // Apply severity levels based on risk posture
    const processedAlerts = this.applySeverityLevels(alerts);

    // Sort by priority and severity
    const sortedAlerts = this.sortAlerts(processedAlerts);

    console.log('[NEXUS_ENGINE] Detection complete. Total alerts:', sortedAlerts.length);
    console.log('[NEXUS_ENGINE] Alert breakdown:', this.getAlertSummary(sortedAlerts));

    return sortedAlerts;
  }

  /**
   * Group data by state
   */
  groupByState(data) {
    const grouped = {};

    for (const row of data) {
      // Try multiple state field names
      const state = this.extractState(row);
      
      if (state) {
        if (!grouped[state]) {
          grouped[state] = [];
        }
        grouped[state].push(row);
      }
    }

    return grouped;
  }

  /**
   * Extract state from row
   */
  extractState(row) {
    const stateFields = [
      'state', 'ship_state', 'customer_state', 'billing_state',
      'location', 'ship_location', 'jurisdiction', 'employee_state', 'work_state',
      'destination_state', 'order_state', 'delivery_state'
    ];

    for (const field of stateFields) {
      if (row[field]) {
        const state = this.normalizeState(String(row[field]));
        if (state) return state;
      }
    }

    // Try to extract state from location strings that might contain city, state format
    const locationFields = ['ship_location', 'location', 'address', 'destination'];
    for (const field of locationFields) {
      if (row[field]) {
        const extracted = this.extractStateFromLocation(String(row[field]));
        if (extracted) return extracted;
      }
    }

    return null;
  }

  /**
   * Extract state code from location strings like "Los Angeles, CA" or "California"
   */
  extractStateFromLocation(location) {
    if (!location) return null;
    
    const trimmed = location.trim().toUpperCase();
    
    // Check if it's already a 2-letter state code
    if (trimmed.length === 2 && this.stateRules[trimmed]) {
      return trimmed;
    }
    
    // Try to match full state name
    for (const [code, rule] of Object.entries(this.stateRules)) {
      if (rule.name && trimmed === rule.name.toUpperCase()) {
        return code;
      }
    }
    
    // Try to extract from "City, ST" format
    const commaMatch = location.match(/,\s*([A-Za-z]{2})\s*$/);
    if (commaMatch) {
      const stateCode = commaMatch[1].toUpperCase();
      if (this.stateRules[stateCode]) {
        return stateCode;
      }
    }
    
    // Try to extract state code from end of string
    const endMatch = location.match(/\b([A-Za-z]{2})\s*$/);
    if (endMatch) {
      const stateCode = endMatch[1].toUpperCase();
      if (this.stateRules[stateCode]) {
        return stateCode;
      }
    }
    
    return null;
  }

  /**
   * Normalize state to 2-letter code
   */
  normalizeState(stateInput) {
    const input = stateInput.trim().toUpperCase();

    // Already a valid 2-letter code
    if (input.length === 2 && this.stateRules[input]) {
      return input;
    }

    // Full state name
    for (const [code, rule] of Object.entries(this.stateRules)) {
      if (rule.name && rule.name.toUpperCase() === input) {
        return code;
      }
    }

    return null;
  }

  /**
   * Apply severity levels based on risk posture
   */
  applySeverityLevels(alerts) {
    const thresholds = SEVERITY_THRESHOLDS[this.config.riskPosture] || SEVERITY_THRESHOLDS.standard;

    return alerts.map(alert => {
      // Adjust severity based on risk posture if applicable
      if (alert.facts?.percentageOver) {
        const percentage = parseFloat(alert.facts.percentageOver);
        
        if (percentage >= thresholds.high * 1.5) {
          alert.severity = 'CRITICAL';
        } else if (percentage >= thresholds.high) {
          alert.severity = 'HIGH';
        } else if (percentage >= thresholds.medium) {
          alert.severity = 'MEDIUM';
        } else if (percentage >= thresholds.low) {
          alert.severity = 'LOW';
        }
      }

      return alert;
    });
  }

  /**
   * Sort alerts by priority and severity
   */
  sortAlerts(alerts) {
    const severityOrder = { 'CRITICAL': 0, 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3, 'INFO': 4 };
    const priorityOrder = { 'HIGH': 0, 'MEDIUM': 1, 'LOW': 2 };

    return alerts.sort((a, b) => {
      // First by severity
      const severityDiff = (severityOrder[a.severity] || 4) - (severityOrder[b.severity] || 4);
      if (severityDiff !== 0) return severityDiff;

      // Then by priority
      const priorityDiff = (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2);
      if (priorityDiff !== 0) return priorityDiff;

      // Then by requiresAction
      if (a.requiresAction && !b.requiresAction) return -1;
      if (!a.requiresAction && b.requiresAction) return 1;

      return 0;
    });
  }

  /**
   * Get alert summary
   */
  getAlertSummary(alerts) {
    const summary = {
      total: alerts.length,
      bySeverity: {},
      byType: {},
      byState: {},
      requiresAction: 0,
      judgmentRequired: 0
    };

    for (const alert of alerts) {
      // By severity
      summary.bySeverity[alert.severity] = (summary.bySeverity[alert.severity] || 0) + 1;

      // By type
      summary.byType[alert.type] = (summary.byType[alert.type] || 0) + 1;

      // By state
      summary.byState[alert.state] = (summary.byState[alert.state] || 0) + 1;

      // Counts
      if (alert.requiresAction) summary.requiresAction++;
      if (alert.judgmentRequired) summary.judgmentRequired++;
    }

    return summary;
  }

  /**
   * Process a complete document through the detection pipeline
   */
  async processDocument(normalizedData, documentType = null) {
    console.log('[NEXUS_ENGINE] Processing document...');
    console.log('[NEXUS_ENGINE] Document type:', documentType);

    // Run nexus detection
    const alerts = await this.detectNexus(normalizedData);

    // Generate summary
    const summary = this.getAlertSummary(alerts);

    // Check for data quality issues
    const dataQualityAlerts = this.checkDataQuality(normalizedData);

    return {
      success: true,
      documentType,
      alerts: [...alerts, ...dataQualityAlerts],
      summary: {
        ...summary,
        dataQualityIssues: dataQualityAlerts.length
      },
      processedAt: new Date().toISOString(),
      config: {
        riskPosture: this.config.riskPosture,
        enabledModules: this.config.enabledModules
      }
    };
  }

  /**
   * Check data quality
   */
  checkDataQuality(data) {
    const alerts = [];

    // Check for missing state data
    const rowsWithoutState = data.filter(row => !this.extractState(row));
    if (rowsWithoutState.length > 0) {
      const percentage = ((rowsWithoutState.length / data.length) * 100).toFixed(1);
      
      if (parseFloat(percentage) > 10) {
        alerts.push({
          id: `DATA_QUALITY_${Date.now()}`,
          type: 'DATA_QUALITY',
          subtype: 'MISSING_STATE',
          severity: parseFloat(percentage) > 50 ? 'HIGH' : 'MEDIUM',
          title: 'Missing State Data',
          description: `${rowsWithoutState.length} rows (${percentage}%) are missing state information`,
          facts: {
            rowsAffected: rowsWithoutState.length,
            totalRows: data.length,
            percentage
          },
          recommendation: 'Review source data to ensure state information is captured for all transactions.',
          judgmentRequired: false,
          requiresAction: false,
          priority: 'MEDIUM',
          createdDate: new Date().toISOString()
        });
      }
    }

    // Check for missing revenue data
    const rowsWithoutRevenue = data.filter(row => {
      const revenueFields = ['revenue', 'amount', 'sales', 'total'];
      return !revenueFields.some(field => row[field] !== undefined);
    });

    if (rowsWithoutRevenue.length > data.length * 0.5) {
      alerts.push({
        id: `DATA_QUALITY_REVENUE_${Date.now()}`,
        type: 'DATA_QUALITY',
        subtype: 'MISSING_REVENUE',
        severity: 'MEDIUM',
        title: 'Missing Revenue Data',
        description: 'Significant portion of rows missing revenue information',
        facts: {
          rowsAffected: rowsWithoutRevenue.length,
          totalRows: data.length
        },
        recommendation: 'Verify revenue/amount columns are properly mapped.',
        judgmentRequired: false,
        requiresAction: false,
        priority: 'LOW',
        createdDate: new Date().toISOString()
      });
    }

    return alerts;
  }

  /**
   * Get configuration
   */
  getConfig() {
    return this.config;
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig) {
    this.config = {
      ...this.config,
      ...newConfig
    };

    // Reinitialize detectors with new config
    this.salesDetector = new SalesNexusDetector(this.config);
    this.incomeDetector = new IncomeNexusDetector(this.config);
    this.payrollDetector = new PayrollNexusDetector(this.config);
    this.franchiseDetector = new FranchiseNexusDetector(this.config);

    console.log('[NEXUS_ENGINE] Configuration updated:', this.config);
  }
}

module.exports = NexusAlertEngine;


