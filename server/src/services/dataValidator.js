const { TARGET_ALERTS, TARGET_DISTRIBUTION, STATUS } = require('../config/dataGenerationConfig');

class DataValidator {
  /**
   * Validates generated data against targets
   */
  validate(data) {
    const errors = [];
    const warnings = [];
    
    // Validate structure
    if (!data.clients || !Array.isArray(data.clients)) {
      errors.push('Missing or invalid clients array');
    }
    if (!data.clientStates || !Array.isArray(data.clientStates)) {
      errors.push('Missing or invalid clientStates array');
    }
    // Check nexusAlerts (the actual alert array used)
    if (!data.nexusAlerts || !Array.isArray(data.nexusAlerts)) {
      errors.push('Missing or invalid nexusAlerts array');
    }
    
    if (errors.length > 0) {
      return { valid: false, errors, warnings, summary: null };
    }
    
    // Calculate metrics - use nexusAlerts instead of alerts
    const alertMetrics = this.calculateAlertMetrics(data.nexusAlerts);
    const stateMetrics = this.calculateStateMetrics(data.clientStates);
    const clientMetrics = this.calculateClientMetrics(data.clients, data.clientStates, data.nexusAlerts);
    
    // Validate alert count - check nexusAlerts
    // Allow 18-22 alerts (flexible range) but prefer exactly 20
    if (data.nexusAlerts.length > TARGET_ALERTS.TOTAL + 2) {
      errors.push(`Too many alerts: ${data.nexusAlerts.length} (maximum: ${TARGET_ALERTS.TOTAL + 2})`);
    } else if (data.nexusAlerts.length > TARGET_ALERTS.TOTAL) {
      warnings.push(`Alert count slightly above target: ${data.nexusAlerts.length} (target: ${TARGET_ALERTS.TOTAL})`);
    }
    
    if (data.nexusAlerts.length < TARGET_ALERTS.TOTAL - 2) {
      warnings.push(`Alert count below target: ${data.nexusAlerts.length} (target: ${TARGET_ALERTS.TOTAL})`);
    }
    
    // Validate alert priorities
    const priorityTolerance = 2;
    if (Math.abs(alertMetrics.highCount - TARGET_ALERTS.HIGH) > priorityTolerance) {
      warnings.push(`High priority alerts off target: ${alertMetrics.highCount} (target: ${TARGET_ALERTS.HIGH})`);
    }
    if (Math.abs(alertMetrics.mediumCount - TARGET_ALERTS.MEDIUM) > priorityTolerance) {
      warnings.push(`Medium priority alerts off target: ${alertMetrics.mediumCount} (target: ${TARGET_ALERTS.MEDIUM})`);
    }
    if (Math.abs(alertMetrics.lowCount - TARGET_ALERTS.LOW) > priorityTolerance) {
      warnings.push(`Low priority alerts off target: ${alertMetrics.lowCount} (target: ${TARGET_ALERTS.LOW})`);
    }
    
    // Validate state distribution
    const distributionTolerance = 5; // 5% tolerance
    if (Math.abs(stateMetrics.compliantPct - TARGET_DISTRIBUTION.COMPLIANT_PCT) > distributionTolerance) {
      warnings.push(`Compliant states: ${stateMetrics.compliantPct}% (target: ${TARGET_DISTRIBUTION.COMPLIANT_PCT}%)`);
    }
    if (Math.abs(stateMetrics.warningPct - TARGET_DISTRIBUTION.WARNING_PCT) > distributionTolerance) {
      warnings.push(`Warning states: ${stateMetrics.warningPct}% (target: ${TARGET_DISTRIBUTION.WARNING_PCT}%)`);
    }
    
    // Validate critical state percentage (removed minimum count requirement)
    if (Math.abs(stateMetrics.criticalPct - TARGET_DISTRIBUTION.CRITICAL_PCT) > distributionTolerance) {
      warnings.push(`Critical states: ${stateMetrics.criticalPct}% (target: ${TARGET_DISTRIBUTION.CRITICAL_PCT}%)`);
    }
    
    // Validate state count range
    if (stateMetrics.totalStates < 30 || stateMetrics.totalStates > 50) {
      warnings.push(`Total states out of range: ${stateMetrics.totalStates} (expected: 30-50)`);
    }
    
    // Validate per-client metrics
    clientMetrics.clientIssues.forEach(issue => {
      warnings.push(issue);
    });
    
    // Check for compliant state alerts
    // NOTE: compliance_confirmed alerts are ALLOWED on compliant states (needed for map visibility)
    const compliantStateAlerts = data.nexusAlerts.filter(alert => {
      if (!alert.stateCode) return false; // Skip monitoring alerts
      // Skip compliance_confirmed alerts - these are intentionally created for compliant states
      if (alert.alertType === 'compliance_confirmed') return false;
      
      const state = data.clientStates.find(s => 
        s.clientId === alert.clientId && s.stateCode === alert.stateCode
      );
      return state && state.status === STATUS.COMPLIANT;
    });
    
    // Only warn if there are non-compliance alerts on compliant states (not an error)
    // This can happen if a state was upgraded from compliant to warning/critical after alert creation
    // or if there's a status mismatch between the alert and the state
    if (compliantStateAlerts.length > 0) {
      warnings.push(`Found ${compliantStateAlerts.length} non-compliance alerts on compliant states (may indicate status mismatch)`);
    }
    
    return {
      valid: errors.length === 0,
      errors,
      warnings,
      summary: {
        alerts: alertMetrics,
        states: stateMetrics,
        clients: clientMetrics
      }
    };
  }
  
