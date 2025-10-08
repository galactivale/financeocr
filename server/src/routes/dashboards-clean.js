const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const DashboardDataGenerator = require('../services/dashboardDataGenerator');
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

// Generate comprehensive dashboard data using the new service
async function generateDashboardData(formData) {
  console.log('🤖 Starting comprehensive dashboard data generation...');
  console.log('📊 Form data received:', JSON.stringify(formData, null, 2));
  
  try {
    console.log('🔑 Checking Gemini API key...');
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not found in environment variables');
    }
    console.log('✅ Gemini API key found');
    
    console.log('🚀 Initializing comprehensive data generator...');
    const dataGenerator = new DashboardDataGenerator();
    
    console.log('📊 Generating comprehensive dashboard data...');
    const comprehensiveData = await dataGenerator.generateComprehensiveDashboardData(formData);
    
    console.log('✅ Comprehensive dashboard data generation completed');
    return comprehensiveData;
    
  } catch (error) {
    console.error('❌ Error generating comprehensive dashboard data:', error);
    console.log('🔄 Using fallback data...');
    return getFallbackDashboardData(formData);
  }
}

// Fallback data generation function
function getFallbackDashboardData(formData) {
  return {
    clientInfo: {
      name: formData.clientName,
      industry: formData.industry || 'Technology',
      annualRevenue: formData.annualRevenue || '$1M - $5M',
      businessModel: formData.businessModel || 'B2B SaaS',
      states: formData.priorityStates,
      riskLevel: 'medium',
      complianceScore: 85
    },
    keyMetrics: {
      totalRevenue: formData.annualRevenue || '$1M - $5M',
      complianceScore: 85,
      riskScore: 15,
      statesMonitored: formData.priorityStates.length,
      alertsActive: 3,
      tasksCompleted: 12
    },
    statesMonitored: formData.priorityStates,
    lastUpdated: new Date().toISOString(),
    personalizedData: {
      clients: formData.priorityStates.map((state, index) => ({
        id: `client-${index + 1}`,
        name: `${formData.clientName} - ${state}`,
        state: state,
        revenue: Math.floor(Math.random() * 100000) + 50000,
        riskLevel: 'medium',
        lastActivity: new Date().toISOString(),
        nexusStatus: 'active'
      })),
      alerts: [
        {
          id: 'alert-1',
          type: 'nexus',
          severity: 'medium',
          message: `Threshold approaching in ${formData.priorityStates[0]}`,
          state: formData.priorityStates[0],
          createdAt: new Date().toISOString(),
          status: 'active'
        }
      ],
      tasks: [
        {
          id: 'task-1',
          title: 'Review compliance status',
          description: 'Review compliance status for all states',
          priority: 'high',
          status: 'pending',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          assignedTo: 'Staff Accountant'
        }
      ],
      analytics: {
        totalClients: 1,
        activeNexusStates: formData.priorityStates.length,
        complianceScore: 85,
        revenueGrowth: 12,
        riskDistribution: {
          low: 60,
          medium: 30,
          high: 10
        }
      }
    }
  };
}

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

    console.log('📊 Generating dashboard data...');
    const dashboardData = await generateDashboardData(formData);
    
    console.log('💾 Storing dashboard in database...');
    const generatedDashboard = await prisma.generatedDashboard.create({
      data: {
        organizationId,
        clientName: formData.clientName,
        uniqueUrl: generateUniqueUrl(formData.clientName),
        clientInfo: dashboardData.clientInfo,
        keyMetrics: dashboardData.keyMetrics,
        statesMonitored: dashboardData.statesMonitored,
        personalizedData: dashboardData.personalizedData,
        // Store comprehensive generated data
        generatedClients: dashboardData.generatedClients,
        generatedAlerts: dashboardData.generatedAlerts,
        generatedTasks: dashboardData.generatedTasks,
        generatedAnalytics: dashboardData.generatedAnalytics,
        generatedClientStates: dashboardData.generatedClientStates,
        generatedNexusAlerts: dashboardData.generatedNexusAlerts,
        generatedNexusActivities: dashboardData.generatedNexusActivities,
        generatedSystemHealth: dashboardData.generatedSystemHealth,
        generatedReports: dashboardData.generatedReports,
        generatedCommunications: dashboardData.generatedCommunications,
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


