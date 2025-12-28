const doctrineRuleService = require('./doctrineRuleService');

/**
 * Doctrine Alert Matcher
 * Checks for matching doctrine rules before generating alerts
 * and applies rule decisions to suppress or modify alerts
 */

class DoctrineAlertMatcher {
  /**
   * Check if an alert matches any active doctrine rules
   * @param {Object} alertData - Alert data to check
   * @param {string} organizationId - Organization ID
   * @param {string} clientId - Client ID (optional)
   * @returns {Object|null} - Matching rule or null
   */
  async checkMatchingRule(alertData, organizationId, clientId = null) {
    try {
      const criteria = {
        organizationId,
        clientId,
        state: alertData.stateCode,
        taxType: alertData.type || alertData.alertType,
        activityPattern: {
          revenue_threshold: alertData.threshold,
          revenue_range: alertData.currentAmount
            ? `${Math.max(0, alertData.currentAmount * 0.9)}-${alertData.currentAmount * 1.1}`
            : undefined
        }
      };

      const matchingRules = await doctrineRuleService.matchRules(criteria);

      if (matchingRules && matchingRules.length > 0) {
        // Return the most specific rule (client > office > firm)
        const sortedRules = matchingRules.sort((a, b) => {
          const scopeOrder = { client: 3, office: 2, firm: 1 };
          return scopeOrder[b.scope] - scopeOrder[a.scope];
        });

        return sortedRules[0];
      }

      return null;
    } catch (error) {
      console.error('Error checking matching doctrine rule:', error);
      return null;
    }
  }

  /**
   * Apply doctrine rule to alert
   * @param {Object} alert - Alert object
   * @param {Object} rule - Matching doctrine rule
   * @returns {Object} - Modified alert
   */
  applyRuleToAlert(alert, rule) {
    if (!rule || rule.status !== 'active') {
      return alert;
    }

    // Apply rule decision
    const modifiedAlert = {
      ...alert,
      appliedDoctrineRuleId: rule.id,
      doctrineRuleVersion: rule.version
    };

    // Based on rule decision, modify alert
    switch (rule.decision) {
      case 'NO_REGISTRATION':
      case 'NO_ACTION':
        // Suppress alert or mark as resolved
        modifiedAlert.judgmentRequired = false;
        modifiedAlert.suppressedByDoctrine = true;
        modifiedAlert.message = `${alert.message} (Doctrine Rule Applied: ${rule.name})`;
        break;

      case 'REGISTER':
      case 'IMMEDIATE_ACTION':
        // Keep alert but mark as action required
        modifiedAlert.judgmentRequired = false;
        modifiedAlert.message = `${alert.message} (Doctrine Rule Applied: ${rule.name} - Action Required)`;
        break;

      case 'MONITOR':
        // Reduce severity or mark for monitoring
        if (modifiedAlert.severity === 'RED') {
          modifiedAlert.severity = 'ORANGE';
        }
        modifiedAlert.judgmentRequired = false;
        modifiedAlert.message = `${alert.message} (Doctrine Rule Applied: ${rule.name} - Monitor)`;
        break;

      default:
        // Just mark that rule was applied
        modifiedAlert.message = `${alert.message} (Doctrine Rule Applied: ${rule.name})`;
    }

    return modifiedAlert;
  }

  /**
   * Process alerts and apply matching doctrine rules
   * @param {Array} alerts - Array of alerts
   * @param {string} organizationId - Organization ID
   * @param {string} clientId - Client ID (optional)
   * @returns {Array} - Processed alerts with doctrine rules applied
   */
  async processAlertsWithDoctrine(alerts, organizationId, clientId = null) {
    const processedAlerts = [];

    for (const alert of alerts) {
      // Check for matching rule
      const matchingRule = await this.checkMatchingRule(alert, organizationId, clientId);

      if (matchingRule) {
        // Apply rule to alert
        const modifiedAlert = this.applyRuleToAlert(alert, matchingRule);
        processedAlerts.push(modifiedAlert);

        // Update impact metrics
        await doctrineRuleService.updateImpactMetrics(matchingRule.id, {
          totalClientsAffected: 1, // Increment
          lastAppliedAt: new Date()
        });
      } else {
        // No matching rule, keep alert as-is
        processedAlerts.push(alert);
      }
    }

    return processedAlerts;
  }

  /**
   * Check if alert should be suppressed based on doctrine rules
   * @param {Object} alert - Alert to check
   * @param {string} organizationId - Organization ID
   * @param {string} clientId - Client ID (optional)
   * @returns {boolean} - True if alert should be suppressed
   */
  async shouldSuppressAlert(alert, organizationId, clientId = null) {
    const matchingRule = await this.checkMatchingRule(alert, organizationId, clientId);

    if (!matchingRule || matchingRule.status !== 'active') {
      return false;
    }

    // Suppress if rule decision is NO_ACTION or NO_REGISTRATION
    return ['NO_REGISTRATION', 'NO_ACTION'].includes(matchingRule.decision);
  }
}

module.exports = new DoctrineAlertMatcher();


