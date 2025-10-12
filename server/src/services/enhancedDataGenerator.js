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
    console.log('📊 Client count from form:', formData.multiStateClientCount);

    try {
      if (!process.env.GEMINI_API_KEY) {
        console.log('⚠️ GEMINI_API_KEY not found, using fallback data');
        return await this.generateFallbackCompleteData(formData, organizationId);
      }

      console.log('✅ Gemini API key found, generating complete dashboard data...');

      // Always generate exactly 10 clients for demo
      const clientCount = 10;
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
              revenue = 50000; // Default fallback
            }
          }
          
          // Convert to number and validate
          revenue = parseFloat(revenue);
          if (isNaN(revenue) || revenue > 600000) {
            console.log(`⚠️ Client ${i + 1} revenue ${clientData.annualRevenue} exceeds limit or is invalid, capping at $600K`);
            revenue = 600000;
          }
          
          // Ensure it's a clean integer
          clientData.annualRevenue = Math.round(revenue);
          
          console.log(`✅ Client ${i + 1} generated: ${clientData.name}, Revenue: $${clientData.annualRevenue.toLocaleString()}`);
          
          const client = await this.createClientWithRelationships(clientData, organizationId);
          
          generatedData.clients.push(client);
          
          // Generate related data for this client
          await this.generateClientRelatedData(client, organizationId, generatedData, formData);
          
          console.log(`✅ Client ${i + 1} and related data created successfully`);
        } catch (error) {
          console.error(`❌ Error generating client ${i + 1}:`, error);
          // Continue with next client instead of failing completely
          continue;
        }
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
      
      // Validate client count
      if (generatedData.clients.length < clientCount) {
        console.warn(`⚠️ Expected ${clientCount} clients but only generated ${generatedData.clients.length}`);
      } else {
        console.log(`✅ Successfully generated ${generatedData.clients.length} clients as expected`);
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
  "foundedYear": 2015-2023,
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
    const ratio = currentAmount / thresholdAmount;
    
    // Critical: Exceeded threshold
    if (ratio >= 1.0) {
      return 'critical';
    }
    
    // Warning: Close to threshold (80-99%)
    if (ratio >= 0.8) {
      return 'warning';
    }
    
    // Pending: Moderate activity (50-79%)
    if (ratio >= 0.5) {
      return 'pending';
    }
    
    // Transit: Some activity but low (20-49%)
    if (ratio >= 0.2) {
      return 'transit';
    }
    
    // Compliant: Very low activity (0-19%)
    return 'compliant';
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
      foundedYear: parseInt(clientData.foundedYear),
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
        foundedYear: cleanClientData.foundedYear,
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

  async generateClientRelatedData(client, organizationId, generatedData, formData) {
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

    // Generate nexus monitoring data
    await this.generateNexusMonitoringData(client, organizationId, generatedData, formData);

    // Generate alerts and tasks
    await this.generateAlertsAndTasks(client, organizationId, generatedData);

    // Generate professional decisions
    await this.generateProfessionalDecisions(client, organizationId, generatedData);

    // Generate decision table entries
    await this.generateDecisionTableEntries(client, organizationId, generatedData);

    // Generate audit trail
    await this.generateAuditTrail(client, organizationId, generatedData);
  }

  async generateNexusMonitoringData(client, organizationId, generatedData, formData) {
    // Use Priority States from the form data instead of random states
    const priorityStates = formData.priorityStates || [];
    
    // If no priority states selected, fall back to a default set
    const defaultStates = ['CA', 'TX', 'NY', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI', 'NJ', 'VA', 'WA', 'AZ', 'MA', 'TN', 'IN', 'MO', 'MD', 'WI'];
    const availableStates = priorityStates.length > 0 ? priorityStates : defaultStates;
    
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
    const states = availableStates.map(state => {
      return stateCodeMap[state] || state;
    });
    
    console.log(`🎯 Using Priority States for client ${client.name}:`, states);
    
    // Vary the number of states based on client risk level and business type
    let numStates;
    if (client.riskLevel === 'critical') {
      numStates = Math.floor(Math.random() * 3) + 4; // 4-6 states for high-risk clients
    } else if (client.riskLevel === 'high') {
      numStates = Math.floor(Math.random() * 3) + 3; // 3-5 states
    } else {
      numStates = Math.floor(Math.random() * 3) + 2; // 2-4 states
    }
    
    // Ensure we don't exceed the number of available priority states
    numStates = Math.min(numStates, states.length);
    
    // Select states from the priority states list
    const selectedStates = states.sort(() => 0.5 - Math.random()).slice(0, numStates);

    for (const stateCode of selectedStates) {
      // Vary thresholds based on state and client characteristics
      let thresholdAmount;
      if (['CA', 'NY', 'TX'].includes(stateCode)) {
        thresholdAmount = 500000 + Math.floor(Math.random() * 500000); // $500K-$1M for major states
      } else if (['FL', 'IL', 'PA', 'OH'].includes(stateCode)) {
        thresholdAmount = 200000 + Math.floor(Math.random() * 300000); // $200K-$500K for medium states
      } else {
        thresholdAmount = 100000 + Math.floor(Math.random() * 200000); // $100K-$300K for other states
      }
      
      // Vary current amounts based on client risk level
      let currentAmount;
      if (client.riskLevel === 'critical') {
        currentAmount = Math.floor(Math.random() * thresholdAmount * 1.5); // 0-150% for critical clients
      } else if (client.riskLevel === 'high') {
        currentAmount = Math.floor(Math.random() * thresholdAmount * 1.2); // 0-120% for high-risk clients
      } else {
        currentAmount = Math.floor(Math.random() * thresholdAmount * 0.9); // 0-90% for lower-risk clients
      }
      
      // Create client state
      const clientState = await this.prisma.clientState.create({
        data: {
          organizationId,
          clientId: client.id,
          stateCode,
          stateName: this.getStateName(stateCode),
          status: this.generateClientStateStatus(currentAmount, thresholdAmount, client.riskLevel),
          registrationRequired: currentAmount > thresholdAmount,
          thresholdAmount,
          currentAmount,
          lastUpdated: new Date(),
          notes: `${client.industry} company monitoring ${stateCode} nexus status - ${client.riskLevel} risk client with ${client.customFields?.businessType || 'B2B'} model`,
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
            title: `${client.name} - ${stateCode} Nexus Threshold Exceeded`,
            description: `${client.industry} company (${client.customFields?.businessType || 'B2B'}) has exceeded the economic nexus threshold in ${stateCode}. Current revenue: $${currentAmount.toLocaleString()}, Threshold: $${thresholdAmount.toLocaleString()}`,
            thresholdAmount,
            currentAmount,
            penaltyRisk: Math.floor((currentAmount - thresholdAmount) * 0.1),
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          },
        });
        generatedData.nexusAlerts.push(nexusAlert);
      }

      // Create nexus activity
      const activityTypes = ['revenue_update', 'threshold_monitoring', 'compliance_check', 'registration_review', 'penalty_assessment'];
      const activityType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
      
      const nexusActivity = await this.prisma.nexusActivity.create({
        data: {
          organizationId,
          clientId: client.id,
          stateCode,
          activityType,
          title: `${client.name} - ${activityType.replace('_', ' ').toUpperCase()} for ${stateCode}`,
          description: `${activityType.replace('_', ' ')} activity for ${client.industry} company in ${stateCode}. ${client.customFields?.businessType || 'B2B'} model with ${client.riskLevel} risk profile`,
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
    const annualRevenue = Math.floor(Math.random() * 550000) + 50000; // $50K-$600K
    
    // Ensure revenue is within limits and is a clean integer
    const cappedRevenue = Math.min(annualRevenue, 600000);
    
    return {
      name: companyName,
      legalName: `${companyName}, LLC`,
      taxId: this.generateUniqueTaxId(),
      industry: industry,
      foundedYear: foundedYear,
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

  async generateFallbackCompleteData(formData, organizationId) {
    console.log('🔄 Generating fallback complete data...');
    
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
          await this.generateClientRelatedData(client, organizationId, generatedData, formData);
          
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
