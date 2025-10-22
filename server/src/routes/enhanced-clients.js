const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { 
  formatClient, 
  formatClientState, 
  formatRevenueBreakdown, 
  formatCustomerDemographics, 
  formatGeographicDistribution,
  formatArray 
} = require('../utils/numberFormatter');
const router = express.Router();
const prisma = new PrismaClient();

// GET /api/enhanced-clients/:id - Get comprehensive client data
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { organizationId } = req.query;

    if (!organizationId) {
      return res.status(400).json({ error: 'Organization ID is required' });
    }

    console.log('🔍 Fetching comprehensive client data for ID:', id);

    // Get comprehensive client data with all related entities
    // Use slug lookup since the ID parameter is a slug, not a UUID
    const client = await prisma.client.findFirst({
      where: { 
        slug: id,
        organizationId: organizationId,
        status: 'active'
      },
      include: {
        // Client States
        clientStates: {
          orderBy: { lastUpdated: 'desc' }
        },
        // Business Profile
        businessProfile: true,
        // Contacts
        contacts: {
          orderBy: { createdAt: 'desc' }
        },
        // Business Locations
        businessLocations: {
          orderBy: { createdAt: 'desc' }
        },
        // Revenue Breakdowns
        revenueBreakdowns: {
          orderBy: { createdAt: 'desc' }
        },
        // Customer Demographics
        customerDemographics: true,
        // Geographic Distributions
        geographicDistributions: {
          orderBy: { percentage: 'desc' }
        },
        // Nexus Alerts
        nexusAlerts: {
          where: { status: 'open' },
          orderBy: { createdAt: 'desc' }
        },
        // Nexus Activities
        nexusActivities: {
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        // Alerts
        alerts: {
          where: { status: { not: 'resolved' } },
          orderBy: { detectedAt: 'desc' }
        },
        // Tasks
        tasks: {
          orderBy: { createdAt: 'desc' },
          take: 20
        },
        // Professional Decisions
        professionalDecisions: {
          orderBy: { decisionDate: 'desc' },
          take: 10
        },
        // Consultations - temporarily disabled due to schema mismatch
        // consultations: {
        //   orderBy: { createdAt: 'desc' },
        //   take: 10
        // },
        // Communications
        communications: {
          orderBy: { createdAt: 'desc' },
          take: 20
        },
        // Documents
        documents: {
          orderBy: { uploadedAt: 'desc' },
          take: 20
        },
        // Audit Trails
        auditTrails: {
          orderBy: { performedAt: 'desc' },
          take: 50
        },
        // Data Processing
        dataProcessing: {
          orderBy: { processedAt: 'desc' },
          take: 10
        }
      }
    });

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    // Calculate comprehensive metrics
    const metrics = {
      totalRevenue: client.annualRevenue || 0,
      riskScore: calculateRiskScore(client),
      complianceScore: client.qualityScore || 0,
      activeAlerts: client.alerts?.length || 0,
      openNexusAlerts: client.nexusAlerts?.length || 0,
      pendingTasks: client.tasks?.filter(t => t.status === 'pending').length || 0,
      statesMonitored: client.clientStates?.length || 0,
      documentsCount: client.documents?.length || 0,
      lastActivity: getLastActivityDate(client),
      penaltyExposure: calculatePenaltyExposure(client)
    };

    // Calculate state-specific metrics
    const stateMetrics = client.clientStates?.map(state => ({
      stateCode: state.stateCode,
      stateName: state.stateName,
      status: state.status,
      currentAmount: state.currentAmount || 0,
      thresholdAmount: state.thresholdAmount || 0,
      percentage: state.thresholdAmount > 0 ? 
        Math.round((state.currentAmount / state.thresholdAmount) * 100) : 0,
      daysSinceThreshold: state.daysSinceThreshold || null,
      penaltyRisk: state.penaltyRisk || 0,
      lastUpdated: state.lastUpdated
    })) || [];

    // Get recent activities
    const recentActivities = [
      ...(client.nexusActivities?.slice(0, 5) || []),
      ...(client.alerts?.slice(0, 5) || []),
      ...(client.tasks?.slice(0, 5) || [])
    ].sort((a, b) => new Date(b.createdAt || b.detectedAt) - new Date(a.createdAt || a.detectedAt))
    .slice(0, 10);

    const response = {
      success: true,
      data: {
        client: {
          ...formatClient(client),
          clientStates: formatArray(client.clientStates || [], formatClientState),
          revenueBreakdowns: formatArray(client.revenueBreakdowns || [], formatRevenueBreakdown),
          customerDemographics: client.customerDemographics ? formatCustomerDemographics(client.customerDemographics) : null,
          geographicDistributions: formatArray(client.geographicDistributions || [], formatGeographicDistribution)
        },
        metrics,
        stateMetrics,
        recentActivities,
        summary: {
          totalStates: client.clientStates?.length || 0,
          criticalStates: client.clientStates?.filter(s => s.status === 'critical').length || 0,
          warningStates: client.clientStates?.filter(s => s.status === 'warning').length || 0,
          monitoringStates: client.clientStates?.filter(s => s.status === 'monitoring').length || 0
        }
      }
    };

    console.log('✅ Comprehensive client data retrieved successfully');
    res.json(response);

  } catch (error) {
    console.error('❌ Error fetching comprehensive client data:', error);
    res.status(500).json({ 
      error: 'Failed to fetch client data',
      details: error.message 
    });
  }
});

