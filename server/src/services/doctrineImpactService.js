const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const doctrineRuleService = require('./doctrineRuleService');

/**
 * Doctrine Impact Service
 * Tracks and calculates impact metrics for doctrine rules
 */

class DoctrineImpactService {
  /**
   * Calculate impact of a rule (dry-run)
   */
  async calculateImpact(rule, organizationId) {
    const {
      state,
      taxType,
      activityPattern,
      scope,
      clientId,
      officeId
    } = rule;

    // Build query to find affected clients
    const clientWhere = {
      organizationId,
      status: 'active'
    };

    // Apply scope filters
    if (scope === 'client' && clientId) {
      clientWhere.id = clientId;
    } else if (scope === 'office' && officeId) {
      // Would need office relationship - for now, use organizationId
      // In full implementation, would filter by office
    }
    // Firm-wide: no additional filter

    // Get clients that would be affected
    const clients = await prisma.client.findMany({
      where: clientWhere,
      include: {
        clientStates: {
          where: state ? { stateCode: state } : undefined
        },
        nexusAlerts: {
          where: {
            isActive: true,
            ...(state ? { stateCode: state } : {}),
            ...(taxType ? { alertType: taxType } : {})
          }
        }
      }
    });

    // Filter clients based on activity pattern if provided
    let affectedClients = clients;
    if (activityPattern) {
      affectedClients = clients.filter(client => {
        // Match against client states or alerts
        // This is simplified - can be enhanced with more sophisticated matching
        return this.matchesClientPattern(client, activityPattern);
      });
    }

    // Calculate metrics
    const totalRevenue = affectedClients.reduce((sum, client) => {
      const stateRevenue = client.clientStates
        .filter(cs => !state || cs.stateCode === state)
        .reduce((s, cs) => s + Number(cs.currentAmount || 0), 0);
      return sum + stateRevenue;
    }, 0);

    const totalMemos = affectedClients.length; // Simplified - would count actual memos

    return {
      clientsAffected: affectedClients.length,
      clientIds: affectedClients.map(c => c.id),
      totalRevenue,
      estimatedMemos: totalMemos,
      riskLevel: this.calculateRiskLevel(affectedClients.length, totalRevenue),
      preview: affectedClients.slice(0, 10).map(client => ({
        clientId: client.id,
        clientName: client.name,
        currentStatus: this.getClientStatus(client, state),
        wouldBecome: this.predictNewStatus(client, rule),
        revenue: client.clientStates
          .filter(cs => !state || cs.stateCode === state)
          .reduce((s, cs) => s + Number(cs.currentAmount || 0), 0)
      }))
    };
  }

  /**
   * Check if client matches activity pattern
   */
  matchesClientPattern(client, pattern) {
    // Simplified matching - can be enhanced
    if (pattern.revenue_threshold) {
      const totalRevenue = client.clientStates.reduce(
        (sum, cs) => sum + Number(cs.currentAmount || 0),
        0
      );
      if (totalRevenue < pattern.revenue_threshold) {
        return false;
      }
    }

    if (pattern.revenue_range) {
      const [min, max] = pattern.revenue_range.split('-').map(Number);
      const totalRevenue = client.clientStates.reduce(
        (sum, cs) => sum + Number(cs.currentAmount || 0),
        0
      );
      if (totalRevenue < min || totalRevenue > max) {
        return false;
      }
    }

    return true;
  }

  /**
   * Get client status
   */
  getClientStatus(client, stateCode) {
    const state = client.clientStates.find(cs => cs.stateCode === stateCode);
    if (!state) return 'NO_DATA';
    if (state.status === 'critical') return 'THRESHOLD_EXCEEDED';
    if (state.status === 'warning') return 'THRESHOLD_APPROACHING';
    return 'COMPLIANT';
  }

  /**
   * Predict new status based on rule
   */
  predictNewStatus(client, rule) {
    // Simplified prediction based on rule decision
    if (rule.decision === 'NO_REGISTRATION' || rule.decision === 'NO_ACTION') {
      return 'NO_ACTION_NEEDED';
    }
    if (rule.decision === 'REGISTER' || rule.decision === 'IMMEDIATE_ACTION') {
      return 'ACTION_REQUIRED';
    }
    return 'MONITOR';
  }

  /**
   * Calculate risk level
   */
  calculateRiskLevel(clientCount, totalRevenue) {
    if (clientCount > 50 || totalRevenue > 10000000) return 'HIGH';
    if (clientCount > 20 || totalRevenue > 5000000) return 'MEDIUM';
    return 'LOW';
  }

  /**
   * Update impact metrics for a rule
   */
  async updateImpactMetrics(ruleId, metrics) {
    return await doctrineRuleService.updateImpactMetrics(ruleId, metrics);
  }

  /**
   * Get impact dashboard data
   */
  async getImpactDashboard(filters = {}) {
    const {
      organizationId,
      scope,
      taxType,
      dateRange
    } = filters;

    const where = {
      organizationId,
      status: 'active'
    };

    if (scope) where.scope = scope;
    if (taxType) where.taxType = taxType;

    const rules = await prisma.doctrineRule.findMany({
      where,
      include: {
        impactMetrics: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Aggregate metrics
    const totalActiveRules = rules.length;
    const totalClientsAffected = rules.reduce(
      (sum, r) => sum + (r.impactMetrics?.totalClientsAffected || 0),
      0
    );
    const totalMemosGenerated = rules.reduce(
      (sum, r) => sum + (r.impactMetrics?.totalMemosGenerated || 0),
      0
    );
    const totalRevenueCovered = rules.reduce(
      (sum, r) => sum + Number(r.impactMetrics?.totalRevenueCovered || 0),
      0
    );

    return {
      metrics: {
        totalActiveRules,
        totalClientsAffected,
        totalMemosGenerated,
        totalRevenueCovered
      },
      rules: rules.map(rule => ({
        ruleId: rule.id,
        name: rule.name,
        scope: rule.scope,
        state: rule.state,
        taxType: rule.taxType,
        clientsAffected: rule.impactMetrics?.totalClientsAffected || 0,
        memosGenerated: rule.impactMetrics?.totalMemosGenerated || 0,
        revenueCovered: Number(rule.impactMetrics?.totalRevenueCovered || 0),
        lastAppliedAt: rule.impactMetrics?.lastAppliedAt
      }))
    };
  }

  /**
   * Get blast radius (affected clients) for a rule
   */
  async getBlastRadius(ruleId) {
    const rule = await prisma.doctrineRule.findUnique({
      where: { id: ruleId }
    });

    if (!rule) {
      throw new Error('Rule not found');
    }

    const impact = await this.calculateImpact(rule, rule.organizationId);

    return {
      ruleId,
      ruleName: rule.name,
      scope: rule.scope,
      affectedClients: impact.clientsAffected,
      clients: impact.preview
    };
  }
}

module.exports = new DoctrineImpactService();


