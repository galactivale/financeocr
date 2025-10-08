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
    api: process.env.GEMINI_API_KEY,
    name: "gemini-2.5-flash-lite",
    generationConfig: {
      temperature: 0.9,
      topK: 40,
      topP: 0.8,
      maxOutputTokens: 2048
    }
  }
};

const genAI = new GoogleGenerativeAI(geminiConfig.token);

// Generate unique URL slug
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
        "complianceRate": "percentage between 85-98%",
        "lastAuditDate": "recent date in YYYY-MM-DD format",
        "monthlyTransactions": "realistic number based on client size",
        "annualTaxLiability": "realistic amount based on revenue",
        "nexusThresholds": "realistic thresholds for their states"
      },
      "statesMonitored": ${JSON.stringify(formData.priorityStates)},
      "lastUpdated": "current date in YYYY-MM-DD format",
      "personalizedData": {
        "clients": [
          {
            "id": "client-1",
            "name": "Realistic client name for ${formData.clientName}'s business",
            "state": "${formData.priorityStates[0] || 'CA'}",
            "revenue": "realistic revenue",
            "riskLevel": "low|medium|high",
            "lastActivity": "recent date",
            "nexusStatus": "active|inactive|pending"
          }
        ],
        "alerts": [
          {
            "id": "alert-1",
            "type": "nexus|compliance|threshold",
            "severity": "low|medium|high|critical",
            "message": "Specific alert message relevant to ${formData.clientName}'s business",
            "state": "${formData.priorityStates[0] || 'CA'}",
            "createdAt": "recent date",
            "status": "active|resolved|pending"
          }
        ],
        "tasks": [
          {
            "id": "task-1",
            "title": "Task specific to ${formData.clientName}'s pain points",
            "description": "Detailed task description",
            "priority": "low|medium|high|urgent",
            "status": "pending|in-progress|completed",
            "dueDate": "upcoming date",
            "assignedTo": "Staff Accountant"
          }
        ],
        "analytics": {
          "totalClients": "realistic number based on client count",
          "activeNexusStates": ${formData.priorityStates.length},
          "complianceScore": "percentage",
          "revenueGrowth": "percentage",
          "riskDistribution": {
            "low": "percentage",
            "medium": "percentage", 
            "high": "percentage"
          }
        },
        "systemHealth": {
          "status": "healthy|warning|critical",
          "uptime": "percentage",
          "responseTime": "milliseconds",
          "activeUsers": "number",
          "dataProcessingRate": "transactions per minute"
        },
        "nexusAlerts": [
          {
            "id": "nexus-alert-1",
            "clientName": "Client name",
            "state": "${formData.priorityStates[0] || 'CA'}",
            "alertType": "threshold_exceeded|nexus_triggered|compliance_issue",
            "severity": "low|medium|high|critical",
            "message": "Specific nexus alert for ${formData.clientName}'s business",
            "createdAt": "recent date",
            "status": "active|resolved"
          }
        ],
        "nexusActivities": [
          {
            "id": "activity-1",
            "type": "nexus_created|threshold_updated|compliance_check",
            "description": "Activity description specific to ${formData.clientName}",
            "state": "${formData.priorityStates[0] || 'CA'}",
            "timestamp": "recent date",
            "userId": "user-id",
            "details": "Additional activity details"
          }
        ],
        "clientStates": [
          {
            "id": "client-state-1",
            "clientId": "client-1",
            "stateCode": "${formData.priorityStates[0] || 'CA'}",
            "status": "critical|warning|pending|transit|compliant",
            "revenue": "realistic revenue number (not string)",
            "lastUpdated": "recent ISO date",
            "client": {
              "id": "client-1",
              "name": "Realistic client name for ${formData.clientName}'s business",
              "legalName": "Realistic legal name",
              "industry": "${formData.primaryIndustry}"
            }
          },
          {
            "id": "client-state-2", 
            "clientId": "client-2",
            "stateCode": "${formData.priorityStates[1] || 'TX'}",
            "status": "critical|warning|pending|transit|compliant",
            "revenue": "realistic revenue number (not string)",
            "lastUpdated": "recent ISO date",
            "client": {
              "id": "client-2",
              "name": "Another realistic client name",
              "legalName": "Another legal name",
              "industry": "${formData.primaryIndustry}"
            }
          }
        ],
        "nexusAlerts": [
          {
            "id": "nexus-alert-1",
            "clientId": "client-1",
            "stateCode": "${formData.priorityStates[0] || 'CA'}",
            "priority": "high|medium|low",
            "status": "open|resolved|pending",
            "message": "Specific nexus alert message for ${formData.clientName}'s business",
            "createdAt": "recent ISO date"
          },
          {
            "id": "nexus-alert-2",
            "clientId": "client-2", 
            "stateCode": "${formData.priorityStates[1] || 'TX'}",
            "priority": "high|medium|low",
            "status": "open|resolved|pending",
            "message": "Another specific nexus alert message",
            "createdAt": "recent ISO date"
          }
        ]
      }
    }
    
    IMPORTANT: Make ALL data highly specific to ${formData.clientName} and their business context. 
    Use their industry, pain points, and client count to generate realistic, personalized data.
    The data should feel like it was generated specifically for their business needs.
    `;

    console.log('📝 Sending prompt to Gemini...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('📄 Raw Gemini response:', text);
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      console.log('✅ JSON extracted from response');
      const parsedData = JSON.parse(jsonMatch[0]);
      console.log('📊 Parsed dashboard data:', JSON.stringify(parsedData, null, 2));
      return parsedData;
    } else {
      console.error('❌ Could not extract JSON from Gemini response');
      throw new Error('Could not parse JSON from Gemini response');
    }
  } catch (error) {
    console.error('❌ Error generating dashboard data:', error);
    console.error('📋 Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    console.log('🔄 Using fallback data...');
    // Fallback data if Gemini fails - include comprehensive personalized data
    const fallbackData = {
      clientInfo: {
        description: `Personalized multi-state client dashboard for ${formData.clientName} with comprehensive tax monitoring`,
        industry: formData.primaryIndustry,
        clientCount: formData.multiStateClientCount,
        riskLevel: "medium",
        complianceScore: 90,
        companyName: formData.clientName,
        businessType: `${formData.primaryIndustry} Business`,
        foundedYear: "2015",
        headquarters: "New York, NY",
        employeeCount: "50-100"
      },
      keyMetrics: {
        description: `Real-time compliance tracking and threshold monitoring for ${formData.clientName}`,
        totalRevenue: "$2,500,000",
        nexusStates: formData.priorityStates.length,
        activeAlerts: 2,
        complianceRate: "94%",
        lastAuditDate: new Date().toISOString().split('T')[0],
        monthlyTransactions: 1500,
        annualTaxLiability: "$125,000",
        nexusThresholds: "Standard state thresholds"
      },
      statesMonitored: formData.priorityStates,
      lastUpdated: new Date().toISOString().split('T')[0],
      personalizedData: {
        clients: [
          {
            id: "client-1",
            name: `${formData.clientName} Client 1`,
            state: formData.priorityStates[0] || "CA",
            revenue: 250000,
            riskLevel: "medium",
            lastActivity: new Date().toISOString(),
            nexusStatus: "active"
          },
          {
            id: "client-2", 
            name: `${formData.clientName} Client 2`,
            state: formData.priorityStates[1] || "TX",
            revenue: 180000,
            riskLevel: "low",
            lastActivity: new Date().toISOString(),
            nexusStatus: "active"
          }
        ],
        alerts: [
          {
            id: "alert-1",
            type: "nexus",
            severity: "medium",
            message: `Nexus threshold approaching for ${formData.clientName} in ${formData.priorityStates[0] || "CA"}`,
            state: formData.priorityStates[0] || "CA",
            createdAt: new Date().toISOString(),
            status: "active"
          }
        ],
        tasks: [
          {
            id: "task-1",
            title: `Review ${formData.clientName} nexus compliance`,
            description: "Review and update nexus compliance for all states",
            priority: "high",
            status: "pending",
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            assignedTo: "Staff Accountant"
          }
        ],
        analytics: {
          totalClients: 2,
          activeNexusStates: formData.priorityStates.length,
          complianceScore: 94,
          revenueGrowth: 12,
          riskDistribution: {
            low: 50,
            medium: 40,
            high: 10
          }
        },
        systemHealth: {
          status: "healthy",
          uptime: 99.9,
          responseTime: 150,
          activeUsers: 5,
          dataProcessingRate: 100
        },
        nexusAlerts: [
          {
            id: "nexus-alert-1",
            clientName: `${formData.clientName} Client 1`,
            state: formData.priorityStates[0] || "CA",
            alertType: "threshold_exceeded",
            severity: "medium",
            message: `Revenue threshold exceeded for ${formData.clientName} in ${formData.priorityStates[0] || "CA"}`,
            createdAt: new Date().toISOString(),
            status: "active"
          }
        ],
        nexusActivities: [
          {
            id: "activity-1",
            type: "nexus_created",
            description: `Nexus created for ${formData.clientName} in ${formData.priorityStates[0] || "CA"}`,
            state: formData.priorityStates[0] || "CA",
            timestamp: new Date().toISOString(),
            userId: "user-1",
            details: "Initial nexus setup completed"
          }
        ],
        clientStates: [
          {
            id: "client-state-1",
            clientId: "client-1",
            stateCode: formData.priorityStates[0] || "CA",
            status: "warning",
            revenue: 250000,
            lastUpdated: new Date().toISOString(),
            client: {
              id: "client-1",
              name: `${formData.clientName} Client 1`,
              legalName: `${formData.clientName} Client 1 LLC`,
              industry: formData.primaryIndustry
            }
          },
          {
            id: "client-state-2",
            clientId: "client-2", 
            stateCode: formData.priorityStates[1] || "TX",
            status: "compliant",
            revenue: 180000,
            lastUpdated: new Date().toISOString(),
            client: {
              id: "client-2",
              name: `${formData.clientName} Client 2`,
              legalName: `${formData.clientName} Client 2 LLC`,
              industry: formData.primaryIndustry
            }
          }
        ]
      }
    };
    console.log('📊 Fallback data generated:', JSON.stringify(fallbackData, null, 2));
    return fallbackData;
  }
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
        error: 'Form data and organization ID are required' 
      });
    }

    console.log('✅ Request validation passed');
    console.log('📊 Form data:', JSON.stringify(formData, null, 2));
    console.log('🏢 Organization ID:', organizationId);

    // Check if organization exists, if not create a demo organization
    let orgId = organizationId;
    if (organizationId === 'demo-org-id') {
      console.log('🔍 Checking for demo organization...');
      let demoOrg = await prisma.organization.findFirst({
        where: { slug: 'demo-organization' }
      });
      
      if (!demoOrg) {
        console.log('🏗️ Creating demo organization...');
        demoOrg = await prisma.organization.create({
          data: {
            id: 'demo-org-id',
            slug: 'demo-organization',
            name: 'Demo Organization',
            legalName: 'Demo Organization LLC',
            taxId: '00-0000000',
            subscriptionTier: 'professional',
            subscriptionStatus: 'active',
            email: 'demo@example.com',
            phone: '+1-555-0000',
            website: 'https://demo.example.com',
            addressLine1: '123 Demo St',
            city: 'Demo City',
            state: 'DC',
            postalCode: '00000',
            country: 'US',
            settings: {
              timezone: 'America/New_York',
              currency: 'USD',
              dateFormat: 'MM/DD/YYYY'
            },
            branding: {
              primaryColor: '#3B82F6',
              logo: null
            },
            features: {
              analytics: true,
              integrations: true,
              multiUser: true,
              apiAccess: true
            }
          }
        });
        console.log('✅ Demo organization created with ID:', demoOrg.id);
      } else {
        console.log('✅ Demo organization found with ID:', demoOrg.id);
      }
      orgId = demoOrg.id;
    }

    // Generate unique URL
    console.log('🔗 Generating unique URL...');
    const uniqueUrl = generateUniqueUrl(formData.clientName);
    console.log('✅ Unique URL generated:', uniqueUrl);

    // Generate fake dashboard data using Gemini AI
    console.log('🤖 Calling Gemini AI...');
    const dashboardData = await generateDashboardData(formData);
    console.log('✅ Dashboard data generated successfully');
    
    // Ensure personalizedData exists
    if (!dashboardData.personalizedData) {
      console.log('⚠️ No personalized data found, using fallback...');
      dashboardData.personalizedData = {
        clients: [
          {
            id: "client-1",
            name: `${formData.clientName} Client 1`,
            state: formData.priorityStates[0] || "CA",
            revenue: 250000,
            riskLevel: "medium",
            lastActivity: new Date().toISOString(),
            nexusStatus: "active"
          }
        ],
        alerts: [
          {
            id: "alert-1",
            type: "nexus",
            severity: "medium",
            message: `Nexus threshold approaching for ${formData.clientName} in ${formData.priorityStates[0] || "CA"}`,
            state: formData.priorityStates[0] || "CA",
            createdAt: new Date().toISOString(),
            status: "active"
          }
        ],
        tasks: [
          {
            id: "task-1",
            title: `Review ${formData.clientName} nexus compliance`,
            description: "Review and update nexus compliance for all states",
            priority: "high",
            status: "pending",
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            assignedTo: "Staff Accountant"
          }
        ],
        analytics: {
          totalClients: 1,
          activeNexusStates: formData.priorityStates.length,
          complianceScore: 94,
          revenueGrowth: 12,
          riskDistribution: {
            low: 50,
            medium: 40,
            high: 10
          }
        },
        systemHealth: {
          status: "healthy",
          uptime: 99.9,
          responseTime: 150,
          activeUsers: 5,
          dataProcessingRate: 100
        },
        nexusAlerts: [
          {
            id: "nexus-alert-1",
            clientName: `${formData.clientName} Client 1`,
            state: formData.priorityStates[0] || "CA",
            alertType: "threshold_exceeded",
            severity: "medium",
            message: `Revenue threshold exceeded for ${formData.clientName} in ${formData.priorityStates[0] || "CA"}`,
            createdAt: new Date().toISOString(),
            status: "active"
          }
        ],
        nexusActivities: [
          {
            id: "activity-1",
            type: "nexus_created",
            description: `Nexus created for ${formData.clientName} in ${formData.priorityStates[0] || "CA"}`,
            state: formData.priorityStates[0] || "CA",
            timestamp: new Date().toISOString(),
            userId: "user-1",
            details: "Initial nexus setup completed"
          }
        ],
        clientStates: [
          {
            id: "client-state-1",
            clientId: "client-1",
            stateCode: formData.priorityStates[0] || "CA",
            status: "warning",
            revenue: 250000,
            lastUpdated: new Date().toISOString(),
            client: {
              id: "client-1",
              name: `${formData.clientName} Client 1`,
              legalName: `${formData.clientName} Client 1 LLC`,
              industry: formData.primaryIndustry
            }
          }
        ]
      };
    }

    // Store in database
    console.log('💾 Storing in database...');
    const generatedDashboard = await prisma.generatedDashboard.create({
      data: {
        organizationId: orgId,
        clientName: formData.clientName,
        uniqueUrl,
        clientInfo: dashboardData.clientInfo,
        keyMetrics: dashboardData.keyMetrics,
        statesMonitored: dashboardData.statesMonitored,
        personalizedData: dashboardData.personalizedData || {},
        lastUpdated: new Date(dashboardData.lastUpdated)
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

    const dashboard = await prisma.generatedDashboard.findUnique({
      where: { uniqueUrl: url },
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