const { GoogleGenerativeAI } = require('@google/generative-ai');
const { PrismaClient } = require('@prisma/client');

class EnhancedDataGenerator {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    this.prisma = new PrismaClient();
    this.usedCompanyNames = new Set();
    this.usedTaxIds = new Set();
    this.usedEmails = new Set();
  }

  async generateCompleteDashboardData(formData, organizationId) {
    console.log('🚀 Starting complete dashboard data generation...');
    console.log('📊 Form data received:', JSON.stringify(formData, null, 2));

    try {
      if (!process.env.GEMINI_API_KEY) {
        console.log('⚠️ GEMINI_API_KEY not found, using fallback data');
        return await this.generateFallbackCompleteData(formData, organizationId);
      }

      console.log('✅ Gemini API key found, generating complete dashboard data...');

      // Generate multiple clients (max 20) with different risk levels
      const clientCount = Math.min(parseInt(formData.multiStateClientCount) || 5, 20);
      console.log(`📊 Generating ${clientCount} clients with complete data relationships...`);

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

      // Generate clients with complete relationships
      for (let i = 0; i < clientCount; i++) {
        console.log(`📊 Generating client ${i + 1}/${clientCount} with complete data...`);
        
        const clientData = await this.generateUniqueClient(formData, i);
        const client = await this.createClientWithRelationships(clientData, organizationId);
        
        generatedData.clients.push(client);
        
        // Generate related data for this client
        await this.generateClientRelatedData(client, organizationId, generatedData);
      }

      console.log('🎉 Complete dashboard data generation successful!');
      console.log('📊 Generated data summary:', {
        clients: generatedData.clients.length,
        clientStates: generatedData.clientStates.length,
        nexusAlerts: generatedData.nexusAlerts.length,
        nexusActivities: generatedData.nexusActivities.length,
        alerts: generatedData.alerts.length,
        tasks: generatedData.tasks.length,
        businessProfiles: generatedData.businessProfiles.length,
        contacts: generatedData.contacts.length,
        businessLocations: generatedData.businessLocations.length,
        revenueBreakdowns: generatedData.revenueBreakdowns.length,
        customerDemographics: generatedData.customerDemographics.length,
        geographicDistributions: generatedData.geographicDistributions.length,
        professionalDecisions: generatedData.professionalDecisions.length,
        consultations: generatedData.consultations.length,
        communications: generatedData.communications.length,
        documents: generatedData.documents.length,
        auditTrails: generatedData.auditTrails.length,
        dataProcessing: generatedData.dataProcessing.length,
        decisionTables: generatedData.decisionTables.length
      });

      return {
        success: true,
        data: generatedData,
        summary: {
          totalClients: generatedData.clients.length,
          totalRecords: Object.values(generatedData).reduce((sum, arr) => sum + arr.length, 0)
        }
      };

    } catch (error) {
      console.error('❌ Error generating complete dashboard data:', error);
      return await this.generateFallbackCompleteData(formData, organizationId);
    }
  }

  async generateUniqueClient(formData, index) {
    const riskLevels = ['low', 'medium', 'high', 'critical'];
    const riskLevel = riskLevels[Math.floor(Math.random() * riskLevels.length)];
    
    // Generate absolutely unique company name
    const companyName = await this.generateUniqueCompanyName(index);
    const industry = this.getRandomIndustry();
    
    const prompt = `
Generate a COMPLETELY UNIQUE and realistic business client for a CPA firm's nexus monitoring system. This must be a DIFFERENT company from any previous clients.

COMPANY REQUIREMENTS:
- Company Name: ${companyName} (must be unique and realistic)
- Industry: ${industry} (must be specific to this company type)
- Risk Level: ${riskLevel}
- Must be a multi-state business with nexus exposure
- Must have realistic financial data for this industry
- Must have complete business profile data

RISK CHARACTERISTICS:
- Risk Level: ${riskLevel}
- Penalty Exposure: ${riskLevel === 'critical' ? '$50,000-$200,000' : riskLevel === 'high' ? '$25,000-$100,000' : riskLevel === 'medium' ? '$5,000-$25,000' : '$0-$5,000'}
- Quality Score: ${riskLevel === 'critical' ? '60-75' : riskLevel === 'high' ? '75-85' : riskLevel === 'medium' ? '85-95' : '95-100'}

COMPLETE DATA REQUIREMENTS:
Return JSON with ALL required fields for a complete client profile:

{
  "name": "${companyName}",
  "legalName": "Unique Legal Name LLC",
  "taxId": "XX-XXXXXXX",
  "industry": "${industry}",
  "foundedYear": 2015-2023,
  "employeeCount": 10-100,
  "annualRevenue": 100000-5000000,
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
  "notes": "Risk-specific notes",
  "tags": ["multi-state", "nexus-risk", "${riskLevel}-risk"],
  "customFields": {},
  "businessProfile": {
    "legalName": "Legal Name LLC",
    "dbaName": "DBA Name",
    "entityType": "LLC/C-Corp/S-Corp",
    "formationDate": "YYYY-MM-DD",
    "federalEin": "XX-XXXXXXX",
    "primaryIndustry": "${industry}",
    "naicsCode": "XXXXXX",
    "businessModel": "B2B/B2C/Mixed",
    "marketFocus": "Target Market",
    "revenueGrowthYoy": 5.0-25.0,
    "fundingStage": "Bootstrapped/Series A/Series B"
  },
  "contacts": [
    {
      "name": "Contact Name",
      "title": "CEO/CFO/CTO",
      "email": "contact@company.com",
      "phone": "+1-XXX-XXX-XXXX",
      "mobile": "+1-XXX-XXX-XXXX",
      "role": "Primary Contact/Secondary",
      "specialization": "Finance/Operations/Technology",
      "notes": "Contact notes"
    }
  ],
  "businessLocations": [
    {
      "type": "Headquarters/Branch/Warehouse",
      "address": "Full Address",
      "city": "City",
      "state": "State",
      "postalCode": "XXXXX",
      "country": "US",
      "propertyType": "Owned/Leased",
      "employeeCount": 5-50,
      "nexusRelevant": true/false
    }
  ],
  "revenueBreakdowns": [
    {
      "category": "Product Sales/Service Revenue/Licensing",
      "amount": 10000-1000000,
      "percentage": 10.0-80.0
    }
  ],
  "customerDemographics": {
    "totalActiveCustomers": 100-10000,
    "averageContractValue": 1000-50000,
    "customerRetentionRate": 70.0-95.0,
    "monthlyRecurringRevenue": 10000-500000
  },
  "geographicDistributions": [
    {
      "stateCode": "CA/TX/NY/FL",
      "customerCount": 10-1000,
      "percentage": 5.0-40.0
    }
  ]
}

IMPORTANT: Make this company completely unique with realistic data that matches the industry and risk level. Do not reuse any company names, tax IDs, or email addresses from previous generations.
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const clientData = JSON.parse(jsonMatch[0]);
        
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
      'UltraSoft', 'SuperData', 'HyperTech', 'MetaSystems', 'CyberWorks', 'NeoCorp', 'ProtoTech', 'GenesisSoft'
    ];
    
    const suffixes = ['Inc', 'LLC', 'Corp', 'Ltd', 'Group', 'Partners', 'Associates', 'Enterprises', 'Solutions', 'Technologies'];
    
    let attempts = 0;
    let companyName;
    
    do {
      const baseName = baseNames[index % baseNames.length];
      const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
      const variation = Math.floor(Math.random() * 1000);
      
      companyName = `${baseName}${variation} ${suffix}`;
      attempts++;
      
      if (attempts > 100) {
        companyName = `${baseName}${Date.now()} ${suffix}`;
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

  async createClientWithRelationships(clientData, organizationId) {
    // Create client
    const client = await this.prisma.client.create({
      data: {
        organizationId,
        name: clientData.name,
        slug: this.generateSlug(clientData.name),
        legalName: clientData.legalName,
        taxId: clientData.taxId,
        industry: clientData.industry,
        foundedYear: clientData.foundedYear,
        employeeCount: clientData.employeeCount,
        annualRevenue: clientData.annualRevenue,
        fiscalYearEnd: new Date(clientData.fiscalYearEnd),
        riskLevel: clientData.riskLevel,
        penaltyExposure: clientData.penaltyExposure,
        qualityScore: clientData.qualityScore,
        primaryContactName: clientData.primaryContactName,
        primaryContactEmail: clientData.primaryContactEmail,
        primaryContactPhone: clientData.primaryContactPhone,
        addressLine1: clientData.addressLine1,
        addressLine2: clientData.addressLine2,
        city: clientData.city,
        state: clientData.state,
        postalCode: clientData.postalCode,
        country: clientData.country || 'US',
        status: 'active',
        notes: clientData.notes,
        tags: clientData.tags,
        customFields: clientData.customFields,
        assignedSince: new Date(),
        lastReview: new Date(),
        nextReview: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      },
    });

    return client;
  }

  async generateClientRelatedData(client, organizationId, generatedData) {
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
            amount: breakdownData.amount,
            percentage: breakdownData.percentage,
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
          totalActiveCustomers: client.customerDemographics.totalActiveCustomers,
          averageContractValue: client.customerDemographics.averageContractValue,
          customerRetentionRate: client.customerDemographics.customerRetentionRate,
          monthlyRecurringRevenue: client.customerDemographics.monthlyRecurringRevenue,
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

    // Generate nexus monitoring data
    await this.generateNexusMonitoringData(client, organizationId, generatedData);

    // Generate alerts and tasks
    await this.generateAlertsAndTasks(client, organizationId, generatedData);

    // Generate professional decisions
    await this.generateProfessionalDecisions(client, organizationId, generatedData);

    // Generate decision table entries
    await this.generateDecisionTableEntries(client, organizationId, generatedData);

    // Generate audit trail
    await this.generateAuditTrail(client, organizationId, generatedData);
  }

  async generateNexusMonitoringData(client, organizationId, generatedData) {
    const states = ['CA', 'TX', 'NY', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI', 'NJ', 'VA', 'WA', 'AZ', 'MA', 'TN', 'IN', 'MO', 'MD', 'WI'];
    const numStates = Math.floor(Math.random() * 5) + 2; // 2-6 states
    const selectedStates = states.sort(() => 0.5 - Math.random()).slice(0, numStates);

    for (const stateCode of selectedStates) {
      const thresholdAmount = 100000 + Math.floor(Math.random() * 400000); // $100K-$500K
      const currentAmount = Math.floor(Math.random() * thresholdAmount * 1.2); // 0-120% of threshold
      
      // Create client state
      const clientState = await this.prisma.clientState.create({
        data: {
          organizationId,
          clientId: client.id,
          stateCode,
          stateName: this.getStateName(stateCode),
          status: currentAmount > thresholdAmount ? 'critical' : currentAmount > thresholdAmount * 0.8 ? 'warning' : 'monitoring',
          registrationRequired: currentAmount > thresholdAmount,
          thresholdAmount,
          currentAmount,
          lastUpdated: new Date(),
          notes: `Monitoring ${stateCode} nexus status`,
        },
      });
      generatedData.clientStates.push(clientState);

      // Create nexus alert if threshold exceeded
      if (currentAmount > thresholdAmount) {
        const nexusAlert = await this.prisma.nexusAlert.create({
          data: {
            organizationId,
            clientId: client.id,
            stateCode,
            alertType: 'threshold_breach',
            priority: 'high',
            status: 'open',
            title: `${stateCode} Nexus Threshold Exceeded`,
            description: `Client has exceeded the economic nexus threshold in ${stateCode}`,
            thresholdAmount,
            currentAmount,
            penaltyRisk: Math.floor((currentAmount - thresholdAmount) * 0.1),
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
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
          activityType: 'revenue_update',
          title: `Revenue Update for ${stateCode}`,
          description: `Updated revenue tracking for ${stateCode} nexus monitoring`,
          amount: currentAmount,
          thresholdAmount,
          status: 'completed',
          metadata: {
            source: 'automated_tracking',
            updateType: 'monthly_review'
          },
        },
      });
      generatedData.nexusActivities.push(nexusActivity);
    }
  }

  async generateAlertsAndTasks(client, organizationId, generatedData) {
    // Create general alerts
    const alertTypes = ['compliance', 'deadline', 'review', 'nexus', 'filing'];
    const numAlerts = Math.floor(Math.random() * 3) + 1; // 1-3 alerts

    for (let i = 0; i < numAlerts; i++) {
      const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
      const alert = await this.prisma.alert.create({
        data: {
          organizationId,
          clientId: client.id,
          title: `${alertType.charAt(0).toUpperCase() + alertType.slice(1)} Alert for ${client.name}`,
          description: `Important ${alertType} alert requiring attention`,
          issue: `${alertType} issue detected`,
          stateCode: ['CA', 'TX', 'NY'][Math.floor(Math.random() * 3)],
          stateName: this.getStateName(['CA', 'TX', 'NY'][Math.floor(Math.random() * 3)]),
          currentAmount: Math.floor(Math.random() * 100000),
          thresholdAmount: 100000,
          penaltyRisk: Math.floor(Math.random() * 50000),
          priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
          severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
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
          title: `${taskType.charAt(0).toUpperCase() + taskType.slice(1)} Task for ${client.name}`,
          description: `Complete ${taskType} task for client`,
          category: taskType,
          type: 'client_work',
          priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
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
      'CA': 'California', 'TX': 'Texas', 'NY': 'New York', 'FL': 'Florida', 'IL': 'Illinois',
      'PA': 'Pennsylvania', 'OH': 'Ohio', 'GA': 'Georgia', 'NC': 'North Carolina', 'MI': 'Michigan',
      'NJ': 'New Jersey', 'VA': 'Virginia', 'WA': 'Washington', 'AZ': 'Arizona', 'MA': 'Massachusetts',
      'TN': 'Tennessee', 'IN': 'Indiana', 'MO': 'Missouri', 'MD': 'Maryland', 'WI': 'Wisconsin'
    };
    return stateNames[stateCode] || stateCode;
  }

  generateSlug(name) {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now();
  }

  getFallbackClientData(index, riskLevel, companyName, industry) {
    const foundedYear = 2015 + Math.floor(Math.random() * 8);
    const employeeCount = Math.floor(Math.random() * 50) + 10;
    const annualRevenue = Math.floor(Math.random() * 5000000) + 500000;
    
    return {
      name: companyName,
      legalName: `${companyName}, LLC`,
      taxId: this.generateUniqueTaxId(),
      industry: industry,
      foundedYear: foundedYear,
      employeeCount: employeeCount,
      annualRevenue: annualRevenue,
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

  async generateFallbackCompleteData(formData, organizationId) {
    console.log('🔄 Generating fallback complete data...');
    
    const clientCount = Math.min(parseInt(formData.multiStateClientCount) || 5, 20);
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
        const riskLevels = ['low', 'medium', 'high', 'critical'];
        const riskLevel = riskLevels[Math.floor(Math.random() * riskLevels.length)];
        const companyName = await this.generateUniqueCompanyName(i);
        const industry = this.getRandomIndustry();
        
        const clientData = this.getFallbackClientData(i, riskLevel, companyName, industry);
        const client = await this.createClientWithRelationships(clientData, organizationId);
        
        generatedData.clients.push(client);
        await this.generateClientRelatedData(client, organizationId, generatedData);
      }

      console.log('✅ Fallback complete data generation successful');
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
