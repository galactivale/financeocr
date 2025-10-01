const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// Get all consultations for an organization
router.get('/', async (req, res) => {
  try {
    const { organizationId } = req.query;
    
    if (!organizationId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Organization ID is required' 
      });
    }

    const consultations = await prisma.consultation.findMany({
      where: {
        organizationId: organizationId
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            slug: true,
            industry: true
          }
        },
        alert: {
          select: {
            id: true,
            title: true,
            severity: true,
            status: true
          }
        }
      },
      orderBy: {
        scheduledDate: 'asc'
      }
    });

    res.json({
      success: true,
      data: consultations
    });
  } catch (error) {
    console.error('Error fetching consultations:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch consultations' 
    });
  }
});

// Get consultations for a specific client
router.get('/client/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params;
    
    const consultations = await prisma.consultation.findMany({
      where: {
        clientId: clientId
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            slug: true,
            industry: true
          }
        },
        alert: {
          select: {
            id: true,
            title: true,
            severity: true,
            status: true
          }
        }
      },
      orderBy: {
        scheduledDate: 'asc'
      }
    });

    res.json({
      success: true,
      data: consultations
    });
  } catch (error) {
    console.error('Error fetching client consultations:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch client consultations' 
    });
  }
});

// Get a single consultation
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const consultation = await prisma.consultation.findUnique({
      where: {
        id: id
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            slug: true,
            industry: true,
            annualRevenue: true,
            employeeCount: true
          }
        },
        alert: {
          select: {
            id: true,
            title: true,
            description: true,
            severity: true,
            status: true,
            type: true,
            category: true
          }
        }
      }
    });

    if (!consultation) {
      return res.status(404).json({ 
        success: false, 
        error: 'Consultation not found' 
      });
    }

    res.json({
      success: true,
      data: consultation
    });
  } catch (error) {
    console.error('Error fetching consultation:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch consultation' 
    });
  }
});

// Create a new consultation
router.post('/', async (req, res) => {
  try {
    console.log('Creating consultation with data:', req.body);
    
    const {
      organizationId,
      clientId,
      alertId,
      topic,
      description,
      scheduledDate,
      scheduledTime,
      duration,
      exposureAmount,
      exposureCurrency,
      prepStatus,
      prepNotes,
      meetingType,
      meetingLink,
      meetingLocation,
      notes
    } = req.body;

    // Validate required fields
    if (!organizationId || !clientId || !topic || !scheduledDate || !scheduledTime || !duration) {
      console.log('Missing required fields:', { organizationId, clientId, topic, scheduledDate, scheduledTime, duration });
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields' 
      });
    }

    // Convert scheduledDate to DateTime
    const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
    console.log('Scheduled DateTime:', scheduledDateTime);

    const consultation = await prisma.consultation.create({
      data: {
        organizationId,
        clientId,
        alertId: alertId || null,
        topic,
        description: description || null,
        scheduledDate: scheduledDateTime,
        scheduledTime,
        duration: parseInt(duration),
        exposureAmount: exposureAmount ? parseFloat(exposureAmount) : null,
        exposureCurrency: exposureCurrency || 'USD',
        prepStatus: prepStatus || 'pending',
        prepNotes: prepNotes || null,
        meetingType: meetingType || 'call',
        meetingLink: meetingLink || null,
        meetingLocation: meetingLocation || null,
        notes: notes || null
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            slug: true,
            industry: true
          }
        },
        alert: {
          select: {
            id: true,
            title: true,
            severity: true,
            status: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      data: consultation
    });
  } catch (error) {
    console.error('Error creating consultation:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create consultation',
      details: error.message 
    });
  }
});

// Update a consultation
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Convert scheduledDate and scheduledTime to DateTime if provided
    if (updateData.scheduledDate && updateData.scheduledTime) {
      updateData.scheduledDate = new Date(`${updateData.scheduledDate}T${updateData.scheduledTime}`);
    }

    // Convert duration to integer if provided
    if (updateData.duration) {
      updateData.duration = parseInt(updateData.duration);
    }

    // Convert exposureAmount to float if provided
    if (updateData.exposureAmount) {
      updateData.exposureAmount = parseFloat(updateData.exposureAmount);
    }

    const consultation = await prisma.consultation.update({
      where: {
        id: id
      },
      data: updateData,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            slug: true,
            industry: true
          }
        },
        alert: {
          select: {
            id: true,
            title: true,
            severity: true,
            status: true
          }
        }
      }
    });

    res.json({
      success: true,
      data: consultation
    });
  } catch (error) {
    console.error('Error updating consultation:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update consultation' 
    });
  }
});

// Delete a consultation
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.consultation.delete({
      where: {
        id: id
      }
    });

    res.json({
      success: true,
      message: 'Consultation deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting consultation:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete consultation' 
    });
  }
});

module.exports = router;
