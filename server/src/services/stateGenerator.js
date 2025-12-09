const { 
  STATUS, 
  STATE_DISTRIBUTION, 
  LARGE_STATES, 
  MEDIUM_STATES, 
  STATE_THRESHOLDS 
} = require('../config/dataGenerationConfig');
const { calculateRevenueForStatus } = require('../utils/statusDetermination');

class StateGenerator {
  constructor(strategy = 'standard') {
    this.strategy = strategy;
    this.usedStates = new Set();
    this.compliantStateReserved = null; // Track which state code is reserved for guaranteed compliance
    this.compliantStateAssigned = false; // Track if the compliant state has been assigned
  }
  
  /**
   * Determines threshold amount based on state size
   */
  determineThresholdAmount(stateCode) {
    let range;
    
    if (LARGE_STATES.includes(stateCode)) {
      range = STATE_THRESHOLDS.LARGE;
    } else if (MEDIUM_STATES.includes(stateCode)) {
      range = STATE_THRESHOLDS.MEDIUM;
    } else {
      range = STATE_THRESHOLDS.SMALL;
    }
    
    return range.min + Math.floor(Math.random() * (range.max - range.min));
  }
  
  /**
   * Selects states for a client from priority states
   */
  selectStatesForClient(riskLevel, priorityStates, clientIndex) {
    const distribution = STATE_DISTRIBUTION[riskLevel];
    const stateCount = distribution.total;
    
    // Filter out already used states for this client
    const availableStates = priorityStates.filter(
      state => !this.usedStates.has(`${clientIndex}-${state}`)
    );
    
    // If we don't have enough available states, allow reuse
    if (availableStates.length < stateCount) {
      // Reset used states for this client and use all priority states
      priorityStates.forEach(state => {
        this.usedStates.delete(`${clientIndex}-${state}`);
      });
    }
    
    // Shuffle available states
    const shuffled = [...priorityStates].sort(() => Math.random() - 0.5);
    
    // Select states
    const selectedStates = shuffled.slice(0, stateCount);
    
    // Mark as used for this client
    selectedStates.forEach(state => {
      this.usedStates.add(`${clientIndex}-${state}`);
    });
    
    return selectedStates;
  }
  
  /**
   * Generates states for a client with proper distribution
   */
  generateStatesForClient(client, priorityStates, clientIndex) {
    const { riskLevel, id: clientId, organizationId } = client;
    const distribution = STATE_DISTRIBUTION[riskLevel];
    
    // Select states
    const selectedStates = this.selectStatesForClient(
      riskLevel, 
      priorityStates, 
      clientIndex
    );
    
    const states = [];
    const activities = [];
    let stateIndex = 0;
    
    // GUARANTEE: Ensure at least one state code is always compliant
    // Reserve the first priority state as the "always compliant" state
    if (!this.compliantStateReserved && priorityStates.length > 0) {
      this.compliantStateReserved = priorityStates[0]; // Reserve first priority state
      console.log(`✅ Reserved state "${this.compliantStateReserved}" for guaranteed compliance`);
    }
    
    // Ensure selectedStates are unique (remove duplicates)
    const uniqueSelectedStates = [...new Set(selectedStates)];
    
    // Generate compliant states (NO ALERTS)
    for (let i = 0; i < distribution.compliant; i++) {
      let stateCode = uniqueSelectedStates[stateIndex++];
      
      // GUARANTEE: If we haven't assigned the compliant state yet, use it now
      if (!this.compliantStateAssigned && this.compliantStateReserved) {
        // Check if the reserved state is in our unique selected states
        if (uniqueSelectedStates.includes(this.compliantStateReserved)) {
          // Use the reserved state for this compliant slot
          stateCode = this.compliantStateReserved;
          // Find and remove it from uniqueSelectedStates to avoid duplicate
          const reservedIndex = uniqueSelectedStates.indexOf(this.compliantStateReserved);
          if (reservedIndex !== -1) {
            uniqueSelectedStates.splice(reservedIndex, 1);
            stateIndex--; // Adjust index since we removed an item
          }
        } else {
          // Replace the current stateCode with the reserved one
          stateCode = this.compliantStateReserved;
        }
        this.compliantStateAssigned = true;
        console.log(`✅ Assigned guaranteed compliant state "${stateCode}" to client ${clientIndex + 1}`);
      }
      
      if (!stateCode) continue;
      
      // Check if we've already created a state for this client+stateCode combination
      const existingState = states.find(s => s.stateCode === stateCode);
      if (existingState) {
        console.warn(`⚠️  Skipping duplicate state ${stateCode} for client ${clientId}`);
        continue;
      }
      
      const state = this.createState(
        clientId, 
        organizationId, 
        stateCode, 
        STATUS.COMPLIANT
      );
      
      states.push(state);
      activities.push(this.createActivity(state, 'monitoring'));
    }
    
    // Generate warning states
    for (let i = 0; i < distribution.warning; i++) {
      const stateCode = uniqueSelectedStates[stateIndex++];
      if (!stateCode) continue;
      
      // Check if we've already created a state for this client+stateCode combination
      const existingState = states.find(s => s.stateCode === stateCode);
      if (existingState) {
        console.warn(`⚠️  Skipping duplicate state ${stateCode} for client ${clientId}`);
        continue;
      }
      
      const state = this.createState(
        clientId, 
        organizationId, 
        stateCode, 
        STATUS.WARNING
      );
      
      states.push(state);
      activities.push(this.createActivity(state, 'threshold_approaching'));
    }
    
    // Generate critical states
    for (let i = 0; i < distribution.critical; i++) {
      const stateCode = uniqueSelectedStates[stateIndex++];
      if (!stateCode) continue;
      
      // Check if we've already created a state for this client+stateCode combination
      const existingState = states.find(s => s.stateCode === stateCode);
      if (existingState) {
        console.warn(`⚠️  Skipping duplicate state ${stateCode} for client ${clientId}`);
        continue;
      }
      
      const state = this.createState(
        clientId, 
        organizationId, 
        stateCode, 
        STATUS.CRITICAL
      );
      
      states.push(state);
      activities.push(this.createActivity(state, 'threshold_breach'));
    }
    
    return { states, activities };
  }
  