// GET /api/enhanced-clients/:id/nexus-status - Get detailed nexus status
router.get('/:id/nexus-status', async (req, res) => {
  try {
    const { id } = req.params;
    const { organizationId } = req.query;

    if (!organizationId) {
      return res.status(400).json({ error: 'Organization ID is required' });
    }

    const client = await prisma.client.findFirst({
      where: { 
        slug: id,
        organizationId: organizationId,
        status: 'active'
      },
      include: {
        clientStates: {
          orderBy: { lastUpdated: 'desc' }
        },
        nexusAlerts: {
          where: { status: 'open' },
          orderBy: { createdAt: 'desc' }
        },
        nexusActivities: {
          orderBy: { createdAt: 'desc' },
          take: 20
        }
      }
    });

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    const nexusStatus = {
      clientId: client.id,
      clientName: client.name,
      states: client.clientStates?.map(state => ({
        stateCode: state.stateCode,
        stateName: state.stateName,
        status: state.status,
        currentAmount: state.currentAmount || 0,
        thresholdAmount: state.thresholdAmount || 0,
        percentage: state.thresholdAmount > 0 ? 
          Math.round((state.currentAmount / state.thresholdAmount) * 100) : 0,
        daysSinceThreshold: state.daysSinceThreshold || null,
        penaltyRisk: state.penaltyRisk || 0,
        notes: state.notes,
        lastUpdated: state.lastUpdated
      })) || [],
      alerts: client.nexusAlerts?.map(alert => ({
        id: alert.id,
        alertType: alert.alertType,
        priority: alert.priority,
        title: alert.title,
        description: alert.description,
        thresholdAmount: alert.thresholdAmount,
        currentAmount: alert.currentAmount,
        penaltyRisk: alert.penaltyRisk,
        createdAt: alert.createdAt
      })) || [],
      activities: client.nexusActivities?.map(activity => ({
        id: activity.id,
        activityType: activity.activityType,
        description: activity.description,
        activityDate: activity.createdAt,
        outcome: activity.outcome
      })) || []
    };

    res.json({
      success: true,
      data: nexusStatus
    });

  } catch (error) {
    console.error('❌ Error fetching nexus status:', error);
    res.status(500).json({ 
      error: 'Failed to fetch nexus status',
      details: error.message 
    });
  }
});

