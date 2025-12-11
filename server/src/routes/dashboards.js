const express = require('express');
const { PrismaClient } = require('@prisma/client');
const OpenAI = require('openai');
const RiskBasedDataGenerator = require('../services/riskBasedDataGenerator');
const EnhancedDataGenerator = require('../services/enhancedDataGenerator');
const router = express.Router();
const prisma = new PrismaClient();

// Generic safe deleteMany wrapper: skips if table is missing (P2021)
async function safeDeleteMany(modelDeleteMany, criteria) {
  try {
    const args = criteria
      ? (Object.prototype.hasOwnProperty.call(criteria, 'where') ? criteria : { where: criteria })
      : {};
    return await modelDeleteMany(args);
  } catch (error) {
    if (error && error.code === 'P2021') {
      console.warn('⚠️ Skipping deletion: table missing (P2021)');
      return { count: 0 };
    }
    throw error;
  }
}

// Initialize OpenAI with configuration (lazy initialization)
let openai = null;
function getOpenAI() {
  if (!openai && process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }
  return openai;
}

// Generate unique URL for dashboard
function generateUniqueUrl(clientName) {
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const cleanName = clientName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  return `${cleanName}-${timestamp}-${randomSuffix}`;
}

// Get base URL for frontend (with proper fallbacks)
function getFrontendBaseUrl() {
  // Priority: FRONTEND_URL > NEXT_PUBLIC_APP_URL > production default > localhost
  let baseUrl = process.env.FRONTEND_URL || 
                process.env.NEXT_PUBLIC_APP_URL || 
                (process.env.NODE_ENV === 'production' ? 'https://financeocr.com' : 'http://localhost:3000');
  
  // Ensure baseUrl doesn't have trailing slash
  return baseUrl.replace(/\/$/, '');
}

// Generate unique URLs for different dashboard roles
function generateDashboardUrls(clientName, uniqueUrl) {
  const baseUrl = getFrontendBaseUrl();
  
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
  console.log('📊 Form data received');
  
  try {
    console.log('🔑 Checking OpenAI API key...');
    if (!process.env.OPENAI_API_KEY) {
      console.log('⚠️ OPENAI_API_KEY not found, will use fallback data generation');
    } else {
      console.log('✅ OpenAI API key found');
    }
    
    console.log('🚀 Initializing enhanced data generator...');
    // Always use 'standard' strategy internally (qualification strategy removed)
    const enhancedGenerator = new EnhancedDataGenerator('standard');
    
    console.log('📊 Generating complete client portfolio with relationships...');
    const generatedData = await enhancedGenerator.generateCompleteDashboardData(formData, organizationId);
    
    console.log('✅ Enhanced data generation completed');
    console.log('📊 Generated data summary');
    
    return generatedData;
    
  } catch (error) {
    const errorMsg = `❌ Error generating schema-based data: ${error.message}`;
    console.error(errorMsg);
    throw error;
  }
}

