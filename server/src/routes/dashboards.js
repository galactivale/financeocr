const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const RiskBasedDataGenerator = require('../services/riskBasedDataGenerator');
const EnhancedDataGenerator = require('../services/enhancedDataGenerator');
const router = express.Router();
const prisma = new PrismaClient();

// Initialize Gemini AI with configuration
const geminiConfig = {
  token: process.env.GEMINI_API_KEY,
  gemini: {
    name: "gemini-1.5-flash",
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 8192,
    }
  }
};

const genAI = new GoogleGenerativeAI(geminiConfig.token);

// Generate unique URL for dashboard
function generateUniqueUrl(clientName) {
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const cleanName = clientName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  return `${cleanName}-${timestamp}-${randomSuffix}`;
}

// Generate unique URLs for different dashboard roles
function generateDashboardUrls(clientName, uniqueUrl) {
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  
  return {
    main: `${baseUrl}/dashboard/view/${uniqueUrl}`,
    managingPartner: `${baseUrl}/dashboard/managing-partner`,
    taxManager: `${baseUrl}/dashboard/tax-manager`,
    systemAdmin: `${baseUrl}/dashboard/system-admin`
  };
}

// Helper functions for portfolio metrics
function cleanRevenueValue(revenue) {
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

function cleanPenaltyExposureValue(penaltyExposure) {
  // Handle string concatenation issue - if it's a string with multiple numbers, take the first valid number
  if (typeof penaltyExposure === 'string') {
    // Extract the first valid number from the string
    const numberMatch = penaltyExposure.match(/\d+/);
    if (numberMatch) {
      const cleanValue = parseInt(numberMatch[0]);
      // Ensure it's within reasonable limits (0 to 200,000)
      return Math.min(Math.max(cleanValue, 0), 200000);
    } else {
      return 0; // Default fallback
    }
  }
  
  // If it's already a number, validate and clean it
  const numValue = parseFloat(penaltyExposure);
  if (isNaN(numValue)) {
    return 0; // Default fallback
  }
  
  // Ensure it's within reasonable limits and is a clean integer
  return Math.round(Math.min(Math.max(numValue, 0), 200000));
}

function calculateRiskDistribution(clients) {
  const distribution = { low: 0, medium: 0, high: 0, critical: 0 };
  clients.forEach(client => {
    if (distribution.hasOwnProperty(client.riskLevel)) {
      distribution[client.riskLevel]++;
    }
  });
  return distribution;
}

function calculateTotalPenaltyExposure(clients) {
  return clients.reduce((sum, client) => {
    // Use the helper function to clean and validate penalty exposure values
    const cleanPenaltyExposure = cleanPenaltyExposureValue(client.penaltyExposure);
    console.log(`🔍 Client "${client.name}": Original penalty exposure: ${client.penaltyExposure}, Clean penalty exposure: ${cleanPenaltyExposure}`);
    return sum + cleanPenaltyExposure;
  }, 0);
}

// Generate comprehensive dashboard data using enhanced approach
async function generateDashboardData(formData, organizationId) {
  console.log('🤖 Starting risk-based dashboard data generation...');
  console.log('📊 Form data received:', JSON.stringify(formData, null, 2));
  
  try {
    console.log('🔑 Checking Gemini API key...');
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not found in environment variables');
    }
    console.log('✅ Gemini API key found');
    
    console.log('🚀 Initializing enhanced data generator...');
    const enhancedGenerator = new EnhancedDataGenerator();
    
    console.log('📊 Generating complete client portfolio with relationships...');
    const generatedData = await enhancedGenerator.generateCompleteDashboardData(formData, organizationId);
    
    console.log('✅ Enhanced data generation completed');
    console.log('📊 Generated data summary:', {
      totalClients: generatedData?.summary?.totalClients || 0,
      totalRecords: generatedData?.summary?.totalRecords || 0,
      hasClientStates: generatedData?.data?.clientStates?.length > 0,
      hasNexusAlerts: generatedData?.data?.nexusAlerts?.length > 0,
      hasDecisionTables: generatedData?.data?.decisionTables?.length > 0
    });
    
    return generatedData;
    
  } catch (error) {
    console.error('❌ Error generating schema-based data:', error);
    console.log('🔄 Using fallback data...');
    console.log('💡 To enable AI data generation, set GEMINI_API_KEY in your .env file');
    return getFallbackDashboardData(formData, organizationId);
  }
}