  /**
   * Calculates alert metrics
   */
  calculateAlertMetrics(alerts) {
    if (!alerts || !Array.isArray(alerts) || alerts.length === 0) {
      return {
        totalAlerts: 0,
        highCount: 0,
        mediumCount: 0,
        lowCount: 0,
        openCount: 0,
        closedCount: 0
      };
    }
    
    return {
      totalAlerts: alerts.length,
      highCount: alerts.filter(a => a.priority === 'high').length,
      mediumCount: alerts.filter(a => a.priority === 'medium').length,
      lowCount: alerts.filter(a => a.priority === 'low').length,
      openCount: alerts.filter(a => a.status === 'open').length,
      closedCount: alerts.filter(a => a.status === 'closed').length
    };
  }
  
  /**
   * Calculates state distribution metrics
   */
  calculateStateMetrics(clientStates) {
    const total = clientStates.length;
    const compliant = clientStates.filter(s => s.status === STATUS.COMPLIANT).length;
    const warning = clientStates.filter(s => s.status === STATUS.WARNING).length;
    const critical = clientStates.filter(s => s.status === STATUS.CRITICAL).length;
    
    return {
      totalStates: total,
      compliantCount: compliant,
      warningCount: warning,
      criticalCount: critical,
      compliantPct: total > 0 ? Math.round((compliant / total) * 100) : 0,
      warningPct: total > 0 ? Math.round((warning / total) * 100) : 0,
      criticalPct: total > 0 ? Math.round((critical / total) * 100) : 0
    };
  }
  
  /**
   * Calculates per-client metrics
   */
  calculateClientMetrics(clients, clientStates, alerts) {
    const clientIssues = [];
    
    if (!clients || !Array.isArray(clients)) {
      return {
        totalClients: 0,
        avgStatesPerClient: 0,
        avgAlertsPerClient: 0,
        clientIssues: ['No clients found']
      };
    }
    
    clients.forEach(client => {
      const clientStateCount = clientStates ? clientStates.filter(s => s.clientId === client.id).length : 0;
      const clientAlertCount = alerts ? alerts.filter(a => a.clientId === client.id).length : 0;
      
      if (clientStateCount < 3 || clientStateCount > 5) {
        clientIssues.push(`Client "${client.name || client.id}" has ${clientStateCount} states (expected: 3-5)`);
      }
      
      // Allow 1-3 alerts per client (flexible, as long as total is ~20)
      if (clientAlertCount < 1 || clientAlertCount > 3) {
        clientIssues.push(`Client "${client.name || client.id}" has ${clientAlertCount} alerts (expected: 1-3)`);
      }
    });
    
    return {
      totalClients: clients.length,
      avgStatesPerClient: clients.length > 0 && clientStates 
        ? (clientStates.length / clients.length).toFixed(1) 
        : 0,
      avgAlertsPerClient: clients.length > 0 && alerts
        ? (alerts.length / clients.length).toFixed(1) 
        : 0,
      clientIssues
    };
  }
  
  /**
   * Formats validation result for logging
   */
  formatValidationResult(result) {
    const lines = [];
    
    lines.push('📊 Data Validation Results');
    lines.push('='.repeat(50));
    
    if (result.valid) {
      lines.push('✅ Validation PASSED');
    } else {
      lines.push('❌ Validation FAILED');
    }
    
    if (result.errors.length > 0) {
      lines.push('\n🔴 Errors:');
      result.errors.forEach(error => lines.push(`  - ${error}`));
    }
    
    if (result.warnings.length > 0) {
      lines.push('\n⚠️  Warnings:');
      result.warnings.forEach(warning => lines.push(`  - ${warning}`));
    }
    
    if (result.summary) {
      lines.push('\n📈 Summary:');
      
      if (result.summary.alerts) {
        const a = result.summary.alerts;
        lines.push(`  Alerts: ${a.totalAlerts} total (${a.highCount} high, ${a.mediumCount} medium, ${a.lowCount} low)`);
      }
      
      if (result.summary.states) {
        const s = result.summary.states;
        lines.push(`  States: ${s.totalStates} total (${s.compliantPct}% compliant, ${s.warningPct}% warning, ${s.criticalPct}% critical)`);
      }
      
      if (result.summary.clients) {
        const c = result.summary.clients;
        lines.push(`  Clients: ${c.totalClients} total (avg ${c.avgStatesPerClient} states, ${c.avgAlertsPerClient} alerts each)`);
      }
    }
    
    lines.push('='.repeat(50));
    
    return lines.join('\n');
  }
}

module.exports = DataValidator;

