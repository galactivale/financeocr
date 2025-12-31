/**
 * Income Tax Nexus Detector
 * 
 * Detects income tax nexus obligations including:
 * - Economic nexus for income tax
 * - PL 86-272 protection analysis
 * - Factor presence nexus
 * - State-specific interpretations
 */

const { STATE_RULES, PL_86_272_ACTIVITIES, RISK_MULTIPLIERS } = require('../rules/stateRules');

class IncomeNexusDetector {
  constructor(config = {}) {
    this.config = config;
    this.stateRules = STATE_RULES;
    this.pl86_272Activities = PL_86_272_ACTIVITIES;
  }

  /**
   * Main detection method for income tax nexus
   */
  async detect(state, data, config) {
    const alerts = [];
    const stateRule = this.stateRules[state];

    if (!stateRule || !stateRule.income) {
      console.log(`[INCOME_DETECTOR] No income rules found for state: ${state}`);
      return alerts;
    }

    // Skip states without income tax
    if (stateRule.income.hasIncomeTax === false && !stateRule.income.franchiseTaxApplies) {
      console.log(`[INCOME_DETECTOR] ${state} has no income tax`);
      
      // Check for alternative taxes (B&O, Commerce Tax, etc.)
      if (stateRule.income.businessAndOccupationTax) {
        alerts.push(this.createAlternativeTaxAlert(state, 'B&O Tax', stateRule));
      }
      if (stateRule.income.commerceActivityTax) {
        alerts.push(this.createAlternativeTaxAlert(state, 'Commerce Tax', stateRule));
      }
      
      return alerts;
    }

    // Calculate net income for state
    const netIncome = this.calculateNetIncome(data, state);
    
    console.log(`[INCOME_DETECTOR] ${state} analysis:`, {
      netIncome,
      hasIncomeTax: stateRule.income.hasIncomeTax,
      pl86_272Applies: stateRule.income.pl86_272Applies
    });

    // Check if business sells tangible personal property
    const sellsTangibleProperty = this.detectTangiblePropertySales(data, state);

    if (sellsTangibleProperty && stateRule.income.pl86_272Applies) {
      // PL 86-272 applies - need to check protected activities
      const pl86_272Analysis = await this.analyzePL86_272(state, data, config);
      
      if (pl86_272Analysis.protected) {
        // Activities are protected, no income tax nexus
        alerts.push(this.createPL86_272ProtectedAlert(state, pl86_272Analysis, netIncome));
      } else if (pl86_272Analysis.unprotected) {
        // Unprotected activities detected - nexus created
        alerts.push(this.createIncomeNexusAlert(state, netIncome, pl86_272Analysis, stateRule));
      } else if (pl86_272Analysis.judgmentRequired) {
        // Judgment required - ambiguous situation
        alerts.push(this.createJudgmentRequiredAlert(state, netIncome, pl86_272Analysis, stateRule));
      }
    } else {
      // Business doesn't sell tangible property OR state doesn't recognize PL 86-272
      // Check economic nexus for income tax
      const economicNexusResult = this.checkIncomeEconomicNexus(state, netIncome, config);
      
      if (economicNexusResult.triggered) {
        alerts.push(this.createIncomeEconomicNexusAlert(state, netIncome, economicNexusResult, stateRule));
      } else if (economicNexusResult.warning) {
        alerts.push(this.createApproachingIncomeThresholdAlert(state, netIncome, economicNexusResult, stateRule));
      }
    }

    // Check for franchise tax applicability (TX, TN, etc.)
    if (stateRule.income.franchiseTaxApplies) {
      const franchiseResult = this.checkFranchiseTaxNexus(state, data, config);
      if (franchiseResult.triggered) {
        alerts.push(this.createFranchiseTaxAlert(state, franchiseResult, stateRule));
      }
    }

    return alerts;
  }

