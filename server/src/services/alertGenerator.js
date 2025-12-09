const { TARGET_ALERTS, STATUS } = require('../config/dataGenerationConfig');

class AlertGenerator {
  /**
   * Generates alerts for a client based on allocation
   */
  generateAlertsForClient(client, states, allocation) {
    const alerts = [];
    const { high, medium, low } = allocation;
    
    // Get states by status
    // IMPORTANT: Only get non-compliant states for alert generation
    // Compliant states should NOT get threshold_breach or threshold_approaching alerts
    const criticalStates = states.filter(s => s.status === STATUS.CRITICAL);
    const warningStates = states.filter(s => s.status === STATUS.WARNING);
    
    // Ensure we never create alerts for compliant states
    // Compliant states should only have compliance_confirmed alerts (created separately)
    
    // Create high priority alerts (from critical states)
    for (let i = 0; i < Math.min(high, criticalStates.length); i++) {
      alerts.push(this.createAlert(
        client,
        criticalStates[i],
        'high',
        'threshold_breach',
        `Critical: ${criticalStates[i].stateName} nexus threshold exceeded`,
        `Revenue in ${criticalStates[i].stateName} has exceeded the nexus threshold by $${criticalStates[i].excessAmount.toLocaleString()}. Immediate registration required.`
      ));
    }
    
    // If we need more high alerts but don't have enough critical states,
    // promote some warning states to high priority
    if (high > criticalStates.length && warningStates.length > 0) {
      const additionalHighNeeded = high - criticalStates.length;
      for (let i = 0; i < Math.min(additionalHighNeeded, warningStates.length); i++) {
        alerts.push(this.createAlert(
          client,
          warningStates[i],
          'high',
          'threshold_approaching',
          `Urgent: ${warningStates[i].stateName} approaching threshold`,
          `Revenue in ${warningStates[i].stateName} is at ${Math.round((warningStates[i].currentAmount / warningStates[i].thresholdAmount) * 100)}% of nexus threshold. Action required soon.`
        ));
      }
    }
    
    // Create medium priority alerts (from warning states)
    const warningStatesForMedium = warningStates.filter(ws => 
      !alerts.some(a => a.stateCode === ws.stateCode)
    );
    
    for (let i = 0; i < Math.min(medium, warningStatesForMedium.length); i++) {
      alerts.push(this.createAlert(
        client,
        warningStatesForMedium[i],
        'medium',
        'threshold_approaching',
        `${warningStatesForMedium[i].stateName} approaching nexus threshold`,
        `Revenue in ${warningStatesForMedium[i].stateName} is at ${Math.round((warningStatesForMedium[i].currentAmount / warningStatesForMedium[i].thresholdAmount) * 100)}% of nexus threshold. Monitor closely.`
      ));
    }
    
    // If we need more medium alerts, create additional ones from remaining warning states
    if (medium > warningStatesForMedium.length && warningStates.length > 0) {
      const additionalMediumNeeded = medium - warningStatesForMedium.length;
      const remainingWarningStates = warningStates.filter(ws => 
        !alerts.some(a => a.stateCode === ws.stateCode)
      );
      
      for (let i = 0; i < Math.min(additionalMediumNeeded, remainingWarningStates.length); i++) {
        alerts.push(this.createAlert(
          client,
          remainingWarningStates[i],
          'medium',
          'threshold_approaching',
          `${remainingWarningStates[i].stateName} approaching nexus threshold`,
          `Revenue in ${remainingWarningStates[i].stateName} is at ${Math.round((remainingWarningStates[i].currentAmount / remainingWarningStates[i].thresholdAmount) * 100)}% of nexus threshold. Monitor closely.`
        ));
      }
    }
    
    // Create low priority monitoring alerts (not tied to specific states)
    // Only create if we still need low priority alerts
    const lowNeeded = low - alerts.length;
    for (let i = 0; i < lowNeeded && i < low; i++) {
      alerts.push(this.createMonitoringAlert(client, 'low'));
    }
    
    // Ensure we have exactly the allocated number (high + medium + low)
    const totalNeeded = high + medium + low;
    return alerts.slice(0, totalNeeded);
  }
  
  /**
   * Creates a nexus alert
   * Must match NexusAlert Prisma schema exactly
   */
  createAlert(client, state, priority, alertType, title, description) {
    const daysUntilDeadline = priority === 'high' ? 30 : priority === 'medium' ? 60 : 90;
    
    // Ensure stateCode is a 2-character code, not a state name
    let stateCode = state.stateCode;
    if (stateCode && stateCode.length > 2) {
      // Convert state name to code if needed
      const stateNameToCode = {
        'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR',
        'California': 'CA', 'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE',
        'Florida': 'FL', 'Georgia': 'GA', 'Hawaii': 'HI', 'Idaho': 'ID',
        'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA', 'Kansas': 'KS',
        'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
        'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS',
        'Missouri': 'MO', 'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV',
        'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY',
        'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH', 'Oklahoma': 'OK',
        'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
        'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT',
        'Vermont': 'VT', 'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV',
        'Wisconsin': 'WI', 'Wyoming': 'WY'
      };
      stateCode = stateNameToCode[stateCode] || stateCode.substring(0, 2).toUpperCase();
    }
    
    // currentAmount is required (Decimal, default 0) - cannot be null
    const currentAmount = state.currentAmount !== null && state.currentAmount !== undefined
      ? Number(state.currentAmount)
      : 0;
    
    // thresholdAmount is optional (Decimal?)
    const thresholdAmount = state.thresholdAmount !== null && state.thresholdAmount !== undefined
      ? Number(state.thresholdAmount)
      : null;
    
    // penaltyRisk is optional (Decimal?)
    const penaltyRisk = state.penaltyRisk !== null && state.penaltyRisk !== undefined
      ? Number(state.penaltyRisk)
      : null;
    
    return {
      organizationId: client.organizationId,
      clientId: client.id,
      stateCode: stateCode, // Required - must be 2-char code
      alertType,
      priority,
      severity: priority, // Map priority to severity
      status: 'open',
      title,
      description,
      thresholdAmount: thresholdAmount, // Optional
      currentAmount: currentAmount, // Required - default to 0 if not provided
      penaltyRisk: penaltyRisk, // Optional
      deadline: new Date(Date.now() + daysUntilDeadline * 24 * 60 * 60 * 1000)
      // Note: createdAt is auto-generated, metadata doesn't exist in NexusAlert schema
    };
  }
  
  /**
   * Creates a low priority monitoring alert
   */
  createMonitoringAlert(client, priority) {
    return {
      organizationId: client.organizationId,
      clientId: client.id,
      stateCode: null,
      alertType: 'nexus_monitoring',
      priority,
      status: 'open',
      title: 'Routine nexus monitoring check',
      description: `Quarterly nexus compliance review scheduled for ${client.name}. Review all state activities and revenue trends.`,
      thresholdAmount: null,
      currentAmount: null,
      excessAmount: 0,
      penaltyRisk: 0,
      deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      metadata: {
        clientName: client.name,
        monitoringType: 'quarterly_review',
        generatedAt: new Date().toISOString()
      }
    };
  }
}

module.exports = AlertGenerator;