  /**
   * Creates a single state record
   */
  createState(clientId, organizationId, stateCode, desiredStatus) {
    const thresholdAmount = this.determineThresholdAmount(stateCode);
    // Always use 'standard' strategy (qualification strategy removed)
    let currentAmount = calculateRevenueForStatus(
      desiredStatus, 
      thresholdAmount, 
      'standard'
    );
    
    // IMPORTANT: Verify and correct status based on actual revenue ratio
    // If revenue exceeds threshold, status MUST be critical, not warning
    const { determineStatus } = require('../utils/statusDetermination');
    const actualStatus = determineStatus(currentAmount, thresholdAmount, this.strategy);
    
    // If the actual status is more severe than desired, use the actual status
    // Priority: critical > warning > compliant
    let finalStatus = desiredStatus;
    if (actualStatus === STATUS.CRITICAL && desiredStatus === STATUS.WARNING) {
      // Revenue exceeded threshold, must be critical
      finalStatus = STATUS.CRITICAL;
      console.warn(`⚠️  State ${stateCode}: Revenue ${currentAmount} exceeds threshold ${thresholdAmount} (${(currentAmount/thresholdAmount*100).toFixed(1)}%), upgrading from warning to critical`);
    } else if (actualStatus === STATUS.CRITICAL && desiredStatus === STATUS.COMPLIANT) {
      // This shouldn't happen, but fix it if it does
      finalStatus = STATUS.CRITICAL;
      console.warn(`⚠️  State ${stateCode}: Revenue ${currentAmount} exceeds threshold ${thresholdAmount}, upgrading from compliant to critical`);
    } else if (actualStatus === STATUS.WARNING && desiredStatus === STATUS.COMPLIANT) {
      // Revenue is in warning range, upgrade to warning
      finalStatus = STATUS.WARNING;
    }
    
    // If we upgraded to critical, ensure revenue is above threshold
    if (finalStatus === STATUS.CRITICAL && currentAmount < thresholdAmount) {
      // Ensure it's at least at the critical threshold (always use 'standard' strategy)
      const thresholds = require('../config/dataGenerationConfig').QUALIFICATION_STRATEGIES['standard'];
      currentAmount = Math.floor(thresholdAmount * (thresholds.criticalThreshold + 0.01)); // Just above threshold
    }
    
    const excessAmount = Math.max(0, currentAmount - thresholdAmount);
    const penaltyRisk = finalStatus === STATUS.CRITICAL 
      ? Math.floor(excessAmount * 0.10) // 10% of excess
      : 0;
    
    return {
      clientId,
      organizationId,
      stateCode,
      stateName: this.getStateName(stateCode),
      status: finalStatus, // Use verified status, not desired status
      thresholdAmount,
      currentAmount,
      registrationRequired: finalStatus === STATUS.CRITICAL,
      excessAmount,
      penaltyRisk,
      lastUpdated: new Date(),
      notes: this.getStateNotes(finalStatus, stateCode, currentAmount, thresholdAmount),
      metadata: {
        qualificationStrategy: 'standard', // Always use standard (qualification strategy removed)
        generatedAt: new Date().toISOString(),
        originalDesiredStatus: desiredStatus, // Track what was originally requested
        statusUpgraded: finalStatus !== desiredStatus
      }
    };
  }
  
