const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// Get all communications (nexus alerts only)
router.get('/', async (req, res) => {
  try {
    const { organizationId, clientId, alertId, status, type } = req.query;
    const where = {};

    if (organizationId) where.organizationId = organizationId;
    if (clientId) where.clientId = clientId;
    if (alertId) where.alertId = alertId;
    if (status) where.status = status;
    if (type) where.type = type;

    const communications = await prisma.communication.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            slug: true,
            industry: true,
            primaryContactEmail: true,
            primaryContactPhone: true,
          },
        },
        alert: {
          select: {
            id: true,
            title: true,
            issue: true,
            stateCode: true,
            stateName: true,
            currentAmount: true,
            thresholdAmount: true,
            penaltyRisk: true,
            priority: true,
            severity: true,
            status: true,
            deadline: true,
          },
        },
      },
      orderBy: {
        sentDate: 'desc',
      },
    });

    res.json({ success: true, data: communications });
  } catch (error) {
    console.error('Error fetching communications:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch communications' });
  }
});

// Get a single communication by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const communication = await prisma.communication.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            slug: true,
            industry: true,
          },
        },
        alert: {
          select: {
            id: true,
            title: true,
            severity: true,
            status: true,
          },
        },
      },
    });

    if (!communication) {
      return res.status(404).json({ success: false, error: 'Communication not found' });
    }

    res.json({ success: true, data: communication });
  } catch (error) {
    console.error('Error fetching communication:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch communication'
    });
  }
});

// Create a new communication for nexus alert
router.post('/', async (req, res) => {
  try {
    console.log('Creating nexus alert communication with data:', req.body);

    const {
      organizationId,
      clientId,
      alertId,
      type,
      subject,
      content,
      professionalReasoning,
      recipientEmail,
      recipientPhone,
    } = req.body;

    // Validate required fields
    if (!organizationId || !clientId || !alertId || !type || !subject || !content) {
      console.log('Missing required fields:', { organizationId, clientId, alertId, type, subject, content });
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }

    // Validate type is email or sms
    if (!['email', 'sms'].includes(type)) {
      return res.status(400).json({ success: false, error: 'Type must be email or sms' });
    }

    const communication = await prisma.communication.create({
      data: {
        organizationId,
        clientId,
        alertId, // Required for nexus alerts
        type,
        subject,
        content,
        professionalReasoning,
        status: 'sent', // Default to sent since we're creating after sending
        sentDate: new Date(),
        recipientEmail: type === 'email' ? recipientEmail : null,
        recipientPhone: type === 'sms' ? recipientPhone : null,
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            slug: true,
            industry: true,
          },
        },
        alert: {
          select: {
            id: true,
            title: true,
            issue: true,
            stateCode: true,
            stateName: true,
            currentAmount: true,
            thresholdAmount: true,
            penaltyRisk: true,
            priority: true,
            severity: true,
            status: true,
            deadline: true,
          },
        },
      }
    });

    res.status(201).json({
      success: true,
      data: communication
    });
  } catch (error) {
    console.error('Error creating communication:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: 'Failed to create communication',
      details: error.message
    });
  }
});

// Update communication status (delivered, read, failed)
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, deliveryDate, readDate, failureReason } = req.body;

    const updateData = { status };
    
    if (deliveryDate) updateData.deliveryDate = new Date(deliveryDate);
    if (readDate) updateData.readDate = new Date(readDate);
    if (failureReason) updateData.failureReason = failureReason;

    const communication = await prisma.communication.update({
      where: { id },
      data: updateData,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            slug: true,
            industry: true,
          },
        },
        alert: {
          select: {
            id: true,
            title: true,
            issue: true,
            stateCode: true,
            stateName: true,
            currentAmount: true,
            thresholdAmount: true,
            penaltyRisk: true,
            priority: true,
            severity: true,
            status: true,
            deadline: true,
          },
        },
      },
    });

    res.json({ success: true, data: communication });
  } catch (error) {
    console.error('Error updating communication status:', error);
    res.status(500).json({ success: false, error: 'Failed to update communication status' });
  }
});

module.exports = router;
