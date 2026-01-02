/**
 * Test script for Critical Gaps API endpoints
 * Tests all 6 critical gaps features end-to-end
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3080';

// Test data
const testOrganizationId = '00000000-0000-0000-0000-000000000001';
const testClientId = '00000000-0000-0000-0000-000000000002';
const testUserId = '00000000-0000-0000-0000-000000000003';

// Helper function for making API calls
async function apiCall(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, options);
  const data = await response.json();

  return {
    status: response.status,
    ok: response.ok,
    data
  };
}

// Test results storage
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

function logTest(name, passed, message = '') {
  const status = passed ? '✓' : '✗';
  const color = passed ? '\x1b[32m' : '\x1b[31m';
  const reset = '\x1b[0m';

  console.log(`${color}${status}${reset} ${name} ${message ? `- ${message}` : ''}`);

  results.tests.push({ name, passed, message });
  if (passed) results.passed++;
  else results.failed++;
}

// Test suite
async function runTests() {
  console.log('\n🧪 Testing Critical Gaps API Endpoints\n');
  console.log('='.repeat(60));

  let memoId = null;
  let approvalId = null;
  let statuteOverrideId = null;

  // ========================================
  // GAP 2: PII Detection
  // ========================================
  console.log('\n📋 GAP 2: PII Detection & Redaction\n');

  try {
    const piiResult = await apiCall('/api/pii/detect', 'POST', {
      fileData: [
        ['Name', 'SSN', 'Email', 'Revenue'],
        ['John Doe', '123-45-6789', 'john@example.com', '100000'],
        ['Jane Smith', '987-65-4321', 'jane@example.com', '200000']
      ],
      headers: ['Name', 'SSN', 'Email', 'Revenue']
    });

    logTest(
      'POST /api/pii/detect',
      piiResult.ok && piiResult.data.severity !== undefined,
      `Detected ${piiResult.data.totalIssues || 0} PII issues with ${piiResult.data.severity} severity`
    );

    // Log PII warning
    if (piiResult.ok) {
      const logResult = await apiCall('/api/pii/log-warning', 'POST', {
        uploadId: 'test-upload-123',
        piiDetection: piiResult.data,
        action: 'SHOWN'
      });

      logTest(
        'POST /api/pii/log-warning',
        logResult.ok && logResult.data.success,
        'PII warning logged successfully'
      );
    }
  } catch (error) {
    logTest('PII Detection endpoints', false, error.message);
  }

  // ========================================
  // GAP 3: Audit Trail
  // ========================================
  console.log('\n📜 GAP 3: Audit Trail & Forensic Log\n');

  try {
    const auditResult = await apiCall('/api/audit/log', 'POST', {
      action: 'UPLOAD_INITIATED',
      entity_type: 'UPLOAD',
      entity_id: 'test-upload-123',
      organizationId: testOrganizationId,
      userId: testUserId,
      details: { fileName: 'test.csv', fileSize: 1024 },
      severity: 'INFO'
    });

    logTest(
      'POST /api/audit/log',
      auditResult.ok && auditResult.data.success,
      'Audit action logged successfully'
    );

    // Get audit trail
    const trailResult = await apiCall('/api/audit/trail/UPLOAD/test-upload-123', 'GET');
    logTest(
      'GET /api/audit/trail/:entityType/:entityId',
      trailResult.ok && Array.isArray(trailResult.data),
      `Retrieved ${trailResult.data.length} audit entries`
    );

    // Verify audit chain
    const verifyResult = await apiCall('/api/audit/verify-chain', 'POST', {
      entityType: 'UPLOAD',
      entityId: 'test-upload-123'
    });

    logTest(
      'POST /api/audit/verify-chain',
      verifyResult.ok && verifyResult.data.verified !== undefined,
      `Chain verification: ${verifyResult.data.verified ? 'VERIFIED' : 'FAILED'}`
    );

    // Get audit actions list
    const actionsResult = await apiCall('/api/audit/actions', 'GET');
    logTest(
      'GET /api/audit/actions',
      actionsResult.ok && actionsResult.data.actions,
      `${Object.keys(actionsResult.data.actions || {}).length} action types available`
    );
  } catch (error) {
    logTest('Audit Trail endpoints', false, error.message);
  }

  // ========================================
  // GAP 6: System of Record (Nexus Memos)
  // ========================================
  console.log('\n📝 GAP 6: Nexus Memos (System of Record)\n');

  try {
    const memoResult = await apiCall('/api/memos', 'POST', {
      organizationId: testOrganizationId,
      clientId: testClientId,
      title: 'Test Nexus Analysis - 2026-01-02',
      memoType: 'INITIAL',
      sections: {
        summary: 'Test memo for API validation',
        alerts: [],
        stateAnalysis: {}
      },
      conclusion: 'Test conclusion',
      recommendations: ['Test recommendation 1', 'Test recommendation 2']
    });

    logTest(
      'POST /api/memos',
      memoResult.ok && memoResult.data.id,
      `Created memo ${memoResult.data.id?.substring(0, 8)}...`
    );

    if (memoResult.ok && memoResult.data.id) {
      memoId = memoResult.data.id;

      // Get memo by ID
      const getMemoResult = await apiCall(`/api/memos/${memoId}`, 'GET');
      logTest(
        'GET /api/memos/:id',
        getMemoResult.ok && getMemoResult.data.id === memoId,
        'Retrieved memo successfully'
      );

      // List memos
      const listResult = await apiCall(`/api/memos?organizationId=${testOrganizationId}`, 'GET');
      logTest(
        'GET /api/memos',
        listResult.ok && Array.isArray(listResult.data),
        `Found ${listResult.data.length} memo(s)`
      );
    }
  } catch (error) {
    logTest('Nexus Memos endpoints', false, error.message);
  }

  // ========================================
  // GAP 4: Document Hash & Sealing
  // ========================================
  console.log('\n🔒 GAP 4: Document Hash & Tamper Detection\n');

  if (memoId) {
    try {
      // Seal the memo
      const formData = new FormData();
      formData.append('memoId', memoId);
      formData.append('userId', testUserId);

      const sealResult = await fetch(`${API_URL}/api/memos/${memoId}/seal`, {
        method: 'POST',
        body: formData
      });

      const sealData = await sealResult.json();

      logTest(
        'POST /api/memos/:id/seal',
        sealResult.ok && sealData.sealed && sealData.hash,
        `Sealed with hash ${sealData.hash?.substring(0, 16)}...`
      );

      // Verify memo integrity
      const verifyFormData = new FormData();
      verifyFormData.append('memoId', memoId);

      const verifyResult = await fetch(`${API_URL}/api/memos/${memoId}/verify`, {
        method: 'POST',
        body: verifyFormData
      });

      const verifyData = await verifyResult.json();

      logTest(
        'POST /api/memos/:id/verify',
        verifyResult.ok && verifyData.verified !== undefined,
        `Verification: ${verifyData.status} (${verifyData.verified ? 'INTACT' : 'TAMPERED'})`
      );

      // Get verification history
      const historyResult = await apiCall(`/api/memos/${memoId}/verification-history`, 'GET');
      logTest(
        'GET /api/memos/:id/verification-history',
        historyResult.ok && Array.isArray(historyResult.data),
        `${historyResult.data.length} verification(s) recorded`
      );
    } catch (error) {
      logTest('Document Hash endpoints', false, error.message);
    }
  } else {
    logTest('Document Hash endpoints', false, 'Skipped - no memo ID available');
  }

  // ========================================
  // GAP 5: Approval Workflow
  // ========================================
  console.log('\n✅ GAP 5: Mandatory Human Approval\n');

  try {
    // Create approval requirement
    const approvalReqResult = await apiCall('/api/approvals/requirements', 'POST', {
      entity_type: 'UPLOAD',
      entity_id: 'test-upload-123',
      approval_type: 'DATA_VALIDATION',
      required_role: 'MANAGING_PARTNER',
      organizationId: testOrganizationId
    });

    logTest(
      'POST /api/approvals/requirements',
      approvalReqResult.ok && approvalReqResult.data.id,
      'Approval requirement created'
    );

    if (approvalReqResult.ok && approvalReqResult.data.id) {
      approvalId = approvalReqResult.data.id;

      // Submit approval
      const submitResult = await apiCall('/api/approvals', 'POST', {
        approvalId,
        userId: testUserId,
        notes: 'Test approval submission'
      });

      logTest(
        'POST /api/approvals',
        submitResult.ok && submitResult.data.status === 'APPROVED',
        'Approval submitted successfully'
      );

      // Check approval status
      const statusResult = await apiCall('/api/approvals/status/UPLOAD/test-upload-123', 'GET');
      logTest(
        'GET /api/approvals/status/:entityType/:entityId',
        statusResult.ok && statusResult.data.approved !== undefined,
        `Status: ${statusResult.data.approved ? 'APPROVED' : 'PENDING'}`
      );
    }

    // Get pending approvals
    const pendingResult = await apiCall(`/api/approvals/pending?organizationId=${testOrganizationId}`, 'GET');
    logTest(
      'GET /api/approvals/pending',
      pendingResult.ok && Array.isArray(pendingResult.data),
      `${pendingResult.data.length} pending approval(s)`
    );
  } catch (error) {
    logTest('Approval Workflow endpoints', false, error.message);
  }

  // ========================================
  // GAP 1: Statute Overrides
  // ========================================
  console.log('\n⚖️  GAP 1: Statute Change Management\n');

  try {
    // Create statute override
    const statuteResult = await apiCall('/api/statutes/overrides', 'POST', {
      stateCode: 'CA',
      taxType: 'SALES_TAX',
      changeType: 'THRESHOLD_ADJUSTMENT',
      previousValue: { threshold: 500000 },
      newValue: { threshold: 750000 },
      effectiveDate: '2026-01-01',
      source: 'Bloomberg Tax Alert',
      citation: 'CA Rev & Tax Code §6203',
      notes: 'Test statute override',
      organizationId: testOrganizationId,
      enteredBy: testUserId
    });

    logTest(
      'POST /api/statutes/overrides',
      statuteResult.ok && statuteResult.data.id,
      `Override created for CA SALES_TAX`
    );

    if (statuteResult.ok && statuteResult.data.id) {
      statuteOverrideId = statuteResult.data.id;

      // Get statute overrides
      const listResult = await apiCall(`/api/statutes/overrides?organizationId=${testOrganizationId}&stateCode=CA`, 'GET');
      logTest(
        'GET /api/statutes/overrides',
        listResult.ok && Array.isArray(listResult.data),
        `Found ${listResult.data.length} override(s) for CA`
      );

      // Validate statute override
      const validateResult = await apiCall(`/api/statutes/overrides/${statuteOverrideId}/validate`, 'POST', {
        userId: testUserId
      });

      logTest(
        'POST /api/statutes/overrides/:id/validate',
        validateResult.ok && validateResult.data.validation_status === 'VALIDATED',
        'Override validated successfully'
      );

      // Get affected clients
      const affectedResult = await apiCall(`/api/statutes/overrides/${statuteOverrideId}/affected-clients`, 'GET');
      logTest(
        'GET /api/statutes/overrides/:id/affected-clients',
        affectedResult.ok && affectedResult.data.count !== undefined,
        `${affectedResult.data.count} client(s) affected`
      );
    }
  } catch (error) {
    logTest('Statute Override endpoints', false, error.message);
  }

  // ========================================
  // Summary
  // ========================================
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Test Results Summary\n');
  console.log(`Total Tests: ${results.tests.length}`);
  console.log(`\x1b[32m✓ Passed: ${results.passed}\x1b[0m`);
  console.log(`\x1b[31m✗ Failed: ${results.failed}\x1b[0m`);
  console.log(`Success Rate: ${((results.passed / results.tests.length) * 100).toFixed(1)}%\n`);

  if (results.failed > 0) {
    console.log('Failed Tests:');
    results.tests
      .filter(t => !t.passed)
      .forEach(t => console.log(`  - ${t.name}: ${t.message}`));
    console.log('');
  }

  console.log('='.repeat(60) + '\n');
}

// Run the tests
runTests().catch(error => {
  console.error('\n❌ Test suite failed:', error);
  process.exit(1);
});