// GET /api/enhanced-clients/:id/alerts - Get client alerts
router.get('/:id/alerts', async (req, res) => {
  try {
    const { id } = req.params;
    const { organizationId } = req.query;

    if (!organizationId) {
      return res.status(400).json({ error: 'Organization ID is required' });
    }

    const alerts = await prisma.alert.findMany({
      where: { 
        clientId: id,
        organizationId: organizationId,
        status: { not: 'resolved' }
      },
      include: {
        client: {
          select: { name: true }
        }
      },
      orderBy: { detectedAt: 'desc' }
    });

    res.json({
      success: true,
      data: alerts
    });

  } catch (error) {
    console.error('❌ Error fetching client alerts:', error);
    res.status(500).json({ 
      error: 'Failed to fetch alerts',
      details: error.message 
    });
  }
});

// GET /api/enhanced-clients/:id/communications - Get client communications
router.get('/:id/communications', async (req, res) => {
  try {
    const { id } = req.params;
    const { organizationId } = req.query;

    if (!organizationId) {
      return res.status(400).json({ error: 'Organization ID is required' });
    }

    const communications = await prisma.communication.findMany({
      where: { 
        clientId: id,
        organizationId: organizationId
      },
      orderBy: { communicationDate: 'desc' },
      take: 50
    });

    res.json({
      success: true,
      data: communications
    });

  } catch (error) {
    console.error('❌ Error fetching communications:', error);
    res.status(500).json({ 
      error: 'Failed to fetch communications',
      details: error.message 
    });
  }
});

// GET /api/enhanced-clients/:id/documents - Get client documents
router.get('/:id/documents', async (req, res) => {
  try {
    const { id } = req.params;
    const { organizationId } = req.query;

    if (!organizationId) {
      return res.status(400).json({ error: 'Organization ID is required' });
    }

    const documents = await prisma.document.findMany({
      where: { 
        clientId: id,
        organizationId: organizationId
      },
      orderBy: { uploadedAt: 'desc' },
      take: 50
    });

    res.json({
      success: true,
      data: documents
    });

  } catch (error) {
    console.error('❌ Error fetching documents:', error);
    res.status(500).json({ 
      error: 'Failed to fetch documents',
      details: error.message 
    });
  }
});

// Helper functions
function calculateRiskScore(client) {
  let score = 0;
  
  // Base risk from client risk level
  switch (client.riskLevel) {
    case 'high': score += 40; break;
    case 'medium': score += 20; break;
    case 'low': score += 5; break;
  }
  
  // Add risk from active alerts
  score += (client.alerts?.length || 0) * 5;
  
  // Add risk from nexus alerts
  score += (client.nexusAlerts?.length || 0) * 10;
  
  // Add risk from states approaching threshold
  const criticalStates = client.clientStates?.filter(s => s.status === 'critical').length || 0;
  score += criticalStates * 15;
  
  return Math.min(score, 100);
}

function calculatePenaltyExposure(client) {
  let exposure = 0;
  
  // Add penalty risk from client states
  client.clientStates?.forEach(state => {
    if (state.penaltyRisk) {
      exposure += state.penaltyRisk;
    }
  });
  
  // Add penalty risk from nexus alerts
  client.nexusAlerts?.forEach(alert => {
    if (alert.penaltyRisk) {
      exposure += alert.penaltyRisk;
    }
  });
  
  return exposure;
}

function getLastActivityDate(client) {
  const dates = [];
  
  if (client.nexusActivities?.length > 0) {
    dates.push(new Date(Math.max(...client.nexusActivities.map(a => new Date(a.createdAt)))));
  }
  
  if (client.alerts?.length > 0) {
    dates.push(new Date(Math.max(...client.alerts.map(a => new Date(a.detectedAt)))));
  }
  
  if (client.tasks?.length > 0) {
    dates.push(new Date(Math.max(...client.tasks.map(t => new Date(t.createdAt)))));
  }
  
  if (dates.length > 0) {
    return new Date(Math.max(...dates));
  }
  
  return null;
}

module.exports = router;