const { GoogleGenerativeAI } = require('@google/generative-ai');
const { PrismaClient } = require('@prisma/client');

class SchemaBasedDataGenerator {
  constructor() {
    const token = process.env.GEMINI_API_KEY;
    if (!token) {
      throw new Error('GEMINI_API_KEY not found in environment variables');
    }
    this.genAI = new GoogleGenerativeAI(token);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    this.prisma = new PrismaClient();
  }

  async generateCompleteClientData(formData, organizationId) {
    console.log('🚀 Starting schema-based data generation...');
    console.log('📊 Form data received:', JSON.stringify(formData, null, 2));

    try {
      console.log('✅ Gemini API key found, generating comprehensive data...');

      // Generate data sequentially to avoid API rate limits and errors
      console.log('📊 Generating client data...');
      const clientData = await this.generateClientData(formData);
      
      console.log('📊 Generating client states data...');
      const clientStatesData = await this.generateClientStatesData(formData);
      
      console.log('📊 Generating nexus alerts data...');
      const nexusAlertsData = await this.generateNexusAlertsData(formData);
      
      console.log('📊 Generating nexus activities data...');
      const nexusActivitiesData = await this.generateNexusActivitiesData(formData);
      
      console.log('📊 Generating alerts data...');
      const alertsData = await this.generateAlertsData(formData);
      
      console.log('📊 Generating tasks data...');
      const tasksData = await this.generateTasksData(formData);
      
      // Use fallback data for other types to avoid API overload
      const businessProfileData = this.getFallbackBusinessProfileData(formData);
      const contactsData = this.getFallbackContactsData(formData);
      const businessLocationsData = this.getFallbackBusinessLocationsData(formData);
      const revenueBreakdownsData = this.getFallbackRevenueBreakdownsData(formData);
      const customerDemographicsData = this.getFallbackCustomerDemographicsData(formData);
      const geographicDistributionsData = this.getFallbackGeographicDistributionsData(formData);

      console.log('💾 Storing data in database tables...');

      // Create the main client record
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
          fiscalYearEnd: clientData.fiscalYearEnd,
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
          customFields: clientData.customFields
        }
      });

      console.log('✅ Client created with ID:', client.id);

      // Create related records
      await Promise.all([
        this.createClientStates(client.id, organizationId, clientStatesData),
        this.createNexusAlerts(client.id, organizationId, nexusAlertsData),
        this.createNexusActivities(client.id, organizationId, nexusActivitiesData),
        this.createAlerts(client.id, organizationId, alertsData),
        this.createTasks(client.id, organizationId, tasksData),
        this.createBusinessProfile(client.id, organizationId, businessProfileData),
        this.createContacts(client.id, organizationId, contactsData),
        this.createBusinessLocations(client.id, organizationId, businessLocationsData),
        this.createRevenueBreakdowns(client.id, organizationId, revenueBreakdownsData),
        this.createCustomerDemographics(client.id, organizationId, customerDemographicsData),
        this.createGeographicDistributions(client.id, organizationId, geographicDistributionsData)
      ]);

      console.log('✅ All related records created successfully');

      return {
        client,
        clientStates: clientStatesData,
        nexusAlerts: nexusAlertsData,
        nexusActivities: nexusActivitiesData,
        alerts: alertsData,
        tasks: tasksData,
        businessProfile: businessProfileData,
        contacts: contactsData,
        businessLocations: businessLocationsData,
        revenueBreakdowns: revenueBreakdownsData,
        customerDemographics: customerDemographicsData,
        geographicDistributions: geographicDistributionsData
      };

    } catch (error) {
      console.error('❌ Error in schema-based data generation:', error);
      throw error;
    }
  }

  async generateClientData(formData) {
    const prompt = `
    Generate realistic client data for a tax compliance management system based on the following form data:
    
    Client Name: ${formData.clientName}
    Priority States: ${formData.priorityStates.join(', ')}
    Pain Points: ${formData.painPoints.join(', ')}
    Multi-State Client Count: ${formData.multiStateClientCount}
    Annual Revenue: ${formData.annualRevenue}
    Industry: ${formData.industry}
    Business Model: ${formData.businessModel}
    Current Challenges: ${formData.currentChallenges}
    
    Generate a JSON object with the following structure:
    {
      "name": "Company Name",
      "legalName": "Legal Company Name Inc.",
      "taxId": "XX-XXXXXXX",
      "industry": "Technology",
      "foundedYear": 2015,
      "employeeCount": 50,
      "annualRevenue": 2500000,
      "fiscalYearEnd": "2024-12-31T00:00:00.000Z",
      "riskLevel": "medium",
      "penaltyExposure": 50000,
      "qualityScore": 85,
      "primaryContactName": "John Smith",
      "primaryContactEmail": "john@company.com",
      "primaryContactPhone": "+1-555-0123",
      "addressLine1": "123 Business St",
      "addressLine2": "Suite 100",
      "city": "San Francisco",
      "state": "CA",
      "postalCode": "94105",
      "country": "US",
      "notes": "Multi-state operations with nexus concerns",
      "tags": ["technology", "saas", "multi-state"],
      "customFields": {}
    }
    
    Make the data realistic and consistent with the client's industry and business model.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('No JSON found in response');
    } catch (error) {
      console.error('Error generating client data with AI:', error);
      return this.getFallbackClientData(formData);
    }
  }

  async generateClientStatesData(formData) {
    const prompt = `
    Generate client state monitoring data for ${formData.clientName} operating in these states:
    ${formData.priorityStates.join(', ')}
    
    For each state, generate realistic data including:
    - Current revenue amounts
    - Threshold amounts
    - Compliance status
    - Risk levels
    - Registration status
    
    Annual Revenue: ${formData.annualRevenue}
    Industry: ${formData.industry}
    
    Return as a JSON array of state objects with this structure:
    [
      {
        "stateCode": "CA",
        "stateName": "California",
        "status": "monitoring",
        "registrationRequired": true,
        "registrationDate": "2024-01-15T00:00:00.000Z",
        "registrationNumber": "REG-123456",
        "thresholdAmount": 100000,
        "currentAmount": 85000,
        "notes": "Approaching threshold"
      }
    ]
    `;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('No JSON array found in response');
    } catch (error) {
      console.error('Error parsing client states JSON:', error);
      return this.getFallbackClientStatesData(formData);
    }
  }

  async generateNexusAlertsData(formData) {
    const prompt = `
    Generate nexus alerts for ${formData.clientName} based on:
    - States: ${formData.priorityStates.join(', ')}
    - Pain Points: ${formData.painPoints.join(', ')}
    - Annual Revenue: ${formData.annualRevenue}
    - Industry: ${formData.industry}
    
    Create realistic alerts including:
    - Threshold breaches
    - Registration deadlines
    - Compliance issues
    - Risk assessments
    - Priority levels
    
    Return as a JSON array with this structure:
    [
      {
        "stateCode": "CA",
        "alertType": "threshold_breach",
        "priority": "high",
        "status": "open",
        "title": "Threshold Approaching in California",
        "description": "Current revenue is approaching the $100,000 threshold",
        "thresholdAmount": 100000,
        "currentAmount": 85000,
        "deadline": "2024-03-15T00:00:00.000Z",
        "penaltyRisk": 15000
      }
    ]
    `;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('No JSON array found in response');
    } catch (error) {
      console.error('Error parsing nexus alerts JSON:', error);
      return this.getFallbackNexusAlertsData(formData);
    }
  }

  async generateNexusActivitiesData(formData) {
    const prompt = `
    Generate nexus activities for ${formData.clientName} including:
    - Recent compliance activities
    - Registration submissions
    - Tax filings
    - Audit responses
    - State communications
    
    Based on states: ${formData.priorityStates.join(', ')}
    Industry: ${formData.industry}
    
    Return as a JSON array with this structure:
    [
      {
        "stateCode": "CA",
        "activityType": "registration",
        "title": "State Registration Submitted",
        "description": "Submitted registration for California sales tax",
        "amount": 0,
        "thresholdAmount": 100000,
        "status": "completed",
        "metadata": {"submissionId": "SUB-123456"}
      }
    ]
    `;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('No JSON array found in response');
    } catch (error) {
      console.error('Error parsing nexus activities JSON:', error);
      return this.getFallbackNexusActivitiesData(formData);
    }
  }

  async generateAlertsData(formData) {
    const prompt = `
    Generate general alerts for ${formData.clientName} based on:
    - Pain Points: ${formData.painPoints.join(', ')}
    - Industry: ${formData.industry}
    - Current Challenges: ${formData.currentChallenges}
    
    Include alerts for:
    - Compliance deadlines
    - Risk notifications
    - System issues
    - Regulatory changes
    - Performance warnings
    
    Return as a JSON array with this structure:
    [
      {
        "title": "Compliance Review Due",
        "description": "Annual compliance review is due in 30 days",
        "issue": "Compliance deadline approaching",
        "stateCode": "CA",
        "stateName": "California",
        "currentAmount": 0,
        "thresholdAmount": 0,
        "penaltyRisk": 0,
        "priority": "high",
        "severity": "medium",
        "status": "new",
        "type": "compliance",
        "category": "deadline",
        "deadline": "2024-04-15T00:00:00.000Z",
        "actions": ["Schedule review", "Gather documents"],
        "resolutionNotes": null
      }
    ]
    `;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('No JSON array found in response');
    } catch (error) {
      console.error('Error parsing alerts JSON:', error);
      return this.getFallbackAlertsData(formData);
    }
  }

  async generateTasksData(formData) {
    const prompt = `
    Generate tasks for ${formData.clientName} based on:
    - Pain Points: ${formData.painPoints.join(', ')}
    - Current Challenges: ${formData.currentChallenges}
    - States: ${formData.priorityStates.join(', ')}
    
    Include tasks for:
    - Compliance activities
    - Documentation
    - Client communications
    - System maintenance
    - Follow-ups
    
    Return as a JSON array with this structure:
    [
      {
        "title": "Review State Compliance Status",
        "description": "Review compliance status for all monitored states",
        "category": "compliance",
        "type": "review",
        "priority": "high",
        "status": "pending",
        "stateCode": "CA",
        "dueDate": "2024-03-20T00:00:00.000Z",
        "estimatedHours": 4,
        "progress": 0
      }
    ]
    `;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('No JSON array found in response');
    } catch (error) {
      console.error('Error parsing tasks JSON:', error);
      return this.getFallbackTasksData(formData);
    }
  }

  async generateBusinessProfileData(formData) {
    const prompt = `
    Generate business profile data for ${formData.clientName} based on:
    - Industry: ${formData.industry}
    - Business Model: ${formData.businessModel}
    - Annual Revenue: ${formData.annualRevenue}
    
    Return as a JSON object with this structure:
    {
      "legalName": "Legal Company Name Inc.",
      "dbaName": "Company DBA",
      "entityType": "Corporation",
      "formationDate": "2015-03-15T00:00:00.000Z",
      "federalEin": "XX-XXXXXXX",
      "primaryIndustry": "Technology",
      "naicsCode": "541511",
      "businessModel": "B2B SaaS",
      "marketFocus": "Enterprise",
      "revenueGrowthYoy": 15.5,
      "fundingStage": "Series A"
    }
    `;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('No JSON found in response');
    } catch (error) {
      console.error('Error parsing business profile JSON:', error);
      return this.getFallbackBusinessProfileData(formData);
    }
  }

  async generateContactsData(formData) {
    const prompt = `
    Generate contact data for ${formData.clientName} including:
    - Primary contacts
    - Finance contacts
    - Legal contacts
    - Technical contacts
    
    Return as a JSON array with this structure:
    [
      {
        "name": "John Smith",
        "title": "CFO",
        "email": "john@company.com",
        "phone": "+1-555-0123",
        "mobile": "+1-555-0124",
        "role": "finance",
        "specialization": "Tax Compliance",
        "notes": "Primary contact for tax matters"
      }
    ]
    `;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('No JSON array found in response');
    } catch (error) {
      console.error('Error parsing contacts JSON:', error);
      return this.getFallbackContactsData(formData);
    }
  }

  async generateBusinessLocationsData(formData) {
    const prompt = `
    Generate business location data for ${formData.clientName} based on:
    - States: ${formData.priorityStates.join(', ')}
    - Industry: ${formData.industry}
    
    Include locations for:
    - Headquarters
    - Regional offices
    - Remote workers
    - Warehouses
    
    Return as a JSON array with this structure:
    [
      {
        "type": "headquarters",
        "address": "123 Business St, Suite 100",
        "city": "San Francisco",
        "state": "CA",
        "postalCode": "94105",
        "country": "US",
        "propertyType": "office",
        "employeeCount": 25,
        "nexusRelevant": true
      }
    ]
    `;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('No JSON array found in response');
    } catch (error) {
      console.error('Error parsing business locations JSON:', error);
      return this.getFallbackBusinessLocationsData(formData);
    }
  }

  async generateRevenueBreakdownsData(formData) {
    const prompt = `
    Generate revenue breakdown data for ${formData.clientName} based on:
    - Industry: ${formData.industry}
    - Business Model: ${formData.businessModel}
    - Annual Revenue: ${formData.annualRevenue}
    
    Include revenue categories like:
    - Product sales
    - Service revenue
    - Subscription revenue
    - Consulting revenue
    
    Return as a JSON array with this structure:
    [
      {
        "category": "Subscription Revenue",
        "amount": 1500000,
        "percentage": 60.0
      }
    ]
    `;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('No JSON array found in response');
    } catch (error) {
      console.error('Error parsing revenue breakdowns JSON:', error);
      return this.getFallbackRevenueBreakdownsData(formData);
    }
  }

  async generateCustomerDemographicsData(formData) {
    const prompt = `
    Generate customer demographics data for ${formData.clientName} based on:
    - Industry: ${formData.industry}
    - Business Model: ${formData.businessModel}
    - Annual Revenue: ${formData.annualRevenue}
    
    Return as a JSON object with this structure:
    {
      "totalActiveCustomers": 150,
      "averageContractValue": 10000,
      "customerRetentionRate": 85.5,
      "monthlyRecurringRevenue": 125000
    }
    `;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('No JSON found in response');
    } catch (error) {
      console.error('Error parsing customer demographics JSON:', error);
      return this.getFallbackCustomerDemographicsData(formData);
    }
  }

  async generateGeographicDistributionsData(formData) {
    const prompt = `
    Generate geographic distribution data for ${formData.clientName} based on:
    - States: ${formData.priorityStates.join(', ')}
    - Industry: ${formData.industry}
    
    Return as a JSON array with this structure:
    [
      {
        "stateCode": "CA",
        "customerCount": 45,
        "percentage": 30.0
      }
    ]
    `;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('No JSON array found in response');
    } catch (error) {
      console.error('Error parsing geographic distributions JSON:', error);
      return this.getFallbackGeographicDistributionsData(formData);
    }
  }

  // Database creation methods
  async createClientStates(clientId, organizationId, clientStatesData) {
    for (const stateData of clientStatesData) {
      await this.prisma.clientState.create({
        data: {
          clientId,
          organizationId,
          stateCode: stateData.stateCode,
          stateName: stateData.stateName,
          status: stateData.status,
          registrationRequired: stateData.registrationRequired,
          registrationDate: stateData.registrationDate ? new Date(stateData.registrationDate) : null,
          registrationNumber: stateData.registrationNumber,
          thresholdAmount: stateData.thresholdAmount,
          currentAmount: stateData.currentAmount,
          notes: stateData.notes
        }
      });
    }
  }

  async createNexusAlerts(clientId, organizationId, nexusAlertsData) {
    for (const alertData of nexusAlertsData) {
      await this.prisma.nexusAlert.create({
        data: {
          clientId,
          organizationId,
          stateCode: alertData.stateCode,
          alertType: alertData.alertType,
          priority: alertData.priority,
          status: alertData.status,
          title: alertData.title,
          description: alertData.description,
          thresholdAmount: alertData.thresholdAmount,
          currentAmount: alertData.currentAmount,
          deadline: alertData.deadline ? new Date(alertData.deadline) : null,
          penaltyRisk: alertData.penaltyRisk
        }
      });
    }
  }

  async createNexusActivities(clientId, organizationId, nexusActivitiesData) {
    for (const activityData of nexusActivitiesData) {
      await this.prisma.nexusActivity.create({
        data: {
          clientId,
          organizationId,
          stateCode: activityData.stateCode,
          activityType: activityData.activityType,
          title: activityData.title,
          description: activityData.description,
          amount: activityData.amount,
          thresholdAmount: activityData.thresholdAmount,
          status: activityData.status,
          metadata: activityData.metadata
        }
      });
    }
  }

  async createAlerts(clientId, organizationId, alertsData) {
    for (const alertData of alertsData) {
      await this.prisma.alert.create({
        data: {
          organizationId,
          clientId,
          title: alertData.title,
          description: alertData.description,
          issue: alertData.issue,
          stateCode: alertData.stateCode,
          stateName: alertData.stateName,
          currentAmount: alertData.currentAmount,
          thresholdAmount: alertData.thresholdAmount,
          penaltyRisk: alertData.penaltyRisk,
          priority: alertData.priority,
          severity: alertData.severity,
          status: alertData.status,
          type: alertData.type,
          category: alertData.category,
          deadline: alertData.deadline ? new Date(alertData.deadline) : null,
          actions: alertData.actions,
          resolutionNotes: alertData.resolutionNotes
        }
      });
    }
  }

  async createTasks(clientId, organizationId, tasksData) {
    for (const taskData of tasksData) {
      await this.prisma.task.create({
        data: {
          organizationId,
          clientId,
          title: taskData.title,
          description: taskData.description,
          category: taskData.category,
          type: taskData.type,
          priority: taskData.priority,
          status: taskData.status,
          stateCode: taskData.stateCode,
          dueDate: taskData.dueDate ? new Date(taskData.dueDate) : null,
          estimatedHours: taskData.estimatedHours,
          progress: taskData.progress
        }
      });
    }
  }

  async createBusinessProfile(clientId, organizationId, businessProfileData) {
    await this.prisma.businessProfile.create({
      data: {
        organizationId,
        clientId,
        legalName: businessProfileData.legalName,
        dbaName: businessProfileData.dbaName,
        entityType: businessProfileData.entityType,
        formationDate: new Date(businessProfileData.formationDate),
        federalEin: businessProfileData.federalEin,
        primaryIndustry: businessProfileData.primaryIndustry,
        naicsCode: businessProfileData.naicsCode,
        businessModel: businessProfileData.businessModel,
        marketFocus: businessProfileData.marketFocus,
        revenueGrowthYoy: businessProfileData.revenueGrowthYoy,
        fundingStage: businessProfileData.fundingStage
      }
    });
  }

  async createContacts(clientId, organizationId, contactsData) {
    for (const contactData of contactsData) {
      await this.prisma.contact.create({
        data: {
          organizationId,
          clientId,
          name: contactData.name,
          title: contactData.title,
          email: contactData.email,
          phone: contactData.phone,
          mobile: contactData.mobile,
          role: contactData.role,
          specialization: contactData.specialization,
          notes: contactData.notes
        }
      });
    }
  }

  async createBusinessLocations(clientId, organizationId, businessLocationsData) {
    for (const locationData of businessLocationsData) {
      await this.prisma.businessLocation.create({
        data: {
          organizationId,
          clientId,
          type: locationData.type,
          address: locationData.address,
          city: locationData.city,
          state: locationData.state,
          postalCode: locationData.postalCode,
          country: locationData.country,
          propertyType: locationData.propertyType,
          employeeCount: locationData.employeeCount,
          nexusRelevant: locationData.nexusRelevant
        }
      });
    }
  }

  async createRevenueBreakdowns(clientId, organizationId, revenueBreakdownsData) {
    for (const breakdownData of revenueBreakdownsData) {
      await this.prisma.revenueBreakdown.create({
        data: {
          organizationId,
          clientId,
          category: breakdownData.category,
          amount: breakdownData.amount,
          percentage: breakdownData.percentage
        }
      });
    }
  }

  async createCustomerDemographics(clientId, organizationId, customerDemographicsData) {
    await this.prisma.customerDemographics.create({
      data: {
        organizationId,
        clientId,
        totalActiveCustomers: customerDemographicsData.totalActiveCustomers,
        averageContractValue: customerDemographicsData.averageContractValue,
        customerRetentionRate: customerDemographicsData.customerRetentionRate,
        monthlyRecurringRevenue: customerDemographicsData.monthlyRecurringRevenue
      }
    });
  }

  async createGeographicDistributions(clientId, organizationId, geographicDistributionsData) {
    for (const distributionData of geographicDistributionsData) {
      await this.prisma.geographicDistribution.create({
        data: {
          organizationId,
          clientId,
          stateCode: distributionData.stateCode,
          customerCount: distributionData.customerCount,
          percentage: distributionData.percentage
        }
      });
    }
  }

  // Fallback data generation methods
  async generateFallbackData(formData, organizationId) {
    console.log('🔄 Generating fallback data...');
    
    const client = await this.prisma.client.create({
      data: {
        organizationId,
        name: formData.clientName,
        slug: this.generateSlug(formData.clientName),
        industry: formData.industry || 'Technology',
        annualRevenue: this.parseRevenue(formData.annualRevenue),
        riskLevel: 'medium',
        qualityScore: 85,
        status: 'active',
        tags: ['generated', 'fallback']
      }
    });

    // Create basic client states
    for (const state of formData.priorityStates) {
      await this.prisma.clientState.create({
        data: {
          clientId: client.id,
          organizationId,
          stateCode: state,
          stateName: this.getStateName(state),
          status: 'monitoring',
          thresholdAmount: 100000,
          currentAmount: Math.floor(Math.random() * 100000) + 50000
        }
      });
    }

    return { client };
  }

  // Utility methods
  generateSlug(name) {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now();
  }

  parseRevenue(revenueString) {
    if (!revenueString) return 1000000;
    const match = revenueString.match(/\$?([\d,]+)/);
    if (match) {
      return parseInt(match[1].replace(/,/g, '')) * 1000; // Convert K to actual number
    }
    return 1000000;
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

  // Fallback data methods (simplified versions)
  getFallbackClientData(formData) {
    return {
      name: formData.clientName,
      legalName: `${formData.clientName} Inc.`,
      taxId: '12-3456789',
      industry: formData.industry || 'Technology',
      foundedYear: 2015,
      employeeCount: 50,
      annualRevenue: this.parseRevenue(formData.annualRevenue),
      fiscalYearEnd: '2024-12-31T00:00:00.000Z',
      riskLevel: 'medium',
      penaltyExposure: 50000,
      qualityScore: 85,
      primaryContactName: 'John Smith',
      primaryContactEmail: 'john@company.com',
      primaryContactPhone: '+1-555-0123',
      addressLine1: '123 Business St',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94105',
      country: 'US',
      notes: 'Multi-state operations',
      tags: ['technology', 'saas'],
      customFields: {}
    };
  }

  getFallbackClientStatesData(formData) {
    return formData.priorityStates.map(state => ({
      stateCode: state,
      stateName: this.getStateName(state),
      status: 'monitoring',
      registrationRequired: true,
      thresholdAmount: 100000,
      currentAmount: Math.floor(Math.random() * 100000) + 50000,
      notes: 'Generated state data'
    }));
  }

  getFallbackNexusAlertsData(formData) {
    return [
      {
        stateCode: formData.priorityStates[0] || 'CA',
        alertType: 'threshold_breach',
        priority: 'medium',
        status: 'open',
        title: 'Threshold Approaching',
        description: 'Current revenue is approaching the threshold',
        thresholdAmount: 100000,
        currentAmount: 85000,
        penaltyRisk: 15000
      }
    ];
  }

  getFallbackNexusActivitiesData(formData) {
    return [
      {
        stateCode: formData.priorityStates[0] || 'CA',
        activityType: 'registration',
        title: 'State Registration Submitted',
        description: 'Submitted registration for state sales tax',
        amount: 0,
        thresholdAmount: 100000,
        status: 'completed',
        metadata: {}
      }
    ];
  }

  getFallbackAlertsData(formData) {
    return [
      {
        title: 'Compliance Review Due',
        description: 'Annual compliance review is due',
        issue: 'Compliance deadline',
        stateCode: formData.priorityStates[0] || 'CA',
        stateName: this.getStateName(formData.priorityStates[0] || 'CA'),
        priority: 'high',
        severity: 'medium',
        status: 'new',
        type: 'compliance',
        category: 'deadline',
        actions: ['Schedule review'],
        resolutionNotes: null
      }
    ];
  }

  getFallbackTasksData(formData) {
    return [
      {
        title: 'Review Compliance Status',
        description: 'Review compliance status for all states',
        category: 'compliance',
        type: 'review',
        priority: 'high',
        status: 'pending',
        stateCode: formData.priorityStates[0] || 'CA',
        estimatedHours: 4,
        progress: 0
      }
    ];
  }

  getFallbackBusinessProfileData(formData) {
    return {
      legalName: `${formData.clientName} Inc.`,
      entityType: 'Corporation',
      formationDate: '2015-03-15T00:00:00.000Z',
      federalEin: '12-3456789',
      primaryIndustry: formData.industry || 'Technology',
      naicsCode: '541511',
      businessModel: formData.businessModel || 'B2B SaaS',
      marketFocus: 'Enterprise',
      revenueGrowthYoy: 15.5,
      fundingStage: 'Series A'
    };
  }

  getFallbackContactsData(formData) {
    return [
      {
        name: 'John Smith',
        title: 'CFO',
        email: 'john@company.com',
        phone: '+1-555-0123',
        role: 'finance',
        specialization: 'Tax Compliance',
        notes: 'Primary contact'
      }
    ];
  }

  getFallbackBusinessLocationsData(formData) {
    return [
      {
        type: 'headquarters',
        address: '123 Business St',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94105',
        country: 'US',
        propertyType: 'office',
        employeeCount: 25,
        nexusRelevant: true
      }
    ];
  }

  getFallbackRevenueBreakdownsData(formData) {
    return [
      {
        category: 'Subscription Revenue',
        amount: 1500000,
        percentage: 60.0
      },
      {
        category: 'Service Revenue',
        amount: 1000000,
        percentage: 40.0
      }
    ];
  }

  getFallbackCustomerDemographicsData(formData) {
    return {
      totalActiveCustomers: 150,
      averageContractValue: 10000,
      customerRetentionRate: 85.5,
      monthlyRecurringRevenue: 125000
    };
  }

  getFallbackGeographicDistributionsData(formData) {
    return formData.priorityStates.map((state, index) => ({
      stateCode: state,
      customerCount: Math.floor(Math.random() * 50) + 10,
      percentage: (100 / formData.priorityStates.length) + (Math.random() - 0.5) * 10
    }));
  }
}

module.exports = SchemaBasedDataGenerator;
