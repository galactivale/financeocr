/**
 * Nexus Alert Engine
 * 
 * Main entry point for the nexus detection system.
 * 
 * Usage:
 * ```javascript
 * const { NexusAlertEngine } = require('./services/nexus-alert-engine');
 * 
 * const engine = new NexusAlertEngine({
 *   firmId: 'firm_123',
 *   riskPosture: 'conservative',
 *   enabledModules: {
 *     sales: true,
 *     income: true,
 *     payroll: true,
 *     franchise: true
 *   }
 * });
 * 
 * const alerts = await engine.detectNexus(normalizedData);
 * ```
 */

const NexusAlertEngine = require('./NexusAlertEngine');
const SalesNexusDetector = require('./detectors/SalesNexusDetector');
const IncomeNexusDetector = require('./detectors/IncomeNexusDetector');
const PayrollNexusDetector = require('./detectors/PayrollNexusDetector');
const FranchiseNexusDetector = require('./detectors/FranchiseNexusDetector');
const { STATE_RULES, PL_86_272_ACTIVITIES, RISK_MULTIPLIERS, SEVERITY_THRESHOLDS } = require('./rules/stateRules');

module.exports = {
  // Main engine
  NexusAlertEngine,
  
  // Individual detectors (for advanced usage)
  SalesNexusDetector,
  IncomeNexusDetector,
  PayrollNexusDetector,
  FranchiseNexusDetector,
  
  // Rules and constants
  STATE_RULES,
  PL_86_272_ACTIVITIES,
  RISK_MULTIPLIERS,
  SEVERITY_THRESHOLDS
};







