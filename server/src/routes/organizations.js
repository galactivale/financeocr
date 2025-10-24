const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// GET /api/organizations/:id - Get organization details by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('🔍 Fetching organization details for ID:', id);
    
    const organization = await prisma.organization.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        slug: true,
        legalName: true,
        subscriptionTier: true,
        subscriptionStatus: true,
        country: true,
        createdAt: true
      }
    });

    if (!organization) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found'
      });
    }

    console.log('✅ Organization found:', organization.name);

    res.json({
      success: true,
      data: organization
    });

  } catch (error) {
    console.error('❌ Error fetching organization:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch organization',
      details: error.message
    });
  }
});

// GET /api/organizations - List all organizations (for admin use)
router.get('/', async (req, res) => {
  try {
    const organizations = await prisma.organization.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        subscriptionTier: true,
        subscriptionStatus: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: organizations
    });

  } catch (error) {
    console.error('❌ Error fetching organizations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch organizations',
      details: error.message
    });
  }
});

module.exports = router;