  /**
   * Creates activity record for a state
   * Must match NexusActivity Prisma schema:
   * - id (auto-generated)
   * - clientId (required)
   * - organizationId (required)
   * - stateCode (required) - MUST be state code, not state name
   * - activityType (required)
   * - title (required) - NEW: Required field
   * - description (optional)
   * - amount (optional Decimal)
   * - thresholdAmount (optional Decimal)
   * - status (default: "completed")
   * - metadata (optional Json)
   * - createdAt (auto-generated)
   */
  createActivity(state, activityType) {
    // Ensure stateCode is actually a code (2 chars), not a state name
    let stateCode = state.stateCode;
    if (stateCode && stateCode.length > 2) {
      // If it's a state name, try to convert it to a code
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
      console.warn(`⚠️  Converted state name "${state.stateCode}" to code "${stateCode}"`);
    }
    
    // Generate title based on activity type and state
    const stateName = this.getStateName(stateCode);
    const title = this.getActivityTitle(activityType, stateName, state);
    
    return {
      clientId: state.clientId,
      organizationId: state.organizationId,
      stateCode: stateCode, // Ensure it's a 2-char code
      activityType,
      title, // Required field
      description: this.getActivityDescription(activityType, state),
      amount: state.currentAmount || null, // Optional Decimal
      thresholdAmount: state.thresholdAmount || null, // Optional Decimal
      status: 'completed',
      metadata: {
        thresholdAmount: state.thresholdAmount,
        currentAmount: state.currentAmount
      }
    };
  }
  
  /**
   * Gets activity title (required field)
   */
  getActivityTitle(activityType, stateName, state) {
    const titles = {
      'monitoring': `Nexus Monitoring - ${stateName}`,
      'threshold_approaching': `Threshold Alert - ${stateName}`,
      'threshold_breach': `Threshold Breach - ${stateName}`,
      'compliance_check': `Compliance Check - ${stateName}`,
      'penalty_assessment': `Penalty Assessment - ${stateName}`
    };
    
    return titles[activityType] || `Nexus Activity - ${stateName}`;
  }
  
  /**
   * Gets full state name from code
   */
  getStateName(stateCode) {
    const stateNames = {
      'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas',
      'CA': 'California', 'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware',
      'FL': 'Florida', 'GA': 'Georgia', 'HI': 'Hawaii', 'ID': 'Idaho',
      'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa', 'KS': 'Kansas',
      'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
      'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi',
      'MO': 'Missouri', 'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada',
      'NH': 'New Hampshire', 'NJ': 'New Jersey', 'NM': 'New Mexico', 'NY': 'New York',
      'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio', 'OK': 'Oklahoma',
      'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
      'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah',
      'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia',
      'WI': 'Wisconsin', 'WY': 'Wyoming'
    };
    
    return stateNames[stateCode] || stateCode;
  }
  
  /**
   * Gets activity description
   */
  getActivityDescription(activityType, state) {
    const ratio = (state.currentAmount / state.thresholdAmount) * 100;
    const descriptions = {
      'monitoring': `Routine nexus monitoring for ${state.stateName} - Revenue at ${ratio.toFixed(1)}% of threshold`,
      'threshold_approaching': `Revenue approaching threshold in ${state.stateName} - currently at ${ratio.toFixed(1)}%`,
      'threshold_breach': `Nexus threshold exceeded in ${state.stateName} by $${state.excessAmount.toLocaleString()}`
    };
    
    return descriptions[activityType] || `Activity for ${state.stateName}`;
  }
  
  /**
   * Gets state notes (truncated to 255 chars for database compatibility)
   */
  getStateNotes(status, stateCode, currentAmount, thresholdAmount) {
    const ratio = (currentAmount / thresholdAmount) * 100;
    const stateName = this.getStateName(stateCode);
    
    let note;
    switch (status) {
      case STATUS.COMPLIANT:
        note = `Fully compliant - Revenue at ${ratio.toFixed(1)}% of threshold in ${stateName}`;
        break;
      case STATUS.WARNING:
        note = `Approaching threshold - Revenue at ${ratio.toFixed(1)}% of threshold in ${stateName}. Monitor closely.`;
        break;
      case STATUS.CRITICAL:
        note = `Threshold exceeded - Revenue at ${ratio.toFixed(1)}% of threshold in ${stateName}. Immediate action required.`;
        break;
      default:
        note = `Nexus monitoring for ${stateName}`;
    }
    
    // Truncate to 255 characters to ensure database compatibility
    return note.length > 255 ? note.substring(0, 252) + '...' : note;
  }
}

module.exports = StateGenerator;

