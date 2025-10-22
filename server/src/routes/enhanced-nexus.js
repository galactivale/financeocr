const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// GET /api/enhanced-nexus/dashboard-summary - Get comprehensive nexus dashboard data
router.get('/dashboard-summary', async (req, res) => {
  try {
    const { organizationId = 'demo-org-id', clientId } = req.query;

    const where = { organizationId };
    if (clientId) where.clientId = clientId;

    // Get client states with client information
    const clientStates = await prisma.clientState.findMany({
      where,
      include: {
        client: {
          select: { id: true, name: true, industry: true, riskLevel: true }
        }
      },
      orderBy: { lastUpdated: 'desc' }
    });

    // Get nexus alerts
    const nexusAlerts = await prisma.nexusAlert.findMany({
      where,
      include: {
        client: {
          select: { id: true, name: true, industry: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Get nexus activities
    const nexusActivities = await prisma.nexusActivity.findMany({
      where,
      include: {
        client: {
          select: { id: true, name: true, industry: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Get state tax info
    const stateTaxInfo = await prisma.stateTaxInfo.findMany({
      orderBy: { stateName: 'asc' }
    });

    // Calculate compliance metrics
    const complianceMetrics = calculateComplianceMetrics(clientStates);

    // Calculate risk assessment
    const riskAssessment = calculateRiskAssessment(clientStates, nexusAlerts);

    // Get alert counts by priority
    const alertCounts = {
      critical: nexusAlerts.filter(a => a.priority === 'critical').length,
      high: nexusAlerts.filter(a => a.priority === 'high').length,
      medium: nexusAlerts.filter(a => a.priority === 'medium').length,
      low: nexusAlerts.filter(a => a.priority === 'low').length
    };

    // Get state counts
    const stateCounts = clientStates.reduce((acc, cs) => {
      acc[cs.stateCode] = (acc[cs.stateCode] || 0) + 1;
      return acc;
    }, {});

    // Get recent activities (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentActivities = nexusActivities.filter(activity => 
      new Date(activity.createdAt) >= sevenDaysAgo
    );

    // Get threshold alerts
    const thresholdAlerts = nexusAlerts.filter(alert => 
      alert.alertType === 'threshold_breach' || 
      alert.alertType === 'economic_nexus_threshold'
    );

    res.json({
      success: true,
      data: {
        clientStates,
        nexusAlerts,
        nexusActivities,
        stateTaxInfo,
        complianceMetrics,
        riskAssessment,
        alertCounts,
        stateCounts,
        recentActivities,
        thresholdAlerts
      }
    });

  } catch (error) {
    console.error('Error fetching nexus dashboard summary:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch nexus dashboard summary',
      details: error.message
    });
  }
});

// GET /api/enhanced-nexus/client-states - Get client states with comprehensive data
router.get('/client-states', async (req, res) => {
  try {
    const { 
      organizationId = 'demo-org-id',
      clientId,
      stateCode,
      status,
      page = 1,
      limit = 50
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {
      organizationId,
      ...(clientId && { clientId }),
      ...(stateCode && { stateCode }),
      ...(status && { status })
    };

    const clientStates = await prisma.clientState.findMany({
      where,
      skip,
      take,
      include: {
        client: {
          select: { 
            id: true, 
            name: true, 
            industry: true, 
            riskLevel: true,
            annualRevenue: true
          }
        }
      },
      orderBy: { lastUpdated: 'desc' }
    });

    const total = await prisma.clientState.count({ where });

    // Get related nexus alerts for each state
    const stateCodes = clientStates.map(cs => cs.stateCode);
    const nexusAlerts = await prisma.nexusAlert.findMany({
      where: {
        organizationId,
        stateCode: { in: stateCodes },
        isActive: true
      },
      include: {
        client: {
          select: { id: true, name: true }
        }
      }
    });

    // Group alerts by state code
    const alertsByState = nexusAlerts.reduce((acc, alert) => {
      if (!acc[alert.stateCode]) {
        acc[alert.stateCode] = [];
      }
      acc[alert.stateCode].push(alert);
      return acc;
    }, {});

    // Add alerts to client states
    const enhancedClientStates = clientStates.map(cs => ({
      ...cs,
      alerts: alertsByState[cs.stateCode] || []
    }));

    res.json({
      success: true,
      data: {
        clientStates: enhancedClientStates,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('Error fetching client states:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch client states',
      details: error.message
    });
  }
});

// GET /api/enhanced-nexus/state-compliance/:clientId - Get comprehensive state compliance for a client
router.get('/state-compliance/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;
    const { organizationId = 'demo-org-id' } = req.query;

    // Get client with basic info - handle both UUID and slug
    const client = await prisma.client.findFirst({
      where: { 
        OR: [
          { id: clientId },
          { slug: clientId }
        ]
      },
      select: {
        id: true,
        name: true,
        industry: true,
        riskLevel: true,
        annualRevenue: true
      }
    });

    if (!client) {
      return res.status(404).json({
        success: false,
        error: 'Client not found'
      });
    }

    // Get client states
    const clientStates = await prisma.clientState.findMany({
      where: {
        clientId,
        organizationId
      },
      orderBy: { lastUpdated: 'desc' }
    });

    // Get state tax info for all states
    const stateCodes = clientStates.map(cs => cs.stateCode);
    const stateTaxInfo = await prisma.stateTaxInfo.findMany({
      where: {
        stateCode: { in: stateCodes }
      }
    });

    // Get nexus alerts for this client
    const nexusAlerts = await prisma.nexusAlert.findMany({
      where: {
        clientId,
        organizationId,
        isActive: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Get nexus activities for this client
    const nexusActivities = await prisma.nexusActivity.findMany({
      where: {
        clientId,
        organizationId
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calculate compliance metrics
    const complianceMetrics = calculateComplianceMetrics(clientStates);

    // Calculate risk assessment
    const riskAssessment = calculateRiskAssessment(clientStates, nexusAlerts);

    // Get compliance timeline (last 6 months)
    const sixMonthsAgo = new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000);
    const complianceTimeline = await prisma.auditTrail.findMany({
      where: {
        clientId,
        organizationId,
        entityType: 'ClientState',
        performedAt: { gte: sixMonthsAgo }
      },
      orderBy: { performedAt: 'desc' }
    });

    res.json({
      success: true,
      data: {
        client,
        clientStates,
        stateTaxInfo,
        nexusAlerts,
        nexusActivities,
        complianceMetrics,
        riskAssessment,
        complianceTimeline
      }
    });

  } catch (error) {
    console.error('Error fetching state compliance:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch state compliance',
      details: error.message
    });
  }
});

// Helper function to calculate compliance metrics
function calculateComplianceMetrics(clientStates) {
  const totalStates = clientStates.length;
  const compliantStates = clientStates.filter(cs => cs.status === 'compliant').length;
  const nonCompliantStates = clientStates.filter(cs => cs.status === 'non-compliant').length;
  const monitoringStates = clientStates.filter(cs => cs.status === 'monitoring').length;
  const atRiskStates = clientStates.filter(cs => cs.status === 'at-risk').length;

  return {
    totalStates,
    compliantStates,
    nonCompliantStates,
    monitoringStates,
    atRiskStates,
    complianceRate: totalStates > 0 ? (compliantStates / totalStates) * 100 : 0,
    riskRate: totalStates > 0 ? ((nonCompliantStates + atRiskStates) / totalStates) * 100 : 0
  };
}

// Helper function to calculate risk assessment
function calculateRiskAssessment(clientStates, nexusAlerts) {
  const totalStates = clientStates.length;
  const statesWithAlerts = new Set(nexusAlerts.map(alert => alert.stateCode)).size;
  const criticalAlerts = nexusAlerts.filter(alert => alert.priority === 'critical').length;
  const highAlerts = nexusAlerts.filter(alert => alert.priority === 'high').length;

  const riskScore = totalStates > 0 ? (statesWithAlerts / totalStates) * 100 : 0;
  const alertRisk = criticalAlerts * 10 + highAlerts * 5;

  return {
    riskScore: Math.min(riskScore + alertRisk, 100),
    riskLevel: riskScore > 80 ? 'high' : riskScore > 50 ? 'medium' : 'low',
    statesWithAlerts,
    criticalAlerts,
    highAlerts,
    totalAlerts: nexusAlerts.length
  };
}

module.exports = router;
