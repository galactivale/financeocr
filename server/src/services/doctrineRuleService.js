const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Doctrine Rule Service
 * Handles CRUD operations for doctrine rules, versioning, and rollback
 */

class DoctrineRuleService {
  /**
   * Create a new doctrine rule
   */
  async createRule(data) {
    const {
      name,
      state,
      taxType,
      activityPattern,
      posture,
      decision,
      scope,
      clientId,
      officeId,
      organizationId,
      rationaleInternal,
      reviewDueAt,
      createdBy
    } = data;

    // Validate scope
    if (!['client', 'office', 'firm'].includes(scope)) {
      throw new Error('Invalid scope. Must be "client", "office", or "firm"');
    }

    // Determine status based on scope
    let status = 'draft';
    if (scope === 'client') {
      status = 'active'; // Client rules auto-activate
    } else if (scope === 'office' || scope === 'firm') {
      status = 'pending_approval';
    }

    // Create the rule
    const rule = await prisma.doctrineRule.create({
      data: {
        name,
        state,
        taxType,
        activityPattern: activityPattern || {},
        posture,
        decision,
        scope,
        clientId: scope === 'client' ? clientId : null,
        officeId: scope === 'office' ? officeId : null,
        organizationId,
        status,
        version: 1,
        rationaleInternal,
        reviewDueAt: reviewDueAt ? new Date(reviewDueAt) : null,
        createdBy
      }
    });

    // Create version event
    await this.createVersionEvent({
      ruleId: rule.id,
      fromVersion: null,
      toVersion: 1,
      actionType: 'create',
      actorId: createdBy,
      reason: 'Initial rule creation',
      previousSnapshot: null,
      newSnapshot: rule
    });

    // Create impact metrics entry
    await prisma.doctrineImpactMetrics.create({
      data: {
        ruleId: rule.id,
        totalClientsAffected: 0,
        totalMemosGenerated: 0,
        totalRevenueCovered: 0
      }
    });

    return rule;
  }

  /**
   * Update an existing rule (creates new version)
   */
  async updateRule(ruleId, data, actorId, reason) {
    const existingRule = await prisma.doctrineRule.findUnique({
      where: { id: ruleId }
    });

    if (!existingRule) {
      throw new Error('Rule not found');
    }

    const newVersion = existingRule.version + 1;

    // Update the rule
    const updatedRule = await prisma.doctrineRule.update({
      where: { id: ruleId },
      data: {
        ...data,
        version: newVersion,
        updatedAt: new Date()
      }
    });

    // Create version event
    await this.createVersionEvent({
      ruleId: ruleId,
      fromVersion: existingRule.version,
      toVersion: newVersion,
      actionType: 'update',
      actorId,
      reason: reason || 'Rule updated',
      previousSnapshot: existingRule,
      newSnapshot: updatedRule
    });

    return updatedRule;
  }

  /**
   * Get rule by ID (optionally specific version)
   */
  async getRule(ruleId, version = null) {
    const rule = await prisma.doctrineRule.findUnique({
      where: { id: ruleId },
      include: {
        approvals: {
          orderBy: { approvedAt: 'desc' }
        },
        impactMetrics: true,
        versionEvents: {
          orderBy: { timestamp: 'desc' },
          take: 10
        }
      }
    });

    if (!rule) {
      return null;
    }

    // If specific version requested, get from version events
    if (version && version !== rule.version) {
      const versionEvent = await prisma.doctrineVersionEvent.findFirst({
        where: {
          ruleId: ruleId,
          toVersion: version
        },
        orderBy: { timestamp: 'desc' }
      });

      if (versionEvent && versionEvent.newSnapshot) {
        return {
          ...versionEvent.newSnapshot,
          version: version,
          isHistorical: true
        };
      }
    }

    return rule;
  }

