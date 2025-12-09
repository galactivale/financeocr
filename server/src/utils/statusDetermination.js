const { STATUS, QUALIFICATION_STRATEGIES } = require('../config/dataGenerationConfig');

/**
 * Determines status based on revenue ratio and qualification strategy
 * @param {number} currentAmount - Current revenue amount
 * @param {number} thresholdAmount - Threshold amount for the state
 * @param {string} strategy - Qualification strategy name
 * @returns {string} - Status: 'compliant', 'warning', or 'critical'
 */
function determineStatus(currentAmount, thresholdAmount, strategy = 'standard') {
  if (!thresholdAmount || thresholdAmount === 0) {
    return STATUS.COMPLIANT;
  }
  
  const ratio = currentAmount / thresholdAmount;
  const thresholds = QUALIFICATION_STRATEGIES[strategy] || QUALIFICATION_STRATEGIES.standard;
  
  // Critical: Above critical threshold
  if (ratio >= thresholds.criticalThreshold) {
    return STATUS.CRITICAL;
  }
  
  // Warning: Between warning threshold and critical threshold
  if (ratio >= thresholds.warningThreshold) {
    return STATUS.WARNING;
  }
  
  // Compliant: Below warning threshold
  return STATUS.COMPLIANT;
}

/**
 * Calculates revenue amount for a given status and threshold
 * @param {string} status - Desired status
 * @param {number} thresholdAmount - Threshold amount
 * @param {string} strategy - Qualification strategy
 * @returns {number} - Calculated revenue amount
 */
function calculateRevenueForStatus(status, thresholdAmount, strategy = 'standard') {
  const thresholds = QUALIFICATION_STRATEGIES[strategy] || QUALIFICATION_STRATEGIES.standard;
  
  switch (status) {
    case STATUS.COMPLIANT:
      // Compliant: 10-50% of threshold
      return Math.floor(thresholdAmount * (0.10 + Math.random() * 0.40));
    
    case STATUS.WARNING:
      // Warning: Between warning and critical threshold
      // IMPORTANT: Must be BELOW critical threshold (never equal or exceed)
      const warningMin = thresholds.warningThreshold;
      const warningMax = Math.min(thresholds.criticalThreshold - 0.01, 0.99); // Ensure it's below 100%
      const warningRatio = warningMin + (Math.random() * (warningMax - warningMin));
      const warningAmount = Math.floor(thresholdAmount * warningRatio);
      
      // Double-check: Warning states must NEVER exceed threshold
      if (warningAmount >= thresholdAmount) {
        // Cap at 99% of threshold to ensure it's below
        return Math.floor(thresholdAmount * 0.99);
      }
      
      return warningAmount;
    
    case STATUS.CRITICAL:
      // Critical: Between critical threshold and 150%
      const criticalMin = thresholds.criticalThreshold;
      const criticalMax = thresholds.criticalThreshold + 0.50;
      const criticalRatio = criticalMin + (Math.random() * (criticalMax - criticalMin));
      return Math.floor(thresholdAmount * criticalRatio);
    
    default:
      return Math.floor(thresholdAmount * 0.10);
  }
}

module.exports = {
  determineStatus,
  calculateRevenueForStatus
};