// Fallback data generation function
async function getFallbackDashboardData(formData, organizationId) {
  console.log('🔄 Generating fallback data with database records...');
  
  try {
    // Create a basic client record in the database
    const client = await prisma.client.create({
      data: {
        organizationId,
        name: formData.clientName,
        slug: generateSlug(formData.clientName),
        industry: formData.industry || 'Technology',
        annualRevenue: parseRevenue(formData.annualRevenue),
        riskLevel: 'medium',
        qualityScore: 85,
        status: 'active',
        tags: ['generated', 'fallback'],
        primaryContactName: 'John Smith',
        primaryContactEmail: 'john@company.com',
        primaryContactPhone: '+1-555-0123',
        addressLine1: '123 Business St',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94105',
        country: 'US',
        notes: 'Fallback generated client'
      }
    });

    console.log('✅ Fallback client created with ID:', client.id);

    // Create basic client states
    const clientStates = [];
    for (const state of formData.priorityStates) {
      const clientState = await prisma.clientState.create({
        data: {
          clientId: client.id,
          organizationId,
          stateCode: state,
          stateName: getStateName(state),
          status: 'monitoring',
          thresholdAmount: 100000,
          currentAmount: Math.floor(Math.random() * 100000) + 50000,
          notes: 'Fallback generated state'
        }
      });
      clientStates.push(clientState);
    }

    // Create basic nexus alerts
    const nexusAlerts = [];
    if (formData.priorityStates.length > 0) {
      const nexusAlert = await prisma.nexusAlert.create({
        data: {
          clientId: client.id,
          organizationId,
          stateCode: formData.priorityStates[0],
          alertType: 'threshold_breach',
          priority: 'medium',
          status: 'open',
          title: 'Threshold Approaching',
          description: 'Current revenue is approaching the threshold',
          thresholdAmount: 100000,
          currentAmount: 85000,
          penaltyRisk: 15000
        }
      });
      nexusAlerts.push(nexusAlert);
    }

    // Create basic tasks
    const tasks = [];
    const task = await prisma.task.create({
      data: {
        organizationId,
        clientId: client.id,
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
    });
    tasks.push(task);

    return {
      client,
      clientStates,
      nexusAlerts,
      tasks,
      alerts: [],
      nexusActivities: [],
      businessProfile: null,
      contacts: [],
      businessLocations: [],
      revenueBreakdowns: [],
      customerDemographics: null,
      geographicDistributions: []
    };

  } catch (error) {
    console.error('❌ Error creating fallback data:', error);
    throw error;
  }
}

// Utility functions
function generateSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now();
}

function parseRevenue(revenueString) {
  if (!revenueString) return 1000000;
  const match = revenueString.match(/\$?([\d,]+)/);
  if (match) {
    return parseInt(match[1].replace(/,/g, '')) * 1000; // Convert K to actual number
  }
  return 1000000;
}

function getStateName(stateCode) {
  const stateNames = {
    'CA': 'California', 'NY': 'New York', 'TX': 'Texas', 'FL': 'Florida',
    'IL': 'Illinois', 'PA': 'Pennsylvania', 'OH': 'Ohio', 'GA': 'Georgia',
    'NC': 'North Carolina', 'MI': 'Michigan', 'NJ': 'New Jersey', 'VA': 'Virginia',
    'WA': 'Washington', 'AZ': 'Arizona', 'MA': 'Massachusetts', 'TN': 'Tennessee',
    'IN': 'Indiana', 'MO': 'Missouri', 'MD': 'Maryland', 'WI': 'Wisconsin'
  };
  return stateNames[stateCode] || stateCode;
}

// Test endpoint to check Gemini API
router.get('/test-gemini', async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(400).json({ error: 'GEMINI_API_KEY not found' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    
    const result = await model.generateContent("Hello, respond with 'API working'");
    const response = await result.response;
    const text = response.text();
    
    res.json({ 
      success: true, 
      message: 'Gemini API is working',
      response: text 
    });
  } catch (error) {
    console.error('Gemini API test error:', error);
    res.status(500).json({ 
      error: 'Gemini API test failed',
      details: error.message,
      status: error.status,
      statusText: error.statusText
    });
  }
});

