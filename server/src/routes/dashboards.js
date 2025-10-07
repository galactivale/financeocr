const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { GoogleGenerativeAI } = require('@google/generative-ai');
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

// Generate fake dashboard data using Gemini AI
async function generateDashboardData(formData) {
  console.log('🤖 Starting dashboard data generation...');
  console.log('📊 Form data received:', JSON.stringify(formData, null, 2));
  
  try {
    console.log('🔑 Checking Gemini API key...');
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not found in environment variables');
    }
    console.log('✅ Gemini API key found');
    
    const model = genAI.getGenerativeModel({ 
      model: geminiConfig.gemini.name,
      generationConfig: geminiConfig.gemini.generationConfig
    });
    console.log('🤖 Gemini model initialized with config:', geminiConfig.gemini);
    
    const prompt = `
    Generate realistic fake dashboard data for a tax compliance monitoring system based on the following client information:
    
    Client Name: ${formData.clientName}
    Multi-state Client Count: ${formData.multiStateClientCount}
    Priority States: ${formData.priorityStates.join(', ')}
    Pain Points: ${formData.painPoints.join(', ')}
    Primary Industry: ${formData.primaryIndustry}
    Qualification Strategy: ${formData.qualificationStrategy}
    Additional Notes: ${formData.additionalNotes}
    
    Please generate a JSON response with the following structure:
    {
      "clientInfo": {
        "description": "Multi-state client dashboard with comprehensive tax monitoring",
        "industry": "${formData.primaryIndustry}",
        "clientCount": "${formData.multiStateClientCount}",
        "riskLevel": "medium|high|low",
        "complianceScore": 85-95
      },
      "keyMetrics": {
        "description": "Real-time compliance tracking and threshold monitoring",
        "totalRevenue": "realistic revenue amount in USD",
        "nexusStates": ${formData.priorityStates.length},
        "activeAlerts": "number between 0-5",
        "complianceRate": "percentage between 85-98%",
        "lastAuditDate": "recent date in YYYY-MM-DD format"
      },
      "statesMonitored": ${JSON.stringify(formData.priorityStates)},
      "lastUpdated": "current date in YYYY-MM-DD format"
    }
    
    Make the data realistic and consistent with the client's industry and size. Use appropriate revenue ranges based on the client count range.
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
    // Fallback data if Gemini fails
    const fallbackData = {
      clientInfo: {
        description: "Multi-state client dashboard with comprehensive tax monitoring",
        industry: formData.primaryIndustry,
        clientCount: formData.multiStateClientCount,
        riskLevel: "medium",
        complianceScore: 90
      },
      keyMetrics: {
        description: "Real-time compliance tracking and threshold monitoring",
        totalRevenue: "$2,500,000",
        nexusStates: formData.priorityStates.length,
        activeAlerts: 2,
        complianceRate: "94%",
        lastAuditDate: new Date().toISOString().split('T')[0]
      },
      statesMonitored: formData.priorityStates,
      lastUpdated: new Date().toISOString().split('T')[0]
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
        lastUpdated: new Date(dashboardData.lastUpdated)
      }
    });
    console.log('✅ Dashboard stored in database with ID:', generatedDashboard.id);

    const response = {
      success: true,
      dashboard: {
        id: generatedDashboard.id,
        clientName: generatedDashboard.clientName,
        uniqueUrl: generatedDashboard.uniqueUrl,
        dashboardUrl: `${process.env.FRONTEND_URL}/dashboard/view/${generatedDashboard.uniqueUrl}`,
        clientInfo: generatedDashboard.clientInfo,
        keyMetrics: generatedDashboard.keyMetrics,
        statesMonitored: generatedDashboard.statesMonitored,
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
      dashboard: {
        id: dashboard.id,
        clientName: dashboard.clientName,
        uniqueUrl: dashboard.uniqueUrl,
        clientInfo: dashboard.clientInfo,
        keyMetrics: dashboard.keyMetrics,
        statesMonitored: dashboard.statesMonitored,
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