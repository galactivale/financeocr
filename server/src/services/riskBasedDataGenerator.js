const { GoogleGenerativeAI } = require('@google/generative-ai');
const { PrismaClient } = require('@prisma/client');

class RiskBasedDataGenerator {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    this.prisma = new PrismaClient();
  }

  async generateRiskBasedClientData(formData, organizationId) {
    console.log('🚀 Starting risk-based client data generation...');
    console.log('📊 Form data received:', JSON.stringify(formData, null, 2));

    try {
      if (!process.env.GEMINI_API_KEY) {
        console.log('⚠️ GEMINI_API_KEY not found, using fallback data');
        return await this.generateFallbackRiskData(formData, organizationId);
      }

      console.log('✅ Gemini API key found, generating risk-based client data...');

      // Generate multiple clients (max 20) with different risk levels
      const clientCount = Math.min(parseInt(formData.multiStateClientCount) || 5, 20);
      console.log(`📊 Generating ${clientCount} clients with risk-based nexus monitoring...`);

      const generatedClients = [];
      
      for (let i = 0; i < clientCount; i++) {
        console.log(`📊 Generating client ${i + 1}/${clientCount}...`);
        
        // Generate client with risk-based characteristics
        const clientData = await this.generateRiskBasedClient(formData, i);
        
        // Create client in database with all required fields
        const client = await this.prisma.client.create({
          data: {
            organizationId,
            name: clientData.name,
            slug: this.generateSlug(clientData.name),
            legalName: clientData.legalName,
            taxId: clientData.taxId,
            industry: clientData.industry,
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
            nextReview: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
          },
        });

        // Create business profile if provided
        if (clientData.businessProfile) {
          await this.prisma.businessProfile.create({
            data: {
              organizationId,
              clientId: client.id,
              legalName: clientData.businessProfile.legalName,
              dbaName: clientData.businessProfile.dbaName,
              entityType: clientData.businessProfile.entityType,
              formationDate: new Date(clientData.businessProfile.formationDate),
              federalEin: clientData.businessProfile.federalEin,
              primaryIndustry: clientData.businessProfile.primaryIndustry,
              naicsCode: clientData.businessProfile.naicsCode,
              businessModel: clientData.businessProfile.businessModel,
              marketFocus: clientData.businessProfile.marketFocus,
              revenueGrowthYoy: clientData.businessProfile.revenueGrowthYoy,
              fundingStage: clientData.businessProfile.fundingStage,
            },
          });
        }

        // Create contacts if provided
        if (clientData.contacts && clientData.contacts.length > 0) {
          for (const contactData of clientData.contacts) {
            await this.prisma.contact.create({
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
          }
        }

        // Create business locations if provided
        if (clientData.businessLocations && clientData.businessLocations.length > 0) {
          for (const locationData of clientData.businessLocations) {
            await this.prisma.businessLocation.create({
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
          }
        }

        // Create revenue breakdowns if provided
        if (clientData.revenueBreakdowns && clientData.revenueBreakdowns.length > 0) {
          for (const revenueData of clientData.revenueBreakdowns) {
            await this.prisma.revenueBreakdown.create({
              data: {
                organizationId,
                clientId: client.id,
                category: revenueData.category,
                amount: revenueData.amount,
                percentage: revenueData.percentage,
              },
            });
          }
        }

        // Create customer demographics if provided
        if (clientData.customerDemographics) {
          await this.prisma.customerDemographics.create({
            data: {
              organizationId,
              clientId: client.id,
              totalActiveCustomers: clientData.customerDemographics.totalActiveCustomers,
              averageContractValue: clientData.customerDemographics.averageContractValue,
              customerRetentionRate: clientData.customerDemographics.customerRetentionRate,
              monthlyRecurringRevenue: clientData.customerDemographics.monthlyRecurringRevenue,
            },
          });
        }

        // Create geographic distributions if provided
        if (clientData.geographicDistributions && clientData.geographicDistributions.length > 0) {
          for (const geoData of clientData.geographicDistributions) {
            await this.prisma.geographicDistribution.create({
              data: {
                organizationId,
                clientId: client.id,
                stateCode: geoData.stateCode,
                customerCount: geoData.customerCount,
                percentage: geoData.percentage,
              },
            });
          }
        }

        // Generate nexus monitoring data for this client
        const nexusData = await this.generateNexusMonitoringData(client, formData);
        
        // Create client states for nexus monitoring
        for (const stateData of nexusData.clientStates) {
          await this.prisma.clientState.create({
            data: {
              ...stateData,
              clientId: client.id,
              organizationId,
            },
          });
        }

        // Create nexus alerts if risk level warrants it
        for (const alertData of nexusData.nexusAlerts) {
          await this.prisma.nexusAlert.create({
            data: {
              ...alertData,
              clientId: client.id,
              organizationId,
            },
          });
        }

        // Create general alerts for high-risk clients
        if (clientData.riskLevel === 'high' || clientData.riskLevel === 'critical') {
          for (const alertData of nexusData.alerts) {
            await this.prisma.alert.create({
              data: {
                ...alertData,
                clientId: client.id,
                organizationId,
              },
            });
          }
        }

        // Create tasks for risk management
        for (const taskData of nexusData.tasks) {
          await this.prisma.task.create({
            data: {
              ...taskData,
              clientId: client.id,
              organizationId,
            },
          });
        }

        // Create audit trail for client creation
        await this.prisma.auditTrail.create({
          data: {
            organizationId,
            clientId: client.id,
            action: 'client_created',
            entityType: 'Client',
            entityId: client.id,
            entityName: client.name,
            changeDescription: `Client ${client.name} created with ${riskLevel} risk level`,
            performedBy: 'system',
            performedByName: 'Data Generator',
            userRole: 'system',
            performedAt: new Date(),
          },
        });

        generatedClients.push({
          client,
          nexusData,
          riskLevel: clientData.riskLevel,
          penaltyExposure: clientData.penaltyExposure,
        });

        console.log(`✅ Client ${i + 1} (${client.name}) created with complete data: ${nexusData.clientStates.length} states, ${nexusData.nexusAlerts.length} nexus alerts, business profile, contacts, locations, revenue breakdowns, demographics, and geographic distributions`);
      }

      console.log('✅ Risk-based client generation completed');
      return {
        clients: generatedClients,
        totalClients: clientCount,
        riskDistribution: this.calculateRiskDistribution(generatedClients),
        totalPenaltyExposure: generatedClients.reduce((sum, c) => sum + c.penaltyExposure, 0),
      };

    } catch (error) {
      console.error('❌ Error generating risk-based data:', error);
      return await this.generateFallbackRiskData(formData, organizationId);
    }
  }

  async generateRiskBasedClient(formData, index) {
    const riskLevels = ['low', 'medium', 'high', 'critical'];
    const riskLevel = riskLevels[Math.floor(Math.random() * riskLevels.length)];
    
    // Generate unique company names to ensure each client represents a different company
    const companyNameVariations = [
      'TechCorp', 'DataFlow', 'CloudSync', 'InnovateLab', 'DigitalEdge', 'NextGen', 'FutureTech', 'SmartSolutions',
      'AlphaSystems', 'BetaWorks', 'GammaTech', 'DeltaData', 'EpsilonSoft', 'ZetaCorp', 'EtaInnovations', 'ThetaLabs',
      'IotaTech', 'KappaSystems', 'LambdaSoft', 'MuCorp', 'NuSolutions', 'XiTech', 'OmicronData', 'PiInnovations',
      'RhoSystems', 'SigmaWorks', 'TauTech', 'UpsilonCorp', 'PhiSolutions', 'ChiInnovations', 'PsiLabs', 'OmegaTech'
    ];
    
    const industryVariations = [
      'Technology', 'Software Development', 'E-commerce', 'SaaS', 'Fintech', 'HealthTech', 'EdTech', 'RetailTech',
      'Manufacturing', 'Logistics', 'Consulting', 'Marketing', 'Real Estate', 'Healthcare', 'Education', 'Financial Services'
    ];
    
    const companyName = companyNameVariations[index % companyNameVariations.length];
    const industry = industryVariations[index % industryVariations.length];
    
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
  "name": "Unique Company Name",
  "legalName": "Unique Legal Business Name, LLC/Corp/Inc",
  "taxId": "XX-XXXXXXX",
  "industry": "Specific Industry",
  
  "employeeCount": 25,
  "annualRevenue": 2500000,
  "fiscalYearEnd": "2024-12-31",
  "riskLevel": "${riskLevel}",
  "penaltyExposure": 75000,
  "qualityScore": 82,
  "primaryContactName": "Realistic Contact Name",
  "primaryContactEmail": "contact@company.com",
  "primaryContactPhone": "+1-555-0123",
  "addressLine1": "Realistic Business Address",
  "addressLine2": "Suite/Floor if applicable",
  "city": "Realistic City",
  "state": "Realistic State",
  "postalCode": "XXXXX",
  "country": "US",
  "notes": "Specific risk assessment notes for this company",
  "tags": ["multi-state", "nexus-risk", "${riskLevel}-risk", "industry-specific-tag"],
  "customFields": {},
  "businessProfile": {
    "legalName": "Same as above",
    "dbaName": "Doing Business As name if different",
    "entityType": "LLC/Corporation/Partnership/Sole Proprietorship",
    "formationDate": "2015-03-15",
    "federalEin": "XX-XXXXXXX",
    "primaryIndustry": "Same as industry above",
    "naicsCode": "XXXXXX",
    "businessModel": "B2B/B2C/Marketplace/Subscription/etc",
    "marketFocus": "Target market description",
    "revenueGrowthYoy": 15.5,
    "fundingStage": "Bootstrapped/Seed/Series A/Series B/Public"
  },
  "contacts": [
    {
      "name": "Primary Contact Name",
      "title": "CEO/CFO/Controller/etc",
      "email": "contact@company.com",
      "phone": "+1-555-0123",
      "mobile": "+1-555-0124",
      "role": "Primary Contact",
      "specialization": "Finance/Operations/etc",
      "notes": "Contact notes"
    }
  ],
  "businessLocations": [
    {
      "type": "Headquarters",
      "address": "Main business address",
      "city": "City",
      "state": "State",
      "postalCode": "XXXXX",
      "country": "US",
      "propertyType": "Office/Retail/Warehouse/etc",
      "employeeCount": 25,
      "nexusRelevant": true
    }
  ],
  "revenueBreakdowns": [
    {
      "category": "Product Sales",
      "amount": 1500000,
      "percentage": 60.0
    },
    {
      "category": "Service Revenue",
      "amount": 1000000,
      "percentage": 40.0
    }
  ],
  "customerDemographics": {
    "totalActiveCustomers": 500,
    "averageContractValue": 5000,
    "customerRetentionRate": 85.5,
    "monthlyRecurringRevenue": 208333
  },
  "geographicDistributions": [
    {
      "stateCode": "CA",
      "customerCount": 200,
      "percentage": 40.0
    },
    {
      "stateCode": "NY",
      "customerCount": 150,
      "percentage": 30.0
    },
    {
      "stateCode": "TX",
      "customerCount": 100,
      "percentage": 20.0
    },
    {
      "stateCode": "FL",
      "customerCount": 50,
      "percentage": 10.0
    }
  ]
}

IMPORTANT: Make this company completely unique with realistic data that matches the industry and risk level. Do not reuse any company names or data from previous generations.
`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('No valid JSON found in response');
    } catch (error) {
      console.error('Error generating client data:', error);
      return this.getFallbackClientData(formData, index, riskLevel);
    }
  }

  async generateNexusMonitoringData(client, formData) {
    const states = formData.priorityStates || ['CA', 'NY', 'TX', 'FL', 'IL'];
    const clientStates = [];
    const nexusAlerts = [];
    const alerts = [];
    const tasks = [];

    // Generate client states for nexus monitoring
    for (const stateCode of states) {
      const stateName = this.getStateName(stateCode);
      const thresholdAmount = this.getStateThreshold(stateCode);
      const currentAmount = this.generateCurrentAmount(client.annualRevenue, client.riskLevel);
      const percentage = Math.round((currentAmount / thresholdAmount) * 100);
      
      // Determine if alerts will be created FIRST
      const willCreateCriticalAlert = percentage >= 100;
      const willCreateWarningAlert = percentage >= 80 && percentage < 100;
      const willCreateAnyAlert = willCreateCriticalAlert || willCreateWarningAlert;
      
      // Generate status - but ensure it doesn't indicate threshold exceeded if no alert will be created
      let status = 'compliant';
      if (willCreateCriticalAlert) {
        status = 'critical';
      } else if (willCreateWarningAlert) {
        status = 'warning';
      } else if (percentage >= 50) {
        status = 'pending';
      } else if (percentage >= 20) {
        status = 'transit';
      }
      // If percentage < 20, status remains 'compliant'

      const clientState = {
        stateCode,
        stateName,
        status,
        thresholdAmount,
        currentAmount,
        notes: `Nexus monitoring for ${stateName} - ${status} status`,
        lastUpdated: new Date(),
      };

      clientStates.push(clientState);

      // Create nexus alert if threshold exceeded (only if willCreateCriticalAlert is true)
      if (willCreateCriticalAlert) {
        nexusAlerts.push({
          stateCode,
          alertType: 'threshold_breach',
          priority: 'high',
          status: 'open',
          title: `${stateName} Nexus Threshold Exceeded`,
          description: `Client has exceeded the economic nexus threshold in ${stateName} by $${(currentAmount - thresholdAmount).toLocaleString()}`,
          thresholdAmount,
          currentAmount,
          penaltyRisk: clientState.penaltyRisk,
        });
      }

      // Create general alert for high-risk states (only if alerts will actually be created)
      if (willCreateAnyAlert) {
        alerts.push({
          alertType: 'nexus_monitoring',
          severity: status === 'critical' ? 'high' : 'medium',
          status: 'active',
          title: `${stateName} Nexus Alert`,
          description: `Monitor ${stateName} nexus status - ${percentage}% of threshold`,
          financialImpact: status === 'critical' ? `$${clientState.penaltyRisk.toLocaleString()} potential penalty` : 'Monitor closely',
          statute: this.getStateStatute(stateCode),
          detectedAt: new Date(),
          assignedTo: 'Tax Manager',
        });
      }
    }

    // Create risk management tasks
    if (client.riskLevel === 'high' || client.riskLevel === 'critical') {
      tasks.push({
        title: 'Nexus Risk Assessment',
        description: 'Conduct comprehensive nexus risk assessment',
        category: 'compliance',
        type: 'assessment',
        priority: client.riskLevel === 'critical' ? 'high' : 'medium',
        status: 'pending',
        stateCode: states[0],
        estimatedHours: 4,
        progress: 0,
      });

      if (nexusAlerts.length > 0) {
        tasks.push({
          title: 'Address Nexus Alerts',
          description: 'Review and address active nexus alerts',
          category: 'compliance',
          type: 'review',
          priority: 'high',
          status: 'pending',
          stateCode: states[0],
          estimatedHours: 6,
          progress: 0,
        });
      }
    }

    return {
      clientStates,
      nexusAlerts,
      alerts,
      tasks,
    };
  }

  getStateName(stateCode) {
    const stateNames = {
      'CA': 'California', 'NY': 'New York', 'TX': 'Texas', 'FL': 'Florida',
      'IL': 'Illinois', 'PA': 'Pennsylvania', 'OH': 'Ohio', 'GA': 'Georgia',
      'NC': 'North Carolina', 'MI': 'Michigan', 'NJ': 'New Jersey', 'VA': 'Virginia',
      'WA': 'Washington', 'AZ': 'Arizona', 'MA': 'Massachusetts', 'TN': 'Tennessee',
      'IN': 'Indiana', 'MO': 'Missouri', 'MD': 'Maryland', 'WI': 'Wisconsin'
    };
    return stateNames[stateCode] || stateCode;
  }

  getStateThreshold(stateCode) {
    const thresholds = {
      'CA': 500000, 'NY': 500000, 'TX': 500000, 'FL': 100000,
      'IL': 100000, 'PA': 100000, 'OH': 100000, 'GA': 100000,
      'NC': 100000, 'MI': 100000, 'NJ': 100000, 'VA': 100000,
      'WA': 100000, 'AZ': 100000, 'MA': 100000, 'TN': 100000,
      'IN': 100000, 'MO': 100000, 'MD': 100000, 'WI': 100000
    };
    return thresholds[stateCode] || 100000;
  }

  getStateStatute(stateCode) {
    const statutes = {
      'CA': 'Cal. Rev. & Tax Code § 23101',
      'NY': 'N.Y. Tax Law § 1101(b)(8)',
      'TX': 'Tex. Tax Code Ann. § 151.107',
      'FL': 'Fla. Stat. § 212.0596',
      'IL': '35 ILCS 105/2',
    };
    return statutes[stateCode] || `${stateCode} Tax Code`;
  }

  generateCurrentAmount(annualRevenue, riskLevel) {
    const baseAmount = annualRevenue * 0.1; // 10% of annual revenue
    const riskMultiplier = {
      'low': 0.3,
      'medium': 0.6,
      'high': 0.9,
      'critical': 1.2
    };
    return Math.floor(baseAmount * riskMultiplier[riskLevel] * (0.8 + Math.random() * 0.4));
  }

  calculateRiskDistribution(clients) {
    const distribution = { low: 0, medium: 0, high: 0, critical: 0 };
    clients.forEach(client => {
      distribution[client.riskLevel]++;
    });
    return distribution;
  }

  generateSlug(name) {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now();
  }

  getFallbackClientData(formData, index, riskLevel) {
    // Generate unique company names for fallback data
    const companyNameVariations = [
      'TechCorp', 'DataFlow', 'CloudSync', 'InnovateLab', 'DigitalEdge', 'NextGen', 'FutureTech', 'SmartSolutions',
      'AlphaSystems', 'BetaWorks', 'GammaTech', 'DeltaData', 'EpsilonSoft', 'ZetaCorp', 'EtaInnovations', 'ThetaLabs',
      'IotaTech', 'KappaSystems', 'LambdaSoft', 'MuCorp', 'NuSolutions', 'XiTech', 'OmicronData', 'PiInnovations',
      'RhoSystems', 'SigmaWorks', 'TauTech', 'UpsilonCorp', 'PhiSolutions', 'ChiInnovations', 'PsiLabs', 'OmegaTech'
    ];
    
    const industryVariations = [
      'Technology', 'Software Development', 'E-commerce', 'SaaS', 'Fintech', 'HealthTech', 'EdTech', 'RetailTech',
      'Manufacturing', 'Logistics', 'Consulting', 'Marketing', 'Real Estate', 'Healthcare', 'Education', 'Financial Services'
    ];
    
    const companyName = companyNameVariations[index % companyNameVariations.length];
    const industry = industryVariations[index % industryVariations.length];
    
    const employeeCount = Math.floor(Math.random() * 50) + 10;
    const annualRevenue = Math.floor(Math.random() * 5000000) + 500000;
    
    return {
      name: companyName,
      legalName: `${companyName}, LLC`,
      taxId: `${Math.floor(Math.random() * 90) + 10}-${Math.floor(Math.random() * 9000000) + 1000000}`,
      industry: industry,
      employeeCount: employeeCount,
      annualRevenue: annualRevenue,
      fiscalYearEnd: new Date('2024-12-31'),
      riskLevel,
      penaltyExposure: riskLevel === 'critical' ? 75000 : riskLevel === 'high' ? 25000 : riskLevel === 'medium' ? 5000 : 0,
      qualityScore: riskLevel === 'critical' ? 65 : riskLevel === 'high' ? 80 : riskLevel === 'medium' ? 90 : 95,
      primaryContactName: 'John Smith',
      primaryContactEmail: `contact@${companyName.toLowerCase()}.com`,
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
      businessProfile: {
        legalName: `${companyName}, LLC`,
        dbaName: companyName,
        entityType: 'LLC',
        formationDate: `2018-03-15`,
        federalEin: `${Math.floor(Math.random() * 90) + 10}-${Math.floor(Math.random() * 9000000) + 1000000}`,
        primaryIndustry: industry,
        naicsCode: `${Math.floor(Math.random() * 900000) + 100000}`,
        businessModel: 'B2B',
        marketFocus: 'Enterprise clients',
        revenueGrowthYoy: 15.5,
        fundingStage: 'Bootstrapped'
      },
      contacts: [
        {
          name: 'John Smith',
          title: 'CEO',
          email: `contact@${companyName.toLowerCase()}.com`,
          phone: '+1-555-0123',
          mobile: '+1-555-0124',
          role: 'Primary Contact',
          specialization: 'Finance',
          notes: 'Primary business contact'
        }
      ],
      businessLocations: [
        {
          type: 'Headquarters',
          address: '123 Business St',
          city: 'San Francisco',
          state: 'CA',
          postalCode: '94105',
          country: 'US',
          propertyType: 'Office',
          employeeCount: employeeCount,
          nexusRelevant: true
        }
      ],
      revenueBreakdowns: [
        {
          category: 'Product Sales',
          amount: Math.floor(annualRevenue * 0.6),
          percentage: 60.0
        },
        {
          category: 'Service Revenue',
          amount: Math.floor(annualRevenue * 0.4),
          percentage: 40.0
        }
      ],
      customerDemographics: {
        totalActiveCustomers: Math.floor(Math.random() * 1000) + 100,
        averageContractValue: Math.floor(annualRevenue / 100),
        customerRetentionRate: 85.5,
        monthlyRecurringRevenue: Math.floor(annualRevenue / 12)
      },
      geographicDistributions: [
        {
          stateCode: 'CA',
          customerCount: Math.floor(Math.random() * 200) + 50,
          percentage: 40.0
        },
        {
          stateCode: 'NY',
          customerCount: Math.floor(Math.random() * 150) + 30,
          percentage: 30.0
        },
        {
          stateCode: 'TX',
          customerCount: Math.floor(Math.random() * 100) + 20,
          percentage: 20.0
        },
        {
          stateCode: 'FL',
          customerCount: Math.floor(Math.random() * 50) + 10,
          percentage: 10.0
        }
      ]
    };
  }

  async generateFallbackRiskData(formData, organizationId) {
    console.log('🔄 Generating fallback risk-based data...');
    
    const clientCount = Math.min(parseInt(formData.multiStateClientCount) || 5, 20);
    const generatedClients = [];
    
    for (let i = 0; i < clientCount; i++) {
      try {
        const riskLevels = ['low', 'medium', 'high', 'critical'];
        const riskLevel = riskLevels[Math.floor(Math.random() * riskLevels.length)];
        
        const clientData = this.getFallbackClientData(formData, i, riskLevel);
        
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
            country: clientData.country,
            status: 'active',
            notes: clientData.notes,
            tags: clientData.tags,
            customFields: clientData.customFields,
            assignedSince: new Date(),
            lastReview: new Date(),
            nextReview: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
          },
        });

        // Create business profile
        if (clientData.businessProfile) {
          await this.prisma.businessProfile.create({
            data: {
              organizationId,
              clientId: client.id,
              legalName: clientData.businessProfile.legalName,
              dbaName: clientData.businessProfile.dbaName,
              entityType: clientData.businessProfile.entityType,
              formationDate: new Date(clientData.businessProfile.formationDate),
              federalEin: clientData.businessProfile.federalEin,
              primaryIndustry: clientData.businessProfile.primaryIndustry,
              naicsCode: clientData.businessProfile.naicsCode,
              businessModel: clientData.businessProfile.businessModel,
              marketFocus: clientData.businessProfile.marketFocus,
              revenueGrowthYoy: clientData.businessProfile.revenueGrowthYoy,
              fundingStage: clientData.businessProfile.fundingStage,
            },
          });
        }

        // Create contacts
        if (clientData.contacts && clientData.contacts.length > 0) {
          for (const contactData of clientData.contacts) {
            await this.prisma.contact.create({
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
          }
        }

        // Create business locations
        if (clientData.businessLocations && clientData.businessLocations.length > 0) {
          for (const locationData of clientData.businessLocations) {
            await this.prisma.businessLocation.create({
              data: {
                organizationId,
                clientId: client.id,
                type: locationData.type,
                address: locationData.address,
                city: locationData.city,
                state: locationData.state,
                postalCode: locationData.postalCode,
                country: locationData.country,
                propertyType: locationData.propertyType,
                employeeCount: locationData.employeeCount,
                nexusRelevant: locationData.nexusRelevant,
              },
            });
          }
        }

        // Create revenue breakdowns
        if (clientData.revenueBreakdowns && clientData.revenueBreakdowns.length > 0) {
          for (const revenueData of clientData.revenueBreakdowns) {
            await this.prisma.revenueBreakdown.create({
              data: {
                organizationId,
                clientId: client.id,
                category: revenueData.category,
                amount: revenueData.amount,
                percentage: revenueData.percentage,
              },
            });
          }
        }

        // Create customer demographics
        if (clientData.customerDemographics) {
          await this.prisma.customerDemographics.create({
            data: {
              organizationId,
              clientId: client.id,
              totalActiveCustomers: clientData.customerDemographics.totalActiveCustomers,
              averageContractValue: clientData.customerDemographics.averageContractValue,
              customerRetentionRate: clientData.customerDemographics.customerRetentionRate,
              monthlyRecurringRevenue: clientData.customerDemographics.monthlyRecurringRevenue,
            },
          });
        }

        // Create geographic distributions
        if (clientData.geographicDistributions && clientData.geographicDistributions.length > 0) {
          for (const geoData of clientData.geographicDistributions) {
            await this.prisma.geographicDistribution.create({
              data: {
                organizationId,
                clientId: client.id,
                stateCode: geoData.stateCode,
                customerCount: geoData.customerCount,
                percentage: geoData.percentage,
              },
            });
          }
        }

      // Generate basic nexus monitoring
      const states = formData.priorityStates || ['CA', 'NY', 'TX'];
      for (const stateCode of states) {
        const thresholdAmount = this.getStateThreshold(stateCode);
        const currentAmount = this.generateCurrentAmount(client.annualRevenue, client.riskLevel);
        const percentage = Math.round((currentAmount / thresholdAmount) * 100);
        
        let status = 'compliant';
        if (percentage >= 100) status = 'critical';
        else if (percentage >= 80) status = 'warning';
        else if (percentage >= 50) status = 'pending';
        else if (percentage >= 20) status = 'transit';

        await this.prisma.clientState.create({
          data: {
            clientId: client.id,
            organizationId,
            stateCode,
            stateName: this.getStateName(stateCode),
            status,
            thresholdAmount,
            currentAmount,
            notes: `Nexus monitoring for ${this.getStateName(stateCode)} - ${status} status`,
            lastUpdated: new Date(),
          },
        });

        // Create nexus alert if critical
        if (status === 'critical') {
          await this.prisma.nexusAlert.create({
            data: {
              clientId: client.id,
              organizationId,
              stateCode,
              alertType: 'threshold_breach',
              priority: 'high',
              status: 'open',
              title: `${this.getStateName(stateCode)} Nexus Threshold Exceeded`,
              description: `Client has exceeded the economic nexus threshold in ${this.getStateName(stateCode)}`,
              thresholdAmount,
              currentAmount,
              penaltyRisk: Math.floor(Math.random() * 50000) + 10000,
            },
          });
        }
      }

        // Create audit trail for fallback client creation
        await this.prisma.auditTrail.create({
          data: {
            organizationId,
            clientId: client.id,
            action: 'client_created',
            entityType: 'Client',
            entityId: client.id,
            entityName: client.name,
            changeDescription: `Fallback client ${client.name} created with ${riskLevel} risk level`,
            performedBy: 'system',
            performedByName: 'Fallback Data Generator',
            userRole: 'system',
            performedAt: new Date(),
          },
        });

        generatedClients.push({ client, riskLevel });
        console.log(`✅ Fallback client ${i + 1} (${client.name}) created with complete data`);
      } catch (error) {
        console.error(`❌ Error creating fallback client ${i + 1}:`, error);
        // Continue with next client instead of failing completely
      }
    }

    // Ensure we have at least one client
    if (generatedClients.length === 0) {
      console.error('❌ No clients could be created in fallback mode');
      throw new Error('Failed to create any clients in fallback mode');
    }

    return {
      clients: generatedClients,
      totalClients: generatedClients.length,
      riskDistribution: this.calculateRiskDistribution(generatedClients),
      totalPenaltyExposure: generatedClients.reduce((sum, c) => sum + (c.client.penaltyExposure || 0), 0),
    };
  }
}

module.exports = RiskBasedDataGenerator;