// POST /api/dashboards/generate
router.post('/generate', async (req, res) => {
  console.log('🚀 Dashboard generation request received');
  console.log('📥 Request body:', JSON.stringify(req.body, null, 2));
  
  try {
    const { formData, organizationId } = req.body;

    if (!formData || !organizationId) {
      console.error('❌ Missing required fields:', { formData: !!formData, organizationId: !!organizationId });
      return res.status(400).json({ 
        error: 'Missing required fields: formData and organizationId are required' 
      });
    }

    console.log('📊 Generating risk-based dashboard data...');
    const generatedData = await generateDashboardData(formData, organizationId);
    
    console.log('📊 Generated data structure:', {
      hasClients: !!generatedData.data?.clients || !!generatedData.clients,
      clientCount: generatedData.data?.clients?.length || generatedData.clients?.length || 0,
      hasClientStates: !!generatedData.data?.clientStates,
      hasNexusAlerts: !!generatedData.data?.nexusAlerts,
      hasDecisionTables: !!generatedData.data?.decisionTables,
      totalRecords: generatedData.summary?.totalRecords || 0
    });
    
    const clients = generatedData.data?.clients || generatedData.clients;
    if (!generatedData || !clients || clients.length === 0) {
      console.error('❌ No clients generated or invalid data structure');
      return res.status(500).json({ 
        error: 'Failed to generate client data',
        details: 'No clients were created during the generation process'
      });
    }
    
    console.log('💾 Creating dashboard reference...');
    
    // Calculate portfolio metrics
    const totalClients = clients.length;
    const riskDistribution = generatedData.riskDistribution || calculateRiskDistribution(clients);
    const totalPenaltyExposure = generatedData.totalPenaltyExposure || calculateTotalPenaltyExposure(clients);
    const totalRevenue = clients.reduce((sum, c) => {
      // Use the helper function to clean and validate revenue values
      const cleanRevenue = cleanRevenueValue(c.annualRevenue);
      console.log(`🔍 Client "${c.name}": Original revenue: ${c.annualRevenue}, Clean revenue: ${cleanRevenue}`);
      return sum + cleanRevenue;
    }, 0);
    const averageQualityScore = totalClients > 0 ? Math.round(clients.reduce((sum, c) => sum + (c.qualityScore || 0), 0) / totalClients) : 0;
        
        console.log('💾 Creating dashboard with data:', {
          organizationId,
          clientName: formData.clientName,
          totalClients,
          totalRevenue,
          averageQualityScore
        });

    const generatedDashboard = await prisma.generatedDashboard.create({
      data: {
            organizationId,
        clientName: formData.clientName,
            uniqueUrl: generateUniqueUrl(formData.clientName),
            clientInfo: {
              name: formData.clientName,
              industry: formData.primaryIndustry || 'Technology',
              totalClients: totalClients,
              riskDistribution: riskDistribution,
              totalPenaltyExposure: totalPenaltyExposure
            },
            keyMetrics: {
              totalRevenue: totalRevenue,
              complianceScore: averageQualityScore,
              riskScore: (riskDistribution.critical || 0) * 25 + (riskDistribution.high || 0) * 15 + (riskDistribution.medium || 0) * 5,
              statesMonitored: formData.priorityStates.length,
              alertsActive: (generatedData.data?.nexusAlerts?.length || 0) + (generatedData.data?.alerts?.length || 0),
              tasksCompleted: generatedData.data?.tasks?.filter(t => t.status === 'completed').length || 0
            },
            statesMonitored: formData.priorityStates,
            personalizedData: {
              clientCount: totalClients,
              riskDistribution: riskDistribution,
              totalPenaltyExposure: totalPenaltyExposure,
              clientIds: clients.map(c => c.id),
              generatedAt: new Date().toISOString()
            },
            // Store comprehensive generated data
            generatedClients: generatedData.data?.clients || clients,
            generatedAlerts: generatedData.data?.alerts || [],
            generatedTasks: generatedData.data?.tasks || [],
            generatedAnalytics: {
              riskDistribution,
              totalPenaltyExposure,
              totalRevenue,
              averageQualityScore
            },
            generatedClientStates: generatedData.data?.clientStates || [],
            generatedNexusAlerts: generatedData.data?.nexusAlerts || [],
            generatedNexusActivities: generatedData.data?.nexusActivities || [],
            generatedSystemHealth: {
              totalRecords: generatedData.summary?.totalRecords || 0,
              dataCompleteness: '100%',
              lastGenerated: new Date().toISOString()
            },
            generatedReports: [],
            generatedCommunications: generatedData.data?.communications || [],
            generatedDecisions: generatedData.data?.decisionTables || [],
            lastUpdated: new Date()
          }
        });

    console.log('✅ Dashboard stored in database with ID:', generatedDashboard.id);

    // Generate all dashboard URLs for different roles
    const dashboardUrls = generateDashboardUrls(formData.clientName, generatedDashboard.uniqueUrl);
    
    const response = {
      success: true,
          data: {
        id: generatedDashboard.id,
        clientName: generatedDashboard.clientName,
        uniqueUrl: generatedDashboard.uniqueUrl,
        dashboardUrl: dashboardUrls.main,
        dashboardUrls: dashboardUrls, // Include all role-specific URLs
        clientInfo: generatedDashboard.clientInfo,
        keyMetrics: generatedDashboard.keyMetrics,
        statesMonitored: generatedDashboard.statesMonitored,
        personalizedData: generatedDashboard.personalizedData,
        lastUpdated: generatedDashboard.lastUpdated
      }
    };

    console.log('🎉 Dashboard generation completed successfully');
        console.log('📤 Response data:', {
          id: response.data.id,
          clientName: response.data.clientName,
          uniqueUrl: response.data.uniqueUrl,
          dashboardUrl: response.data.dashboardUrl
        });
    res.json(response);

  } catch (error) {
    console.error('❌ Error generating dashboard:', error);
    console.error('📋 Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      formData: req.body.formData,
      organizationId: req.body.organizationId
    });
    
    res.status(500).json({ 
      success: false,
      error: 'Failed to generate dashboard',
      details: error.message 
    });
  }
});

