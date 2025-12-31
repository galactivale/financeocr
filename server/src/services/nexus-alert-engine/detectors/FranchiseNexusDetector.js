/**
 * Franchise Tax Nexus Detector
 * 
 * Detects franchise/gross receipts tax nexus obligations including:
 * - "Doing business" indicators
 * - Qualification requirements
 * - Minimum tax obligations
 * - State-specific franchise tax types (margin tax, net worth tax, etc.)
 */

const { STATE_RULES } = require('../rules/stateRules');

class FranchiseNexusDetector {
  constructor(config = {}) {
    this.config = config;
    this.stateRules = STATE_RULES;
  }

  /**
   * Main detection method for franchise tax nexus
   */
  async detect(state, data, config) {
    const alerts = [];
    const stateRule = this.stateRules[state];

    if (!stateRule || !stateRule.franchise) {
      console.log(`[FRANCHISE_DETECTOR] No franchise rules found for state: ${state}`);
      return alerts;
    }

    // Skip states without franchise tax
    if (stateRule.franchise.hasFranchiseTax === false) {
      console.log(`[FRANCHISE_DETECTOR] ${state} has no franchise tax`);
      return alerts;
    }

    // Check if business is "doing business" in state
    const doingBusinessIndicators = this.checkDoingBusiness(state, data);

    console.log(`[FRANCHISE_DETECTOR] ${state} analysis:`, {
      isDoingBusiness: doingBusinessIndicators.isDoingBusiness,
      indicators: Object.keys(doingBusinessIndicators.indicators).filter(
        k => doingBusinessIndicators.indicators[k]
      )
    });

    if (doingBusinessIndicators.isDoingBusiness) {
      // Business meets franchise tax nexus criteria
      alerts.push(this.createFranchiseNexusAlert(state, doingBusinessIndicators, stateRule));

      // Check if exceeds franchise tax thresholds
      const thresholdResult = this.checkFranchiseThreshold(state, data, config);
      if (thresholdResult.exceeds) {
        alerts.push(this.createFranchiseThresholdAlert(state, thresholdResult, stateRule));
      }

      // Check for qualification requirements
      const qualificationIssues = this.checkQualificationRequirements(state, data);
      if (qualificationIssues.hasIssues) {
        alerts.push(this.createQualificationAlert(state, qualificationIssues, stateRule));
      }

      // Check minimum tax obligation
      if (stateRule.franchise.minimumTax > 0) {
        alerts.push(this.createMinimumTaxAlert(state, stateRule));
      }
    }

    return alerts;
  }

  /**
   * Check if business is "doing business" in state
   */
  checkDoingBusiness(state, data) {
    const indicators = {
      hasOffice: this.hasOfficeInState(state, data),
      hasEmployees: this.hasEmployeesInState(state, data),
      hasProperty: this.hasPropertyInState(state, data),
      hasBankAccount: this.hasBankAccountInState(state, data),
      revenueInState: this.calculateRevenueInState(state, data),
      transactsBusiness: this.transactsBusinessInState(state, data),
      hasInventory: this.hasInventoryInState(state, data),
      hasRegisteredAgent: this.hasRegisteredAgentInState(state, data)
    };

    // State-specific rules for "doing business"
    const stateRule = this.stateRules[state]?.franchise;
    const isDoingBusiness = this.applyStateRules(indicators, stateRule, state);

    return {
      isDoingBusiness,
      indicators,
      stateRule
    };
  }

