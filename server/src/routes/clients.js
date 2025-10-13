const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { formatClient, formatArray } = require('../utils/numberFormatter');
const router = express.Router();
const prisma = new PrismaClient();

// Get all clients with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      status, 
      riskLevel,
      organizationId 
    } = req.query;
    
    const where = {};
    
    // CRITICAL: Filter by organization ID to ensure data isolation
    if (organizationId) {
      where.organizationId = organizationId;
    } else {
      return res.status(400).json({ 
        error: 'Organization ID is required for data isolation' 
      });
    }
    
    // Add search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { industry: { contains: search, mode: 'insensitive' } },
        { legalName: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    // Add status filter
    if (status) {
      where.status = status;
    }
    
    // Add risk level filter
    if (riskLevel) {
      where.riskLevel = riskLevel;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [clients, total] = await Promise.all([
      prisma.client.findMany({
        where,
        select: {
          id: true,
          slug: true,
          name: true,
          legalName: true,
          industry: true,
          annualRevenue: true,
          foundedYear: true,
          employeeCount: true,
          riskLevel: true,
          penaltyExposure: true,
          qualityScore: true,
          status: true,
          assignedPartner: true,
          assignedManager: true,
          primaryContactName: true,
          primaryContactEmail: true,
          city: true,
          state: true,
          tags: true,
          organizationId: true,
          createdAt: true,
          updatedAt: true,
          clientStates: true,
          nexusAlerts: {
            where: {
              status: 'open'
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.client.count({ where })
    ]);

    // Transform data to match frontend expectations
    const transformedClients = clients.map(client => {
      // Calculate risk level based on alerts and states
      const criticalStates = client.clientStates.filter(cs => cs.status === 'critical').length;
      const warningStates = client.clientStates.filter(cs => cs.status === 'warning').length;
      const activeAlerts = client.nexusAlerts.length;
      
      let riskLevel = 'low';
      if (criticalStates > 0 || activeAlerts > 2) {
        riskLevel = 'critical';
      } else if (warningStates > 0 || activeAlerts > 0) {
        riskLevel = 'warning';
      } else if (client.clientStates.some(cs => cs.currentAmount > cs.thresholdAmount * 0.8)) {
        riskLevel = 'high';
      }

      // Calculate penalty exposure
      const penaltyExposure = client.clientStates.reduce((sum, cs) => {
        if (cs.currentAmount > cs.thresholdAmount) {
          const excess = cs.currentAmount - cs.thresholdAmount;
          return sum + (excess * 0.1); // 10% penalty estimate
        }
        return sum;
      }, 0);

      // Transform states data
      const states = client.clientStates.map(cs => ({
        code: cs.stateCode,
        name: cs.stateName || cs.stateCode,
        revenue: cs.currentAmount,
        threshold: cs.thresholdAmount || 500000,
        percentage: Math.round((cs.currentAmount / (cs.thresholdAmount || 500000)) * 100),
        status: cs.status,
        daysSinceThreshold: cs.currentAmount > (cs.thresholdAmount || 500000) ? 
          Math.floor((Date.now() - new Date(cs.lastUpdated).getTime()) / (1000 * 60 * 60 * 24)) : undefined,
        penaltyRange: cs.currentAmount > (cs.thresholdAmount || 500000) ? {
          min: Math.round((cs.currentAmount - (cs.thresholdAmount || 500000)) * 0.1),
          max: Math.round((cs.currentAmount - (cs.thresholdAmount || 500000)) * 0.2)
        } : undefined
      }));

      return {
        id: client.id,
        slug: client.slug,
        name: client.name,
        avatar: client.name.charAt(0).toUpperCase(),
        industry: client.industry,
        revenue: client.annualRevenue ? (typeof client.annualRevenue === 'object' ? client.annualRevenue.toNumber() : parseFloat(client.annualRevenue)) : 0,
        founded: client.foundedYear || 2020,
        employees: client.employeeCount || 10,
        riskLevel,
        penaltyExposure: Math.round(penaltyExposure),
        organizationId: client.organizationId, // Include organization ID
        assignedSince: new Date(client.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        lastReview: new Date(client.lastReview || client.updatedAt).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        }),
        nextReview: new Date(client.nextReview || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        }),
        activeAlerts,
        states,
        decisions: [], // Will be populated from decisions table if needed
        communications: [], // Will be populated from communications table if needed
        performance: {
          responseTime: "2.3 hours",
          satisfaction: 4.5,
          complianceRate: 95,
          penaltyPrevention: Math.round(penaltyExposure * 1.5),
          timeSpent: "15.2 hours"
        },
        // Include original fields for proper formatting
        foundedYear: client.foundedYear,
        employeeCount: client.employeeCount,
        annualRevenue: client.annualRevenue,
        qualityScore: client.qualityScore
      };
    });

    res.json({
      success: true,
      data: {
        clients: formatArray(transformedClients, formatClient),
        total,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch clients' 
    });
  }
});

// Get single client by ID with all related data
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { organizationId } = req.query;
    
    // CRITICAL: Filter by organization ID to ensure data isolation
    if (!organizationId) {
      return res.status(400).json({ 
        error: 'Organization ID is required for data isolation' 
      });
    }
    
    // Check if id is a UUID or slug
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    const whereClause = isUUID ? { id, organizationId } : { slug: id, organizationId };
    
    console.log('Looking for client with:', whereClause);
    
    // Get client with related data
    const client = await prisma.client.findUnique({
      where: whereClause,
      include: {
        organization: true,
        clientStates: true,
        nexusAlerts: true,
        communications: true,
        businessProfile: true,
        contacts: true,
        businessLocations: true,
        revenueBreakdowns: true,
        customerDemographics: true,
        geographicDistributions: true,
      },
    });

    console.log('Found client:', client ? { id: client.id, name: client.name, slug: client.slug } : 'Not found');

    if (!client) {
      return res.status(404).json({
        success: false,
        error: 'Client not found'
      });
    }

    // Calculate risk level based on client states
    let riskLevel = 'monitoring';
    if (client.clientStates && client.clientStates.length > 0) {
      const criticalStates = client.clientStates.filter(cs => cs.status === 'critical');
      const warningStates = client.clientStates.filter(cs => cs.status === 'warning');
      
      if (criticalStates.length > 0) {
        riskLevel = 'critical';
      } else if (warningStates.length > 0) {
        riskLevel = 'warning';
      }
    }

    // Return client data with computed fields
    res.json({
      success: true,
      data: {
        ...formatClient(client),
        riskLevel: riskLevel,
        activeAlerts: client.nexusAlerts ? client.nexusAlerts.filter(alert => alert.status === 'open').length : 0,
        nextReview: "2024-12-01"
      }
    });
  } catch (error) {
    console.error('Error fetching client details:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch client details',
      details: error.message 
    });
  }
});