// GET /api/dashboards/:url
router.get('/:url', async (req, res) => {
  try {
    const { url } = req.params;
    console.log('🔍 Fetching dashboard for URL:', url);

    const dashboard = await prisma.generatedDashboard.findUnique({
      where: { 
        uniqueUrl: url,
        isActive: true 
      },
      include: {
        organization: {
          select: {
            name: true,
            slug: true
          }
        }
      }
    });

    if (!dashboard) {
      return res.status(404).json({ error: 'Dashboard not found' });
    }

    res.json({
      success: true,
      data: {
        id: dashboard.id,
        clientName: dashboard.clientName,
        uniqueUrl: dashboard.uniqueUrl,
        clientInfo: dashboard.clientInfo,
        keyMetrics: dashboard.keyMetrics,
        statesMonitored: dashboard.statesMonitored,
        personalizedData: dashboard.personalizedData,
        lastUpdated: dashboard.lastUpdated,
        organization: dashboard.organization
      }
    });

  } catch (error) {
    console.error('Error fetching dashboard:', error);
    res.status(500).json({ 
      error: 'Failed to fetch dashboard',
      details: error.message 
    });
  }
});

// GET /api/dashboards (list all for organization)
router.get('/', async (req, res) => {
  try {
    const { organizationId } = req.query;

    if (!organizationId) {
      return res.status(400).json({ error: 'Organization ID is required' });
    }

    const dashboards = await prisma.generatedDashboard.findMany({
      where: { 
        organizationId,
        isActive: true 
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        clientName: true,
        uniqueUrl: true,
        clientInfo: true,
        keyMetrics: true,
        statesMonitored: true,
        lastUpdated: true,
        createdAt: true
      }
    });

    res.json({
      success: true,
      dashboards: dashboards.map(dashboard => ({
        ...dashboard,
        dashboardUrl: `${process.env.FRONTEND_URL}/dashboard/view/${dashboard.uniqueUrl}`
      }))
    });

  } catch (error) {
    console.error('Error fetching dashboards:', error);
    res.status(500).json({ 
      error: 'Failed to fetch dashboards',
      details: error.message 
    });
  }
});

