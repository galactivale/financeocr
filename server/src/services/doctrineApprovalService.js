const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const doctrineRuleService = require('./doctrineRuleService');

/**
 * Doctrine Approval Service
 * Handles approval workflows for office and firm-wide rules
 */

class DoctrineApprovalService {
  /**
   * Submit rule for approval
   */
  async submitForApproval(ruleId) {
    const rule = await prisma.doctrineRule.findUnique({
      where: { id: ruleId }
    });

    if (!rule) {
      throw new Error('Rule not found');
    }

    if (rule.scope === 'client') {
      throw new Error('Client rules do not require approval');
    }

    if (rule.status !== 'draft') {
      throw new Error('Only draft rules can be submitted for approval');
    }

    return await prisma.doctrineRule.update({
      where: { id: ruleId },
      data: {
        status: 'pending_approval',
        updatedAt: new Date()
      }
    });
  }

  /**
   * Approve a rule
   */
  async approveRule(ruleId, approverId, approverRole, comment) {
    const rule = await prisma.doctrineRule.findUnique({
      where: { id: ruleId },
      include: {
        approvals: true
      }
    });

    if (!rule) {
      throw new Error('Rule not found');
    }

    if (rule.status !== 'pending_approval') {
      throw new Error('Rule is not pending approval');
    }

    // Check if already approved by this approver
    const existingApproval = rule.approvals.find(
      a => a.approverId === approverId && a.action === 'approve'
    );

    if (existingApproval) {
      throw new Error('You have already approved this rule');
    }

    // Create approval record
    await prisma.doctrineApproval.create({
      data: {
        ruleId,
        approverId,
        approverRole: approverRole || 'partner',
        action: 'approve',
        comment,
        approvedAt: new Date()
      }
    });

    // Check if rule has required approvals
    const approvals = await prisma.doctrineApproval.findMany({
      where: {
        ruleId,
        action: 'approve'
      }
    });

    const requiredApprovals = rule.scope === 'firm' ? 2 : 1;
    const distinctApprovers = new Set(approvals.map(a => a.approverId));

    // If we have enough distinct approvals, activate the rule
    if (distinctApprovers.size >= requiredApprovals) {
      await prisma.doctrineRule.update({
        where: { id: ruleId },
        data: {
          status: 'active',
          updatedAt: new Date()
        }
      });

      // Create version event
      await doctrineRuleService.createVersionEvent({
        ruleId,
        fromVersion: rule.version,
        toVersion: rule.version,
        actionType: 'update',
        actorId: approverId,
        reason: `Rule activated after ${requiredApprovals} approval(s)`,
        previousSnapshot: rule,
        newSnapshot: { ...rule, status: 'active' }
      });
    }

    return {
      approved: true,
      approvalsReceived: distinctApprovers.size,
      approvalsRequired: requiredApprovals,
      activated: distinctApprovers.size >= requiredApprovals
    };
  }

  /**
   * Reject a rule
   */
  async rejectRule(ruleId, approverId, approverRole, comment) {
    const rule = await prisma.doctrineRule.findUnique({
      where: { id: ruleId }
    });

    if (!rule) {
      throw new Error('Rule not found');
    }

    if (rule.status !== 'pending_approval') {
      throw new Error('Rule is not pending approval');
    }

    // Create rejection record
    await prisma.doctrineApproval.create({
      data: {
        ruleId,
        approverId,
        approverRole: approverRole || 'partner',
        action: 'reject',
        comment,
        approvedAt: new Date()
      }
    });

    // Update rule status to rejected
    const updatedRule = await prisma.doctrineRule.update({
      where: { id: ruleId },
      data: {
        status: 'rejected',
        updatedAt: new Date()
      }
    });

    // Create version event
    await doctrineRuleService.createVersionEvent({
      ruleId,
      fromVersion: rule.version,
      toVersion: rule.version,
      actionType: 'update',
      actorId: approverId,
      reason: `Rule rejected: ${comment || 'No comment provided'}`,
      previousSnapshot: rule,
      newSnapshot: updatedRule
    });

    return updatedRule;
  }

  /**
   * Get pending approvals
   */
  async getPendingApprovals(filters = {}) {
    const {
      organizationId,
      scope,
      taxType,
      state,
      page = 1,
      limit = 20
    } = filters;

    const where = {
      status: 'pending_approval'
    };

    if (organizationId) where.organizationId = organizationId;
    if (scope) where.scope = scope;
    if (taxType) where.taxType = taxType;
    if (state) where.state = state;

    const [rules, total] = await Promise.all([
      prisma.doctrineRule.findMany({
        where,
        include: {
          approvals: {
            where: { action: 'approve' }
          },
          impactMetrics: true
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.doctrineRule.count({ where })
    ]);

    // Enrich with approval status
    const enrichedRules = rules.map(rule => {
      const approvalsReceived = rule.approvals.length;
      const requiredApprovals = rule.scope === 'firm' ? 2 : 1;
      const distinctApprovers = new Set(rule.approvals.map(a => a.approverId));

      return {
        ...rule,
        approvalsReceived: distinctApprovers.size,
        approvalsRequired: requiredApprovals,
        needsMoreApprovals: distinctApprovers.size < requiredApprovals
      };
    });

    return {
      rules: enrichedRules,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Check approval status
   */
  async checkApprovalStatus(ruleId) {
    const rule = await prisma.doctrineRule.findUnique({
      where: { id: ruleId },
      include: {
        approvals: {
          where: { action: 'approve' }
        }
      }
    });

    if (!rule) {
      throw new Error('Rule not found');
    }

    const requiredApprovals = rule.scope === 'firm' ? 2 : 1;
    const distinctApprovers = new Set(rule.approvals.map(a => a.approverId));

    return {
      ruleId,
      status: rule.status,
      approvalsReceived: distinctApprovers.size,
      approvalsRequired: requiredApprovals,
      needsMoreApprovals: distinctApprovers.size < requiredApprovals,
      approvers: Array.from(distinctApprovers)
    };
  }
}

module.exports = new DoctrineApprovalService();