// Fallback data generation function
async function getFallbackDashboardData(formData, organizationId) {
  console.log('🔄 Generating fallback data with database records...');
  
  try {
    // Create 10 client records in the database
    const clients = [];
    const industries = ['Technology', 'Healthcare', 'Manufacturing', 'Retail', 'Financial Services', 'Real Estate', 'Education', 'Automotive', 'Energy', 'Consulting'];
    const riskLevels = ['low', 'medium', 'high', 'critical'];
    const cities = ['San Francisco', 'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas'];
    const states = ['CA', 'NY', 'TX', 'IL', 'FL', 'PA', 'OH', 'GA', 'NC', 'MI'];

    for (let i = 0; i < 10; i++) {
      const industry = industries[i % industries.length];
      const riskLevel = riskLevels[i % riskLevels.length];
      const city = cities[i % cities.length];
      const state = states[i % states.length];
      const clientName = i === 0 ? formData.clientName : `${formData.clientName} Client ${i + 1}`;
      
      const client = await prisma.client.create({
        data: {
          organizationId,
          name: clientName,
          slug: generateSlug(clientName),
          industry: industry,
          annualRevenue: Math.floor(Math.random() * 5000000) + 500000, // Random revenue between 500K and 5.5M
          riskLevel: riskLevel,
          qualityScore: Math.floor(Math.random() * 40) + 60, // Random score between 60-100
          status: 'active',
          tags: ['generated', 'fallback', industry.toLowerCase()],
          primaryContactName: `Contact ${i + 1}`,
          primaryContactEmail: `contact${i + 1}@${clientName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
          primaryContactPhone: `+1-555-${String(i + 1).padStart(4, '0')}`,
          addressLine1: `${100 + i} Business St`,
          city: city,
          state: state,
          postalCode: `${10000 + i}`,
          country: 'US',
          notes: `Fallback generated client ${i + 1}`
        }
      });

      clients.push(client);
      console.log(`✅ Fallback client ${i + 1} created with ID:`, client.id);
    }

    // Create basic client states for all clients
    const clientStates = [];
    for (const client of clients) {
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
            notes: `Fallback generated state for ${client.name}`
          }
        });
        clientStates.push(clientState);
      }
    }

    // Create basic nexus alerts for some clients
    const nexusAlerts = [];
    for (let i = 0; i < Math.min(5, clients.length); i++) { // Create alerts for first 5 clients
      const client = clients[i];
      if (formData.priorityStates.length > 0) {
        const nexusAlert = await prisma.nexusAlert.create({
          data: {
            clientId: client.id,
            organizationId,
            stateCode: formData.priorityStates[i % formData.priorityStates.length],
            alertType: 'threshold_breach',
            priority: i % 2 === 0 ? 'high' : 'medium',
            status: 'open',
            title: `${client.name} Threshold Approaching`,
            description: `Current revenue is approaching the threshold for ${client.name}`,
            thresholdAmount: 100000,
            currentAmount: 85000 + (i * 5000),
            penaltyRisk: 15000 + (i * 2000)
          }
        });
        nexusAlerts.push(nexusAlert);
      }
    }

    // Create basic tasks for some clients
    const tasks = [];
    for (let i = 0; i < Math.min(3, clients.length); i++) { // Create tasks for first 3 clients
      const client = clients[i];
      const task = await prisma.task.create({
        data: {
          organizationId,
          clientId: client.id,
          title: `Review Compliance Status - ${client.name}`,
          description: `Review compliance status for all states for ${client.name}`,
          category: 'compliance',
          type: 'review',
          priority: i === 0 ? 'high' : 'medium',
          status: 'pending',
          stateCode: formData.priorityStates[i % formData.priorityStates.length] || 'CA',
          estimatedHours: 4 + i,
          progress: 0
        }
      });
      tasks.push(task);
    }

    return {
      data: {
        clients: clients, // Array of 10 clients
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
      },
      summary: {
        totalClients: clients.length,
        totalRecords: clientStates.length + nexusAlerts.length + tasks.length
      }
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

async function ensureCompliantVisualizationStates(organizationId, generatedData, formData = {}) {
  if (!organizationId || !generatedData) {
    return;
  }

  const dataSection = generatedData.data || generatedData;
  if (!dataSection) {
    return;
  }

  if (!Array.isArray(dataSection.clientStates)) {
    dataSection.clientStates = [];
  }
  if (!Array.isArray(dataSection.nexusAlerts)) {
    dataSection.nexusAlerts = [];
  }

  const clients = await prisma.client.findMany({
    where: { organizationId },
    select: { id: true, name: true, industry: true }
  });
  if (!clients.length) {
    return;
  }

  const targetCount = Math.max(1, Math.min(3, Math.floor(Math.random() * 3) + 1));
  const priorityStates = (formData.priorityStates || [])
    .map((state) => (state || '').toString().trim().toUpperCase())
    .filter(Boolean);
  const fallbackStates = ['CA', 'TX', 'FL', 'WA', 'NY', 'VA', 'CO'];

  const candidateStates = [...new Set([
    ...priorityStates,
    ...dataSection.clientStates
      .map((state) => (state.stateCode || state.state || state.code || '').toString().trim().toUpperCase())
      .filter(Boolean),
    ...fallbackStates
  ])];

  if (!candidateStates.length) {
    candidateStates.push('CA', 'TX', 'FL');
  }

  const clientStates = await prisma.clientState.findMany({
    where: { organizationId }
  });

  const alerts = await prisma.nexusAlert.findMany({
    where: { organizationId }
  });

  const alertMap = new Map();
  alerts.forEach((alert) => {
    const key = `${alert.clientId || 'org'}:${(alert.stateCode || '').toUpperCase()}`;
    const list = alertMap.get(key) || [];
    list.push(alert.id);
    alertMap.set(key, list);
  });

  const isZeroAlertState = (state) => {
    const key = `${state.clientId}:${(state.stateCode || '').toUpperCase()}`;
    return !alertMap.has(key);
  };

  const shuffle = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const ensuredStates = [];
  const existingCompliant = clientStates.filter(
    (state) => (state.status || '').toLowerCase() === 'compliant' && isZeroAlertState(state)
  );

  for (const state of shuffle(existingCompliant)) {
    ensuredStates.push(state);
    if (ensuredStates.length >= targetCount) {
      break;
    }
  }

  let remaining = targetCount - ensuredStates.length;

  if (remaining > 0) {
    const convertibleStates = shuffle(
      clientStates.filter((state) => !ensuredStates.some((selected) => selected.id === state.id))
    );

    for (const state of convertibleStates) {
      if (remaining <= 0) break;

      const thresholdAmount = state.thresholdAmount ? Number(state.thresholdAmount) : 150000;
      const currentAmount = Math.round(thresholdAmount * (0.18 + Math.random() * 0.12)); // 18-30%

      const updatedState = await prisma.clientState.update({
        where: { id: state.id },
        data: {
          status: 'compliant',
          registrationRequired: false,
          currentAmount,
          thresholdAmount,
          lastUpdated: new Date(),
          notes: 'Compliant state added for visual balance'
        }
      });

      await safeDeleteMany(prisma.nexusAlert.deleteMany.bind(prisma.nexusAlert), {
        where: {
          organizationId,
          clientId: updatedState.clientId,
          stateCode: updatedState.stateCode
        }
      });

      ensuredStates.push(updatedState);
      remaining -= 1;
    }
  }

  if (remaining > 0) {
    const usedStateCodes = new Set(clientStates.map((state) => (state.stateCode || '').toUpperCase()));
    const availableNewStates = candidateStates.filter((code) => !usedStateCodes.has(code));
    const statePool = availableNewStates.length ? availableNewStates : candidateStates;

    for (let i = 0; i < remaining; i++) {
      const client = clients[(i + Math.floor(Math.random() * clients.length)) % clients.length];
      const stateCode = statePool[(i + Math.floor(Math.random() * statePool.length)) % statePool.length] || 'CA';
      const thresholdAmount = 140000 + Math.floor(Math.random() * 60000);
      const currentAmount = Math.round(thresholdAmount * (0.15 + Math.random() * 0.1));

      const newState = await prisma.clientState.create({
        data: {
          organizationId,
          clientId: client.id,
          stateCode,
          stateName: getStateName(stateCode),
          status: 'compliant',
          registrationRequired: false,
          thresholdAmount,
          currentAmount,
          lastUpdated: new Date(),
          notes: `Compliant monitoring state for ${client.name}`
        }
      });

      ensuredStates.push(newState);
    }
  }

  if (ensuredStates.length) {
    const refreshedStates = await prisma.clientState.findMany({ where: { organizationId } });
    const refreshedAlerts = await prisma.nexusAlert.findMany({ where: { organizationId } });

    dataSection.clientStates = refreshedStates;
    dataSection.nexusAlerts = refreshedAlerts;
  }
}

// Validate critical DB schema before running costly AI generation
async function validateDatabaseSchema() {
  const issues = [];
  try {
    // Basic connectivity
    await prisma.$queryRaw`SELECT 1`;

    const requirements = [
      { table: 'clients', columns: ['slug'] },
      { table: 'client_states', columns: ['state_code', 'state_name', 'status', 'registration_required', 'threshold_amount', 'current_amount', 'last_updated', 'notes'] },
      { table: 'nexus_alerts', columns: ['client_id', 'organization_id', 'state_code', 'alert_type', 'priority', 'severity', 'status', 'title', 'threshold_amount', 'current_amount', 'acknowledged_at', 'acknowledged_by', 'resolved_at', 'resolved_by'] },
      { table: 'nexus_activities', columns: ['client_id', 'organization_id', 'state_code', 'activity_type', 'title', 'amount', 'threshold_amount', 'status'] },
      { table: 'alerts' },
      { table: 'tasks' },
      { table: 'business_profiles' },
      { table: 'contacts' },
      { table: 'business_locations' },
      { table: 'revenue_breakdowns' },
      { table: 'customer_demographics' },
      { table: 'geographic_distributions' },
      { table: 'professional_decisions' },
      { table: 'consultations' },
      { table: 'communications' },
      { table: 'documents' },
      { table: 'audit_trails' },
      { table: 'data_processing' },
      { table: 'generated_dashboards' }
    ];

    for (const req of requirements) {
      const [tbl] = await prisma.$queryRawUnsafe(
        `SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='${req.table}') AS exists`
      );
      if (!tbl?.exists) {
        issues.push(`Missing table ${req.table}`);
        continue;
      }
      if (req.columns && req.columns.length) {
        for (const col of req.columns) {
          const [colExists] = await prisma.$queryRawUnsafe(
            `SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='${req.table}' AND column_name='${col}') AS exists`
          );
          if (!colExists?.exists) issues.push(`Missing column ${req.table}.${col}`);
        }
      }
    }

    // Decision table is optional (code skips on P2021) – warn only
    const [decisionTable] = await prisma.$queryRawUnsafe(
      "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='decision_tables') AS exists"
    );
    if (!decisionTable?.exists) issues.push('Optional: missing table decision_tables (entries will be skipped)');
  } catch (e) {
    issues.push(`Database connectivity error: ${e?.message || e}`);
  }
  const onlyOptional = issues.length === 1 && issues[0].startsWith('Optional:');
  return { ok: issues.length === 0 || onlyOptional, issues };
}

// Test endpoint to check Gemini API
router.get('/test-openai', async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(400).json({ error: 'OPENAI_API_KEY not found' });
    }

    const openaiClient = getOpenAI();
    if (!openaiClient) {
      return res.status(400).json({ error: 'OPENAI_API_KEY not configured' });
    }
    const result = await openaiClient.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: "Hello, respond with 'API working'"
        }
      ],
      max_tokens: 50
    });
    const text = result.choices[0].message.content;
    
    res.json({ 
      success: true, 
      message: 'OpenAI API is working',
      response: text 
    });
  } catch (error) {
    console.error('OpenAI API test error:', error);
    res.status(500).json({ 
      error: 'OpenAI API test failed',
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
    const schema = await validateDatabaseSchema();
    if (!schema.ok) {
      console.error('❌ Database schema validation failed. Aborting generation to save API credits.', schema.issues);
      return res.status(500).json({ 
        error: 'Database schema not ready',
        issues: schema.issues
      });
    }

    const { formData } = req.body;

    if (!formData) {
      console.error('❌ Missing required fields:', { formData: !!formData });
      return res.status(400).json({ 
        error: 'Missing required fields: formData is required' 
      });
    }

    // Create a new organization for this dashboard
    console.log('🏢 Creating new organization for dashboard generation...');
    
    const orgSlug = `org-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    
    // Prepare organization data - only include absolutely required fields
    const orgData = {
      slug: orgSlug,
      name: `${formData.clientName} Dashboard Organization`
    };
    
    let newOrganization;
    try {
      newOrganization = await prisma.organization.create({
        data: orgData
      });

      console.log('✅ Organization created:', { id: newOrganization.id, name: newOrganization.name });
    } catch (orgError) {
      console.error('❌ Error creating organization:', orgError);
      return res.status(500).json({
        error: 'Failed to create organization',
        details: orgError.message
      });
    }

    // Get the organization ID from the created organization
    const finalOrganizationId = newOrganization.id;
    
    console.log('📊 Generating risk-based dashboard data...');
    let generatedData;
    try {
      generatedData = await generateDashboardData(formData, finalOrganizationId);
    } catch (err) {
      if (err && (err.code?.startsWith('P') || (err.name && err.name.toLowerCase().includes('prisma')))) {
        console.error('❌ Prisma error during generation. Aborting to save API credits:', err);
        return res.status(500).json({
          error: 'Database error during generation',
          details: err.message,
          code: err.code
        });
      }
      throw err;
    }
    
    await ensureCompliantVisualizationStates(finalOrganizationId, generatedData, formData);
    
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
      return sum + cleanRevenue;
    }, 0);
    const averageQualityScore = totalClients > 0 ? Math.round(clients.reduce((sum, c) => sum + (c.qualityScore || 0), 0) / totalClients) : 0;

    const generatedDashboard = await prisma.generatedDashboard.create({
      data: {
        organizationId: finalOrganizationId,
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
        lastUpdated: generatedDashboard.lastUpdated,
        organizationId: finalOrganizationId // Include the created organization ID
      }
    };

    console.log('🎉 Dashboard generation completed successfully');
    res.json(response);

  } catch (error) {
    console.error('❌ Error generating dashboard:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to generate dashboard',
      details: error.message 
    });
  }
});

