/**
 * Data Generation Configuration
 * All constants and settings for dashboard data generation
 */

// Status System - 3 Tier Only
const STATUS = {
  COMPLIANT: 'compliant',  // < 80% threshold - Green
  WARNING: 'warning',      // 80-99% threshold - Yellow
  CRITICAL: 'critical'     // ≥ 100% threshold - Red
};

// Status Colors for Frontend
const STATUS_COLORS = {
  [STATUS.COMPLIANT]: '#10b981',  // Green
  [STATUS.WARNING]: '#f97316',    // Orange
  [STATUS.CRITICAL]: '#ef4444'    // Red
};

// Client Risk Levels
const RISK_LEVELS = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
};

// Fixed client count
const TOTAL_CLIENTS = 10;

// Target state distribution percentages
const TARGET_DISTRIBUTION = {
  COMPLIANT_PCT: 40,
  WARNING_PCT: 40,
  CRITICAL_PCT: 20
};

// Target alert distribution
const TARGET_ALERTS = {
  TOTAL: 20,
  HIGH: 5,
  MEDIUM: 10,
  LOW: 5,
  PER_CLIENT: 2
};

// State distribution by risk level (achieves 40/40/20)
const STATE_DISTRIBUTION = {
  [RISK_LEVELS.CRITICAL]: {
    total: 5,
    compliant: 1,  // 20%
    warning: 2,    // 40%
    critical: 2    // 40%
  },
  [RISK_LEVELS.HIGH]: {
    total: 4,
    compliant: 1,  // 25%
    warning: 2,    // 50%
    critical: 1    // 25%
  },
  [RISK_LEVELS.MEDIUM]: {
    total: 4,
    compliant: 2,  // 50%
    warning: 2,    // 50%
    critical: 0    // 0%
  },
  [RISK_LEVELS.LOW]: {
    total: 3,
    compliant: 2,  // 67%
    warning: 1,    // 33%
    critical: 0    // 0%
  }
};

// Risk level distribution for 10 clients
const RISK_DISTRIBUTION = [
  RISK_LEVELS.CRITICAL,  // Client 1
  RISK_LEVELS.CRITICAL,  // Client 2
  RISK_LEVELS.HIGH,      // Client 3
  RISK_LEVELS.HIGH,      // Client 4
  RISK_LEVELS.MEDIUM,    // Client 5
  RISK_LEVELS.MEDIUM,    // Client 6
  RISK_LEVELS.MEDIUM,    // Client 7
  RISK_LEVELS.LOW,       // Client 8
  RISK_LEVELS.LOW,       // Client 9
  RISK_LEVELS.LOW        // Client 10
];

// Alert allocation per client (sums to 5/10/5)
const ALERT_ALLOCATION = {
  [RISK_LEVELS.CRITICAL]: [
    { high: 1, medium: 1, low: 0 },  // Client 1
    { high: 1, medium: 1, low: 0 }   // Client 2
  ],
  [RISK_LEVELS.HIGH]: [
    { high: 1, medium: 1, low: 0 },  // Client 3
    { high: 1, medium: 1, low: 0 }   // Client 4
  ],
  [RISK_LEVELS.MEDIUM]: [
    { high: 1, medium: 1, low: 0 },  // Client 5
    { high: 0, medium: 1, low: 1 },  // Client 6
    { high: 0, medium: 1, low: 1 }   // Client 7
  ],
  [RISK_LEVELS.LOW]: [
    { high: 0, medium: 1, low: 1 },  // Client 8
    { high: 0, medium: 1, low: 1 },  // Client 9
    { high: 0, medium: 1, low: 1 }   // Client 10
  ]
};
// Total: 5 high + 10 medium + 5 low = 20 alerts ✅

// Qualification strategies
const QUALIFICATION_STRATEGIES = {
  conservative: {
    name: 'Conservative',
    warningThreshold: 0.60,
    alertThreshold: 0.80,
    criticalThreshold: 1.00,
    description: 'Early warning at 60%, alerts at 80%'
  },
  standard: {
    name: 'Standard',
    warningThreshold: 0.80,
    alertThreshold: 0.80,
    criticalThreshold: 1.00,
    description: 'Alerts at 80%, critical at 100%'
  },
  aggressive: {
    name: 'Aggressive',
    warningThreshold: 0.90,
    alertThreshold: 0.90,
    criticalThreshold: 1.10,
    description: 'Alerts at 90%, critical at 110%'
  },
  'compliance-focused': {
    name: 'Compliance-Focused',
    warningThreshold: 0.70,
    alertThreshold: 0.70,
    criticalThreshold: 0.90,
    description: 'Strict monitoring, alerts at 70%'
  },
  'risk-tolerant': {
    name: 'Risk-Tolerant',
    warningThreshold: 1.00,
    alertThreshold: 1.00,
    criticalThreshold: 1.20,
    description: 'Minimal alerts, only at 100%+'
  }
};

// Revenue ranges
const REVENUE_RANGE = {
  MIN: 50000,
  MAX: 600000
};

// State threshold ranges (by state size)
const STATE_THRESHOLDS = {
  LARGE: { min: 500000, max: 1000000 },    // CA, NY, TX
  MEDIUM: { min: 200000, max: 500000 },    // FL, IL, PA, OH
  SMALL: { min: 100000, max: 300000 }      // All others
};

const LARGE_STATES = ['CA', 'NY', 'TX'];
const MEDIUM_STATES = ['FL', 'IL', 'PA', 'OH'];

module.exports = {
  STATUS,
  STATUS_COLORS,
  RISK_LEVELS,
  TOTAL_CLIENTS,
  TARGET_DISTRIBUTION,
  TARGET_ALERTS,
  STATE_DISTRIBUTION,
  RISK_DISTRIBUTION,
  ALERT_ALLOCATION,
  QUALIFICATION_STRATEGIES,
  REVENUE_RANGE,
  STATE_THRESHOLDS,
  LARGE_STATES,
  MEDIUM_STATES
};