  /**
   * Calculate net income for a state
   */
  calculateNetIncome(data, state) {
    let totalRevenue = 0;
    let totalReturns = 0;
    let totalCOGS = 0;
    
    for (const row of data) {
      if (this.matchesState(row, state)) {
        // Revenue
        const revenue = this.extractAmount(row, ['revenue', 'sales', 'income', 'gross_sales']);
        if (revenue > 0) totalRevenue += revenue;
        
        // Returns/Refunds
        const returns = this.extractAmount(row, ['returns', 'refunds', 'credits']);
        if (returns > 0) totalReturns += returns;
        
        // Cost of Goods Sold
        const cogs = this.extractAmount(row, ['cogs', 'cost_of_goods', 'cost']);
        if (cogs > 0) totalCOGS += cogs;
      }
    }
    
    return totalRevenue - totalReturns - totalCOGS;
  }

  /**
   * Check if row matches state
   */
  matchesState(row, state) {
    const rowState = String(row.state || row.ship_state || row.customer_state || row.location || '').toUpperCase().trim();
    return rowState === state || rowState === this.stateRules[state]?.name?.toUpperCase();
  }

  /**
   * Extract amount from row
   */
  extractAmount(row, fields) {
    for (const field of fields) {
      if (row[field] !== undefined) {
        const value = String(row[field]).replace(/[$,]/g, '');
        const parsed = parseFloat(value);
        if (!isNaN(parsed)) {
          return parsed;
        }
      }
    }
    return 0;
  }

  /**
   * Detect if business sells tangible personal property
   */
  detectTangiblePropertySales(data, state) {
    const tangibleIndicators = ['product', 'goods', 'merchandise', 'inventory', 'physical', 'tangible'];
    const intangibleIndicators = ['service', 'consulting', 'software', 'saas', 'subscription', 'digital'];
    
    let tangibleCount = 0;
    let intangibleCount = 0;
    
    for (const row of data) {
      if (!this.matchesState(row, state)) continue;
      
      const productType = String(row.product_type || row.type || row.category || '').toLowerCase();
      
      if (tangibleIndicators.some(ind => productType.includes(ind))) {
        tangibleCount++;
      }
      if (intangibleIndicators.some(ind => productType.includes(ind))) {
        intangibleCount++;
      }
    }
    
    // If more tangible than intangible, assume tangible property sales
    return tangibleCount > intangibleCount || tangibleCount > 0;
  }

  /**
   * Analyze PL 86-272 protection status
   */
  async analyzePL86_272(state, data, config) {
    // Extract activities from workforce data
    const activities = this.extractActivities(data, state);
    
    // Classify activities as protected or unprotected
    const classifiedActivities = this.classifyActivities(activities);
    
    // Get state-specific PL 86-272 interpretation
    const stateInterpretation = this.getStateInterpretation(state);
    
    // Apply firm guidance if exists
    const firmGuidance = this.getFirmGuidance(state, 'PL86_272', config);
    
    const protectedCount = classifiedActivities.filter(a => a.classification === 'protected').length;
    const unprotectedCount = classifiedActivities.filter(a => a.classification === 'unprotected').length;
    const ambiguousCount = classifiedActivities.filter(a => a.classification === 'ambiguous').length;
    
    return {
      activities: classifiedActivities,
      protected: unprotectedCount === 0 && ambiguousCount === 0 && protectedCount > 0,
      unprotected: unprotectedCount > 0,
      judgmentRequired: ambiguousCount > 0 && unprotectedCount === 0,
      stateInterpretation,
      firmGuidance,
      summary: {
        protectedCount,
        unprotectedCount,
        ambiguousCount,
        totalActivities: classifiedActivities.length
      }
    };
  }