// DELETE /api/dashboards/delete-all - Delete all client data and dashboards
router.delete('/delete-all', async (req, res) => {
  console.log('🗑️ Delete all client data request received');
  
  try {
    console.log('🗑️ Deleting all data regardless of organization ID');

    // Delete all related data in the correct order to respect foreign key constraints
    const deleteResults = {
      generatedDashboards: 0,
      clients: 0,
      clientStates: 0,
      nexusAlerts: 0,
      nexusActivities: 0,
      alerts: 0,
      tasks: 0,
      businessProfiles: 0,
      contacts: 0,
      businessLocations: 0,
      revenueBreakdowns: 0,
      customerDemographics: 0,
      geographicDistributions: 0,
      professionalDecisions: 0,
      consultations: 0,
      communications: 0,
      documents: 0,
      auditTrails: 0,
      dataProcessing: 0
    };

    // Delete generated dashboards first
    const deletedDashboards = await prisma.generatedDashboard.deleteMany({});
    deleteResults.generatedDashboards = deletedDashboards.count;
    console.log('✅ Deleted generated dashboards:', deletedDashboards.count);

    // Delete all client-related data
    const deletedClients = await prisma.client.deleteMany({});
    deleteResults.clients = deletedClients.count;
    console.log('✅ Deleted clients:', deletedClients.count);

    // Delete client states
    const deletedClientStates = await prisma.clientState.deleteMany({});
    deleteResults.clientStates = deletedClientStates.count;
    console.log('✅ Deleted client states:', deletedClientStates.count);

    // Delete nexus alerts
    const deletedNexusAlerts = await prisma.nexusAlert.deleteMany({});
    deleteResults.nexusAlerts = deletedNexusAlerts.count;
    console.log('✅ Deleted nexus alerts:', deletedNexusAlerts.count);

    // Delete nexus activities
    const deletedNexusActivities = await prisma.nexusActivity.deleteMany({});
    deleteResults.nexusActivities = deletedNexusActivities.count;
    console.log('✅ Deleted nexus activities:', deletedNexusActivities.count);

    // Delete alerts
    const deletedAlerts = await prisma.alert.deleteMany({});
    deleteResults.alerts = deletedAlerts.count;
    console.log('✅ Deleted alerts:', deletedAlerts.count);

    // Delete tasks
    const deletedTasks = await prisma.task.deleteMany({});
    deleteResults.tasks = deletedTasks.count;
    console.log('✅ Deleted tasks:', deletedTasks.count);

    // Delete business profiles
    const deletedBusinessProfiles = await prisma.businessProfile.deleteMany({});
    deleteResults.businessProfiles = deletedBusinessProfiles.count;
    console.log('✅ Deleted business profiles:', deletedBusinessProfiles.count);

    // Delete contacts
    const deletedContacts = await prisma.contact.deleteMany({});
    deleteResults.contacts = deletedContacts.count;
    console.log('✅ Deleted contacts:', deletedContacts.count);

    // Delete business locations
    const deletedBusinessLocations = await prisma.businessLocation.deleteMany({});
    deleteResults.businessLocations = deletedBusinessLocations.count;
    console.log('✅ Deleted business locations:', deletedBusinessLocations.count);

    // Delete revenue breakdowns
    const deletedRevenueBreakdowns = await prisma.revenueBreakdown.deleteMany({});
    deleteResults.revenueBreakdowns = deletedRevenueBreakdowns.count;
    console.log('✅ Deleted revenue breakdowns:', deletedRevenueBreakdowns.count);

    // Delete customer demographics
    const deletedCustomerDemographics = await prisma.customerDemographics.deleteMany({});
    deleteResults.customerDemographics = deletedCustomerDemographics.count;
    console.log('✅ Deleted customer demographics:', deletedCustomerDemographics.count);

    // Delete geographic distributions
    const deletedGeographicDistributions = await prisma.geographicDistribution.deleteMany({});
    deleteResults.geographicDistributions = deletedGeographicDistributions.count;
    console.log('✅ Deleted geographic distributions:', deletedGeographicDistributions.count);

    // Delete professional decisions
    const deletedProfessionalDecisions = await prisma.professionalDecision.deleteMany({});
    deleteResults.professionalDecisions = deletedProfessionalDecisions.count;
    console.log('✅ Deleted professional decisions:', deletedProfessionalDecisions.count);

    // Delete consultations
    const deletedConsultations = await prisma.consultation.deleteMany({});
    deleteResults.consultations = deletedConsultations.count;
    console.log('✅ Deleted consultations:', deletedConsultations.count);

    // Delete communications
    const deletedCommunications = await prisma.communication.deleteMany({});
    deleteResults.communications = deletedCommunications.count;
    console.log('✅ Deleted communications:', deletedCommunications.count);

    // Delete documents
    const deletedDocuments = await prisma.document.deleteMany({});
    deleteResults.documents = deletedDocuments.count;
    console.log('✅ Deleted documents:', deletedDocuments.count);

    // Delete audit trails
    const deletedAuditTrails = await prisma.auditTrail.deleteMany({});
    deleteResults.auditTrails = deletedAuditTrails.count;
    console.log('✅ Deleted audit trails:', deletedAuditTrails.count);

    // Delete data processing records
    const deletedDataProcessing = await prisma.dataProcessing.deleteMany({});
    deleteResults.dataProcessing = deletedDataProcessing.count;
    console.log('✅ Deleted data processing records:', deletedDataProcessing.count);

    const totalDeleted = Object.values(deleteResults).reduce((sum, count) => sum + count, 0);

    console.log('🎉 All client data deleted successfully');
    console.log('📊 Deletion summary:', deleteResults);
    console.log('📊 Total records deleted:', totalDeleted);

    res.json({
      success: true,
      data: {
        deletedCount: totalDeleted,
        details: deleteResults
      }
    });

  } catch (error) {
    console.error('❌ Error deleting all client data:', error);
    res.status(500).json({ 
      error: 'Failed to delete client data',
      details: error.message 
    });
  }
});