  /**
   * List rules with filters
   */
  async listRules(filters = {}) {
    const {
      organizationId,
      clientId,
      scope,
      status,
      state,
      taxType,
      page = 1,
      limit = 20
    } = filters;

    const where = {};
    if (organizationId) where.organizationId = organizationId;
    if (clientId) where.clientId = clientId;
    if (scope) where.scope = scope;
    if (status) where.status = status;
    if (state) where.state = state;
    if (taxType) where.taxType = taxType;

    const [rules, total] = await Promise.all([
      prisma.doctrineRule.findMany({
        where,
        include: {
          impactMetrics: true,
          approvals: true
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.doctrineRule.count({ where })
    ]);

    return {
      rules,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Disable a rule
   */
  async disableRule(ruleId, actorId, reason) {
    const rule = await prisma.doctrineRule.findUnique({
      where: { id: ruleId }
    });

    if (!rule) {
      throw new Error('Rule not found');
    }

    const updatedRule = await prisma.doctrineRule.update({
      where: { id: ruleId },
      data: {
        status: 'disabled',
        updatedAt: new Date()
      }
    });

    // Create version event
    await this.createVersionEvent({
      ruleId: ruleId,
      fromVersion: rule.version,
      toVersion: rule.version,
      actionType: 'disable',
      actorId,
      reason: reason || 'Rule disabled',
      previousSnapshot: rule,
      newSnapshot: updatedRule
    });

    return updatedRule;
  }

  /**
   * Rollback rule to a previous version
   */
  async rollbackRule(ruleId, targetVersion, actorId, reason) {
    const currentRule = await prisma.doctrineRule.findUnique({
      where: { id: ruleId }
    });

    if (!currentRule) {
      throw new Error('Rule not found');
    }

    if (targetVersion >= currentRule.version) {
      throw new Error('Cannot rollback to current or future version');
    }

    // Get the target version snapshot
    const versionEvent = await prisma.doctrineVersionEvent.findFirst({
      where: {
        ruleId: ruleId,
        toVersion: targetVersion
      },
      orderBy: { timestamp: 'desc' }
    });

    if (!versionEvent || !versionEvent.newSnapshot) {
      throw new Error('Target version not found');
    }

    const targetSnapshot = versionEvent.newSnapshot;
    const newVersion = currentRule.version + 1;

    // Restore rule from snapshot
    const rolledBackRule = await prisma.doctrineRule.update({
      where: { id: ruleId },
      data: {
        name: targetSnapshot.name,
        state: targetSnapshot.state,
        taxType: targetSnapshot.taxType,
        activityPattern: targetSnapshot.activityPattern,
        posture: targetSnapshot.posture,
        decision: targetSnapshot.decision,
        version: newVersion,
        updatedAt: new Date()
      }
    });

    // Create version event
    await this.createVersionEvent({
      ruleId: ruleId,
      fromVersion: currentRule.version,
      toVersion: newVersion,
      actionType: 'rollback',
      actorId,
      reason: reason || `Rolled back to version ${targetVersion}`,
      previousSnapshot: currentRule,
      newSnapshot: rolledBackRule
    });

    return rolledBackRule;
  }

  /**
   * Get version history for a rule
   */
  async getVersionHistory(ruleId) {
    const events = await prisma.doctrineVersionEvent.findMany({
      where: { ruleId },
      orderBy: { timestamp: 'desc' },
      include: {
        rule: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return events;
  }

  /**
   * Match rules based on criteria
   */
  async matchRules(criteria) {
    const {
      organizationId,
      clientId,
      state,
      taxType,
      activityPattern
    } = criteria;

    const where = {
      organizationId,
      status: 'active'
    };

    // Scope matching: firm-wide, office, or client-specific
    if (clientId) {
      where.OR = [
        { scope: 'firm' },
        { scope: 'office' }, // Would need officeId lookup
        { scope: 'client', clientId }
      ];
    } else {
      where.scope = 'firm';
    }

    if (state) where.state = state;
    if (taxType) where.taxType = taxType;

    const rules = await prisma.doctrineRule.findMany({
      where,
      include: {
        impactMetrics: true
      },
      orderBy: [
        { scope: 'asc' }, // Prefer more specific scopes
        { version: 'desc' } // Prefer latest version
      ]
    });

    // Filter by activity pattern if provided
    if (activityPattern) {
      return rules.filter(rule => {
        if (!rule.activityPattern) return false;
        // Simple pattern matching - can be enhanced
        return this.matchesActivityPattern(rule.activityPattern, activityPattern);
      });
    }

    return rules;
  }

  /**
   * Check if activity pattern matches
   */
  matchesActivityPattern(rulePattern, activityPattern) {
    // Simple matching logic - can be enhanced
    for (const key in rulePattern) {
      if (activityPattern[key] !== rulePattern[key]) {
        return false;
      }
    }
    return true;
  }

  /**
   * Create a version event
   */
  async createVersionEvent(data) {
    return await prisma.doctrineVersionEvent.create({
      data: {
        ruleId: data.ruleId,
        fromVersion: data.fromVersion,
        toVersion: data.toVersion,
        actionType: data.actionType,
        actorId: data.actorId,
        timestamp: new Date(),
        reason: data.reason,
        previousSnapshot: data.previousSnapshot,
        newSnapshot: data.newSnapshot
      }
    });
  }

  /**
   * Update impact metrics
   */
  async updateImpactMetrics(ruleId, metrics) {
    const existing = await prisma.doctrineImpactMetrics.findUnique({
      where: { ruleId }
    });

    if (existing) {
      // Increment values if provided, otherwise keep existing
      const newClientsAffected = metrics.totalClientsAffected !== undefined
        ? existing.totalClientsAffected + (metrics.totalClientsAffected || 0)
        : existing.totalClientsAffected;
      
      const newMemosGenerated = metrics.totalMemosGenerated !== undefined
        ? existing.totalMemosGenerated + (metrics.totalMemosGenerated || 0)
        : existing.totalMemosGenerated;
      
      const newRevenueCovered = metrics.totalRevenueCovered !== undefined
        ? Number(existing.totalRevenueCovered) + Number(metrics.totalRevenueCovered || 0)
        : Number(existing.totalRevenueCovered);

      return await prisma.doctrineImpactMetrics.update({
        where: { ruleId },
        data: {
          totalClientsAffected: newClientsAffected,
          totalMemosGenerated: newMemosGenerated,
          totalRevenueCovered: newRevenueCovered,
          lastAppliedAt: metrics.lastAppliedAt ? new Date(metrics.lastAppliedAt) : existing.lastAppliedAt,
          updatedAt: new Date()
        }
      });
    } else {
      return await prisma.doctrineImpactMetrics.create({
        data: {
          ruleId,
          totalClientsAffected: metrics.totalClientsAffected || 0,
          totalMemosGenerated: metrics.totalMemosGenerated || 0,
          totalRevenueCovered: metrics.totalRevenueCovered || 0,
          lastAppliedAt: metrics.lastAppliedAt ? new Date(metrics.lastAppliedAt) : null
        }
      });
    }
  }
}

module.exports = new DoctrineRuleService();