  /**
   * Extract activities from data
   */
  extractActivities(data, state) {
    const activities = [];
    const activityKeywords = {
      solicitation: ['sales', 'solicitation', 'prospecting', 'lead_generation'],
      order_taking: ['order', 'booking', 'reservation'],
      installation: ['install', 'setup', 'implementation'],
      training: ['training', 'education', 'onboarding'],
      repair: ['repair', 'fix', 'maintenance', 'service'],
      technical_support: ['support', 'helpdesk', 'troubleshoot'],
      consulting: ['consulting', 'advisory', 'professional_services'],
      delivery: ['delivery', 'shipping', 'logistics']
    };
    
    for (const row of data) {
      if (!this.matchesState(row, state)) continue;
      
      const role = String(row.role || row.title || row.job_title || row.activity || '').toLowerCase();
      
      for (const [activityType, keywords] of Object.entries(activityKeywords)) {
        if (keywords.some(kw => role.includes(kw))) {
          activities.push({
            type: activityType,
            source: role,
            employee: row.employee_name || row.name,
            state: state
          });
        }
      }
    }
    
    return activities;
  }

  /**
   * Classify activities as protected/unprotected/ambiguous
   */
  classifyActivities(activities) {
    return activities.map(activity => {
      let classification = 'ambiguous';
      
      if (this.pl86_272Activities.protected.includes(activity.type)) {
        classification = 'protected';
      } else if (this.pl86_272Activities.unprotected.includes(activity.type)) {
        classification = 'unprotected';
      } else if (this.pl86_272Activities.ambiguous.includes(activity.type)) {
        classification = 'ambiguous';
      }
      
      return {
        ...activity,
        classification
      };
    });
  }

  /**
   * Get state-specific PL 86-272 interpretation
   */
  getStateInterpretation(state) {
    const stateRule = this.stateRules[state]?.income;
    
    return {
      state,
      protectedActivities: stateRule?.protectedActivities || this.pl86_272Activities.protected,
      unprotectedActivities: stateRule?.unprotectedActivities || this.pl86_272Activities.unprotected,
      requiresJudgment: stateRule?.requiresJudgment || this.pl86_272Activities.ambiguous,
      notes: stateRule?.note
    };
  }

  /**
   * Get firm guidance for a state and topic
   */
  getFirmGuidance(state, topic, config) {
    // This would integrate with the Doctrine Propagation System
    // For now, return null
    return null;
  }

  /**
   * Check income economic nexus thresholds
   */
  checkIncomeEconomicNexus(state, income, config) {
    const stateRule = this.stateRules[state]?.income;
    if (!stateRule?.economicNexusThreshold) {
      return { triggered: false };
    }

    const riskPosture = config?.riskPosture || 'standard';
    const multiplier = RISK_MULTIPLIERS[riskPosture] || 1.0;
    const adjustedThreshold = stateRule.economicNexusThreshold * multiplier;

    if (income >= adjustedThreshold) {
      return {
        triggered: true,
        type: 'INCOME_ECONOMIC_NEXUS',
        threshold: adjustedThreshold,
        statutoryThreshold: stateRule.economicNexusThreshold,
        actual: income,
        percentageOver: ((income / adjustedThreshold) * 100).toFixed(1)
      };
    }

    // Check if approaching threshold
    if (income >= adjustedThreshold * 0.8) {
      return {
        triggered: false,
        warning: true,
        type: 'INCOME_NEXUS_APPROACHING',
        threshold: adjustedThreshold,
        actual: income,
        percentageOfThreshold: ((income / adjustedThreshold) * 100).toFixed(1)
      };
    }

    return { triggered: false };
  }

  /**
   * Check franchise tax nexus (for states like TX)
   */
  checkFranchiseTaxNexus(state, data, config) {
    const stateRule = this.stateRules[state]?.income;
    if (!stateRule?.franchiseThreshold) {
      return { triggered: false };
    }

    const totalRevenue = this.calculateTotalRevenue(data, state);
    
    if (totalRevenue >= stateRule.franchiseThreshold) {
      return {
        triggered: true,
        type: 'FRANCHISE_TAX',
        threshold: stateRule.franchiseThreshold,
        actual: totalRevenue
      };
    }

    return { triggered: false };
  }