// DELETE /api/dashboards/:id - Delete a specific dashboard and its related data
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { organizationId: queryOrganizationId } = req.query;
    
    console.log('🗑️ Delete dashboard request received');
    console.log('📋 Request details:', {
      dashboardId: id,
      organizationId: queryOrganizationId,
      timestamp: new Date().toISOString(),
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress
    });

    // First, get the dashboard to find related data
    const dashboard = await prisma.generatedDashboard.findUnique({
      where: { id },
      include: {
        organization: {
          select: { id: true }
        }
      }
    });

    if (!dashboard) {
      console.log('❌ Dashboard not found:', id);
      return res.status(404).json({ error: 'Dashboard not found' });
    }

    const organizationId = dashboard.organizationId;
    console.log('🗑️ Deleting dashboard and related data');
    console.log('📊 Dashboard details:', {
      id: dashboard.id,
      name: dashboard.clientName,
      uniqueUrl: dashboard.uniqueUrl,
      organizationId: organizationId,
      createdAt: dashboard.createdAt,
      lastUpdated: dashboard.lastUpdated
    });

    // Get the client IDs from personalized data
    const clientIds = dashboard.personalizedData?.clientIds || [];
    console.log('🔍 Client IDs from personalized data:', clientIds);
    
    const deleteResults = {
      generatedDashboard: 0,
      clients: 0,
      clientStates: 0,
      nexusAlerts: 0,
      nexusActivities: 0,
      alerts: 0,
      tasks: 0,
      businessProfiles: 0,
      contacts: 0,
      businessLocations: 0,
      revenueBreakdowns: 0,
      customerDemographics: 0,
      geographicDistributions: 0,
      professionalDecisions: 0,
      consultations: 0,
      communications: 0,
      documents: 0,
      auditTrails: 0,
      dataProcessing: 0
    };

    // Delete related data if clientIds exist
    if (clientIds && clientIds.length > 0) {
      console.log('🗑️ Deleting related client data for clientIds:', clientIds);
      
      // Delete client states
      console.log('🗑️ Deleting client states...');
      const deletedClientStates = await prisma.clientState.deleteMany({
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.clientStates = deletedClientStates.count;
      console.log('✅ Deleted client states:', deletedClientStates.count);

      // Delete nexus alerts
      const deletedNexusAlerts = await prisma.nexusAlert.deleteMany({
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.nexusAlerts = deletedNexusAlerts.count;

      // Delete nexus activities
      const deletedNexusActivities = await prisma.nexusActivity.deleteMany({
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.nexusActivities = deletedNexusActivities.count;

      // Delete alerts
      const deletedAlerts = await prisma.alert.deleteMany({
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.alerts = deletedAlerts.count;

      // Delete tasks
      const deletedTasks = await prisma.task.deleteMany({
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.tasks = deletedTasks.count;

      // Delete business profiles
      const deletedBusinessProfiles = await prisma.businessProfile.deleteMany({
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.businessProfiles = deletedBusinessProfiles.count;

      // Delete contacts
      const deletedContacts = await prisma.contact.deleteMany({
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.contacts = deletedContacts.count;

      // Delete business locations
      const deletedBusinessLocations = await prisma.businessLocation.deleteMany({
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.businessLocations = deletedBusinessLocations.count;

      // Delete revenue breakdowns
      const deletedRevenueBreakdowns = await prisma.revenueBreakdown.deleteMany({
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.revenueBreakdowns = deletedRevenueBreakdowns.count;

      // Delete customer demographics
      const deletedCustomerDemographics = await prisma.customerDemographics.deleteMany({
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.customerDemographics = deletedCustomerDemographics.count;

      // Delete geographic distributions
      const deletedGeographicDistributions = await prisma.geographicDistribution.deleteMany({
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.geographicDistributions = deletedGeographicDistributions.count;

      // Delete professional decisions
      const deletedProfessionalDecisions = await prisma.professionalDecision.deleteMany({
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.professionalDecisions = deletedProfessionalDecisions.count;

      // Delete consultations
      const deletedConsultations = await prisma.consultation.deleteMany({
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.consultations = deletedConsultations.count;

      // Delete communications
      const deletedCommunications = await prisma.communication.deleteMany({
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.communications = deletedCommunications.count;

      // Delete documents
      const deletedDocuments = await prisma.document.deleteMany({
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.documents = deletedDocuments.count;

      // Delete audit trails
      const deletedAuditTrails = await prisma.auditTrail.deleteMany({
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.auditTrails = deletedAuditTrails.count;

      // Delete data processing records
      const deletedDataProcessing = await prisma.dataProcessing.deleteMany({
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.dataProcessing = deletedDataProcessing.count;

      // Finally, delete the clients
      const deletedClients = await prisma.client.deleteMany({
        where: { 
          id: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.clients = deletedClients.count;
      console.log('✅ Deleted clients:', deletedClients.count);
    } else {
      console.log('⚠️ No client IDs found in personalized data, skipping client data deletion');
    }

    // Delete the generated dashboard
    console.log('🗑️ Deleting generated dashboard...');
    const deletedDashboard = await prisma.generatedDashboard.delete({
      where: { id }
    });
    deleteResults.generatedDashboard = 1;
    console.log('✅ Deleted generated dashboard:', deletedDashboard.clientName);

    const totalDeleted = Object.values(deleteResults).reduce((sum, count) => sum + count, 0);

    console.log('🎉 Dashboard and related data deleted successfully');
    console.log('📊 Deletion summary:', deleteResults);
    console.log('📊 Total records deleted:', totalDeleted);
    console.log('📋 Deleted dashboard details:', {
      id: dashboard.id,
      clientName: dashboard.clientName,
      uniqueUrl: dashboard.uniqueUrl,
      clientIds: clientIds,
      organizationId: organizationId
    });
    console.log('⏱️ Deletion completed at:', new Date().toISOString());

    res.json({
      success: true,
      data: {
        deleted: true,
        deletedCount: totalDeleted,
        details: deleteResults
      }
    });

  } catch (error) {
    console.error('❌ Error deleting dashboard:', error);
    console.error('📋 Error details:', {
      dashboardId: req.params.id,
      organizationId: req.query.organizationId,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({ 
      error: 'Failed to delete dashboard',
      details: error.message 
    });
  }
});

// DELETE /api/dashboards/url/:url - Delete a specific dashboard by URL and its related data
router.delete('/url/:url', async (req, res) => {
  try {
    const { url } = req.params;
    const { organizationId: queryOrganizationId } = req.query;
    
    console.log('🗑️ Delete dashboard by URL request received');
    console.log('📋 Request details:', {
      dashboardUrl: url,
      organizationId: queryOrganizationId,
      timestamp: new Date().toISOString(),
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection.remoteAddress
    });

    // First, get the dashboard by URL
    const dashboard = await prisma.generatedDashboard.findUnique({
      where: { uniqueUrl: url },
      include: {
        organization: {
          select: { id: true }
        }
      }
    });

    if (!dashboard) {
      console.log('❌ Dashboard not found:', url);
      return res.status(404).json({ error: 'Dashboard not found' });
    }

    const organizationId = dashboard.organizationId;
    console.log('🗑️ Deleting dashboard and related data');
    console.log('📊 Dashboard details:', {
      id: dashboard.id,
      name: dashboard.clientName,
      uniqueUrl: dashboard.uniqueUrl,
      organizationId: organizationId,
      createdAt: dashboard.createdAt,
      lastUpdated: dashboard.lastUpdated
    });

    // Get the client IDs from personalized data
    const clientIds = dashboard.personalizedData?.clientIds || [];
    console.log('🔍 Client IDs from personalized data:', clientIds);
    
    const deleteResults = {
      generatedDashboard: 0,
      clients: 0,
      clientStates: 0,
      nexusAlerts: 0,
      nexusActivities: 0,
      alerts: 0,
      tasks: 0,
      businessProfiles: 0,
      contacts: 0,
      businessLocations: 0,
      revenueBreakdowns: 0,
      customerDemographics: 0,
      geographicDistributions: 0,
      professionalDecisions: 0,
      consultations: 0,
      communications: 0,
      documents: 0,
      auditTrails: 0,
      dataProcessing: 0
    };

    // Delete related data if clientIds exist
    if (clientIds && clientIds.length > 0) {
      console.log('🗑️ Deleting related client data for clientIds:', clientIds);
      
      // Delete client states
      console.log('🗑️ Deleting client states...');
      const deletedClientStates = await prisma.clientState.deleteMany({
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.clientStates = deletedClientStates.count;
      console.log('✅ Deleted client states:', deletedClientStates.count);

      // Delete nexus alerts
      const deletedNexusAlerts = await prisma.nexusAlert.deleteMany({
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.nexusAlerts = deletedNexusAlerts.count;
      console.log('✅ Deleted nexus alerts:', deletedNexusAlerts.count);

      // Delete nexus activities
      const deletedNexusActivities = await prisma.nexusActivity.deleteMany({
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.nexusActivities = deletedNexusActivities.count;
      console.log('✅ Deleted nexus activities:', deletedNexusActivities.count);

      // Delete alerts
      const deletedAlerts = await prisma.alert.deleteMany({
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.alerts = deletedAlerts.count;
      console.log('✅ Deleted alerts:', deletedAlerts.count);

      // Delete tasks
      const deletedTasks = await prisma.task.deleteMany({
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.tasks = deletedTasks.count;
      console.log('✅ Deleted tasks:', deletedTasks.count);

      // Delete business profiles
      const deletedBusinessProfiles = await prisma.businessProfile.deleteMany({
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.businessProfiles = deletedBusinessProfiles.count;
      console.log('✅ Deleted business profiles:', deletedBusinessProfiles.count);

      // Delete contacts
      const deletedContacts = await prisma.contact.deleteMany({
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.contacts = deletedContacts.count;
      console.log('✅ Deleted contacts:', deletedContacts.count);

      // Delete business locations
      const deletedBusinessLocations = await prisma.businessLocation.deleteMany({
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.businessLocations = deletedBusinessLocations.count;
      console.log('✅ Deleted business locations:', deletedBusinessLocations.count);

      // Delete revenue breakdowns
      const deletedRevenueBreakdowns = await prisma.revenueBreakdown.deleteMany({
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.revenueBreakdowns = deletedRevenueBreakdowns.count;
      console.log('✅ Deleted revenue breakdowns:', deletedRevenueBreakdowns.count);

      // Delete customer demographics
      const deletedCustomerDemographics = await prisma.customerDemographic.deleteMany({
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.customerDemographics = deletedCustomerDemographics.count;
      console.log('✅ Deleted customer demographics:', deletedCustomerDemographics.count);

      // Delete geographic distributions
      const deletedGeographicDistributions = await prisma.geographicDistribution.deleteMany({
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.geographicDistributions = deletedGeographicDistributions.count;
      console.log('✅ Deleted geographic distributions:', deletedGeographicDistributions.count);

      // Delete professional decisions
      const deletedProfessionalDecisions = await prisma.professionalDecision.deleteMany({
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.professionalDecisions = deletedProfessionalDecisions.count;
      console.log('✅ Deleted professional decisions:', deletedProfessionalDecisions.count);

      // Delete consultations
      const deletedConsultations = await prisma.consultation.deleteMany({
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.consultations = deletedConsultations.count;
      console.log('✅ Deleted consultations:', deletedConsultations.count);

      // Delete communications
      const deletedCommunications = await prisma.communication.deleteMany({
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.communications = deletedCommunications.count;
      console.log('✅ Deleted communications:', deletedCommunications.count);

      // Delete documents
      const deletedDocuments = await prisma.document.deleteMany({
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.documents = deletedDocuments.count;
      console.log('✅ Deleted documents:', deletedDocuments.count);

      // Delete audit trails
      const deletedAuditTrails = await prisma.auditTrail.deleteMany({
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.auditTrails = deletedAuditTrails.count;
      console.log('✅ Deleted audit trails:', deletedAuditTrails.count);

      // Delete data processing records
      const deletedDataProcessing = await prisma.dataProcessing.deleteMany({
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.dataProcessing = deletedDataProcessing.count;
      console.log('✅ Deleted data processing records:', deletedDataProcessing.count);

      // Finally, delete the clients themselves
      console.log('🗑️ Deleting clients...');
      const deletedClients = await prisma.client.deleteMany({
        where: { 
          id: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.clients = deletedClients.count;
      console.log('✅ Deleted clients:', deletedClients.count);
    } else {
      console.log('⚠️ No client IDs found in personalized data, skipping client data deletion');
    }

    // Delete the generated dashboard
    console.log('🗑️ Deleting generated dashboard...');
    const deletedDashboard = await prisma.generatedDashboard.delete({
      where: { uniqueUrl: url }
    });
    deleteResults.generatedDashboard = 1;
    console.log('✅ Deleted generated dashboard:', deletedDashboard.clientName);

    const totalDeleted = Object.values(deleteResults).reduce((sum, count) => sum + count, 0);

    console.log('🎉 Dashboard and related data deleted successfully');
    console.log('📊 Deletion summary:', deleteResults);
    console.log('📊 Total records deleted:', totalDeleted);
    console.log('📋 Deleted dashboard details:', {
      id: dashboard.id,
      clientName: dashboard.clientName,
      uniqueUrl: dashboard.uniqueUrl,
      clientIds: clientIds,
      organizationId: organizationId
    });
    console.log('⏱️ Deletion completed at:', new Date().toISOString());

    res.json({
      success: true,
      data: {
        deleted: true,
        deletedCount: totalDeleted,
        details: deleteResults
      }
    });

  } catch (error) {
    console.error('❌ Error deleting dashboard by URL:', error);
    console.error('📋 Error details:', {
      dashboardUrl: req.params.url,
      organizationId: req.query.organizationId,
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({ 
      error: 'Failed to delete dashboard',
      details: error.message 
    });
  }
});

module.exports = router;
