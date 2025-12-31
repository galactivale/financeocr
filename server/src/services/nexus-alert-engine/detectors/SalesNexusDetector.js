/**
 * Sales Tax Nexus Detector
 * 
 * Detects sales tax nexus obligations including:
 * - Economic nexus (post-Wayfair)
 * - Physical presence nexus
 * - Marketplace facilitator nexus
 * - Click-through/affiliate nexus
 */

const { STATE_RULES, RISK_MULTIPLIERS } = require('../rules/stateRules');

class SalesNexusDetector {
  constructor(config = {}) {
    this.config = config;
    this.stateRules = STATE_RULES;
  }

  /**
   * Main detection method for sales tax nexus
   */
  async detect(state, data, config) {
    const alerts = [];
    const stateRule = this.stateRules[state];

    if (!stateRule || !stateRule.sales) {
      console.log(`[SALES_DETECTOR] No sales rules found for state: ${state}`);
      return alerts;
    }

    // Skip states without sales tax
    if (stateRule.sales.hasStateSalesTax === false) {
      console.log(`[SALES_DETECTOR] ${state} has no state sales tax`);
      return alerts;
    }

    // Calculate revenues
    const totalRevenue = this.calculateTotalRevenue(data, state);
    const marketplaceRevenue = this.calculateMarketplaceRevenue(data, state);
    const directRevenue = totalRevenue - marketplaceRevenue;
    const transactionCount = this.countTransactions(data, state);

    console.log(`[SALES_DETECTOR] ${state} analysis:`, {
      totalRevenue,
      marketplaceRevenue,
      directRevenue,
      transactionCount
    });

    // 1. Check Economic Nexus (Post-Wayfair)
    const economicNexusResult = this.checkEconomicNexus(state, directRevenue, transactionCount, config);
    if (economicNexusResult.triggered) {
      alerts.push(this.createEconomicNexusAlert(state, economicNexusResult, stateRule));
    } else if (economicNexusResult.warning) {
      alerts.push(this.createApproachingThresholdAlert(state, economicNexusResult, stateRule));
    }

    // 2. Check Marketplace Facilitator Nexus
    if (marketplaceRevenue > 0) {
      const marketplaceResult = this.checkMarketplaceNexus(state, marketplaceRevenue, config);
      if (marketplaceResult.triggered) {
        alerts.push(this.createMarketplaceNexusAlert(state, marketplaceResult, stateRule));
      }
    }

    // 3. Check Physical Presence Nexus
    const physicalPresence = this.detectPhysicalPresence(data, state);
    if (physicalPresence.hasPhysicalPresence) {
      alerts.push(this.createPhysicalPresenceAlert(state, physicalPresence, stateRule));
    }

    // 4. Check Click-Through/Affiliate Nexus
    if (stateRule.sales.affiliateNexus) {
      const affiliateResult = this.detectAffiliateRelationships(data, state);
      if (affiliateResult.hasAffiliateNexus) {
        alerts.push(this.createAffiliateNexusAlert(state, affiliateResult, stateRule));
      }
    }

    return alerts;
  }

  /**
   * Calculate total revenue for a state
   */
  calculateTotalRevenue(data, state) {
    let total = 0;
    
    for (const row of data) {
      if (this.matchesState(row, state)) {
        const revenue = this.extractRevenue(row);
        if (revenue > 0) {
          total += revenue;
        }
      }
    }
    
    return total;
  }

  /**
   * Calculate marketplace revenue (Amazon, Shopify, etc.)
   */
  calculateMarketplaceRevenue(data, state) {
    let total = 0;
    const marketplaceIndicators = ['amazon', 'shopify', 'ebay', 'etsy', 'walmart', 'marketplace'];
    
    for (const row of data) {
      if (this.matchesState(row, state)) {
        const channel = String(row.channel || row.source || row.platform || '').toLowerCase();
        if (marketplaceIndicators.some(mp => channel.includes(mp))) {
          total += this.extractRevenue(row);
        }
      }
    }
    
    return total;
  }

  /**
   * Count transactions in a state
   */
  countTransactions(data, state) {
    return data.filter(row => this.matchesState(row, state)).length;
  }