  /**
   * Calculate total revenue for franchise tax
   */
  calculateTotalRevenue(data, state) {
    let total = 0;
    for (const row of data) {
      if (this.matchesState(row, state)) {
        total += this.extractAmount(row, ['revenue', 'sales', 'amount', 'total']);
      }
    }
    return total;
  }

  /**
   * Create PL 86-272 protected alert
   */
  createPL86_272ProtectedAlert(state, analysis, netIncome) {
    return {
      id: this.generateAlertId('PL86_272_PROTECTED', state),
      type: 'INCOME_NEXUS',
      subtype: 'PL86_272_PROTECTED',
      state: state,
      stateName: this.stateRules[state]?.name || state,
      severity: 'INFO',
      title: `${state} PL 86-272 Protection Applies`,
      description: `Activities in ${state} appear to be protected solicitation under PL 86-272. No income tax nexus at this time.`,
      facts: {
        netIncome,
        protectedActivities: analysis.summary.protectedCount,
        totalActivities: analysis.summary.totalActivities,
        activities: analysis.activities.filter(a => a.classification === 'protected'),
        stateInterpretation: analysis.stateInterpretation
      },
      recommendation: `Continue to monitor activities in ${state}. Ensure all employee activities remain within protected solicitation bounds.`,
      judgmentRequired: false,
      requiresAction: false,
      priority: 'LOW',
      createdDate: new Date().toISOString()
    };
  }

  /**
   * Create income nexus alert (unprotected activities)
   */
  createIncomeNexusAlert(state, netIncome, analysis, stateRule) {
    const unprotectedActivities = analysis.activities.filter(a => a.classification === 'unprotected');
    
    return {
      id: this.generateAlertId('INCOME_NEXUS', state),
      type: 'INCOME_NEXUS',
      subtype: 'PL86_272_UNPROTECTED',
      state: state,
      stateName: stateRule.name || state,
      severity: 'HIGH',
      title: `${state} PL 86-272 Protection Lost - Income Tax Nexus Created`,
      description: `Unprotected activities detected in ${state} create income tax nexus. ${unprotectedActivities.length} unprotected activity type(s) found.`,
      facts: {
        netIncome,
        unprotectedActivities: unprotectedActivities,
        protectedActivities: analysis.activities.filter(a => a.classification === 'protected'),
        summary: analysis.summary,
        stateInterpretation: analysis.stateInterpretation
      },
      recommendation: `Register for income tax in ${state}. Review unprotected activities and consider restructuring if possible.`,
      judgmentRequired: false,
      requiresAction: true,
      priority: 'HIGH',
      createdDate: new Date().toISOString()
    };
  }

  /**
   * Create judgment required alert
   */
  createJudgmentRequiredAlert(state, netIncome, analysis, stateRule) {
    const ambiguousActivities = analysis.activities.filter(a => a.classification === 'ambiguous');
    
    return {
      id: this.generateAlertId('PL86_272_JUDGMENT', state),
      type: 'INCOME_NEXUS',
      subtype: 'PL86_272_JUDGMENT_REQUIRED',
      state: state,
      stateName: stateRule.name || state,
      severity: 'MEDIUM',
      title: `${state} PL 86-272 Analysis Requires Judgment`,
      description: `Ambiguous activities in ${state} require professional judgment to determine PL 86-272 protection status.`,
      facts: {
        netIncome,
        ambiguousActivities: ambiguousActivities,
        protectedActivities: analysis.activities.filter(a => a.classification === 'protected'),
        summary: analysis.summary,
        stateInterpretation: analysis.stateInterpretation,
        firmGuidance: analysis.firmGuidance
      },
      recommendation: `Review ambiguous activities with tax professional. Consider state-specific guidance and firm doctrine.`,
      judgmentRequired: true,
      requiresAction: true,
      priority: 'MEDIUM',
      createdDate: new Date().toISOString()
    };
  }

