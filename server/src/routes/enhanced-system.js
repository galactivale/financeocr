const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// GET /api/enhanced-system/overview - Get comprehensive system overview
router.get('/overview', async (req, res) => {
  try {
    const { organizationId = 'demo-org-id' } = req.query;

    // Get organization with metadata
    const organization = await prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        organizationMetadata: true
      }
    });

    if (!organization) {
      return res.status(404).json({
        success: false,
        error: 'Organization not found'
      });
    }

    // Get users with all relationships
    const users = await prisma.user.findMany({
      where: { organizationId },
      include: {
        userSessions: {
          where: {
            expiresAt: { gt: new Date() }
          },
          orderBy: { createdAt: 'desc' }
        },
        userPermissions: true,
        managedClients: {
          select: { id: true, name: true, status: true }
        },
        assignedClients: {
          select: { id: true, name: true, status: true }
        },
        assignedTasks: {
          select: { id: true, title: true, status: true, priority: true }
        },
        createdDecisions: {
          select: { id: true, decisionType: true, status: true, decisionDate: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Get client summary
    const clients = await prisma.client.findMany({
      where: { organizationId },
      select: {
        id: true,
        name: true,
        industry: true,
        status: true,
        riskLevel: true,
        qualityScore: true,
        annualRevenue: true,
        createdAt: true
      },
      orderBy: { updatedAt: 'desc' },
      take: 10
    });

    // Get integrations
    const integrations = await prisma.integration.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' }
    });

    // Get performance metrics
    const performanceMetrics = await prisma.performanceMetric.findMany({
      where: { organizationId },
      orderBy: { metricDate: 'desc' },
      take: 20
    });

    // Get recent audit logs
    const auditLogs = await prisma.auditLog.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    // Calculate system health metrics
    const systemHealth = await calculateSystemHealth(organizationId);

    // Calculate user metrics
    const userMetrics = {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.status === 'active').length,
      pendingUsers: users.filter(u => u.status === 'pending').length,
      onlineUsers: users.filter(u => u.userSessions.length > 0).length,
      roles: {
        managingPartner: users.filter(u => u.role === 'managing_partner').length,
        taxManager: users.filter(u => u.role === 'tax_manager').length,
        staffAccountant: users.filter(u => u.role === 'staff_accountant').length,
        systemAdmin: users.filter(u => u.role === 'system_admin').length
      }
    };

    // Calculate client metrics
    const clientMetrics = {
      totalClients: clients.length,
      activeClients: clients.filter(c => c.status === 'active').length,
      highRiskClients: clients.filter(c => c.riskLevel === 'high').length,
      averageQualityScore: clients.reduce((sum, c) => sum + (c.qualityScore || 0), 0) / clients.length || 0,
      totalRevenue: clients.reduce((sum, c) => sum + (c.annualRevenue || 0), 0)
    };

    res.json({
      success: true,
      data: {
        organization,
        users,
        clients,
        integrations,
        performanceMetrics,
        auditLogs,
        systemHealth,
        metrics: {
          users: userMetrics,
          clients: clientMetrics
        }
      }
    });

  } catch (error) {
    console.error('Error fetching system overview:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch system overview',
      details: error.message
    });
  }
});

// GET /api/enhanced-system/users - Get users with all relationships
router.get('/users', async (req, res) => {
  try {
    const { organizationId = 'demo-org-id' } = req.query;

    const users = await prisma.user.findMany({
      where: { organizationId },
      include: {
        userSessions: {
          where: {
            expiresAt: { gt: new Date() }
          },
          orderBy: { createdAt: 'desc' }
        },
        userPermissions: true,
        managedClients: {
          select: { id: true, name: true, status: true, industry: true }
        },
        assignedClients: {
          select: { id: true, name: true, status: true, industry: true }
        },
        assignedTasks: {
          select: { id: true, title: true, status: true, priority: true, dueDate: true }
        },
        createdDecisions: {
          select: { id: true, decisionType: true, status: true, decisionDate: true }
        },
        assignedAlerts: {
          select: { id: true, title: true, status: true, priority: true, createdAt: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: users
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users',
      details: error.message
    });
  }
});

// GET /api/enhanced-system/integrations - Get integrations with status
router.get('/integrations', async (req, res) => {
  try {
    const { organizationId = 'demo-org-id' } = req.query;

    const integrations = await prisma.integration.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' }
    });

    // Calculate integration health
    const integrationHealth = {
      total: integrations.length,
      active: integrations.filter(i => i.status === 'active').length,
      inactive: integrations.filter(i => i.status === 'inactive').length,
      error: integrations.filter(i => i.errorCount > 0).length,
      lastSync: integrations.reduce((latest, i) => {
        if (!i.lastSync) return latest;
        return !latest || i.lastSync > latest ? i.lastSync : latest;
      }, null)
    };

    res.json({
      success: true,
      data: {
        integrations,
        health: integrationHealth
      }
    });

  } catch (error) {
    console.error('Error fetching integrations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch integrations',
      details: error.message
    });
  }
});

// GET /api/enhanced-system/audit-logs - Get audit logs with filtering
router.get('/audit-logs', async (req, res) => {
  try {
    const { 
      organizationId = 'demo-org-id',
      page = 1,
      limit = 50,
      action,
      resourceType,
      userId,
      startDate,
      endDate
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    const where = {
      organizationId,
      ...(action && { action }),
      ...(resourceType && { resourceType }),
      ...(userId && { userId }),
      ...(startDate && endDate && {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      })
    };

    const auditLogs = await prisma.auditLog.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' }
    });

    const total = await prisma.auditLog.count({ where });

    res.json({
      success: true,
      data: {
        auditLogs,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit))
        }
      }
    });

  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch audit logs',
      details: error.message
    });
  }
});

// Helper function to calculate system health
async function calculateSystemHealth(organizationId) {
  try {
    // Get recent performance metrics
    const recentMetrics = await prisma.performanceMetric.findMany({
      where: {
        organizationId,
        metricDate: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        }
      },
      orderBy: { metricDate: 'desc' }
    });

    // Get integration status
    const integrations = await prisma.integration.findMany({
      where: { organizationId }
    });

    // Get user session status
    const activeSessions = await prisma.userSession.count({
      where: {
        user: { organizationId },
        expiresAt: { gt: new Date() }
      }
    });

    // Calculate health score
    const integrationHealth = integrations.length > 0 
      ? (integrations.filter(i => i.status === 'active').length / integrations.length) * 100 
      : 100;

    const systemHealth = {
      status: integrationHealth > 80 ? 'healthy' : integrationHealth > 60 ? 'degraded' : 'critical',
      score: Math.round(integrationHealth),
      metrics: {
        activeIntegrations: integrations.filter(i => i.status === 'active').length,
        totalIntegrations: integrations.length,
        activeSessions,
        recentMetrics: recentMetrics.length
      },
      lastChecked: new Date().toISOString()
    };

    return systemHealth;

  } catch (error) {
    console.error('Error calculating system health:', error);
    return {
      status: 'unknown',
      score: 0,
      metrics: {},
      lastChecked: new Date().toISOString()
    };
  }
}

module.exports = router;
