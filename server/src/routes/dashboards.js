const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const SchemaBasedDataGenerator = require('../services/schemaBasedDataGenerator');
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

// Generate comprehensive dashboard data using schema-based approach
async function generateDashboardData(formData, organizationId) {
  console.log('🤖 Starting schema-based dashboard data generation...');
  console.log('📊 Form data received:', JSON.stringify(formData, null, 2));
  
  try {
    console.log('🔑 Checking Gemini API key...');
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not found in environment variables');
    }
    console.log('✅ Gemini API key found');
    
    console.log('🚀 Initializing schema-based data generator...');
    const dataGenerator = new SchemaBasedDataGenerator();
    
    console.log('📊 Generating comprehensive database records...');
    const generatedData = await dataGenerator.generateCompleteClientData(formData, organizationId);
    
    console.log('✅ Schema-based data generation completed');
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

    console.log('📊 Generating schema-based dashboard data...');
    const generatedData = await generateDashboardData(formData, organizationId);
    
    console.log('💾 Creating dashboard reference...');
    const generatedDashboard = await prisma.generatedDashboard.create({
      data: {
        organizationId,
        clientName: formData.clientName,
        uniqueUrl: generateUniqueUrl(formData.clientName),
        clientInfo: {
          name: generatedData.client.name,
          industry: generatedData.client.industry,
          annualRevenue: generatedData.client.annualRevenue,
          riskLevel: generatedData.client.riskLevel,
          qualityScore: generatedData.client.qualityScore
        },
        keyMetrics: {
          totalRevenue: generatedData.client.annualRevenue,
          complianceScore: generatedData.client.qualityScore,
          riskScore: generatedData.client.riskLevel === 'high' ? 25 : generatedData.client.riskLevel === 'medium' ? 15 : 5,
          statesMonitored: formData.priorityStates.length,
          alertsActive: generatedData.nexusAlerts?.length || 0,
          tasksCompleted: generatedData.tasks?.filter(t => t.status === 'completed').length || 0
        },
        statesMonitored: formData.priorityStates,
        personalizedData: {
          clientId: generatedData.client.id,
          generatedAt: new Date().toISOString()
        },
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
    console.log('📤 Response:', JSON.stringify(response, null, 2));
    res.json(response);

  } catch (error) {
    console.error('❌ Error generating dashboard:', error);
    console.error('📋 Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    res.status(500).json({ 
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

module.exports = router;
