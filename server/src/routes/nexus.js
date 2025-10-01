const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// Get all nexus alerts
router.get('/alerts', async (req, res) => {
  try {
    const { limit = 10, offset = 0, status, priority, stateCode } = req.query;
    
    const where = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (stateCode) where.stateCode = stateCode;

    const alerts = await prisma.nexusAlert.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            legalName: true,
            industry: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      skip: parseInt(offset)
    });

    const total = await prisma.nexusAlert.count({ where });

    res.json({
      alerts,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error fetching nexus alerts:', error);
    res.status(500).json({ error: 'Failed to fetch nexus alerts' });
  }
});

// Get nexus activities
router.get('/activities', async (req, res) => {
  try {
    const { limit = 10, offset = 0, clientId, stateCode, activityType } = req.query;
    
    const where = {};
    if (clientId) where.clientId = clientId;
    if (stateCode) where.stateCode = stateCode;
    if (activityType) where.activityType = activityType;

    const activities = await prisma.nexusActivity.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            legalName: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      skip: parseInt(offset)
    });

    const total = await prisma.nexusActivity.count({ where });

    res.json({
      activities,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error fetching nexus activities:', error);
    res.status(500).json({ error: 'Failed to fetch nexus activities' });
  }
});

// Get client states
router.get('/client-states', async (req, res) => {
  try {
    const { limit = 10, offset = 0, clientId, stateCode, status } = req.query;
    
    const where = {};
    if (clientId) where.clientId = clientId;
    if (stateCode) where.stateCode = stateCode;
    if (status) where.status = status;

    const clientStates = await prisma.clientState.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            legalName: true,
            industry: true
          }
        }
      },
      orderBy: { lastUpdated: 'desc' },
      take: parseInt(limit),
      skip: parseInt(offset)
    });

    const total = await prisma.clientState.count({ where });

    res.json({
      clientStates,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error fetching client states:', error);
    res.status(500).json({ error: 'Failed to fetch client states' });
  }
});

// Get state tax information
router.get('/state-tax-info', async (req, res) => {
  try {
    const { stateCode } = req.query;
    
    const where = { isActive: true };
    if (stateCode) where.stateCode = stateCode;

    const stateTaxInfo = await prisma.stateTaxInfo.findMany({
      where,
      orderBy: { stateName: 'asc' }
    });

    res.json({ stateTaxInfo });
  } catch (error) {
    console.error('Error fetching state tax info:', error);
    res.status(500).json({ error: 'Failed to fetch state tax info' });
  }
});

// Get nexus dashboard summary
router.get('/dashboard-summary', async (req, res) => {
  try {
    const organizationId = req.query.organizationId || 'default-org';

    // Get counts by status
    const alertCounts = await prisma.nexusAlert.groupBy({
      by: ['status'],
      _count: { status: true },
      where: { organizationId }
    });

    // Get counts by priority
    const priorityCounts = await prisma.nexusAlert.groupBy({
      by: ['priority'],
      _count: { priority: true },
      where: { organizationId }
    });

    // Get counts by state
    const stateCounts = await prisma.nexusAlert.groupBy({
      by: ['stateCode'],
      _count: { stateCode: true },
      where: { organizationId }
    });

    // Get recent activities
    const recentActivities = await prisma.nexusActivity.findMany({
      where: { organizationId },
      include: {
        client: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    // Get threshold monitoring data
    const thresholdAlerts = await prisma.nexusAlert.findMany({
      where: {
        organizationId,
        alertType: 'threshold_exceeded',
        status: 'open'
      },
      include: {
        client: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.json({
      alertCounts,
      priorityCounts,
      stateCounts,
      recentActivities,
      thresholdAlerts
    });
  } catch (error) {
    console.error('Error fetching nexus dashboard summary:', error);
    res.status(500).json({ error: 'Failed to fetch nexus dashboard summary' });
  }
});

// Create a new nexus alert
router.post('/alerts', async (req, res) => {
  try {
    const {
      clientId,
      organizationId,
      stateCode,
      alertType,
      priority = 'medium',
      title,
      description,
      thresholdAmount,
      currentAmount = 0,
      deadline,
      penaltyRisk
    } = req.body;

    const alert = await prisma.nexusAlert.create({
      data: {
        clientId,
        organizationId: organizationId || 'default-org',
        stateCode,
        alertType,
        priority,
        title,
        description,
        thresholdAmount: thresholdAmount ? parseFloat(thresholdAmount) : null,
        currentAmount: parseFloat(currentAmount),
        deadline: deadline ? new Date(deadline) : null,
        penaltyRisk: penaltyRisk ? parseFloat(penaltyRisk) : null
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            legalName: true
          }
        }
      }
    });

    res.status(201).json(alert);
  } catch (error) {
    console.error('Error creating nexus alert:', error);
    res.status(500).json({ error: 'Failed to create nexus alert' });
  }
});

// Update nexus alert status
router.patch('/alerts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, acknowledgedBy, resolvedBy } = req.body;

    const updateData = { status };
    
    if (status === 'acknowledged' && acknowledgedBy) {
      updateData.acknowledgedAt = new Date();
      updateData.acknowledgedBy = acknowledgedBy;
    }
    
    if (status === 'resolved' && resolvedBy) {
      updateData.resolvedAt = new Date();
      updateData.resolvedBy = resolvedBy;
    }

    const alert = await prisma.nexusAlert.update({
      where: { id },
      data: updateData,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            legalName: true
          }
        }
      }
    });

    res.json(alert);
  } catch (error) {
    console.error('Error updating nexus alert:', error);
    res.status(500).json({ error: 'Failed to update nexus alert' });
  }
});

// Create nexus activity
router.post('/activities', async (req, res) => {
  try {
    const {
      clientId,
      organizationId,
      stateCode,
      activityType,
      title,
      description,
      amount,
      thresholdAmount,
      status = 'completed',
      metadata
    } = req.body;

    const activity = await prisma.nexusActivity.create({
      data: {
        clientId,
        organizationId: organizationId || 'default-org',
        stateCode,
        activityType,
        title,
        description,
        amount: amount ? parseFloat(amount) : null,
        thresholdAmount: thresholdAmount ? parseFloat(thresholdAmount) : null,
        status,
        metadata: metadata || {}
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            legalName: true
          }
        }
      }
    });

    res.status(201).json(activity);
  } catch (error) {
    console.error('Error creating nexus activity:', error);
    res.status(500).json({ error: 'Failed to create nexus activity' });
  }
});

module.exports = router;