  /**
   * Create income economic nexus alert
   */
  createIncomeEconomicNexusAlert(state, netIncome, result, stateRule) {
    return {
      id: this.generateAlertId('INCOME_ECONOMIC_NEXUS', state),
      type: 'INCOME_NEXUS',
      subtype: 'ECONOMIC_NEXUS',
      state: state,
      stateName: stateRule.name || state,
      severity: 'HIGH',
      title: `${state} Income Tax Economic Nexus Triggered`,
      description: `Net income of $${this.formatNumber(netIncome)} exceeds ${state}'s economic nexus threshold of $${this.formatNumber(result.threshold)}`,
      facts: {
        threshold: result.threshold,
        statutoryThreshold: result.statutoryThreshold,
        actualIncome: netIncome,
        percentageOver: result.percentageOver
      },
      recommendation: `Register for income tax in ${state}. Review apportionment factors and filing requirements.`,
      judgmentRequired: false,
      requiresAction: true,
      priority: 'HIGH',
      createdDate: new Date().toISOString()
    };
  }

  /**
   * Create approaching income threshold alert
   */
  createApproachingIncomeThresholdAlert(state, netIncome, result, stateRule) {
    return {
      id: this.generateAlertId('INCOME_NEXUS_APPROACHING', state),
      type: 'INCOME_NEXUS',
      subtype: 'ECONOMIC_NEXUS_APPROACHING',
      state: state,
      stateName: stateRule.name || state,
      severity: 'MEDIUM',
      title: `${state} Income Tax Threshold Approaching`,
      description: `Net income of $${this.formatNumber(netIncome)} is ${result.percentageOfThreshold}% of ${state}'s economic nexus threshold`,
      facts: {
        threshold: result.threshold,
        actualIncome: netIncome,
        percentageOfThreshold: result.percentageOfThreshold,
        remainingHeadroom: result.threshold - netIncome
      },
      recommendation: `Monitor income activity in ${state}. Prepare for potential income tax registration.`,
      judgmentRequired: false,
      requiresAction: false,
      priority: 'MEDIUM',
      createdDate: new Date().toISOString()
    };
  }

  /**
   * Create franchise tax alert
   */
  createFranchiseTaxAlert(state, result, stateRule) {
    return {
      id: this.generateAlertId('FRANCHISE_TAX', state),
      type: 'INCOME_NEXUS',
      subtype: 'FRANCHISE_TAX',
      state: state,
      stateName: stateRule.name || state,
      severity: 'HIGH',
      title: `${state} Franchise/Margin Tax Obligation`,
      description: `Revenue of $${this.formatNumber(result.actual)} exceeds ${state}'s franchise tax threshold of $${this.formatNumber(result.threshold)}`,
      facts: {
        threshold: result.threshold,
        actualRevenue: result.actual,
        taxType: stateRule.income.marginTax ? 'Margin Tax' : 'Franchise Tax'
      },
      recommendation: `Register for ${stateRule.income.marginTax ? 'margin' : 'franchise'} tax in ${state}. Note: ${state} has no personal income tax.`,
      judgmentRequired: false,
      requiresAction: true,
      priority: 'HIGH',
      createdDate: new Date().toISOString()
    };
  }

  /**
   * Create alternative tax alert (B&O, Commerce Tax, etc.)
   */
  createAlternativeTaxAlert(state, taxType, stateRule) {
    return {
      id: this.generateAlertId('ALTERNATIVE_TAX', state),
      type: 'INCOME_NEXUS',
      subtype: 'ALTERNATIVE_TAX',
      state: state,
      stateName: stateRule.name || state,
      severity: 'INFO',
      title: `${state} ${taxType} May Apply`,
      description: `${state} has no income tax but ${taxType} may apply to gross receipts.`,
      facts: {
        taxType,
        note: stateRule.income.note
      },
      recommendation: `Review ${taxType} requirements for ${state}. This tax applies to gross receipts, not net income.`,
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

module.exports = IncomeNexusDetector;







