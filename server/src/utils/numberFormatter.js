/**
 * Utility functions to ensure proper numeric formatting in API responses
 */

/**
 * Converts Prisma Decimal values to proper numbers
 * @param {any} value - The value to convert
 * @returns {number|null} - Converted number or null
 */
function formatDecimal(value) {
  if (value === null || value === undefined) {
    return null;
  }
  
  // If it's already a number, return it
  if (typeof value === 'number') {
    return value;
  }
  
  // If it's a string representation of a number, parse it
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? null : parsed;
  }
  
  // If it's a Prisma Decimal object, convert to number
  if (value && typeof value === 'object' && value.toNumber) {
    return value.toNumber();
  }
  
  return null;
}

/**
 * Converts Prisma Int values to proper numbers
 * @param {any} value - The value to convert
 * @returns {number|null} - Converted number or null
 */
function formatInt(value) {
  if (value === null || value === undefined) {
    return null;
  }
  
  // If it's already a number, return it
  if (typeof value === 'number') {
    return Math.round(value);
  }
  
  // If it's a string representation of a number, parse it
  if (typeof value === 'string') {
    const parsed = parseInt(value);
    return isNaN(parsed) ? null : parsed;
  }
  
  return null;
}

/**
 * Converts Prisma Float values to proper numbers
 * @param {any} value - The value to convert
 * @returns {number|null} - Converted number or null
 */
function formatFloat(value) {
  if (value === null || value === undefined) {
    return null;
  }
  
  // If it's already a number, return it
  if (typeof value === 'number') {
    return value;
  }
  
  // If it's a string representation of a number, parse it
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? null : parsed;
  }
  
  return null;
}

/**
 * Formats a client object to ensure all numeric fields are properly formatted
 * @param {Object} client - The client object from Prisma
 * @returns {Object} - Formatted client object
 */
function formatClient(client) {
  if (!client) return null;
  
  return {
    ...client,
    employeeCount: formatInt(client.employeeCount),
    annualRevenue: formatDecimal(client.annualRevenue),
    penaltyExposure: formatDecimal(client.penaltyExposure),
    qualityScore: formatInt(client.qualityScore)
  };
}

/**
 * Formats a client state object to ensure all numeric fields are properly formatted
 * @param {Object} clientState - The client state object from Prisma
 * @returns {Object} - Formatted client state object
 */
function formatClientState(clientState) {
  if (!clientState) return null;
  
  return {
    ...clientState,
    currentAmount: formatDecimal(clientState.currentAmount),
    thresholdAmount: formatDecimal(clientState.thresholdAmount),
    penaltyRisk: formatDecimal(clientState.penaltyRisk)
  };
}

/**
 * Formats a nexus alert object to ensure all numeric fields are properly formatted
 * @param {Object} alert - The nexus alert object from Prisma
 * @returns {Object} - Formatted nexus alert object
 */
function formatNexusAlert(alert) {
  if (!alert) return null;
  
  return {
    ...alert,
    thresholdAmount: formatDecimal(alert.thresholdAmount),
    currentAmount: formatDecimal(alert.currentAmount),
    penaltyRisk: formatDecimal(alert.penaltyRisk)
  };
}

/**
 * Formats a task object to ensure all numeric fields are properly formatted
 * @param {Object} task - The task object from Prisma
 * @returns {Object} - Formatted task object
 */
function formatTask(task) {
  if (!task) return null;
  
  return {
    ...task,
    estimatedHours: formatDecimal(task.estimatedHours),
    actualHours: formatDecimal(task.actualHours),
    progress: formatInt(task.progress)
  };
}

/**
 * Formats a revenue breakdown object to ensure all numeric fields are properly formatted
 * @param {Object} breakdown - The revenue breakdown object from Prisma
 * @returns {Object} - Formatted revenue breakdown object
 */
function formatRevenueBreakdown(breakdown) {
  if (!breakdown) return null;
  
  return {
    ...breakdown,
    amount: formatDecimal(breakdown.amount),
    percentage: formatFloat(breakdown.percentage)
  };
}

/**
 * Formats a customer demographics object to ensure all numeric fields are properly formatted
 * @param {Object} demographics - The customer demographics object from Prisma
 * @returns {Object} - Formatted customer demographics object
 */
function formatCustomerDemographics(demographics) {
  if (!demographics) return null;
  
  return {
    ...demographics,
    totalActiveCustomers: formatInt(demographics.totalActiveCustomers),
    averageContractValue: formatDecimal(demographics.averageContractValue),
    customerRetentionRate: formatFloat(demographics.customerRetentionRate),
    monthlyRecurringRevenue: formatDecimal(demographics.monthlyRecurringRevenue)
  };
}

/**
 * Formats a geographic distribution object to ensure all numeric fields are properly formatted
 * @param {Object} distribution - The geographic distribution object from Prisma
 * @returns {Object} - Formatted geographic distribution object
 */
function formatGeographicDistribution(distribution) {
  if (!distribution) return null;
  
  return {
    ...distribution,
    customerCount: formatInt(distribution.customerCount),
    percentage: formatFloat(distribution.percentage)
  };
}

/**
 * Formats an array of objects using the provided formatter function
 * @param {Array} array - Array of objects to format
 * @param {Function} formatter - Formatter function to apply to each object
 * @returns {Array} - Array of formatted objects
 */
function formatArray(array, formatter) {
  if (!Array.isArray(array)) return [];
  return array.map(formatter).filter(item => item !== null);
}

module.exports = {
  formatDecimal,
  formatInt,
  formatFloat,
  formatClient,
  formatClientState,
  formatNexusAlert,
  formatTask,
  formatRevenueBreakdown,
  formatCustomerDemographics,
  formatGeographicDistribution,
  formatArray
};
