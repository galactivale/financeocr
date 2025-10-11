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

// Create client state for nexus monitoring
router.post('/client-states', async (req, res) => {
  try {
    const {
      clientId,
      organizationId,
      stateCode,
      stateName,
      status = 'monitoring',
      thresholdAmount,
      currentAmount = 0,
      notes,
      lastUpdated
    } = req.body;

    if (!clientId || !organizationId || !stateCode || !stateName) {
      return res.status(400).json({ 
        error: 'Missing required fields: clientId, organizationId, stateCode, stateName' 
      });
    }

    // Check if client state already exists
    const existingState = await prisma.clientState.findFirst({
      where: {
        clientId,
        stateCode,
        organizationId
      }
    });

    if (existingState) {
      return res.status(409).json({ 
        error: 'Client state already exists for this state',
        details: 'A nexus monitoring record already exists for this client in this state'
      });
    }

    const clientState = await prisma.clientState.create({
      data: {
        clientId,
        organizationId,
        stateCode,
        stateName,
        status,
        thresholdAmount: thresholdAmount ? parseFloat(thresholdAmount) : null,
        currentAmount: parseFloat(currentAmount),
        notes: notes || `Nexus monitoring setup for ${stateName}`,
        lastUpdated: lastUpdated ? new Date(lastUpdated) : new Date()
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            legalName: true,
            industry: true
          }
        }
      }
    });

    console.log(`✅ Created client state for ${clientState.client.name} in ${stateName}`);

    res.status(201).json({
      success: true,
      data: clientState
    });
  } catch (error) {
    console.error('Error creating client state:', error);
    res.status(500).json({ 
      error: 'Failed to create client state',
      details: error.message 
    });
  }
});

// Update client state
router.patch('/client-states/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      status,
      thresholdAmount,
      currentAmount,
      notes,
      lastUpdated
    } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (thresholdAmount !== undefined) updateData.thresholdAmount = parseFloat(thresholdAmount);
    if (currentAmount !== undefined) updateData.currentAmount = parseFloat(currentAmount);
    if (notes) updateData.notes = notes;
    if (lastUpdated) updateData.lastUpdated = new Date(lastUpdated);

    const clientState = await prisma.clientState.update({
      where: { id },
      data: updateData,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            legalName: true,
            industry: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: clientState
    });
  } catch (error) {
    console.error('Error updating client state:', error);
    res.status(500).json({ 
      error: 'Failed to update client state',
      details: error.message 
    });
  }
});

// Delete client state
router.delete('/client-states/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.clientState.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Client state deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting client state:', error);
    res.status(500).json({ 
      error: 'Failed to delete client state',
      details: error.message 
    });
  }
});

// Create nexus alert
router.post('/alerts', async (req, res) => {
  try {
    const {
      clientId,
      organizationId,
      stateCode,
      alertType = 'threshold_breach',
      priority = 'medium',
      status = 'open',
      title,
      description,
      thresholdAmount,
      currentAmount,
      penaltyRisk,
      dueDate,
      assignedTo,
      notes
    } = req.body;

    if (!clientId || !organizationId || !stateCode || !title) {
      return res.status(400).json({ 
        error: 'Missing required fields: clientId, organizationId, stateCode, title' 
      });
    }

    const nexusAlert = await prisma.nexusAlert.create({
      data: {
        clientId,
        organizationId,
        stateCode,
        alertType,
        priority,
        status,
        title,
        description: description || `Nexus alert for ${stateCode}`,
        thresholdAmount: thresholdAmount ? parseFloat(thresholdAmount) : null,
        currentAmount: currentAmount ? parseFloat(currentAmount) : null,
        penaltyRisk: penaltyRisk ? parseFloat(penaltyRisk) : null,
        dueDate: dueDate ? new Date(dueDate) : null,
        assignedTo: assignedTo || null,
        notes: notes || null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            legalName: true,
            industry: true
          }
        }
      }
    });

    console.log(`✅ Created nexus alert for ${nexusAlert.client.name} in ${stateCode}: ${title}`);

    res.status(201).json({
      success: true,
      data: nexusAlert
    });
  } catch (error) {
    console.error('Error creating nexus alert:', error);
    res.status(500).json({ 
      error: 'Failed to create nexus alert',
      details: error.message 
    });
  }
});

// Update nexus alert
router.patch('/alerts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      status,
      priority,
      title,
      description,
      thresholdAmount,
      currentAmount,
      penaltyRisk,
      dueDate,
      assignedTo,
      notes
    } = req.body;

    const updateData = { updatedAt: new Date() };
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (thresholdAmount !== undefined) updateData.thresholdAmount = parseFloat(thresholdAmount);
    if (currentAmount !== undefined) updateData.currentAmount = parseFloat(currentAmount);
    if (penaltyRisk !== undefined) updateData.penaltyRisk = parseFloat(penaltyRisk);
    if (dueDate) updateData.dueDate = new Date(dueDate);
    if (assignedTo !== undefined) updateData.assignedTo = assignedTo;
    if (notes !== undefined) updateData.notes = notes;

    const nexusAlert = await prisma.nexusAlert.update({
      where: { id },
      data: updateData,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            legalName: true,
            industry: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: nexusAlert
    });
  } catch (error) {
    console.error('Error updating nexus alert:', error);
    res.status(500).json({ 
      error: 'Failed to update nexus alert',
      details: error.message 
    });
  }
});

// Delete nexus alert
router.delete('/alerts/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.nexusAlert.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Nexus alert deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting nexus alert:', error);
    res.status(500).json({ 
      error: 'Failed to delete nexus alert',
      details: error.message 
    });
  }
});

module.exports = router;