  /**
   * Check if company has office in state
   */
  hasOfficeInState(state, data) {
    for (const row of data) {
      if (this.matchesState(row, state)) {
        const locationType = String(row.location_type || row.property_type || '').toLowerCase();
        if (locationType.includes('office') || locationType.includes('headquarters')) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Check if company has employees in state
   */
  hasEmployeesInState(state, data) {
    for (const row of data) {
      if (this.matchesState(row, state)) {
        if (row.employee_name || row.employee || row.staff) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Check if company has property in state
   */
  hasPropertyInState(state, data) {
    for (const row of data) {
      if (this.matchesState(row, state)) {
        if (row.property || row.real_estate || row.equipment || row.assets) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Check if company has bank account in state
   */
  hasBankAccountInState(state, data) {
    for (const row of data) {
      if (this.matchesState(row, state)) {
        if (row.bank_account || row.bank || row.financial_institution) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Calculate revenue in state
   */
  calculateRevenueInState(state, data) {
    let total = 0;
    for (const row of data) {
      if (this.matchesState(row, state)) {
        const revenue = this.extractRevenue(row);
        if (revenue > 0) total += revenue;
      }
    }
    return total;
  }

  /**
   * Check if company transacts business in state
   */
  transactsBusinessInState(state, data) {
    let transactionCount = 0;
    for (const row of data) {
      if (this.matchesState(row, state)) {
        transactionCount++;
      }
    }
    return transactionCount > 0;
  }

  /**
   * Check if company has inventory in state
   */
  hasInventoryInState(state, data) {
    for (const row of data) {
      if (this.matchesState(row, state)) {
        if (row.inventory || row.stock || row.warehouse) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Check if company has registered agent in state
   */
  hasRegisteredAgentInState(state, data) {
    for (const row of data) {
      if (this.matchesState(row, state)) {
        if (row.registered_agent || row.statutory_agent) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Check if row matches state
   */
  matchesState(row, state) {
    const rowState = String(row.state || row.location || '').toUpperCase().trim();
    return rowState === state || rowState === this.stateRules[state]?.name?.toUpperCase();
  }

  /**
   * Extract revenue from row
   */
  extractRevenue(row) {
    const revenueFields = ['revenue', 'amount', 'sales', 'total', 'gross_receipts'];
    for (const field of revenueFields) {
      if (row[field] !== undefined) {
        const value = String(row[field]).replace(/[$,]/g, '');
        const parsed = parseFloat(value);
        if (!isNaN(parsed)) return parsed;
      }
    }
    return 0;
  }

  /**
   * Apply state-specific "doing business" rules
   */
  applyStateRules(indicators, stateRule, state) {
    if (!stateRule) return false;

    const threshold = stateRule.doingBusinessThreshold;

    // Any presence triggers nexus
    if (threshold === 'any_presence') {
      return (
        indicators.hasOffice ||
        indicators.hasEmployees ||
        indicators.hasProperty ||
        indicators.transactsBusiness ||
        indicators.hasInventory
      );
    }

    // Revenue-based threshold
    if (typeof threshold === 'number') {
      return indicators.revenueInState >= threshold;
    }

    // Default: any significant presence
    return (
      indicators.hasOffice ||
      indicators.hasEmployees ||
      indicators.hasProperty
    );
  }

  /**
   * Check franchise tax threshold
   */
  checkFranchiseThreshold(state, data, config) {
    const stateRule = this.stateRules[state]?.franchise;
    const revenue = this.calculateRevenueInState(state, data);

    if (stateRule?.threshold) {
      return {
        exceeds: revenue >= stateRule.threshold,
        threshold: stateRule.threshold,
        actual: revenue,
        taxType: stateRule.marginTax ? 'Margin Tax' : 
                 stateRule.netWorthTax ? 'Net Worth Tax' : 
                 'Franchise Tax'
      };
    }

    return { exceeds: false };
  }

  /**
   * Check qualification requirements
   */
  checkQualificationRequirements(state, data) {
    const issues = [];
    const stateRule = this.stateRules[state]?.franchise;

    if (!stateRule?.qualificationRequired) {
      return { hasIssues: false, issues: [] };
    }

    // Check for registered agent
    if (!this.hasRegisteredAgentInState(state, data)) {
      issues.push({
        type: 'no_registered_agent',
        description: 'No registered agent on file',
        severity: 'HIGH',
        remediation: `Appoint a registered agent in ${state}`
      });
    }

    // Check for certificate of authority (assumed missing if no data)
    const hasCertificate = this.hasCertificateOfAuthority(state, data);
    if (!hasCertificate) {
      issues.push({
        type: 'no_certificate_of_authority',
        description: 'Certificate of Authority may be required',
        severity: 'HIGH',
        remediation: `File for Certificate of Authority in ${state}`
      });
    }

    // Check for name conflicts (simplified check)
    const hasNameConflict = this.hasNameConflict(state, data);
    if (hasNameConflict) {
      issues.push({
        type: 'name_conflict',
        description: 'Potential business name conflict',
        severity: 'MEDIUM',
        remediation: `Verify business name availability in ${state}`
      });
    }

    return {
      hasIssues: issues.length > 0,
      issues,
      requiresAction: issues.some(i => 
        ['no_registered_agent', 'no_certificate_of_authority'].includes(i.type)
      )
    };
  }

  /**
   * Check for certificate of authority
   */
  hasCertificateOfAuthority(state, data) {
    for (const row of data) {
      if (this.matchesState(row, state)) {
        if (row.certificate_of_authority || row.foreign_qualification) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Check for name conflicts
   */
  hasNameConflict(state, data) {
    // Simplified - would need state database lookup in production
    return false;
  }

  /**
   * Create franchise nexus alert
   */
  createFranchiseNexusAlert(state, doingBusinessIndicators, stateRule) {
    const activeIndicators = Object.entries(doingBusinessIndicators.indicators)
      .filter(([key, value]) => value && key !== 'revenueInState')
      .map(([key]) => key.replace(/^has/, '').replace(/InState$/, ''));

    return {
      id: this.generateAlertId('FRANCHISE_NEXUS', state),
      type: 'FRANCHISE_NEXUS',
      subtype: 'DOING_BUSINESS',
      state: state,
      stateName: this.stateRules[state]?.name || state,
      severity: 'HIGH',
      title: `${state} Franchise Tax Nexus - Doing Business`,
      description: `Business activity in ${state} creates franchise tax obligations`,
      facts: {
        indicators: doingBusinessIndicators.indicators,
        activeIndicators,
        revenueInState: doingBusinessIndicators.indicators.revenueInState,
        taxType: stateRule.marginTax ? 'Margin Tax' : 
                 stateRule.netWorthTax ? 'Net Worth Tax' : 
                 stateRule.exciseTax ? 'Excise Tax' : 
                 'Franchise Tax'
      },
      recommendation: `Register for franchise tax in ${state}. Review qualification and annual report requirements.`,
      judgmentRequired: false,
      requiresAction: true,
      priority: 'HIGH',
      createdDate: new Date().toISOString()
    };
  }

  /**
   * Create franchise threshold alert
   */
  createFranchiseThresholdAlert(state, thresholdResult, stateRule) {
    return {
      id: this.generateAlertId('FRANCHISE_THRESHOLD', state),
      type: 'FRANCHISE_NEXUS',
      subtype: 'THRESHOLD_EXCEEDED',
      state: state,
      stateName: this.stateRules[state]?.name || state,
      severity: 'HIGH',
      title: `${state} ${thresholdResult.taxType} Threshold Exceeded`,
      description: `Revenue of $${this.formatNumber(thresholdResult.actual)} exceeds ${state}'s ${thresholdResult.taxType} threshold of $${this.formatNumber(thresholdResult.threshold)}`,
      facts: {
        threshold: thresholdResult.threshold,
        actualRevenue: thresholdResult.actual,
        taxType: thresholdResult.taxType,
        percentageOver: ((thresholdResult.actual / thresholdResult.threshold) * 100).toFixed(1)
      },
      recommendation: `File ${thresholdResult.taxType} return in ${state}. Calculate tax liability based on applicable method.`,
      judgmentRequired: false,
      requiresAction: true,
      priority: 'HIGH',
      createdDate: new Date().toISOString()
    };
  }

  /**
   * Create qualification alert
   */
  createQualificationAlert(state, qualificationIssues, stateRule) {
    return {
      id: this.generateAlertId('QUALIFICATION', state),
      type: 'FRANCHISE_NEXUS',
      subtype: 'QUALIFICATION_REQUIRED',
      state: state,
      stateName: this.stateRules[state]?.name || state,
      severity: 'HIGH',
      title: `${state} Foreign Qualification Required`,
      description: `Business activity in ${state} requires foreign qualification. ${qualificationIssues.issues.length} issue(s) identified.`,
      facts: {
        issues: qualificationIssues.issues,
        requiresAction: qualificationIssues.requiresAction
      },
      recommendation: `Address qualification requirements for ${state}: ${qualificationIssues.issues.map(i => i.remediation).join('; ')}`,
      judgmentRequired: false,
      requiresAction: true,
      priority: 'HIGH',
      createdDate: new Date().toISOString()
    };
  }

  /**
   * Create minimum tax alert
   */
  createMinimumTaxAlert(state, stateRule) {
    return {
      id: this.generateAlertId('MINIMUM_TAX', state),
      type: 'FRANCHISE_NEXUS',
      subtype: 'MINIMUM_TAX',
      state: state,
      stateName: this.stateRules[state]?.name || state,
      severity: 'INFO',
      title: `${state} Minimum Franchise Tax`,
      description: `${state} imposes a minimum franchise tax of $${stateRule.franchise.minimumTax}`,
      facts: {
        minimumTax: stateRule.franchise.minimumTax,
        note: stateRule.franchise.note
      },
      recommendation: `Budget for minimum franchise tax of $${stateRule.franchise.minimumTax} in ${state}, regardless of income.`,
      judgmentRequired: false,
      requiresAction: false,
      priority: 'LOW',
      createdDate: new Date().toISOString()
    };
  }

  /**
   * Generate unique alert ID
   */
  generateAlertId(type, state) {
    return `${type}_${state}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Format number with commas
   */
  formatNumber(num) {
    return new Intl.NumberFormat('en-US').format(Math.round(num));
  }
}

module.exports = FranchiseNexusDetector;







