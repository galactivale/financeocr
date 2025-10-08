const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// GET /api/personalized-dashboard/:url/clients
router.get('/:url/clients', async (req, res) => {
  try {
    const { url } = req.params;
    
    const dashboard = await prisma.generatedDashboard.findUnique({
      where: { uniqueUrl: url },
      select: { personalizedData: true, clientName: true }
    });

    if (!dashboard) {
      return res.status(404).json({ error: 'Dashboard not found' });
    }

    // Get the client ID from personalized data
    const clientId = dashboard.personalizedData?.clientId;
    
    if (!clientId) {
      return res.json({
        success: true,
        data: []
      });
    }

    // Query the actual clients table
    const clients = await prisma.client.findMany({
      where: { 
        id: clientId,
        status: 'active'
      },
      include: {
        clientStates: true,
        businessProfile: true,
        contacts: true,
        businessLocations: true
      }
    });
    
    res.json({
      success: true,
      data: clients
    });

  } catch (error) {
    console.error('Error fetching personalized clients:', error);
    res.status(500).json({ 
      error: 'Failed to fetch clients',
      details: error.message 
    });
  }
});

// GET /api/personalized-dashboard/:url/alerts
router.get('/:url/alerts', async (req, res) => {
  try {
    const { url } = req.params;
    
    const dashboard = await prisma.generatedDashboard.findUnique({
      where: { uniqueUrl: url },
      select: { personalizedData: true, clientName: true }
    });

    if (!dashboard) {
      return res.status(404).json({ error: 'Dashboard not found' });
    }

    const clientId = dashboard.personalizedData?.clientId;
    
    if (!clientId) {
      return res.json({
        success: true,
        data: []
      });
    }

    // Query the actual alerts table
    const alerts = await prisma.alert.findMany({
      where: { 
        clientId: clientId,
        status: { not: 'resolved' }
      },
      include: {
        client: {
          select: { name: true, industry: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json({
      success: true,
      data: alerts
    });

  } catch (error) {
    console.error('Error fetching personalized alerts:', error);
    res.status(500).json({ 
      error: 'Failed to fetch alerts',
      details: error.message 
    });
  }
});

// GET /api/personalized-dashboard/:url/tasks
router.get('/:url/tasks', async (req, res) => {
  try {
    const { url } = req.params;
    
    const dashboard = await prisma.generatedDashboard.findUnique({
      where: { uniqueUrl: url },
      select: { 
        personalizedData: true, 
        generatedTasks: true,
        clientName: true 
      }
    });

    if (!dashboard) {
      return res.status(404).json({ error: 'Dashboard not found' });
    }

    // Use comprehensive generated data if available, fallback to personalized data
    const tasks = dashboard.generatedTasks || dashboard.personalizedData?.tasks || [];
    
    res.json({
      success: true,
      data: tasks
    });

  } catch (error) {
    console.error('Error fetching personalized tasks:', error);
    res.status(500).json({ 
      error: 'Failed to fetch tasks',
      details: error.message 
    });
  }
});

// GET /api/personalized-dashboard/:url/analytics
router.get('/:url/analytics', async (req, res) => {
  try {
    const { url } = req.params;
    
    const dashboard = await prisma.generatedDashboard.findUnique({
      where: { uniqueUrl: url },
      select: { 
        personalizedData: true, 
        generatedAnalytics: true,
        clientName: true 
      }
    });

    if (!dashboard) {
      return res.status(404).json({ error: 'Dashboard not found' });
    }

    // Use comprehensive generated data if available, fallback to personalized data
    const analytics = dashboard.generatedAnalytics || dashboard.personalizedData?.analytics || {};
    
    res.json({
      success: true,
      data: analytics
    });

  } catch (error) {
    console.error('Error fetching personalized analytics:', error);
    res.status(500).json({ 
      error: 'Failed to fetch analytics',
      details: error.message 
    });
  }
});

// GET /api/personalized-dashboard/:url/system-health
router.get('/:url/system-health', async (req, res) => {
  try {
    const { url } = req.params;
    
    const dashboard = await prisma.generatedDashboard.findUnique({
      where: { uniqueUrl: url },
      select: { 
        personalizedData: true, 
        generatedSystemHealth: true,
        clientName: true 
      }
    });

    if (!dashboard) {
      return res.status(404).json({ error: 'Dashboard not found' });
    }

    // Use comprehensive generated data if available, fallback to personalized data
    const systemHealth = dashboard.generatedSystemHealth || dashboard.personalizedData?.systemHealth || {};
    
    res.json({
      success: true,
      data: systemHealth
    });

  } catch (error) {
    console.error('Error fetching personalized system health:', error);
    res.status(500).json({ 
      error: 'Failed to fetch system health',
      details: error.message 
    });
  }
});

// GET /api/personalized-dashboard/:url/nexus-alerts
router.get('/:url/nexus-alerts', async (req, res) => {
  try {
    const { url } = req.params;
    
    const dashboard = await prisma.generatedDashboard.findUnique({
      where: { uniqueUrl: url },
      select: { personalizedData: true, clientName: true }
    });

    if (!dashboard) {
      return res.status(404).json({ error: 'Dashboard not found' });
    }

    const clientId = dashboard.personalizedData?.clientId;
    
    if (!clientId) {
      return res.json({
        success: true,
        data: []
      });
    }

    // Query the actual nexus_alerts table
    const nexusAlerts = await prisma.nexusAlert.findMany({
      where: { 
        clientId: clientId,
        isActive: true
      },
      include: {
        client: {
          select: { name: true, industry: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json({
      success: true,
      data: nexusAlerts
    });

  } catch (error) {
    console.error('Error fetching personalized nexus alerts:', error);
    res.status(500).json({ 
      error: 'Failed to fetch nexus alerts',
      details: error.message 
    });
  }
});

// GET /api/personalized-dashboard/:url/nexus-activities
router.get('/:url/nexus-activities', async (req, res) => {
  try {
    const { url } = req.params;
    
    const dashboard = await prisma.generatedDashboard.findUnique({
      where: { uniqueUrl: url },
      select: { 
        personalizedData: true, 
        generatedNexusActivities: true,
        clientName: true 
      }
    });

    if (!dashboard) {
      return res.status(404).json({ error: 'Dashboard not found' });
    }

    // Use comprehensive generated data if available, fallback to personalized data
    const nexusActivities = dashboard.generatedNexusActivities || dashboard.personalizedData?.nexusActivities || [];
    
    res.json({
      success: true,
      data: nexusActivities
    });

  } catch (error) {
    console.error('Error fetching personalized nexus activities:', error);
    res.status(500).json({ 
      error: 'Failed to fetch nexus activities',
      details: error.message 
    });
  }
});

// GET /api/personalized-dashboard/:url/client-states
router.get('/:url/client-states', async (req, res) => {
  try {
    const { url } = req.params;
    
    const dashboard = await prisma.generatedDashboard.findUnique({
      where: { uniqueUrl: url },
      select: { personalizedData: true, clientName: true }
    });

    if (!dashboard) {
      return res.status(404).json({ error: 'Dashboard not found' });
    }

    const clientId = dashboard.personalizedData?.clientId;
    
    if (!clientId) {
      return res.json({
        success: true,
        data: []
      });
    }

    // Query the actual client_states table
    const clientStates = await prisma.clientState.findMany({
      where: { 
        clientId: clientId
      },
      include: {
        client: {
          select: { name: true, industry: true }
        }
      },
      orderBy: { lastUpdated: 'desc' }
    });
    
    res.json({
      success: true,
      data: clientStates
    });

  } catch (error) {
    console.error('Error fetching personalized client states:', error);
    res.status(500).json({ 
      error: 'Failed to fetch client states',
      details: error.message 
    });
  }
});

module.exports = router;