// GET /api/dashboards/all (list all dashboards from all organizations)
router.get('/all', async (req, res) => {
  try {
    console.log('🔍 Fetching all dashboards from all organizations');

    const dashboards = await prisma.generatedDashboard.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        clientName: true,
        uniqueUrl: true,
        clientInfo: true,
        keyMetrics: true,
        statesMonitored: true,
        lastUpdated: true,
        createdAt: true,
        isActive: true,
        organizationId: true
      }
    });

    console.log(`📊 Found ${dashboards.length} dashboards across all organizations`);

    res.json({
      success: true,
      dashboards: dashboards.map(dashboard => ({
        ...dashboard,
        dashboardUrl: `${getFrontendBaseUrl()}/dashboard/view/${dashboard.uniqueUrl}`
      }))
    });

  } catch (error) {
    console.error('Error fetching all dashboards:', error);
    res.status(500).json({ 
      error: 'Failed to fetch all dashboards',
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
        uniqueUrl: url
        // Removed isActive filter to allow both active and archived dashboards
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
        organization: dashboard.organization,
        organizationId: dashboard.organizationId // Include organizationId for sessionStorage
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
        organizationId
        // Remove isActive filter to get both active and archived dashboards
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
        createdAt: true,
        isActive: true
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
    const deletedDashboards = await safeDeleteMany(prisma.generatedDashboard.deleteMany.bind(prisma.generatedDashboard));
    deleteResults.generatedDashboards = deletedDashboards.count;
    console.log('✅ Deleted generated dashboards:', deletedDashboards.count);

    // Delete all client-related data
    const deletedClients = await safeDeleteMany(prisma.client.deleteMany.bind(prisma.client));
    deleteResults.clients = deletedClients.count;
    console.log('✅ Deleted clients:', deletedClients.count);

    // Delete client states
    const deletedClientStates = await safeDeleteMany(prisma.clientState.deleteMany.bind(prisma.clientState));
    deleteResults.clientStates = deletedClientStates.count;
    console.log('✅ Deleted client states:', deletedClientStates.count);

    // Delete nexus alerts
    const deletedNexusAlerts = await safeDeleteMany(prisma.nexusAlert.deleteMany.bind(prisma.nexusAlert));
    deleteResults.nexusAlerts = deletedNexusAlerts.count;
    console.log('✅ Deleted nexus alerts:', deletedNexusAlerts.count);

    // Delete nexus activities
    const deletedNexusActivities = await safeDeleteMany(prisma.nexusActivity.deleteMany.bind(prisma.nexusActivity));
    deleteResults.nexusActivities = deletedNexusActivities.count;
    console.log('✅ Deleted nexus activities:', deletedNexusActivities.count);

    // Delete alerts
    const deletedAlerts = await safeDeleteMany(prisma.alert.deleteMany.bind(prisma.alert));
    deleteResults.alerts = deletedAlerts.count;
    console.log('✅ Deleted alerts:', deletedAlerts.count);

    // Delete tasks
    const deletedTasks = await safeDeleteMany(prisma.task.deleteMany.bind(prisma.task));
    deleteResults.tasks = deletedTasks.count;
    console.log('✅ Deleted tasks:', deletedTasks.count);

    // Delete business profiles
    const deletedBusinessProfiles = await safeDeleteMany(prisma.businessProfile.deleteMany.bind(prisma.businessProfile));
    deleteResults.businessProfiles = deletedBusinessProfiles.count;
    console.log('✅ Deleted business profiles:', deletedBusinessProfiles.count);

    // Delete contacts
    const deletedContacts = await safeDeleteMany(prisma.contact.deleteMany.bind(prisma.contact));
    deleteResults.contacts = deletedContacts.count;
    console.log('✅ Deleted contacts:', deletedContacts.count);

    // Delete business locations
    const deletedBusinessLocations = await safeDeleteMany(prisma.businessLocation.deleteMany.bind(prisma.businessLocation));
    deleteResults.businessLocations = deletedBusinessLocations.count;
    console.log('✅ Deleted business locations:', deletedBusinessLocations.count);

    // Delete revenue breakdowns
    const deletedRevenueBreakdowns = await safeDeleteMany(prisma.revenueBreakdown.deleteMany.bind(prisma.revenueBreakdown));
    deleteResults.revenueBreakdowns = deletedRevenueBreakdowns.count;
    console.log('✅ Deleted revenue breakdowns:', deletedRevenueBreakdowns.count);

    // Delete customer demographics
    const deletedCustomerDemographics = await safeDeleteMany(prisma.customerDemographics.deleteMany.bind(prisma.customerDemographics));
    deleteResults.customerDemographics = deletedCustomerDemographics.count;
    console.log('✅ Deleted customer demographics:', deletedCustomerDemographics.count);

    // Delete geographic distributions
    const deletedGeographicDistributions = await safeDeleteMany(prisma.geographicDistribution.deleteMany.bind(prisma.geographicDistribution));
    deleteResults.geographicDistributions = deletedGeographicDistributions.count;
    console.log('✅ Deleted geographic distributions:', deletedGeographicDistributions.count);

    // Delete professional decisions
    const deletedProfessionalDecisions = await safeDeleteMany(prisma.professionalDecision.deleteMany.bind(prisma.professionalDecision));
    deleteResults.professionalDecisions = deletedProfessionalDecisions.count;
    console.log('✅ Deleted professional decisions:', deletedProfessionalDecisions.count);

    // Delete consultations
    const deletedConsultations = await safeDeleteMany(prisma.consultation.deleteMany.bind(prisma.consultation));
    deleteResults.consultations = deletedConsultations.count;
    console.log('✅ Deleted consultations:', deletedConsultations.count);

    // Delete communications
    const deletedCommunications = await safeDeleteMany(prisma.communication.deleteMany.bind(prisma.communication));
    deleteResults.communications = deletedCommunications.count;
    console.log('✅ Deleted communications:', deletedCommunications.count);

    // Delete documents
    const deletedDocuments = await safeDeleteMany(prisma.document.deleteMany.bind(prisma.document));
    deleteResults.documents = deletedDocuments.count;
    console.log('✅ Deleted documents:', deletedDocuments.count);

    // Delete audit trails
    const deletedAuditTrails = await safeDeleteMany(prisma.auditTrail.deleteMany.bind(prisma.auditTrail));
    deleteResults.auditTrails = deletedAuditTrails.count;
    console.log('✅ Deleted audit trails:', deletedAuditTrails.count);

    // Delete data processing records
    const deletedDataProcessing = await safeDeleteMany(prisma.dataProcessing.deleteMany.bind(prisma.dataProcessing));
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
      const deletedClientStates = await safeDeleteMany(prisma.clientState.deleteMany.bind(prisma.clientState), {
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.clientStates = deletedClientStates.count;
      console.log('✅ Deleted client states:', deletedClientStates.count);

      // Delete nexus alerts
      const deletedNexusAlerts = await safeDeleteMany(prisma.nexusAlert.deleteMany.bind(prisma.nexusAlert), {
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.nexusAlerts = deletedNexusAlerts.count;

      // Delete nexus activities
      const deletedNexusActivities = await safeDeleteMany(prisma.nexusActivity.deleteMany.bind(prisma.nexusActivity), {
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.nexusActivities = deletedNexusActivities.count;

      // Delete alerts
      const deletedAlerts = await safeDeleteMany(prisma.alert.deleteMany.bind(prisma.alert), {
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.alerts = deletedAlerts.count;

      // Delete tasks
      const deletedTasks = await safeDeleteMany(prisma.task.deleteMany.bind(prisma.task), {
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.tasks = deletedTasks.count;

      // Delete business profiles
      const deletedBusinessProfiles = await safeDeleteMany(prisma.businessProfile.deleteMany.bind(prisma.businessProfile), { 
        clientId: { in: clientIds },
        organizationId 
      });
      deleteResults.businessProfiles = deletedBusinessProfiles.count;

      // Delete contacts
      const deletedContacts = await safeDeleteMany(prisma.contact.deleteMany.bind(prisma.contact), {
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.contacts = deletedContacts.count;

      // Delete business locations
      const deletedBusinessLocations = await safeDeleteMany(prisma.businessLocation.deleteMany.bind(prisma.businessLocation), {
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.businessLocations = deletedBusinessLocations.count;

      // Delete revenue breakdowns
      const deletedRevenueBreakdowns = await safeDeleteMany(prisma.revenueBreakdown.deleteMany.bind(prisma.revenueBreakdown), {
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.revenueBreakdowns = deletedRevenueBreakdowns.count;

      // Delete customer demographics
      const deletedCustomerDemographics = await safeDeleteMany(prisma.customerDemographics.deleteMany.bind(prisma.customerDemographics), {
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.customerDemographics = deletedCustomerDemographics.count;

      // Delete geographic distributions
      const deletedGeographicDistributions = await safeDeleteMany(prisma.geographicDistribution.deleteMany.bind(prisma.geographicDistribution), {
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.geographicDistributions = deletedGeographicDistributions.count;

      // Delete professional decisions
      const deletedProfessionalDecisions = await safeDeleteMany(prisma.professionalDecision.deleteMany.bind(prisma.professionalDecision), {
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.professionalDecisions = deletedProfessionalDecisions.count;

      // Delete consultations
      const deletedConsultations = await safeDeleteMany(prisma.consultation.deleteMany.bind(prisma.consultation), {
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.consultations = deletedConsultations.count;

      // Delete communications
      const deletedCommunications = await safeDeleteMany(prisma.communication.deleteMany.bind(prisma.communication), {
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.communications = deletedCommunications.count;

      // Delete documents
      const deletedDocuments = await safeDeleteMany(prisma.document.deleteMany.bind(prisma.document), {
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.documents = deletedDocuments.count;

      // Delete audit trails
      const deletedAuditTrails = await safeDeleteMany(prisma.auditTrail.deleteMany.bind(prisma.auditTrail), {
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.auditTrails = deletedAuditTrails.count;

      // Delete data processing records
      const deletedDataProcessing = await safeDeleteMany(prisma.dataProcessing.deleteMany.bind(prisma.dataProcessing), {
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.dataProcessing = deletedDataProcessing.count;

      // Finally, delete the clients
      const deletedClients = await safeDeleteMany(prisma.client.deleteMany.bind(prisma.client), {
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
      const deletedClientStates = await safeDeleteMany(prisma.clientState.deleteMany.bind(prisma.clientState), {
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.clientStates = deletedClientStates.count;
      console.log('✅ Deleted client states:', deletedClientStates.count);

      // Delete nexus alerts
      const deletedNexusAlerts = await safeDeleteMany(prisma.nexusAlert.deleteMany.bind(prisma.nexusAlert), {
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.nexusAlerts = deletedNexusAlerts.count;
      console.log('✅ Deleted nexus alerts:', deletedNexusAlerts.count);

      // Delete nexus activities
      const deletedNexusActivities = await safeDeleteMany(prisma.nexusActivity.deleteMany.bind(prisma.nexusActivity), {
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.nexusActivities = deletedNexusActivities.count;
      console.log('✅ Deleted nexus activities:', deletedNexusActivities.count);

      // Delete alerts
      const deletedAlerts = await safeDeleteMany(prisma.alert.deleteMany.bind(prisma.alert), {
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.alerts = deletedAlerts.count;
      console.log('✅ Deleted alerts:', deletedAlerts.count);

      // Delete tasks
      const deletedTasks = await safeDeleteMany(prisma.task.deleteMany.bind(prisma.task), {
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.tasks = deletedTasks.count;
      console.log('✅ Deleted tasks:', deletedTasks.count);

      // Delete business profiles
      const deletedBusinessProfiles = await safeDeleteMany(prisma.businessProfile.deleteMany.bind(prisma.businessProfile), { 
        clientId: { in: clientIds },
        organizationId 
      });
      deleteResults.businessProfiles = deletedBusinessProfiles.count;
      console.log('✅ Deleted business profiles:', deletedBusinessProfiles.count);

      // Delete contacts
      const deletedContacts = await safeDeleteMany(prisma.contact.deleteMany.bind(prisma.contact), {
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.contacts = deletedContacts.count;
      console.log('✅ Deleted contacts:', deletedContacts.count);

      // Delete business locations
      const deletedBusinessLocations = await safeDeleteMany(prisma.businessLocation.deleteMany.bind(prisma.businessLocation), {
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.businessLocations = deletedBusinessLocations.count;
      console.log('✅ Deleted business locations:', deletedBusinessLocations.count);

      // Delete revenue breakdowns
      const deletedRevenueBreakdowns = await safeDeleteMany(prisma.revenueBreakdown.deleteMany.bind(prisma.revenueBreakdown), {
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.revenueBreakdowns = deletedRevenueBreakdowns.count;
      console.log('✅ Deleted revenue breakdowns:', deletedRevenueBreakdowns.count);

      // Delete customer demographics
      const deletedCustomerDemographics = await safeDeleteMany(prisma.customerDemographic.deleteMany.bind(prisma.customerDemographic), {
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.customerDemographics = deletedCustomerDemographics.count;
      console.log('✅ Deleted customer demographics:', deletedCustomerDemographics.count);

      // Delete geographic distributions
      const deletedGeographicDistributions = await safeDeleteMany(prisma.geographicDistribution.deleteMany.bind(prisma.geographicDistribution), {
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.geographicDistributions = deletedGeographicDistributions.count;
      console.log('✅ Deleted geographic distributions:', deletedGeographicDistributions.count);

      // Delete professional decisions
      const deletedProfessionalDecisions = await safeDeleteMany(prisma.professionalDecision.deleteMany.bind(prisma.professionalDecision), {
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.professionalDecisions = deletedProfessionalDecisions.count;
      console.log('✅ Deleted professional decisions:', deletedProfessionalDecisions.count);

      // Delete consultations
      const deletedConsultations = await safeDeleteMany(prisma.consultation.deleteMany.bind(prisma.consultation), {
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.consultations = deletedConsultations.count;
      console.log('✅ Deleted consultations:', deletedConsultations.count);

      // Delete communications
      const deletedCommunications = await safeDeleteMany(prisma.communication.deleteMany.bind(prisma.communication), {
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.communications = deletedCommunications.count;
      console.log('✅ Deleted communications:', deletedCommunications.count);

      // Delete documents
      const deletedDocuments = await safeDeleteMany(prisma.document.deleteMany.bind(prisma.document), {
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.documents = deletedDocuments.count;
      console.log('✅ Deleted documents:', deletedDocuments.count);

      // Delete audit trails
      const deletedAuditTrails = await safeDeleteMany(prisma.auditTrail.deleteMany.bind(prisma.auditTrail), {
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.auditTrails = deletedAuditTrails.count;
      console.log('✅ Deleted audit trails:', deletedAuditTrails.count);

      // Delete data processing records
      const deletedDataProcessing = await safeDeleteMany(prisma.dataProcessing.deleteMany.bind(prisma.dataProcessing), {
        where: { 
          clientId: { in: clientIds },
          organizationId 
        }
      });
      deleteResults.dataProcessing = deletedDataProcessing.count;
      console.log('✅ Deleted data processing records:', deletedDataProcessing.count);

      // Finally, delete the clients themselves
      console.log('🗑️ Deleting clients...');
      const deletedClients = await safeDeleteMany(prisma.client.deleteMany.bind(prisma.client), {
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
