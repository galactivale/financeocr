const OpenAI = require('openai');
const { PrismaClient } = require('@prisma/client');
const { 
  TOTAL_CLIENTS, 
  RISK_DISTRIBUTION, 
  ALERT_ALLOCATION,
  RISK_LEVELS,
  TARGET_ALERTS,
  REVENUE_RANGE
} = require('../config/dataGenerationConfig');
const StateGenerator = require('./stateGenerator');
const AlertGenerator = require('./alertGenerator');
const DataValidator = require('./dataValidator');
const { sanitizeClientState, sanitizeAlert } = require('../utils/dataSanitizer');

class EnhancedDataGenerator {
  constructor(strategy = 'standard') {
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      this.openai = new OpenAI({ apiKey });
    } else {
      this.openai = null;
      console.log('⚠️ OPENAI_API_KEY not found, will use fallback data generation');
    }
    this.prisma = new PrismaClient();
    this.usedCompanyNames = new Set();
    this.usedTaxIds = new Set();
    this.usedEmails = new Set();
    
    // Initialize new services (always use 'standard' strategy)
    this.strategy = 'standard';
    this.stateGenerator = new StateGenerator('standard');
    this.alertGenerator = new AlertGenerator();
    this.dataValidator = new DataValidator();
  }

  async ensureOrganizationExists(organizationId, formData) {
    console.log('🏢 Ensuring Organization record exists:', organizationId);
    console.log('🔍 OrganizationId type:', typeof organizationId);
    console.log('🔍 OrganizationId value:', JSON.stringify(organizationId));
    
    try {
      // Check if organization already exists
      const existingOrg = await this.prisma.organization.findUnique({
        where: { id: organizationId }
      });

      if (existingOrg) {
        console.log('✅ Organization already exists:', existingOrg.name);
        
        // Organization settings update (qualification strategy removed)
        
        return existingOrg;
      }

      // Create new organization - only required fields
      const organizationData = {
        slug: `org-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
        name: formData.clientName ? `${formData.clientName} CPA Firm` : 'Demo CPA Firm'
      };

      const organization = await this.prisma.organization.create({
        data: organizationData
      });

      console.log('✅ Organization created successfully:', organization.name);
      return organization;

    } catch (error) {
      console.error('❌ Error ensuring organization exists:', error);
      throw error;
    }
  }

  async generateCompleteDashboardData(formData, organizationId, logCallback = null) {
    const log = (message) => {
      console.log(message);
      if (logCallback) logCallback(message);
    };
    
    log('🚀 Starting complete dashboard data generation...');
    log('📊 Form data received');

    try {
      // First, ensure the Organization record exists
      const organization = await this.ensureOrganizationExists(organizationId, formData);

      log('✅ OpenAI API key found, generating complete dashboard data...');

      // Always generate exactly 10 clients for demo
      const clientCount = TOTAL_CLIENTS;
      log(`📊 Generating ${clientCount} clients with complete data relationships...`);
      log(`   Strategy: standard (fixed)`);

      const generatedData = {
        clients: [],
        clientStates: [],
        nexusAlerts: [],
        nexusActivities: [],
        alerts: [],
        tasks: [],
        businessProfiles: [],
        contacts: [],
        businessLocations: [],
        revenueBreakdowns: [],
        customerDemographics: [],
        geographicDistributions: [],
        professionalDecisions: [],
        consultations: [],
        communications: [],
        documents: [],
        auditTrails: [],
        dataProcessing: [],
        decisionTables: []
      };

      // Get priority states from form data
      const priorityStates = formData.priorityStates || ['CA', 'NY', 'TX', 'FL', 'IL'];
      log(`   Priority States: ${priorityStates.join(', ')}`);

      // GUARANTEE: Reserve the first priority state to always be compliant
      // This ensures at least one state always shows as compliant on the map
      const guaranteedCompliantState = priorityStates[0];
      log(`✅ Guaranteeing state "${guaranteedCompliantState}" will always have at least one compliant client`);
      
      // Track which client will get the guaranteed compliant state
      let guaranteedCompliantAssigned = false;

      // Track alert allocation per risk level
      const riskLevelIndexes = {
        [RISK_LEVELS.CRITICAL]: 0,
        [RISK_LEVELS.HIGH]: 0,
        [RISK_LEVELS.MEDIUM]: 0,
        [RISK_LEVELS.LOW]: 0
      };

      // Generate clients with complete relationships
      for (let i = 0; i < clientCount; i++) {
        const riskLevel = RISK_DISTRIBUTION[i];
        log(`📝 Generating client ${i + 1}/${clientCount} (${riskLevel} risk)...`);
        
        try {
          const clientData = await this.generateUniqueClient(formData, i);
          
          // Ensure revenue is within limits and properly formatted as number
          let revenue = clientData.annualRevenue;
          
          // Handle string concatenation issue - if it's a string with multiple numbers, take the first valid number
          if (typeof revenue === 'string') {
            // Extract the first valid number from the string
            const numberMatch = revenue.match(/\d+/);
            if (numberMatch) {
              revenue = parseInt(numberMatch[0]);
            } else {
              revenue = REVENUE_RANGE.MIN; // Default fallback
            }
          }
          
          // Convert to number and validate
          revenue = parseFloat(revenue);
          if (isNaN(revenue) || revenue > REVENUE_RANGE.MAX) {
            console.log(`⚠️ Client ${i + 1} revenue ${clientData.annualRevenue} exceeds limit or is invalid, capping at $${REVENUE_RANGE.MAX.toLocaleString()}`);
            revenue = REVENUE_RANGE.MAX;
          }
          
          // Ensure it's a clean integer
          clientData.annualRevenue = Math.round(revenue);
          
          log(`✅ Client ${i + 1} generated: ${clientData.name}, Revenue: $${clientData.annualRevenue.toLocaleString()}`);
          
          const client = await this.createClientWithRelationships(clientData, organizationId);
          
          generatedData.clients.push(client);
          
          // Generate states for client using StateGenerator
          // GUARANTEE: Ensure the first client with compliant states gets the guaranteed compliant state
          const clientRiskLevel = RISK_DISTRIBUTION[i];
          const distribution = require('../config/dataGenerationConfig').STATE_DISTRIBUTION[clientRiskLevel];
        const hasCompliantStates = distribution.compliant > 0;
        
        let states, activities;
        
        // If this client has compliant states and we haven't assigned the guaranteed one yet, do it now
        if (hasCompliantStates && !guaranteedCompliantAssigned) {
          // Temporarily modify priority states to put guaranteed state first
          const modifiedPriorityStates = [
            guaranteedCompliantState,
            ...priorityStates.filter(s => s !== guaranteedCompliantState)
          ];
          console.log(`   🎯 Client ${i + 1} will receive guaranteed compliant state "${guaranteedCompliantState}"`);
          
          const result = this.stateGenerator.generateStatesForClient(
            client,
            modifiedPriorityStates,
            i
          );
          states = result.states;
          activities = result.activities;
          
          // Mark as assigned
          guaranteedCompliantAssigned = true;
        } else {
          // Normal generation for other clients
          const result = this.stateGenerator.generateStatesForClient(
            client,
            priorityStates,
            i
          );
          states = result.states;
          activities = result.activities;
        }
        
        // Save states to database
        for (const stateData of states) {
            // Sanitize the entire state object to ensure all fields fit database constraints
            // Only pass fields that exist in the ClientState schema
            const sanitizedStateData = sanitizeClientState({
              organizationId: stateData.organizationId,
              clientId: stateData.clientId,
              stateCode: stateData.stateCode,
              stateName: stateData.stateName,
              status: stateData.status,
              registrationRequired: stateData.registrationRequired,
              thresholdAmount: stateData.thresholdAmount,
              currentAmount: stateData.currentAmount,
              lastUpdated: stateData.lastUpdated,
              notes: stateData.notes
              // Note: excessAmount, penaltyRisk, and metadata are NOT in ClientState schema
              // They are only used for calculations, not stored in ClientState
            });
            
            // Log ALL field lengths for debugging
            console.log(`🔍 State data field analysis for ${sanitizedStateData.stateCode}:`);
            Object.keys(sanitizedStateData).forEach(key => {
              const value = sanitizedStateData[key];
              if (value !== null && value !== undefined) {
                if (typeof value === 'string') {
                  console.log(`  ${key}: ${value.length} chars - "${value.substring(0, 50)}${value.length > 50 ? '...' : ''}"`);
                  if (value.length > 200) {
                    console.error(`  ❌ ${key} is VERY LONG: ${value.length} chars!`);
                  }
                } else if (typeof value === 'number') {
                  console.log(`  ${key}: ${value} (number)`);
                } else if (value instanceof Date) {
                  console.log(`  ${key}: ${value.toISOString()} (Date)`);
                } else {
                  console.log(`  ${key}: ${typeof value} - ${JSON.stringify(value).substring(0, 50)}`);
                }
              }
            });
            
            log(`📝 Creating state: ${sanitizedStateData.stateCode} ${sanitizedStateData.stateName}`);
            
            try {
              // Check if state already exists for this client+stateCode combination
              const existingState = await this.prisma.clientState.findUnique({
                where: {
                  clientId_stateCode: {
                    clientId: sanitizedStateData.clientId,
                    stateCode: sanitizedStateData.stateCode
                  }
                }
              });
              
              if (existingState) {
                console.warn(`⚠️  State ${sanitizedStateData.stateCode} already exists for client ${sanitizedStateData.clientId}, skipping creation`);
                generatedData.clientStates.push(existingState);
                continue;
              }
              
              const clientState = await this.prisma.clientState.create({
                data: sanitizedStateData
              });
              generatedData.clientStates.push(clientState);
            } catch (error) {
              // Handle unique constraint violation gracefully
              if (error.code === 'P2002' && error.meta?.target?.includes('client_id') && error.meta?.target?.includes('state_code')) {
                console.warn(`⚠️  State ${sanitizedStateData.stateCode} already exists for client ${sanitizedStateData.clientId}, skipping creation`);
                // Try to fetch the existing state
                try {
                  const existingState = await this.prisma.clientState.findUnique({
                    where: {
                      clientId_stateCode: {
                        clientId: sanitizedStateData.clientId,
                        stateCode: sanitizedStateData.stateCode
                      }
                    }
                  });
                  if (existingState) {
                    generatedData.clientStates.push(existingState);
                  }
                } catch (fetchError) {
                  console.error('❌ Error fetching existing state:', fetchError.message);
                }
                continue; // Skip this state and continue with the next one
              }
              
              console.error('❌ Error creating client state:', error.message);
              console.error('❌ Error code:', error.code);
              console.error('❌ Full state data:', JSON.stringify(sanitizedStateData, null, 2));
              console.error('❌ Field-by-field breakdown:');
              Object.keys(sanitizedStateData).forEach(key => {
                const value = sanitizedStateData[key];
                if (typeof value === 'string') {
                  console.error(`  ${key}: ${value.length} chars`);
                }
              });
              throw error;
            }
          }
          
          // Save activities to database
          for (const activityData of activities) {
            // Ensure stateCode is a 2-character code, not a state name
            let stateCode = activityData.stateCode;
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
              console.warn(`⚠️  Activity: Converted state name "${activityData.stateCode}" to code "${stateCode}"`);
            }
            
            // Ensure title exists (required field)
            if (!activityData.title) {
              console.warn(`⚠️  Activity missing title, generating one...`);
              activityData.title = `Nexus Activity - ${stateCode}`;
            }
            
            // Only include fields that exist in NexusActivity schema
            const nexusActivity = await this.prisma.nexusActivity.create({
              data: {
                organizationId: activityData.organizationId,
                clientId: activityData.clientId,
                stateCode: stateCode, // Ensure it's a 2-char code
                activityType: activityData.activityType,
                title: activityData.title, // Required field
                description: activityData.description || null, // Optional
                amount: activityData.amount || null, // Optional Decimal
                thresholdAmount: activityData.thresholdAmount || null, // Optional Decimal
                status: activityData.status || 'completed',
                metadata: activityData.metadata || null // Optional Json
                // Note: createdAt is auto-generated, activityDate doesn't exist in schema
              }
            });
            generatedData.nexusActivities.push(nexusActivity);
          }
          
        console.log(`   ✓ Generated ${states.length} states`);
        const compliantStates = states.filter(s => s.status === 'compliant');
        const warningStates = states.filter(s => s.status === 'warning');
        const criticalStates = states.filter(s => s.status === 'critical');
        console.log(`     - Compliant: ${compliantStates.length}`);
        console.log(`     - Warning: ${warningStates.length}`);
        console.log(`     - Critical: ${criticalStates.length}`);
        
        // CREATE COMPLIANCE_CONFIRMED ALERTS for compliant states (needed for map visibility)
        // Each compliant state needs an alert to appear on the map
        for (const compliantState of compliantStates) {
          if (generatedData.nexusAlerts.length < TARGET_ALERTS.TOTAL) {
            const complianceAlert = this.alertGenerator.createAlert(
              client,
              compliantState,
              'low',
              'compliance_confirmed',
              `Compliance Confirmed - ${compliantState.stateName}`,
              `Client is fully compliant in ${compliantState.stateName}. Revenue at ${Math.round((compliantState.currentAmount / compliantState.thresholdAmount) * 100)}% of threshold.`
            );
            
            // Sanitize and save compliance alert
            const sanitizedAlertData = sanitizeAlert({
              organizationId: complianceAlert.organizationId,
              clientId: complianceAlert.clientId,
              stateCode: complianceAlert.stateCode,
              alertType: complianceAlert.alertType,
              priority: complianceAlert.priority,
              severity: complianceAlert.severity || complianceAlert.priority,
              status: complianceAlert.status,
              title: complianceAlert.title,
              description: complianceAlert.description,
              thresholdAmount: complianceAlert.thresholdAmount,
              currentAmount: complianceAlert.currentAmount,
              penaltyRisk: complianceAlert.penaltyRisk,
              deadline: complianceAlert.deadline,
              isActive: complianceAlert.isActive !== undefined ? complianceAlert.isActive : true
            });
            
            try {
              const nexusAlert = await this.prisma.nexusAlert.create({
                data: sanitizedAlertData
              });
              generatedData.nexusAlerts.push(nexusAlert);
              console.log(`   ✓ Created compliance_confirmed alert for ${compliantState.stateCode}`);
            } catch (error) {
              console.error('❌ Error creating compliance alert:', error.message);
            }
          }
        }
        
        // Get alert allocation for this client
        const riskLevelIndex = riskLevelIndexes[riskLevel];
        const allocation = ALERT_ALLOCATION[riskLevel][riskLevelIndex];
        riskLevelIndexes[riskLevel]++;
        
        // Generate alerts for client using AlertGenerator
        const clientAlerts = this.alertGenerator.generateAlertsForClient(
          client,
          states,
          allocation
        );
          
          // Calculate how many alerts we can still create
          const remainingAlertBudget = TARGET_ALERTS.TOTAL - generatedData.nexusAlerts.length;
          
          // Limit alerts to remaining budget
          const alertsToCreate = clientAlerts.slice(0, remainingAlertBudget);
          
          console.log(`   📊 Alert budget: ${remainingAlertBudget} remaining, ${alertsToCreate.length} to create`);
          
          // Save alerts to database
          for (const alertData of alertsToCreate) {
            // Double-check we haven't exceeded the limit
            if (generatedData.nexusAlerts.length >= TARGET_ALERTS.TOTAL) {
              console.log(`   ⚠️  Alert limit reached (${TARGET_ALERTS.TOTAL}), stopping alert creation`);
              break;
            }
            
            // Sanitize alert data to ensure all fields fit database constraints
            // Only pass fields that exist in NexusAlert schema
            const sanitizedAlertData = sanitizeAlert({
              organizationId: alertData.organizationId,
              clientId: alertData.clientId,
              stateCode: alertData.stateCode, // Required - must not be null
              alertType: alertData.alertType,
              priority: alertData.priority,
              severity: alertData.severity || alertData.priority, // Required field
              status: alertData.status,
              title: alertData.title,
              description: alertData.description,
              thresholdAmount: alertData.thresholdAmount,
              currentAmount: alertData.currentAmount, // Required - cannot be null
              penaltyRisk: alertData.penaltyRisk,
              deadline: alertData.deadline,
              isActive: alertData.isActive !== undefined ? alertData.isActive : true
              // Note: createdAt is auto-generated, excessAmount/metadata don't exist in schema
            });
            
            try {
              const nexusAlert = await this.prisma.nexusAlert.create({
                data: sanitizedAlertData
              });
              generatedData.nexusAlerts.push(nexusAlert);
            } catch (error) {
              console.error('❌ Error creating nexus alert:', error.message);
              console.error('❌ Alert data:', JSON.stringify(sanitizedAlertData, null, 2));
              throw error;
            }
          }
          
          console.log(`   ✓ Generated ${alertsToCreate.length} alerts (${allocation.high}H/${allocation.medium}M/${allocation.low}L) - ${generatedData.nexusAlerts.length}/${TARGET_ALERTS.TOTAL} total`);
          
          // Generate other related data (business profiles, contacts, etc.)
          await this.generateClientRelatedData(client, organizationId, generatedData, formData, organization, TARGET_ALERTS.TOTAL);
          
          log(`✅ Client ${i + 1} and related data created successfully`);
        } catch (error) {
          console.error(`❌ Error generating client ${i + 1}:`, error);
          // Fail fast on Prisma errors to avoid wasting AI credits
          if (error && (error.code?.startsWith('P') || (error.name && error.name.toLowerCase().includes('prisma')))) {
            throw error;
          }
          // Otherwise, continue with next client
          continue;
        }
      }

      console.log('\n📊 Generation complete! Validating data...');

      // Validate generated data
      const validation = this.dataValidator.validate(generatedData);
      console.log('\n' + this.dataValidator.formatValidationResult(validation));

      if (!validation.valid) {
        throw new Error(`Data validation failed:\n${validation.errors.join('\n')}`);
      }

      if (validation.warnings.length > 0) {
        console.warn('⚠️  Generation completed with warnings');
      } else {
        console.log('✅ All validation checks passed!');
      }

      return {
        success: true,
        data: generatedData,
        summary: {
          totalClients: generatedData.clients.length,
          totalRecords: Object.values(generatedData).reduce((sum, arr) => sum + arr.length, 0)
        },
        validation: validation.summary
      };

    } catch (error) {
      console.error('❌ Error generating complete dashboard data:', error);
      throw error;
    }
  }

  async generateUniqueClient(formData, index) {
    // Use predetermined risk level distribution from config
    const riskLevel = RISK_DISTRIBUTION[index] || RISK_LEVELS.MEDIUM;
    
    // Generate absolutely unique company name
    const companyName = await this.generateUniqueCompanyName(index);
    const industry = this.getRandomIndustry();
    
    // Generate unique business characteristics for diversity
    const businessTypes = ['B2B', 'B2C', 'B2B2C', 'Marketplace', 'Subscription', 'E-commerce', 'SaaS', 'Manufacturing', 'Distribution', 'Services'];
    const businessType = businessTypes[Math.floor(Math.random() * businessTypes.length)];
    
    const fundingStages = ['Bootstrapped', 'Seed', 'Series A', 'Series B', 'Series C', 'Private Equity', 'Public', 'Family Owned'];
    const fundingStage = fundingStages[Math.floor(Math.random() * fundingStages.length)];
    
    const prompt = `
Generate a COMPLETELY UNIQUE and realistic business client for a CPA firm's nexus monitoring system. This is client #${index + 1} in a portfolio of diverse businesses that the CPA firm monitors for nexus compliance.

CONTEXT: You are creating a diverse portfolio of clients for a CPA firm. Each client must be completely different from the others to provide variety in monitoring scenarios.

COMPANY REQUIREMENTS:
- Company Name: ${companyName} (must be unique and realistic)
- Industry: ${industry} (must be specific to this company type)
- Business Type: ${businessType}
- Funding Stage: ${fundingStage}
- Risk Level: ${riskLevel}
- Must be a multi-state business with nexus exposure
- Must have realistic financial data for this industry and business type
- Must have complete business profile data
- PRIORITY STATES: ${formData.priorityStates ? formData.priorityStates.join(', ') : 'Multi-state operations'} (focus business operations in these states)

RISK CHARACTERISTICS:
- Risk Level: ${riskLevel}
- Penalty Exposure: ${riskLevel === 'critical' ? '$50,000-$200,000' : riskLevel === 'high' ? '$25,000-$100,000' : riskLevel === 'medium' ? '$5,000-$25,000' : '$0-$5,000'}
- Quality Score: ${riskLevel === 'critical' ? '60-75' : riskLevel === 'high' ? '75-85' : riskLevel === 'medium' ? '85-95' : '95-100'}

DIVERSITY REQUIREMENTS:
- Create a unique business story and background
- Use different geographic locations and markets
- Vary the business model and revenue streams
- Include unique challenges and opportunities
- Make each client feel like a real, distinct business

COMPLETE DATA REQUIREMENTS:
Return JSON with ALL required fields for a complete client profile:

{
  "name": "${companyName}",
  "legalName": "Unique Legal Name LLC",
  "taxId": "XX-XXXXXXX",
  "industry": "${industry}",
  
  "employeeCount": 10-100,
    "annualRevenue": 50000-600000 (must be a clean integer, no decimals),
  "fiscalYearEnd": "2024-12-31",
  "riskLevel": "${riskLevel}",
  "penaltyExposure": 0-200000,
  "qualityScore": 60-100,
  "primaryContactName": "Realistic Name",
  "primaryContactEmail": "unique@company.com",
  "primaryContactPhone": "+1-XXX-XXX-XXXX",
  "addressLine1": "Realistic Address",
  "addressLine2": "Suite/Floor",
  "city": "Realistic City",
  "state": "US State",
  "postalCode": "XXXXX",
  "country": "US",
  "notes": "Unique business story and nexus monitoring requirements for ${industry} company",
  "tags": ["multi-state", "nexus-risk", "${riskLevel}-risk", "${businessType.toLowerCase()}", "${fundingStage.toLowerCase().replace(' ', '-')}"],
  "customFields": {
    "businessType": "${businessType}",
    "fundingStage": "${fundingStage}",
    "clientPortfolio": "CPA Firm Portfolio",
    "monitoringPriority": "${riskLevel === 'critical' ? 'High' : riskLevel === 'high' ? 'Medium' : 'Standard'}"
  },
  "businessProfile": {
    "legalName": "Legal Name LLC",
    "dbaName": "DBA Name",
    "entityType": "LLC/C-Corp/S-Corp",
    "formationDate": "YYYY-MM-DD",
    "federalEin": "XX-XXXXXXX",
    "primaryIndustry": "${industry}",
    "naicsCode": "XXXXXX",
    "businessModel": "${businessType}",
    "marketFocus": "Unique target market for ${industry}",
    "revenueGrowthYoy": 5.0-25.0,
    "fundingStage": "${fundingStage}"
  },
  "contacts": [
    {
      "name": "Unique Contact Name",
      "title": "CEO/CFO/CTO/COO/VP",
      "email": "contact@company.com",
      "phone": "+1-XXX-XXX-XXXX",
      "mobile": "+1-XXX-XXX-XXXX",
      "role": "Primary Contact",
      "specialization": "Finance/Operations/Technology/Sales",
      "notes": "Primary contact for ${industry} ${businessType} business"
    },
    {
      "name": "Secondary Contact Name",
      "title": "Controller/Manager/Director",
      "email": "secondary@company.com",
      "phone": "+1-XXX-XXX-XXXX",
      "mobile": "+1-XXX-XXX-XXXX",
      "role": "Secondary Contact",
      "specialization": "Accounting/Compliance/Operations",
      "notes": "Secondary contact for nexus monitoring"
    }
  ],
  "businessLocations": [
    {
      "type": "Headquarters",
      "address": "Primary Business Address",
      "city": "Primary City",
      "state": "${formData.priorityStates && formData.priorityStates.length > 0 ? formData.priorityStates[0] : 'Primary State'}",
      "postalCode": "XXXXX",
      "country": "US",
      "propertyType": "Owned/Leased",
      "employeeCount": 10-50,
      "nexusRelevant": true
    }${formData.priorityStates && formData.priorityStates.length > 1 ? `,
    {
      "type": "Branch/Warehouse/Office",
      "address": "Secondary Business Address",
      "city": "Secondary City",
      "state": "${formData.priorityStates[1]}",
      "postalCode": "XXXXX",
      "country": "US",
      "propertyType": "Leased",
      "employeeCount": 5-25,
      "nexusRelevant": true
    }` : ''}${formData.priorityStates && formData.priorityStates.length > 2 ? `,
    {
      "type": "Regional Office",
      "address": "Regional Business Address",
      "city": "Regional City",
      "state": "${formData.priorityStates[2]}",
      "postalCode": "XXXXX",
      "country": "US",
      "propertyType": "Leased",
      "employeeCount": 3-15,
      "nexusRelevant": true
    }` : ''}
  ],
  "revenueBreakdowns": [
    {
      "category": "${businessType === 'SaaS' ? 'Subscription Revenue' : businessType === 'E-commerce' ? 'Product Sales' : businessType === 'Services' ? 'Service Revenue' : 'Primary Revenue'}",
      "amount": 30000-400000 (must be clean integer),
      "percentage": 60.0-80.0
    },
    {
      "category": "${businessType === 'SaaS' ? 'Professional Services' : businessType === 'E-commerce' ? 'Shipping & Handling' : businessType === 'Services' ? 'Consulting' : 'Secondary Revenue'}",
      "amount": 10000-150000 (must be clean integer),
      "percentage": 15.0-30.0
    },
    {
      "category": "${businessType === 'SaaS' ? 'Training & Support' : businessType === 'E-commerce' ? 'Marketplace Fees' : businessType === 'Services' ? 'Licensing' : 'Other Revenue'}",
      "amount": 5000-50000 (must be clean integer),
      "percentage": 5.0-15.0
    }
  ],
  "customerDemographics": {
    "totalActiveCustomers": "${businessType === 'B2B' ? '20-200' : businessType === 'B2C' ? '500-5000' : businessType === 'SaaS' ? '50-1000' : '50-2000'}",
    "averageContractValue": "${businessType === 'B2B' ? '5000-50000' : businessType === 'B2C' ? '50-500' : businessType === 'SaaS' ? '200-2500' : '500-15000'}",
    "customerRetentionRate": "${businessType === 'SaaS' ? '85.0-95.0' : businessType === 'B2B' ? '80.0-90.0' : '70.0-85.0'}",
    "monthlyRecurringRevenue": "${businessType === 'SaaS' ? '5000-50000' : businessType === 'Subscription' ? '3000-30000' : '1000-20000'}"
  },
  "geographicDistributions": [
    ${formData.priorityStates && formData.priorityStates.length > 0 ? 
      formData.priorityStates.map((state, index) => {
        const stateCode = state.length === 2 ? state : 
          {'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR', 'California': 'CA', 'Colorado': 'CO',
           'Connecticut': 'CT', 'Delaware': 'DE', 'Florida': 'FL', 'Georgia': 'GA', 'Hawaii': 'HI', 'Idaho': 'ID',
           'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA', 'Kansas': 'KS', 'Kentucky': 'KY', 'Louisiana': 'LA',
           'Maine': 'ME', 'Maryland': 'MD', 'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS',
           'Missouri': 'MO', 'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ',
           'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH', 'Oklahoma': 'OK',
           'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC', 'South Dakota': 'SD',
           'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT', 'Vermont': 'VT', 'Virginia': 'VA', 'Washington': 'WA',
           'West Virginia': 'WV', 'Wisconsin': 'WI', 'Wyoming': 'WY'}[state] || state;
        const percentage = index === 0 ? '20.0-35.0' : index === 1 ? '15.0-25.0' : index === 2 ? '10.0-20.0' : '5.0-15.0';
        const customerCount = index === 0 ? '15-150' : index === 1 ? '10-100' : index === 2 ? '8-80' : '5-50';
        return `{
      "stateCode": "${stateCode}",
      "customerCount": ${customerCount},
      "percentage": ${percentage}
    }`;
      }).join(',\n    ') :
      `{
      "stateCode": "CA",
      "customerCount": 10-100,
      "percentage": 15.0-25.0
    },
    {
      "stateCode": "TX",
      "customerCount": 8-80,
      "percentage": 12.0-20.0
    },
    {
      "stateCode": "NY",
      "customerCount": 6-60,
      "percentage": 10.0-18.0
    },
    {
      "stateCode": "FL",
      "customerCount": 5-50,
      "percentage": 8.0-15.0
    },
    {
      "stateCode": "IL",
      "customerCount": 4-40,
      "percentage": 6.0-12.0
    },
    {
      "stateCode": "WA",
      "customerCount": 3-30,
      "percentage": 5.0-10.0
    }`
    }
  ]
}

IMPORTANT: 
- This is for a CPA firm's client portfolio - create a realistic business that would need nexus monitoring
- Make this company completely unique with realistic data that matches the industry, business type, and risk level
- Do not reuse any company names, tax IDs, or email addresses from previous generations
- Each client should feel like a distinct business with unique challenges and opportunities
- Focus on creating diverse scenarios for the CPA firm to monitor across different industries and business models
- CRITICAL: Annual revenue MUST be between $50,000 and $600,000 - do not exceed $600,000 under any circumstances
- CRITICAL: All numeric values (annualRevenue, employeeCount, etc.) must be clean integers with no decimal places
- CRITICAL: Do NOT concatenate multiple numbers together - each field should contain only ONE number
- CRITICAL: annualRevenue should be a single integer like 150000, NOT multiple numbers like 150000250000350000
- CRITICAL: Focus business operations and geographic distributions on the PRIORITY STATES: ${formData.priorityStates ? formData.priorityStates.join(', ') : 'Multi-state operations'}
- CRITICAL: The business should have significant operations, customers, or revenue in the priority states to create realistic nexus monitoring scenarios
`;

    // If OpenAI is not available, use fallback data
    if (!this.openai) {
      console.log('⚠️ OpenAI not available, using fallback client data');
      return this.getFallbackClientData(index, riskLevel, companyName, industry);
    }

    try {
      // Retry OpenAI once on rate limits
      let result;
      try {
        result = await this.openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant that generates realistic business client data for CPA firms. Always respond with valid JSON only."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 4000,
          response_format: { type: "json_object" }
        });
      } catch (e) {
        if (e && (e.status === 429 || e.code === 'rate_limit_exceeded')) {
          await new Promise(r => setTimeout(r, 1000));
          result = await this.openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: "You are a helpful assistant that generates realistic business client data for CPA firms. Always respond with valid JSON only."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            temperature: 0.7,
            max_tokens: 4000,
            response_format: { type: "json_object" }
          });
        } else {
          throw e;
        }
      }
      const text = result.choices[0].message.content;
      
      // Parse JSON from response (OpenAI returns JSON directly when response_format is json_object)
      let clientData;
      try {
        clientData = JSON.parse(text);
      } catch (parseError) {
        // Fallback: try to extract JSON if not directly parseable
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          clientData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No valid JSON found in AI response');
        }
      }
      
      if (clientData) {
        
        // Ensure uniqueness
        clientData.name = companyName;
        clientData.taxId = this.generateUniqueTaxId();
        clientData.primaryContactEmail = this.generateUniqueEmail(companyName);
        
        if (clientData.businessProfile) {
          clientData.businessProfile.federalEin = this.generateUniqueTaxId();
        }
        
        if (clientData.contacts && clientData.contacts.length > 0) {
          clientData.contacts[0].email = clientData.primaryContactEmail;
        }
        
        return clientData;
      } else {
        throw new Error('No valid JSON found in AI response');
      }
    } catch (error) {
      console.error('❌ Error generating AI client data:', error);
      return this.getFallbackClientData(index, riskLevel, companyName, industry);
    }
  }

  async generateUniqueCompanyName(index) {
    const baseNames = [
      'TechCorp', 'DataFlow', 'CloudSync', 'InnovateLab', 'DigitalEdge', 'NextGen', 'FutureTech', 'SmartSolutions',
      'AlphaSystems', 'BetaWorks', 'GammaTech', 'DeltaData', 'EpsilonSoft', 'ZetaCorp', 'EtaInnovations', 'ThetaLabs',
      'IotaTech', 'KappaSystems', 'LambdaSoft', 'MuCorp', 'NuSolutions', 'XiTech', 'OmicronData', 'PiInnovations',
      'RhoSystems', 'SigmaWorks', 'TauTech', 'UpsilonCorp', 'PhiSolutions', 'ChiInnovations', 'PsiLabs', 'OmegaTech',
      'QuantumCore', 'NexusTech', 'VertexSoft', 'ApexData', 'PrimeSystems', 'EliteWorks', 'ProTech', 'MegaCorp',
      'UltraSoft', 'SuperData', 'HyperTech', 'MetaSystems', 'CyberWorks', 'NeoCorp', 'ProtoTech', 'GenesisSoft',
      'BlueWave', 'GreenTech', 'RedStone', 'SilverLine', 'GoldGate', 'PlatinumCore', 'DiamondEdge', 'CrystalSoft',
      'Sunrise', 'Sunset', 'Moonlight', 'Starlight', 'Thunder', 'Lightning', 'Storm', 'Rainbow', 'Aurora', 'Nebula'
    ];
    
    const suffixes = ['Inc', 'LLC', 'Corp', 'Ltd', 'Group', 'Partners', 'Associates', 'Enterprises', 'Solutions', 'Technologies'];
    const adjectives = ['Advanced', 'Premier', 'Elite', 'Professional', 'Strategic', 'Dynamic', 'Innovative', 'Creative', 'Modern', 'Global'];
    
    let attempts = 0;
    let companyName;
    
    do {
      const baseName = baseNames[index % baseNames.length];
      const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
      const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
      
      // Create variations without numbers
      const variations = [
        `${baseName} ${suffix}`,
        `${adjective} ${baseName} ${suffix}`,
        `${baseName} ${adjective} ${suffix}`,
        `${baseName} & ${suffix}`,
        `${baseName} ${suffix} Group`
      ];
      
      companyName = variations[Math.floor(Math.random() * variations.length)];
      attempts++;
      
      if (attempts > 100) {
        companyName = `${baseName} ${suffix} ${Date.now().toString().slice(-4)}`;
        break;
      }
    } while (this.usedCompanyNames.has(companyName));
    
    this.usedCompanyNames.add(companyName);
    return companyName;
  }

  generateUniqueTaxId() {
    let taxId;
    do {
      taxId = `${Math.floor(Math.random() * 90) + 10}-${Math.floor(Math.random() * 9000000) + 1000000}`;
    } while (this.usedTaxIds.has(taxId));
    
    this.usedTaxIds.add(taxId);
    return taxId;
  }

  generateUniqueEmail(companyName) {
    const domains = ['com', 'net', 'org', 'io', 'co', 'tech', 'solutions', 'systems'];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    
    let email;
    do {
      const variation = Math.floor(Math.random() * 1000);
      email = `contact${variation}@${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.${domain}`;
    } while (this.usedEmails.has(email));
    
    this.usedEmails.add(email);
    return email;
  }

  getRandomIndustry() {
    const industries = [
      'Technology', 'Software Development', 'E-commerce', 'SaaS', 'Fintech', 'HealthTech', 'EdTech', 'RetailTech',
      'Manufacturing', 'Logistics', 'Consulting', 'Marketing', 'Real Estate', 'Healthcare', 'Education', 'Financial Services',
      'Media & Entertainment', 'Gaming', 'Cybersecurity', 'AI/ML', 'Blockchain', 'IoT', 'Cloud Computing', 'Data Analytics'
    ];
    return industries[Math.floor(Math.random() * industries.length)];
  }

  generateClientStateStatus(currentAmount, thresholdAmount, riskLevel) {
    // Use the new status determination utility (always uses 'standard' strategy)
    const { determineStatus } = require('../utils/statusDetermination');
    return determineStatus(currentAmount, thresholdAmount, 'standard');
  }

  cleanRevenueValue(revenue) {
    // Handle string concatenation issue - if it's a string with multiple numbers, take the first valid number
    if (typeof revenue === 'string') {
      // Extract the first valid number from the string
      const numberMatch = revenue.match(/\d+/);
      if (numberMatch) {
        const cleanValue = parseInt(numberMatch[0]);
        // Ensure it's within limits
        return Math.min(Math.max(cleanValue, 50000), 600000);
      } else {
        return 50000; // Default fallback
      }
    }
    
    // If it's already a number, validate and clean it
    const numValue = parseFloat(revenue);
    if (isNaN(numValue)) {
      return 50000; // Default fallback
    }
    
    // Ensure it's within limits and is a clean integer
    return Math.round(Math.min(Math.max(numValue, 50000), 600000));
  }

  async createClientWithRelationships(clientData, organizationId) {
    // Ensure all numeric fields are clean integers
    const cleanClientData = {
      ...clientData,
      employeeCount: parseInt(clientData.employeeCount),
      annualRevenue: this.cleanRevenueValue(clientData.annualRevenue),
      penaltyExposure: parseFloat(clientData.penaltyExposure),
      qualityScore: parseInt(clientData.qualityScore)
    };
    
    // Create client
    const client = await this.prisma.client.create({
      data: {
        organizationId,
        name: cleanClientData.name,
        slug: this.generateSlug(cleanClientData.name),
        legalName: cleanClientData.legalName,
        taxId: cleanClientData.taxId,
        industry: cleanClientData.industry,
        employeeCount: cleanClientData.employeeCount,
        annualRevenue: cleanClientData.annualRevenue,
        fiscalYearEnd: new Date(cleanClientData.fiscalYearEnd),
        riskLevel: cleanClientData.riskLevel,
        penaltyExposure: cleanClientData.penaltyExposure,
        qualityScore: cleanClientData.qualityScore,
        primaryContactName: cleanClientData.primaryContactName,
        primaryContactEmail: cleanClientData.primaryContactEmail,
        primaryContactPhone: cleanClientData.primaryContactPhone,
        addressLine1: cleanClientData.addressLine1,
        addressLine2: cleanClientData.addressLine2,
        city: cleanClientData.city,
        state: cleanClientData.state,
        postalCode: cleanClientData.postalCode,
        country: cleanClientData.country || 'US',
        status: 'active',
        notes: cleanClientData.notes,
        tags: cleanClientData.tags,
        customFields: cleanClientData.customFields,
        assignedSince: new Date(),
        lastReview: new Date(),
        nextReview: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      },
    });

    return client;
  }

  async generateClientRelatedData(client, organizationId, generatedData, formData, organization = null, maxAlerts = 20) {
    // Create business profile
    if (client.businessProfile) {
      const businessProfile = await this.prisma.businessProfile.create({
        data: {
          organizationId,
          clientId: client.id,
          legalName: client.businessProfile.legalName,
          dbaName: client.businessProfile.dbaName,
          entityType: client.businessProfile.entityType,
          formationDate: new Date(client.businessProfile.formationDate),
          federalEin: client.businessProfile.federalEin,
          primaryIndustry: client.businessProfile.primaryIndustry,
          naicsCode: client.businessProfile.naicsCode,
          businessModel: client.businessProfile.businessModel,
          marketFocus: client.businessProfile.marketFocus,
          revenueGrowthYoy: client.businessProfile.revenueGrowthYoy,
          fundingStage: client.businessProfile.fundingStage,
        },
      });
      generatedData.businessProfiles.push(businessProfile);
    }

    // Create contacts
    if (client.contacts && client.contacts.length > 0) {
      for (const contactData of client.contacts) {
        const contact = await this.prisma.contact.create({
          data: {
            organizationId,
            clientId: client.id,
            name: contactData.name,
            title: contactData.title,
            email: contactData.email,
            phone: contactData.phone,
            mobile: contactData.mobile,
            role: contactData.role,
            specialization: contactData.specialization,
            notes: contactData.notes,
          },
        });
        generatedData.contacts.push(contact);
      }
    }

    // Create business locations
    if (client.businessLocations && client.businessLocations.length > 0) {
      for (const locationData of client.businessLocations) {
        const location = await this.prisma.businessLocation.create({
          data: {
            organizationId,
            clientId: client.id,
            type: locationData.type,
            address: locationData.address,
            city: locationData.city,
            state: locationData.state,
            postalCode: locationData.postalCode,
            country: locationData.country || 'US',
            propertyType: locationData.propertyType,
            employeeCount: locationData.employeeCount,
            nexusRelevant: locationData.nexusRelevant,
          },
        });
        generatedData.businessLocations.push(location);
      }
    }

    // Create revenue breakdowns
    if (client.revenueBreakdowns && client.revenueBreakdowns.length > 0) {
      for (const breakdownData of client.revenueBreakdowns) {
        const breakdown = await this.prisma.revenueBreakdown.create({
          data: {
            organizationId,
            clientId: client.id,
            category: breakdownData.category,
            amount: parseInt(breakdownData.amount), // Ensure clean integer
            percentage: parseFloat(breakdownData.percentage), // Keep as float for percentage
          },
        });
        generatedData.revenueBreakdowns.push(breakdown);
      }
    }

    // Create customer demographics
    if (client.customerDemographics) {
      const demographics = await this.prisma.customerDemographics.create({
        data: {
          organizationId,
          clientId: client.id,
          totalActiveCustomers: parseInt(client.customerDemographics.totalActiveCustomers),
          averageContractValue: parseFloat(client.customerDemographics.averageContractValue),
          customerRetentionRate: parseFloat(client.customerDemographics.customerRetentionRate),
          monthlyRecurringRevenue: parseFloat(client.customerDemographics.monthlyRecurringRevenue),
        },
      });
      generatedData.customerDemographics.push(demographics);
    }

    // Create geographic distributions
    if (client.geographicDistributions && client.geographicDistributions.length > 0) {
      for (const geoData of client.geographicDistributions) {
        const distribution = await this.prisma.geographicDistribution.create({
          data: {
            organizationId,
            clientId: client.id,
            stateCode: geoData.stateCode,
            customerCount: geoData.customerCount,
            percentage: geoData.percentage,
          },
        });
        generatedData.geographicDistributions.push(distribution);
      }
    }

    // Nexus monitoring data (states and alerts) is now generated in the main loop
    // using StateGenerator and AlertGenerator services
    // This method only handles business profiles, contacts, locations, etc.

    // CHANGE: Add low priority "monitoring" alerts for medium/low risk clients (only if under limit)
    if (['medium', 'low'].includes(client.riskLevel) && generatedData.nexusAlerts.length < 20) {
      // Create 1 low priority monitoring alert per medium/low risk client
      const monitoringAlert = await this.prisma.nexusAlert.create({
        data: {
          organizationId,
          clientId: client.id,
          stateCode: 'CA', // Use a common state for monitoring alerts
          alertType: 'nexus_monitoring',
          priority: 'low',
          status: 'open',
          title: `${client.name} - Routine Nexus Monitoring Check`,
          description: `Regular monitoring for ${client.name} nexus compliance. Scheduled routine check.`,
          thresholdAmount: 500000,
          currentAmount: 0,
          penaltyRisk: 0,
          deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
        },
      });
      generatedData.nexusAlerts.push(monitoringAlert);
    }

    // Generate alerts and tasks
    await this.generateAlertsAndTasks(client, organizationId, generatedData);

    // Generate professional decisions
    await this.generateProfessionalDecisions(client, organizationId, generatedData);

    // Generate decision table entries
    await this.generateDecisionTableEntries(client, organizationId, generatedData);

    // Generate audit trail
    await this.generateAuditTrail(client, organizationId, generatedData);
  }

  // Helper function: Determine state count based on risk level (3-5 states)
  determineStateCount(riskLevel) {
    const stateCountMap = {
      'critical': 4 + Math.floor(Math.random() * 2), // 4-5 states
      'high': 4 + Math.floor(Math.random() * 2),     // 4-5 states
      'medium': 3 + Math.floor(Math.random() * 2),   // 3-4 states
      'low': 3 + Math.floor(Math.random() * 2)       // 3-4 states
    };
    
    return stateCountMap[riskLevel] || 4; // Default to 4 if unknown
  }

  // Helper function: Calculate state distribution to achieve 40/40/20 split
  calculateStateDistribution(riskLevel, totalStates) {
    const distributions = {
      'critical': {
        // For 4-5 states: 1-2 compliant, 2 warning, 1-2 critical
        compliant: Math.max(1, Math.floor(totalStates * 0.30)),
        warning: 2,
        critical: Math.min(2, Math.ceil(totalStates * 0.40))
      },
      'high': {
        // For 4-5 states: 2 compliant, 2 warning, 0-1 critical
        compliant: 2,
        warning: 2,
        critical: Math.random() > 0.5 ? 1 : 0
      },
      'medium': {
        // For 3-4 states: 2-3 compliant, 1-2 warning, 0 critical
        compliant: Math.ceil(totalStates * 0.60),
        warning: Math.floor(totalStates * 0.40),
        critical: 0
      },
      'low': {
        // For 3-4 states: 2-3 compliant, 1 warning, 0 critical
        compliant: Math.ceil(totalStates * 0.70),
        warning: Math.floor(totalStates * 0.30),
        critical: 0
      }
    };
    
    const distribution = distributions[riskLevel] || distributions['medium'];
    
    // Ensure total matches
    const total = distribution.compliant + distribution.warning + distribution.critical;
    if (total < totalStates) {
      distribution.compliant += (totalStates - total);
    } else if (total > totalStates) {
      distribution.compliant = Math.max(1, distribution.compliant - (total - totalStates));
    }
    
    return distribution;
  }

  // Helper function: Determine if warning state should create alert
  shouldCreateWarningAlert(client, warningStateIndex) {
    const alertPlan = {
      'critical': {
        // 2 alerts: 1 high (from critical state), 1 medium (from warning)
        warningAlerts: 1,
        createOnIndex: [0] // First warning state gets an alert
      },
      'high': {
        // 2 alerts: 0-1 high (from critical if exists), 1-2 medium (from warnings)
        warningAlerts: 2,
        createOnIndex: [0, 1] // First two warning states get alerts
      },
      'medium': {
        // 2 alerts: 0 high, 1 medium (warning), 1 low (monitoring)
        warningAlerts: 1,
        createOnIndex: [0] // First warning state gets an alert
      },
      'low': {
        // 2 alerts: 0 high, 1 medium (warning), 1 low (monitoring)
        warningAlerts: 1,
        createOnIndex: [0] // First warning state gets an alert
      }
    };
    
    const plan = alertPlan[client.riskLevel] || alertPlan['medium'];
    return plan.createOnIndex.includes(warningStateIndex);
  }

  // DEPRECATED: This method is replaced by StateGenerator and AlertGenerator in the main loop
  // Keeping for backward compatibility only - should not be called in new code
  async generateNexusMonitoringData(client, organizationId, generatedData, formData, organization = null, maxAlerts = 20) {
    console.warn('⚠️ generateNexusMonitoringData is deprecated. States and alerts are now generated in the main loop using StateGenerator and AlertGenerator.');
    // This method is intentionally left empty - all logic moved to main generation loop
    return;
  }
  
  // Legacy implementation - kept for reference only
  async generateNexusMonitoringData_LEGACY(client, organizationId, generatedData, formData, organization = null, maxAlerts = 20) {
    // Use Priority States from the form data, or fall back to all US states
    const priorityStates = formData.priorityStates || [];
    
    // Convert state names to state codes if needed
    const stateCodeMap = {
      'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR', 'California': 'CA', 'Colorado': 'CO',
      'Connecticut': 'CT', 'Delaware': 'DE', 'Florida': 'FL', 'Georgia': 'GA', 'Hawaii': 'HI', 'Idaho': 'ID',
      'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA', 'Kansas': 'KS', 'Kentucky': 'KY', 'Louisiana': 'LA',
      'Maine': 'ME', 'Maryland': 'MD', 'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS',
      'Missouri': 'MO', 'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ',
      'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH', 'Oklahoma': 'OK',
      'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC', 'South Dakota': 'SD',
      'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT', 'Vermont': 'VT', 'Virginia': 'VA', 'Washington': 'WA',
      'West Virginia': 'WV', 'Wisconsin': 'WI', 'Wyoming': 'WY'
    };
    
    // Convert state names to codes, or use as-is if already codes
    const availableStates = priorityStates.length > 0 
      ? priorityStates.map(state => stateCodeMap[state] || state)
      : ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 
          'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
          'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
          'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
          'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];
    
    // Always use 'standard' strategy (qualification strategy removed)
    const strategy = require('../config/dataGenerationConfig').QUALIFICATION_STRATEGIES['standard'];
    const riskLevel = client.riskLevel || 'medium';
    
    // CHANGE 1: Reduce state count based on risk level (3-5 states instead of 5-8)
    const totalStates = this.determineStateCount(riskLevel);
    
    // CHANGE 2: Calculate state distribution to achieve 40/40/20 split
    const stateDistribution = this.calculateStateDistribution(riskLevel, totalStates);
    
    const numCompliantStates = stateDistribution.compliant;
    const numWarningStates = stateDistribution.warning;
    const numCriticalStates = stateDistribution.critical;
    
    console.log(`📊 State allocation for ${client.name} (${riskLevel} risk): ${numCompliantStates} compliant, ${numWarningStates} warning, ${numCriticalStates} critical`);
    
    // STEP 2: Select States Randomly
    const shuffledStates = [...availableStates].sort(() => Math.random() - 0.5);
    
    const compliantStates = shuffledStates.slice(0, numCompliantStates);
    const warningStates = shuffledStates.slice(numCompliantStates, numCompliantStates + numWarningStates);
    const criticalStates = shuffledStates.slice(numCompliantStates + numWarningStates, numCompliantStates + numWarningStates + numCriticalStates);
    
    // Helper function to determine threshold amount
    const determineThresholdAmount = (stateCode) => {
      if (['CA', 'NY', 'TX'].includes(stateCode)) {
        return 500000 + Math.floor(Math.random() * 500000); // $500K-$1M
      } else if (['FL', 'IL', 'PA', 'OH'].includes(stateCode)) {
        return 200000 + Math.floor(Math.random() * 300000); // $200K-$500K
      } else {
        return 100000 + Math.floor(Math.random() * 200000); // $100K-$300K
      }
    };
    
    // STEP 3: Generate Compliant States (Green - 10% threshold, NO alerts)
    for (const stateCode of compliantStates) {
      const thresholdAmount = determineThresholdAmount(stateCode);
      const complianceRatio = 0.10; // Fixed at exactly 10% of threshold
      const currentAmount = Math.floor(thresholdAmount * complianceRatio);

      const clientState = await this.prisma.clientState.create({
        data: {
          organizationId,
          clientId: client.id,
          stateCode,
          stateName: this.getStateName(stateCode),
          status: 'compliant',
          registrationRequired: false,
          thresholdAmount,
          currentAmount,
          lastUpdated: new Date(),
          notes: `Fully compliant - Revenue at ${(complianceRatio * 100).toFixed(1)}% of threshold`,
        },
      });
      generatedData.clientStates.push(clientState);
      
      // CREATE COMPLIANCE_CONFIRMED ALERT for compliant states (needed for map visibility)
      // Only create if we haven't hit the alert limit
      if (generatedData.nexusAlerts.length < maxAlerts) {
        const complianceAlert = await this.prisma.nexusAlert.create({
          data: {
            organizationId,
            clientId: client.id,
            stateCode,
            alertType: 'compliance_confirmed',
            priority: 'low',
            status: 'open',
            title: `${client.name} - ${stateCode} Compliance Confirmed`,
            description: `${client.industry} company is fully compliant in ${stateCode}. Current revenue: $${currentAmount.toLocaleString()}, Threshold: $${thresholdAmount.toLocaleString()} (${(complianceRatio * 100).toFixed(1)}%)`,
            thresholdAmount,
            currentAmount,
            penaltyRisk: 0, // No penalty for compliant states
            deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year (routine monitoring)
          },
        });
        generatedData.nexusAlerts.push(complianceAlert);
      }
      
      // Create nexus activity
      const nexusActivity = await this.prisma.nexusActivity.create({
        data: {
          organizationId,
          clientId: client.id,
          stateCode,
          activityType: 'compliance_check',
          title: `${client.name} - Compliance Check for ${stateCode}`,
          description: `Compliance check for ${client.industry} company in ${stateCode}. Status: Compliant`,
          amount: currentAmount,
          thresholdAmount,
          status: 'completed',
          metadata: {
            source: 'automated_tracking',
            updateType: 'monthly_review',
            clientIndustry: client.industry,
            businessType: client.customFields?.businessType || 'B2B',
            riskLevel: client.riskLevel
          },
        },
      });
      generatedData.nexusActivities.push(nexusActivity);
    }
    
    // STEP 4: Generate Warning States (Orange - Between alert and critical thresholds, Selective Medium alerts)
    for (let i = 0; i < warningStates.length; i++) {
      const stateCode = warningStates[i];
      const thresholdAmount = determineThresholdAmount(stateCode);
      // Generate ratio between alert threshold and critical threshold
      const minRatio = strategy.alertThreshold;
      const maxRatio = strategy.criticalThreshold - 0.01; // Just below critical
      const warningRatio = minRatio + Math.random() * (maxRatio - minRatio);
      const currentAmount = Math.floor(thresholdAmount * warningRatio);

      const clientState = await this.prisma.clientState.create({
        data: {
          organizationId,
          clientId: client.id,
          stateCode,
          stateName: this.getStateName(stateCode),
          status: 'warning',
          registrationRequired: false,
          thresholdAmount,
          currentAmount,
          lastUpdated: new Date(),
          notes: `Approaching threshold - Revenue at ${(warningRatio * 100).toFixed(1)}% of threshold`,
        },
      });
      generatedData.clientStates.push(clientState);
      
      // CHANGE 4: Only create alert if this client needs warning alerts AND we haven't hit the limit
      if (this.shouldCreateWarningAlert(client, i) && generatedData.nexusAlerts.length < maxAlerts) {
        const nexusAlert = await this.prisma.nexusAlert.create({
          data: {
            organizationId,
            clientId: client.id,
            stateCode,
            alertType: 'threshold_approaching',
            priority: 'medium',
            status: 'open',
            title: `${client.name} - ${stateCode} Nexus Threshold Approaching`,
            description: `${client.industry} company is approaching the economic nexus threshold in ${stateCode}. Current revenue: $${currentAmount.toLocaleString()}, Threshold: $${thresholdAmount.toLocaleString()} (${(warningRatio * 100).toFixed(1)}%)`,
            thresholdAmount,
            currentAmount,
            penaltyRisk: 0, // No penalty yet
            deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
          },
        });
        generatedData.nexusAlerts.push(nexusAlert);
      }
      
      // Create nexus activity
      const nexusActivity = await this.prisma.nexusActivity.create({
        data: {
          organizationId,
          clientId: client.id,
          stateCode,
          activityType: 'threshold_monitoring',
          title: `${client.name} - Threshold Alert for ${stateCode}`,
          description: `Threshold approaching alert for ${client.industry} company in ${stateCode}. Status: Warning`,
          amount: currentAmount,
          thresholdAmount,
          status: 'completed',
          metadata: {
            source: 'automated_tracking',
            updateType: 'monthly_review',
            clientIndustry: client.industry,
            businessType: client.customFields?.businessType || 'B2B',
            riskLevel: client.riskLevel
          },
        },
      });
      generatedData.nexusActivities.push(nexusActivity);
    }
    
    // STEP 5: Generate Critical States (Red - Exceeds critical threshold, High alerts)
    for (const stateCode of criticalStates) {
      const thresholdAmount = determineThresholdAmount(stateCode);
      // Generate ratio above critical threshold (100-150% of threshold)
      const criticalRatio = strategy.criticalThreshold + Math.random() * 0.5; // Critical threshold to 50% over
      const currentAmount = Math.floor(thresholdAmount * criticalRatio);
      const excessAmount = currentAmount - thresholdAmount;
      const penaltyRisk = Math.floor(excessAmount * 0.1); // 10% of excess

      const clientState = await this.prisma.clientState.create({
        data: {
          organizationId,
          clientId: client.id,
          stateCode,
          stateName: this.getStateName(stateCode),
          status: 'critical',
          registrationRequired: true,
          thresholdAmount,
          currentAmount,
          lastUpdated: new Date(),
          notes: `THRESHOLD EXCEEDED - Revenue at ${(criticalRatio * 100).toFixed(1)}% of threshold. Immediate action required.`,
        },
      });
      generatedData.clientStates.push(clientState);
      
      // CREATE HIGH PRIORITY ALERT (only if we haven't hit the limit)
      if (generatedData.nexusAlerts.length < maxAlerts) {
        const nexusAlert = await this.prisma.nexusAlert.create({
        data: {
          organizationId,
          clientId: client.id,
          stateCode,
          alertType: 'threshold_breach',
          priority: 'high',
          status: 'open',
          title: `${client.name} - ${stateCode} Nexus Threshold EXCEEDED`,
          description: `${client.industry} company has EXCEEDED the economic nexus threshold in ${stateCode}. Current revenue: $${currentAmount.toLocaleString()}, Threshold: $${thresholdAmount.toLocaleString()} (${(criticalRatio * 100).toFixed(1)}%). Excess: $${excessAmount.toLocaleString()}`,
          thresholdAmount,
          currentAmount,
          penaltyRisk,
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days (urgent)
        },
      });
      generatedData.nexusAlerts.push(nexusAlert);
      } else {
        console.log(`⚠️ Alert limit reached, skipping critical alert for ${client.name} in ${stateCode}`);
      }
      
      // Create nexus activity
      const nexusActivity = await this.prisma.nexusActivity.create({
        data: {
          organizationId,
          clientId: client.id,
          stateCode,
          activityType: 'penalty_assessment',
          title: `${client.name} - Penalty Assessment for ${stateCode}`,
          description: `Penalty assessment for ${client.industry} company in ${stateCode}. Status: Critical - Threshold Exceeded`,
          amount: currentAmount,
          thresholdAmount,
          status: 'completed',
          metadata: {
            source: 'automated_tracking',
            updateType: 'monthly_review',
            clientIndustry: client.industry,
            businessType: client.customFields?.businessType || 'B2B',
            riskLevel: client.riskLevel,
            excessAmount,
            penaltyRisk
          },
        },
      });
      generatedData.nexusActivities.push(nexusActivity);
    }
    
    console.log(`✅ Generated ${totalStates} states for ${client.name}: ${numCompliantStates} compliant (green, no alerts), ${numWarningStates} warning (orange, medium alerts), ${numCriticalStates} critical (red, high alerts)`);
  }

  async generateAlertsAndTasks(client, organizationId, generatedData) {
    // Create general alerts
    const alertTypes = ['compliance', 'deadline', 'review', 'nexus', 'filing'];
    const numAlerts = Math.floor(Math.random() * 3) + 1; // 1-3 alerts

    for (let i = 0; i < numAlerts; i++) {
      const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
      const stateCode = ['CA', 'TX', 'NY', 'FL', 'IL'][Math.floor(Math.random() * 5)];
      const alert = await this.prisma.alert.create({
        data: {
          organizationId,
          clientId: client.id,
          title: `${client.name} - ${alertType.charAt(0).toUpperCase() + alertType.slice(1)} Alert`,
          description: `${alertType} alert for ${client.industry} company (${client.customFields?.businessType || 'B2B'}) requiring CPA firm attention`,
          issue: `${alertType} issue detected for ${client.riskLevel} risk client in ${stateCode}`,
          stateCode,
          stateName: this.getStateName(stateCode),
          currentAmount: Math.floor(Math.random() * 100000),
          thresholdAmount: 100000,
          penaltyRisk: Math.floor(Math.random() * 50000),
          priority: client.riskLevel === 'critical' ? 'high' : client.riskLevel === 'high' ? 'medium' : 'low',
          severity: client.riskLevel === 'critical' ? 'high' : client.riskLevel === 'high' ? 'medium' : 'low',
          status: 'new',
          type: alertType,
          category: 'compliance',
          deadline: new Date(Date.now() + (Math.floor(Math.random() * 30) + 1) * 24 * 60 * 60 * 1000),
          detectedAt: new Date(),
        },
      });
      generatedData.alerts.push(alert);
    }

    // Create tasks
    const taskTypes = ['review', 'filing', 'compliance', 'nexus', 'communication'];
    const numTasks = Math.floor(Math.random() * 4) + 1; // 1-4 tasks

    for (let i = 0; i < numTasks; i++) {
      const taskType = taskTypes[Math.floor(Math.random() * taskTypes.length)];
      const task = await this.prisma.task.create({
        data: {
          organizationId,
          clientId: client.id,
          title: `${client.name} - ${taskType.charAt(0).toUpperCase() + taskType.slice(1)} Task`,
          description: `Complete ${taskType} task for ${client.industry} company (${client.customFields?.businessType || 'B2B'}) - ${client.riskLevel} risk client`,
          category: taskType,
          type: 'client_work',
          priority: client.riskLevel === 'critical' ? 'high' : client.riskLevel === 'high' ? 'medium' : 'low',
          status: 'pending',
          dueDate: new Date(Date.now() + (Math.floor(Math.random() * 14) + 1) * 24 * 60 * 60 * 1000),
          estimatedHours: Math.floor(Math.random() * 8) + 1,
          progress: 0,
        },
      });
      generatedData.tasks.push(task);
    }
  }

  async generateProfessionalDecisions(client, organizationId, generatedData) {
    const decisionTypes = ['nexus_registration', 'compliance_strategy', 'tax_planning', 'risk_assessment'];
    const numDecisions = Math.floor(Math.random() * 3) + 1; // 1-3 decisions

    for (let i = 0; i < numDecisions; i++) {
      const decisionType = decisionTypes[Math.floor(Math.random() * decisionTypes.length)];
      const decision = await this.prisma.professionalDecision.create({
        data: {
          organizationId,
          clientId: client.id,
          decisionDate: new Date(),
          decisionType,
          decisionSummary: `${decisionType.replace('_', ' ')} decision for ${client.name}`,
          professionalReasoning: `Professional reasoning for ${decisionType} decision based on client's risk profile and compliance requirements`,
          riskLevel: client.riskLevel,
          financialExposure: Math.floor(Math.random() * 100000),
          status: 'finalized',
        },
      });
      generatedData.professionalDecisions.push(decision);
    }
  }

  async generateDecisionTableEntries(client, organizationId, generatedData) {
    const decisionTypes = ['nexus_registration', 'compliance_strategy', 'tax_planning', 'risk_assessment', 'filing_strategy'];
    const numDecisions = Math.floor(Math.random() * 2) + 1; // 1-2 decision table entries

    for (let i = 0; i < numDecisions; i++) {
      const decisionType = decisionTypes[Math.floor(Math.random() * decisionTypes.length)];
      try {
        const decisionTable = await this.prisma.decisionTable.create({
          data: {
          organizationId,
          clientId: client.id,
          decisionId: `DEC-${client.id.slice(0, 8)}-${Date.now()}`,
          decisionType,
          decisionTitle: `${decisionType.replace('_', ' ')} Decision for ${client.name}`,
          decisionDescription: `Comprehensive decision record for ${decisionType} regarding ${client.name}`,
          decisionDate: new Date(),
          decisionMaker: 'Senior Tax Manager',
          decisionMakerRole: 'Tax Manager',
          riskLevel: client.riskLevel,
          financialExposure: Math.floor(Math.random() * 100000),
          decisionRationale: `Based on client's risk profile (${client.riskLevel}), revenue levels, and multi-state operations, this decision ensures compliance while minimizing exposure`,
          supportingEvidence: ['Revenue analysis', 'State threshold review', 'Client consultation notes'],
          alternativesConsidered: ['Alternative approach 1', 'Alternative approach 2'],
          relatedAlerts: [],
          relatedTasks: [],
          relatedDocuments: [],
          status: 'finalized',
          implementationDate: new Date(),
          followUpRequired: Math.random() > 0.5,
          followUpDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          tags: [decisionType, client.riskLevel, 'compliance'],
          metadata: {
            clientRiskLevel: client.riskLevel,
            annualRevenue: client.annualRevenue,
            multiStateOperations: true
          },
          },
        });
        generatedData.decisionTables.push(decisionTable);
      } catch (e) {
        if (!(e && e.code === 'P2021')) throw e; // skip if table missing
      }
    }
  }

  async generateAuditTrail(client, organizationId, generatedData) {
    const auditTrail = await this.prisma.auditTrail.create({
      data: {
        organizationId,
        clientId: client.id,
        action: 'client_created',
        entityType: 'Client',
        entityId: client.id,
        entityName: client.name,
        changeDescription: `Client ${client.name} created with complete data relationships`,
        performedBy: 'system',
        performedByName: 'Data Generator',
        userRole: 'system',
        performedAt: new Date(),
      },
    });
    generatedData.auditTrails.push(auditTrail);
  }

  getStateName(stateCode) {
    const stateNames = {
      'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
      'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
      'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
      'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
      'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
      'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
      'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
      'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
      'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
      'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming'
    };
    return stateNames[stateCode] || stateCode;
  }

  generateSlug(name) {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now();
  }

  getFallbackClientData(index, riskLevel, companyName, industry) {
    
    const employeeCount = Math.floor(Math.random() * 50) + 10;
    const annualRevenue = Math.floor(Math.random() * 550000) + 50000; // $50K-$600K
    
    // Ensure revenue is within limits and is a clean integer
    const cappedRevenue = Math.min(annualRevenue, 600000);
    
    return {
      name: companyName,
      legalName: `${companyName}, LLC`,
      taxId: this.generateUniqueTaxId(),
      industry: industry,
      employeeCount: employeeCount,
      annualRevenue: cappedRevenue,
      fiscalYearEnd: '2024-12-31',
      riskLevel,
      penaltyExposure: riskLevel === 'critical' ? 75000 : riskLevel === 'high' ? 25000 : riskLevel === 'medium' ? 5000 : 0,
      qualityScore: riskLevel === 'critical' ? 65 : riskLevel === 'high' ? 80 : riskLevel === 'medium' ? 90 : 95,
      primaryContactName: 'John Smith',
      primaryContactEmail: this.generateUniqueEmail(companyName),
      primaryContactPhone: '+1-555-0123',
      addressLine1: '123 Business St',
      addressLine2: 'Suite 100',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94105',
      country: 'US',
      notes: `${riskLevel} risk client - requires monitoring`,
      tags: ['multi-state', 'nexus-risk', `${riskLevel}-risk`, industry.toLowerCase()],
      customFields: {},
    };
  }

  async generateFallbackCompleteData(formData, organizationId, organization = null) {
    console.log('🔄 Generating fallback complete data...');
    
    // Ensure organization exists for fallback data too
    const org = organization || await this.ensureOrganizationExists(organizationId, formData);
    
    const clientCount = 10;
    const generatedData = {
      clients: [],
      clientStates: [],
      nexusAlerts: [],
      nexusActivities: [],
      alerts: [],
      tasks: [],
      businessProfiles: [],
      contacts: [],
      businessLocations: [],
      revenueBreakdowns: [],
      customerDemographics: [],
      geographicDistributions: [],
      professionalDecisions: [],
      consultations: [],
      communications: [],
      documents: [],
      auditTrails: [],
      dataProcessing: [],
      decisionTables: []
    };

    try {
      for (let i = 0; i < clientCount; i++) {
        console.log(`📊 Generating fallback client ${i + 1}/${clientCount}...`);
        
        try {
          const riskLevels = ['low', 'medium', 'high', 'critical'];
          const riskLevel = riskLevels[Math.floor(Math.random() * riskLevels.length)];
          const companyName = await this.generateUniqueCompanyName(i);
          const industry = this.getRandomIndustry();
          
          const clientData = this.getFallbackClientData(i, riskLevel, companyName, industry);
          
          // Ensure revenue is within limits and properly formatted as number
          let revenue = clientData.annualRevenue;
          
          // Handle string concatenation issue - if it's a string with multiple numbers, take the first valid number
          if (typeof revenue === 'string') {
            // Extract the first valid number from the string
            const numberMatch = revenue.match(/\d+/);
            if (numberMatch) {
              revenue = parseInt(numberMatch[0]);
            } else {
              revenue = 50000; // Default fallback
            }
          }
          
          // Convert to number and validate
          revenue = parseFloat(revenue);
          if (isNaN(revenue) || revenue > 600000) {
            console.log(`⚠️ Fallback client ${i + 1} revenue ${clientData.annualRevenue} exceeds limit or is invalid, capping at $600K`);
            revenue = 600000;
          }
          
          // Ensure it's a clean integer
          clientData.annualRevenue = Math.round(revenue);
          
          console.log(`✅ Fallback client ${i + 1} generated: ${clientData.name}, Revenue: $${clientData.annualRevenue.toLocaleString()}`);
          
          const client = await this.createClientWithRelationships(clientData, organizationId);
          
          generatedData.clients.push(client);
          await this.generateClientRelatedData(client, organizationId, generatedData, formData, org);
          
          console.log(`✅ Fallback client ${i + 1} and related data created successfully`);
        } catch (error) {
          console.error(`❌ Error generating fallback client ${i + 1}:`, error);
          // Continue with next client instead of failing completely
          continue;
        }
      }

      console.log('✅ Fallback complete data generation successful');
      
      // Validate client count
      if (generatedData.clients.length < clientCount) {
        console.warn(`⚠️ Expected ${clientCount} fallback clients but only generated ${generatedData.clients.length}`);
      } else {
        console.log(`✅ Successfully generated ${generatedData.clients.length} fallback clients as expected`);
      }
      
      return {
        success: true,
        data: generatedData,
        summary: {
          totalClients: generatedData.clients.length,
          totalRecords: Object.values(generatedData).reduce((sum, arr) => sum + arr.length, 0)
        }
      };
    } catch (error) {
      console.error('❌ Error generating fallback complete data:', error);
      throw error;
    }
  }
}

module.exports = EnhancedDataGenerator;