  /**
   * Check if row matches state
   */
  matchesState(row, state) {
    // Check common state fields
    const stateFields = ['state', 'ship_state', 'customer_state', 'location', 'ship_location', 'destination_state'];
    
    for (const field of stateFields) {
      if (row[field]) {
        const rowState = String(row[field]).toUpperCase().trim();
        
        // Direct match
        if (rowState === state) return true;
        
        // Match full state name
        if (rowState === this.stateRules[state]?.name?.toUpperCase()) return true;
        
        // Extract state from "City, ST" format
        const commaMatch = String(row[field]).match(/,\s*([A-Za-z]{2})\s*$/);
        if (commaMatch && commaMatch[1].toUpperCase() === state) return true;
        
        // Check if the field ends with the state code
        const endMatch = String(row[field]).match(/\b([A-Za-z]{2})\s*$/);
        if (endMatch && endMatch[1].toUpperCase() === state) return true;
      }
    }
    
    return false;
  }

  /**
   * Extract revenue from a row
   */
  extractRevenue(row) {
    const revenueFields = ['revenue', 'amount', 'sales', 'total', 'gross_sales', 'net_sales', 'order_total'];
    
    for (const field of revenueFields) {
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
   * Check economic nexus thresholds
   */
  checkEconomicNexus(state, revenue, transactionCount, config) {
    const stateRule = this.stateRules[state]?.sales;
    if (!stateRule?.economicNexusThreshold) {
      return { triggered: false };
    }

    // Apply risk posture multiplier
    const riskPosture = config?.riskPosture || 'standard';
    const multiplier = RISK_MULTIPLIERS[riskPosture] || 1.0;
    const adjustedThreshold = stateRule.economicNexusThreshold * multiplier;

    // Check revenue threshold
    if (revenue >= adjustedThreshold) {
      return {
        triggered: true,
        type: 'ECONOMIC_NEXUS',
        threshold: adjustedThreshold,
        statutoryThreshold: stateRule.economicNexusThreshold,
        actual: revenue,
        percentageOver: ((revenue / adjustedThreshold) * 100).toFixed(1)
      };
    }

    // Check transaction count threshold if applicable
    if (stateRule.transactionCountThreshold && transactionCount >= stateRule.transactionCountThreshold) {
      return {
        triggered: true,
        type: 'ECONOMIC_NEXUS_TRANSACTIONS',
        threshold: stateRule.transactionCountThreshold,
        actual: transactionCount,
        percentageOver: ((transactionCount / stateRule.transactionCountThreshold) * 100).toFixed(1)
      };
    }

    // Check if approaching threshold (warning at 80%)
    if (revenue >= adjustedThreshold * 0.8) {
      return {
        triggered: false,
        warning: true,
        type: 'ECONOMIC_NEXUS_APPROACHING',
        threshold: adjustedThreshold,
        statutoryThreshold: stateRule.economicNexusThreshold,
        actual: revenue,
        percentageOfThreshold: ((revenue / adjustedThreshold) * 100).toFixed(1)
      };
    }

    return { triggered: false };
  }

  /**
   * Check marketplace nexus thresholds
   */
  checkMarketplaceNexus(state, marketplaceRevenue, config) {
    const stateRule = this.stateRules[state]?.sales;
    if (!stateRule?.marketplaceThreshold) {
      return { triggered: false };
    }

    const riskPosture = config?.riskPosture || 'standard';
    const multiplier = RISK_MULTIPLIERS[riskPosture] || 1.0;
    const adjustedThreshold = stateRule.marketplaceThreshold * multiplier;

    if (marketplaceRevenue >= adjustedThreshold) {
      return {
        triggered: true,
        type: 'MARKETPLACE_NEXUS',
        threshold: adjustedThreshold,
        actual: marketplaceRevenue,
        percentageOver: ((marketplaceRevenue / adjustedThreshold) * 100).toFixed(1)
      };
    }

    return { triggered: false };
  }

  /**
   * Detect physical presence indicators
   */
  detectPhysicalPresence(data, state) {
    const indicators = {
      employees: [],
      property: [],
      inventory: [],
      contractors: [],
      tradeShows: []
    };

    for (const row of data) {
      if (!this.matchesState(row, state)) continue;

      // Check for employees
      if (row.employee_name || row.employee || row.staff) {
        indicators.employees.push({
          name: row.employee_name || row.employee || row.staff,
          role: row.role || row.title || row.position
        });
      }

      // Check for contractors
      if (row.contractor_name || row.contractor || row.vendor) {
        indicators.contractors.push({
          name: row.contractor_name || row.contractor || row.vendor,
          type: row.contractor_type || 'unknown'
        });
      }

      // Check for property
      if (row.property || row.office || row.warehouse || row.location_type) {
        indicators.property.push({
          type: row.property_type || row.location_type || 'property',
          address: row.address
        });
      }

      // Check for inventory
      if (row.inventory || row.stock || row.warehouse_location) {
        indicators.inventory.push({
          location: row.warehouse_location || state,
          value: row.inventory_value
        });
      }
    }

    return {
      hasPhysicalPresence: 
        indicators.employees.length > 0 ||
        indicators.property.length > 0 ||
        indicators.inventory.length > 0 ||
        indicators.contractors.length > 0,
      indicators
    };
  }

  /**
   * Detect affiliate/click-through nexus relationships
   */
  detectAffiliateRelationships(data, state) {
    const affiliates = [];
    const affiliateIndicators = ['affiliate', 'referral', 'partner', 'commission'];

    for (const row of data) {
      if (!this.matchesState(row, state)) continue;

      const channel = String(row.channel || row.source || '').toLowerCase();
      if (affiliateIndicators.some(ind => channel.includes(ind))) {
        affiliates.push({
          name: row.affiliate_name || row.partner_name || 'Unknown',
          revenue: this.extractRevenue(row)
        });
      }
    }

    const totalAffiliateRevenue = affiliates.reduce((sum, a) => sum + (a.revenue || 0), 0);

    return {
      hasAffiliateNexus: affiliates.length > 0 && totalAffiliateRevenue > 10000,
      affiliates,
      totalAffiliateRevenue
    };
  }

  /**
   * Create economic nexus alert
   */
  createEconomicNexusAlert(state, analysis, stateRule) {
    return {
      id: this.generateAlertId('ECONOMIC_NEXUS', state),
      type: 'SALES_NEXUS',
      subtype: 'ECONOMIC_NEXUS',
      state: state,
      stateName: stateRule.name || state,
      severity: this.calculateSeverity(analysis.actual, analysis.threshold),
      title: `${state} Sales Tax Economic Nexus Triggered`,
      description: `Revenue of $${this.formatNumber(analysis.actual)} exceeds ${state}'s economic nexus threshold of $${this.formatNumber(analysis.threshold)}`,
      facts: {
        threshold: analysis.threshold,
        statutoryThreshold: analysis.statutoryThreshold,
        actualRevenue: analysis.actual,
        percentageOver: analysis.percentageOver,
        effectiveDate: stateRule.sales?.effectiveDate,
        period: 'Current Year'
      },
      recommendation: `Register for sales tax collection in ${state}. Review registration requirements and filing deadlines.`,
      judgmentRequired: false,
      requiresAction: true,
      priority: 'HIGH',
      createdDate: new Date().toISOString(),
      dueDate: this.calculateDueDate(state, 'sales')
    };
  }

  /**
   * Create approaching threshold alert
   */
  createApproachingThresholdAlert(state, analysis, stateRule) {
    return {
      id: this.generateAlertId('ECONOMIC_NEXUS_APPROACHING', state),
      type: 'SALES_NEXUS',
      subtype: 'ECONOMIC_NEXUS_APPROACHING',
      state: state,
      stateName: stateRule.name || state,
      severity: 'MEDIUM',
      title: `${state} Sales Tax Threshold Approaching`,
      description: `Revenue of $${this.formatNumber(analysis.actual)} is ${analysis.percentageOfThreshold}% of ${state}'s economic nexus threshold`,
      facts: {
        threshold: analysis.threshold,
        actualRevenue: analysis.actual,
        percentageOfThreshold: analysis.percentageOfThreshold,
        remainingHeadroom: analysis.threshold - analysis.actual,
        period: 'Current Year'
      },
      recommendation: `Monitor sales activity in ${state}. Prepare for potential registration requirement.`,
      judgmentRequired: false,
      requiresAction: false,
      priority: 'MEDIUM',
      createdDate: new Date().toISOString()
    };
  }

  /**
   * Create marketplace nexus alert
   */
  createMarketplaceNexusAlert(state, analysis, stateRule) {
    return {
      id: this.generateAlertId('MARKETPLACE_NEXUS', state),
      type: 'SALES_NEXUS',
      subtype: 'MARKETPLACE_NEXUS',
      state: state,
      stateName: stateRule.name || state,
      severity: 'INFO',
      title: `${state} Marketplace Sales Threshold Met`,
      description: `Marketplace revenue of $${this.formatNumber(analysis.actual)} exceeds threshold. Verify marketplace is remitting tax.`,
      facts: {
        threshold: analysis.threshold,
        marketplaceRevenue: analysis.actual,
        percentageOver: analysis.percentageOver
      },
      recommendation: `Verify that marketplace facilitators (Amazon, Shopify, etc.) are properly collecting and remitting sales tax for ${state} sales.`,
      judgmentRequired: false,
      requiresAction: false,
      priority: 'LOW',
      createdDate: new Date().toISOString()
    };
  }

  /**
   * Create physical presence alert
   */
  createPhysicalPresenceAlert(state, physicalPresence, stateRule) {
    const indicators = physicalPresence.indicators;
    const presenceTypes = [];
    
    if (indicators.employees.length > 0) presenceTypes.push(`${indicators.employees.length} employee(s)`);
    if (indicators.contractors.length > 0) presenceTypes.push(`${indicators.contractors.length} contractor(s)`);
    if (indicators.property.length > 0) presenceTypes.push(`${indicators.property.length} property location(s)`);
    if (indicators.inventory.length > 0) presenceTypes.push(`${indicators.inventory.length} inventory location(s)`);

    return {
      id: this.generateAlertId('PHYSICAL_PRESENCE', state),
      type: 'SALES_NEXUS',
      subtype: 'PHYSICAL_PRESENCE',
      state: state,
      stateName: stateRule.name || state,
      severity: 'HIGH',
      title: `${state} Physical Presence Nexus Detected`,
      description: `Physical presence detected in ${state}: ${presenceTypes.join(', ')}`,
      facts: {
        employees: indicators.employees,
        contractors: indicators.contractors,
        property: indicators.property,
        inventory: indicators.inventory,
        presenceSummary: presenceTypes
      },
      recommendation: `Physical presence creates sales tax nexus in ${state}. Verify sales tax registration and compliance.`,
      judgmentRequired: false,
      requiresAction: true,
      priority: 'HIGH',
      createdDate: new Date().toISOString()
    };
  }

  /**
   * Create affiliate nexus alert
   */
  createAffiliateNexusAlert(state, affiliateResult, stateRule) {
    return {
      id: this.generateAlertId('AFFILIATE_NEXUS', state),
      type: 'SALES_NEXUS',
      subtype: 'AFFILIATE_NEXUS',
      state: state,
      stateName: stateRule.name || state,
      severity: 'MEDIUM',
      title: `${state} Click-Through/Affiliate Nexus Potential`,
      description: `Affiliate relationships in ${state} may create click-through nexus with $${this.formatNumber(affiliateResult.totalAffiliateRevenue)} in referral revenue`,
      facts: {
        affiliateCount: affiliateResult.affiliates.length,
        totalAffiliateRevenue: affiliateResult.totalAffiliateRevenue,
        affiliates: affiliateResult.affiliates
      },
      recommendation: `Review affiliate agreements in ${state}. Click-through nexus laws may require sales tax collection.`,
      judgmentRequired: true,
      requiresAction: false,
      priority: 'MEDIUM',
      createdDate: new Date().toISOString()
    };
  }

  /**
   * Calculate severity based on threshold percentage
   */
  calculateSeverity(actual, threshold) {
    const percentage = (actual / threshold) * 100;
    
    if (percentage >= 150) return 'CRITICAL';
    if (percentage >= 120) return 'HIGH';
    if (percentage >= 100) return 'MEDIUM';
    return 'LOW';
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

  /**
   * Calculate due date for registration
   */
  calculateDueDate(state, taxType) {
    const today = new Date();
    // Default: 30 days from detection
    today.setDate(today.getDate() + 30);
    return today.toISOString();
  }
}

module.exports = SalesNexusDetector;