// Create a new client
router.post('/', async (req, res) => {
  try {
    const {
      name,
      legalName,
      industry,
      annualRevenue,
      foundedYear,
      employeeCount,
      primaryContactName,
      primaryContactEmail,
      city,
      state,
      description,
      organizationId,
      slug,
      riskLevel = 'medium',
      penaltyExposure,
      qualityScore = 75,
      status = 'active',
      assignedPartner,
      assignedManager,
      tags = []
    } = req.body;

    // Validate required fields
    if (!name || !legalName || !industry || !organizationId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, legalName, industry, organizationId'
      });
    }

    // Generate slug if not provided
    const clientSlug = slug || name.toLowerCase().replace(/[^a-z0-9]/g, '-');

    // Calculate penalty exposure if not provided
    const calculatedPenaltyExposure = penaltyExposure || (annualRevenue ? annualRevenue * 0.1 : 50000);

    // Create the client
    const client = await prisma.client.create({
      data: {
        name,
        legalName,
        industry,
        annualRevenue: annualRevenue ? parseFloat(annualRevenue) : null,
        foundedYear: foundedYear ? parseInt(foundedYear) : null,
        employeeCount: employeeCount ? parseInt(employeeCount) : null,
        primaryContactName,
        primaryContactEmail,
        city,
        state,
        description,
        organizationId,
        slug: clientSlug,
        riskLevel,
        penaltyExposure: calculatedPenaltyExposure,
        qualityScore,
        status,
        assignedPartner: assignedPartner || 'Managing Partner',
        assignedManager: assignedManager || 'Sarah Mitchell',
        tags,
        lastReview: new Date(),
        nextReview: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      }
    });

    // Format the response
    const formattedClient = formatClient(client);

    res.status(201).json({
      success: true,
      data: formattedClient
    });

  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create client',
      details: error.message
    });
  }
});

module.exports = router;
