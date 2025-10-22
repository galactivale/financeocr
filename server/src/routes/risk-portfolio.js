const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { formatClient, formatClientState, formatArray } = require('../utils/numberFormatter');
const router = express.Router();
const prisma = new PrismaClient();

// GET /api/risk-portfolio - Get risk-based client portfolio
router.get('/', async (req, res) => {
  try {
    const { organizationId } = req.query;

    if (!organizationId) {
      return res.status(400).json({ error: 'Organization ID is required' });
    }

    console.log('🔍 Fetching risk-based client portfolio...');

    // Get all clients with their risk data
    const clients = await prisma.client.findMany({
      where: { 
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
        alerts: {
          where: { status: { not: 'resolved' } },
          orderBy: { detectedAt: 'desc' }
        },
        tasks: {
          where: { status: { not: 'completed' } },
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { riskLevel: 'desc' }
    });

    // Calculate portfolio metrics
    const riskDistribution = {
      low: clients.filter(c => c.riskLevel === 'low').length,
      medium: clients.filter(c => c.riskLevel === 'medium').length,
      high: clients.filter(c => c.riskLevel === 'high').length,
      critical: clients.filter(c => c.riskLevel === 'critical').length
    };

    const totalPenaltyExposure = clients.reduce((sum, c) => sum + (c.penaltyExposure || 0), 0);
    const totalRevenue = clients.reduce((sum, c) => sum + (c.annualRevenue || 0), 0);
    const averageQualityScore = clients.length > 0 ? 
      Math.round(clients.reduce((sum, c) => sum + (c.qualityScore || 0), 0) / clients.length) : 0;

    const activeAlerts = clients.reduce((sum, c) => sum + c.alerts.length, 0);
    const openNexusAlerts = clients.reduce((sum, c) => sum + c.nexusAlerts.length, 0);
    const pendingTasks = clients.reduce((sum, c) => sum + c.tasks.length, 0);

    // Get high-risk clients
    const highRiskClients = clients.filter(c => c.riskLevel === 'high' || c.riskLevel === 'critical');

    // Get clients with active nexus alerts
    const clientsWithAlerts = clients.filter(c => c.nexusAlerts.length > 0);

    const response = {
      success: true,
      data: {
        portfolio: {
          totalClients: clients.length,
          riskDistribution,
          totalPenaltyExposure,
          totalRevenue,
          averageQualityScore,
          activeAlerts,
          openNexusAlerts,
          pendingTasks
        },
        clients: clients.map(client => ({
          id: client.id,
          name: client.name,
          slug: client.slug,
          industry: client.industry,
          annualRevenue: parseFloat(client.annualRevenue) || 0,
          riskLevel: client.riskLevel,
          penaltyExposure: parseFloat(client.penaltyExposure) || 0,
          qualityScore: parseInt(client.qualityScore) || 0,
          statesMonitored: client.clientStates.length,
          activeAlerts: client.alerts.length,
          nexusAlerts: client.nexusAlerts.length,
          pendingTasks: client.tasks.length,
          lastUpdated: client.updatedAt
        })),
        highRiskClients: highRiskClients.map(client => ({
          id: client.id,
          name: client.name,
          riskLevel: client.riskLevel,
          penaltyExposure: parseFloat(client.penaltyExposure) || 0,
          nexusAlerts: client.nexusAlerts.length,
          statesMonitored: client.clientStates.length
        })),
        clientsWithAlerts: clientsWithAlerts.map(client => ({
          id: client.id,
          name: client.name,
          nexusAlerts: client.nexusAlerts.map(alert => ({
            id: alert.id,
            stateCode: alert.stateCode,
            title: alert.title,
            priority: alert.priority,
            penaltyRisk: parseFloat(alert.penaltyRisk) || 0
          }))
        }))
      }
    };

    console.log('✅ Risk portfolio data retrieved successfully');
    res.json(response);

  } catch (error) {
    console.error('❌ Error fetching risk portfolio:', error);
    res.status(500).json({ 
      error: 'Failed to fetch risk portfolio',
      details: error.message 
    });
  }
});

// GET /api/risk-portfolio/:clientId - Get detailed client risk profile
router.get('/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;
    const { organizationId } = req.query;

    if (!organizationId) {
      return res.status(400).json({ error: 'Organization ID is required' });
    }

    console.log('🔍 Fetching detailed client risk profile for:', clientId);

    const client = await prisma.client.findFirst({
      where: { 
        slug: clientId,
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
        alerts: {
          where: { status: { not: 'resolved' } },
          orderBy: { detectedAt: 'desc' }
        },
        tasks: {
          where: { status: { not: 'completed' } },
          orderBy: { createdAt: 'desc' }
        },
        nexusActivities: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    // Calculate risk metrics
    const criticalStates = client.clientStates.filter(s => s.status === 'critical').length;
    const warningStates = client.clientStates.filter(s => s.status === 'warning').length;
    const monitoringStates = client.clientStates.filter(s => s.status === 'monitoring').length;

    const totalPenaltyRisk = client.clientStates.reduce((sum, s) => sum + (s.penaltyRisk || 0), 0);
    const nexusAlertRisk = client.nexusAlerts.reduce((sum, a) => sum + (a.penaltyRisk || 0), 0);

    const response = {
      success: true,
      data: {
        client: {
          id: client.id,
          name: client.name,
          slug: client.slug,
          industry: client.industry,
          annualRevenue: client.annualRevenue,
          riskLevel: client.riskLevel,
          penaltyExposure: client.penaltyExposure,
          qualityScore: client.qualityScore,
          lastUpdated: client.updatedAt
        },
        riskProfile: {
          riskLevel: client.riskLevel,
          totalPenaltyRisk,
          nexusAlertRisk,
          criticalStates,
          warningStates,
          monitoringStates,
          activeAlerts: client.alerts.length,
          nexusAlerts: client.nexusAlerts.length,
          pendingTasks: client.tasks.length
        },
        stateMonitoring: client.clientStates.map(state => ({
          stateCode: state.stateCode,
          stateName: state.stateName,
          status: state.status,
          currentAmount: state.currentAmount,
          thresholdAmount: state.thresholdAmount,
          percentage: state.percentage,
          daysSinceThreshold: state.daysSinceThreshold,
          penaltyRisk: state.penaltyRisk,
          lastUpdated: state.lastUpdated
        })),
        nexusAlerts: client.nexusAlerts.map(alert => ({
          id: alert.id,
          stateCode: alert.stateCode,
          alertType: alert.alertType,
          priority: alert.priority,
          title: alert.title,
          description: alert.description,
          thresholdAmount: alert.thresholdAmount,
          currentAmount: alert.currentAmount,
          penaltyRisk: alert.penaltyRisk,
          createdAt: alert.createdAt
        })),
        recentActivities: client.nexusActivities.map(activity => ({
          id: activity.id,
          activityType: activity.activityType,
          title: activity.title,
          description: activity.description,
          createdAt: activity.createdAt
        }))
      }
    };

    console.log('✅ Client risk profile retrieved successfully');
    res.json(response);

  } catch (error) {
    console.error('❌ Error fetching client risk profile:', error);
    res.status(500).json({ 
      error: 'Failed to fetch client risk profile',
      details: error.message 
    });
  }
});

module.exports = router;





