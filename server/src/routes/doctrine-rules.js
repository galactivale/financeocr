const express = require('express');
const router = express.Router();
const doctrineRuleService = require('../services/doctrineRuleService');
const doctrineApprovalService = require('../services/doctrineApprovalService');
const doctrineImpactService = require('../services/doctrineImpactService');

/**
 * POST /api/doctrine-rules
 * Create a new doctrine rule
 */
router.post('/', async (req, res) => {
  try {
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
      reviewDueAt
    } = req.body;

    // Get user from request (assuming auth middleware sets req.user)
    const createdBy = req.user?.id;

    if (!name || !scope || !organizationId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, scope, organizationId'
      });
    }

    // Validate scope
    if (!['client', 'office', 'firm'].includes(scope)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid scope. Must be "client", "office", or "firm"'
      });
    }

    // Validate scope-specific requirements
    if (scope === 'client' && !clientId) {
      return res.status(400).json({
        success: false,
        error: 'clientId required for client-scoped rules'
      });
    }

    const rule = await doctrineRuleService.createRule({
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
    });

    res.json({
      success: true,
      rule
    });
  } catch (error) {
    console.error('Error creating doctrine rule:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create doctrine rule'
    });
  }
});

/**
 * GET /api/doctrine-rules
 * List doctrine rules with filters
 */
router.get('/', async (req, res) => {
  try {
    const {
      organizationId,
      clientId,
      scope,
      status,
      state,
      taxType,
      page = 1,
      limit = 20
    } = req.query;

    const result = await doctrineRuleService.listRules({
      organizationId,
      clientId,
      scope,
      status,
      state,
      taxType,
      page: parseInt(page),
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error listing doctrine rules:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to list doctrine rules'
    });
  }
});

/**
 * GET /api/doctrine-rules/pending
 * List rules pending approval
 */
router.get('/pending', async (req, res) => {
  try {
    const {
      organizationId,
      scope,
      taxType,
      state,
      page = 1,
      limit = 20
    } = req.query;

    const result = await doctrineApprovalService.getPendingApprovals({
      organizationId,
      scope,
      taxType,
      state,
      page: parseInt(page),
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error getting pending approvals:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get pending approvals'
    });
  }
});

/**
 * GET /api/doctrine-rules/impact
 * Get impact dashboard data
 */
router.get('/impact', async (req, res) => {
  try {
    const {
      organizationId,
      scope,
      taxType,
      dateRange
    } = req.query;

    const result = await doctrineImpactService.getImpactDashboard({
      organizationId,
      scope,
      taxType,
      dateRange
    });

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error getting impact dashboard:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get impact dashboard'
    });
  }
});

/**
 * GET /api/doctrine-rules/:id
 * Get a specific rule
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { version } = req.query;

    const rule = await doctrineRuleService.getRule(id, version ? parseInt(version) : null);

    if (!rule) {
      return res.status(404).json({
        success: false,
        error: 'Rule not found'
      });
    }

    res.json({
      success: true,
      rule
    });
  } catch (error) {
    console.error('Error getting doctrine rule:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get doctrine rule'
    });
  }
});

/**
 * POST /api/doctrine-rules/:id/approve
 * Approve a pending rule
 */
router.post('/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;
    const approverId = req.user?.id;
    const approverRole = req.user?.role || 'partner';

    if (!approverId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const result = await doctrineApprovalService.approveRule(
      id,
      approverId,
      approverRole,
      comment
    );

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error approving doctrine rule:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to approve doctrine rule'
    });
  }
});

/**
 * POST /api/doctrine-rules/:id/reject
 * Reject a pending rule
 */
router.post('/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;
    const approverId = req.user?.id;
    const approverRole = req.user?.role || 'partner';

    if (!approverId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const rule = await doctrineApprovalService.rejectRule(
      id,
      approverId,
      approverRole,
      comment
    );

    res.json({
      success: true,
      rule
    });
  } catch (error) {
    console.error('Error rejecting doctrine rule:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to reject doctrine rule'
    });
  }
});

/**
 * POST /api/doctrine-rules/dry-run
 * Simulate rule impact without creating the rule
 */
router.post('/dry-run', async (req, res) => {
  try {
    const {
      organizationId,
      state,
      taxType,
      activityPattern,
      posture,
      decision,
      scope,
      clientId,
      officeId
    } = req.body;

    if (!organizationId || !scope) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: organizationId, scope'
      });
    }

    const rule = {
      state,
      taxType,
      activityPattern,
      posture,
      decision,
      scope,
      clientId,
      officeId,
      organizationId
    };

    const impact = await doctrineImpactService.calculateImpact(rule, organizationId);

    res.json({
      success: true,
      impact
    });
  } catch (error) {
    console.error('Error running dry-run:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to run dry-run'
    });
  }
});

/**
 * POST /api/doctrine-rules/:id/rollback
 * Rollback rule to a previous version
 */
router.post('/:id/rollback', async (req, res) => {
  try {
    const { id } = req.params;
    const { targetVersion, reason } = req.body;
    const actorId = req.user?.id;

    if (!actorId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    if (!targetVersion) {
      return res.status(400).json({
        success: false,
        error: 'targetVersion is required'
      });
    }

    const rule = await doctrineRuleService.rollbackRule(
      id,
      parseInt(targetVersion),
      actorId,
      reason
    );

    res.json({
      success: true,
      rule
    });
  } catch (error) {
    console.error('Error rolling back doctrine rule:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to rollback doctrine rule'
    });
  }
});

/**
 * POST /api/doctrine-rules/:id/disable
 * Disable an active rule
 */
router.post('/:id/disable', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const actorId = req.user?.id;

    if (!actorId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const rule = await doctrineRuleService.disableRule(id, actorId, reason);

    res.json({
      success: true,
      rule
    });
  } catch (error) {
    console.error('Error disabling doctrine rule:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to disable doctrine rule'
    });
  }
});

/**
 * GET /api/doctrine-rules/:id/versions
 * Get version history for a rule
 */
router.get('/:id/versions', async (req, res) => {
  try {
    const { id } = req.params;

    const history = await doctrineRuleService.getVersionHistory(id);

    res.json({
      success: true,
      history
    });
  } catch (error) {
    console.error('Error getting version history:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get version history'
    });
  }
});

/**
 * GET /api/doctrine-rules/:id/blast-radius
 * Get blast radius (affected clients) for a rule
 */
router.get('/:id/blast-radius', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await doctrineImpactService.getBlastRadius(id);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error getting blast radius:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get blast radius'
    });
  }
});

module.exports = router;


