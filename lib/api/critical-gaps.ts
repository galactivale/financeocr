const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3080';

// GAP 2: PII Detection
export interface PIIDetection {
  byColumn: Record<string, {
    index: number;
    type: string;
    risk: string;
    sampleValues: string[];
  }>;
  byPattern: Record<string, Array<{
    column: string;
    columnIndex: number;
    row: number;
    value: string;
  }>>;
  severity: "NONE" | "LOW" | "MEDIUM" | "HIGH";
  totalIssues: number;
}

export async function detectPII(fileData: any[], headers: string[]): Promise<PIIDetection> {
  try {
    const response = await fetch(`${API_URL}/api/pii/detect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileData, headers })
    });

    if (!response.ok) {
      throw new Error(`PII detection failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('PII detection error:', error);
    throw error;
  }
}

export async function logPIIWarning(uploadId: string, piiDetection: PIIDetection, action: 'SHOWN' | 'OVERRIDE' | 'AUTO_EXCLUDED'): Promise<void> {
  try {
    await fetch(`${API_URL}/api/pii/log-warning`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uploadId, piiDetection, action })
    });
  } catch (error) {
    console.error('Failed to log PII warning:', error);
  }
}

// GAP 3: Audit Logging
export interface AuditAction {
  action: string;
  entity_type: string;
  entity_id: string;
  client_id?: string;
  upload_id?: string;
  memo_id?: string;
  details?: any;
  severity?: 'INFO' | 'WARNING' | 'ERROR';
  userId?: string;
  organizationId?: string;
}

export async function logAuditAction(action: AuditAction): Promise<void> {
  try {
    await fetch(`${API_URL}/api/audit/log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(action)
    });
  } catch (error) {
    console.error('Failed to log audit action:', error);
  }
}

export async function getAuditTrail(entityType: string, entityId: string): Promise<any[]> {
  try {
    const response = await fetch(`${API_URL}/api/audit/trail/${entityType}/${entityId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch audit trail');
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch audit trail:', error);
    return [];
  }
}

// GAP 4: Document Hash & Sealing
export interface MemoSealResult {
  memo: any;
  hash: string;
  sealed: boolean;
  sealedAt: Date;
  sealedBy: string;
}

export interface MemoVerificationResult {
  verified: boolean;
  storedHash: string;
  currentHash: string;
  sealedAt: Date;
  sealedBy: string;
  verificationTimestamp: Date;
  status: 'VERIFIED' | 'TAMPERED' | 'NOT_SEALED';
}

export async function sealMemo(memoId: string, userId: string, pdfBuffer?: ArrayBuffer): Promise<MemoSealResult> {
  try {
    const formData = new FormData();
    formData.append('memoId', memoId);
    formData.append('userId', userId);
    if (pdfBuffer) {
      formData.append('pdf', new Blob([pdfBuffer]));
    }

    const response = await fetch(`${API_URL}/api/memos/${memoId}/seal`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Failed to seal memo: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to seal memo:', error);
    throw error;
  }
}

export async function verifyMemoIntegrity(memoId: string, pdfBuffer?: ArrayBuffer): Promise<MemoVerificationResult> {
  try {
    const formData = new FormData();
    formData.append('memoId', memoId);
    if (pdfBuffer) {
      formData.append('pdf', new Blob([pdfBuffer]));
    }

    const response = await fetch(`${API_URL}/api/memos/${memoId}/verify`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Failed to verify memo: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to verify memo:', error);
    throw error;
  }
}

export async function getVerificationHistory(memoId: string): Promise<any[]> {
  try {
    const response = await fetch(`${API_URL}/api/memos/${memoId}/verification-history`);
    if (!response.ok) {
      throw new Error('Failed to fetch verification history');
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch verification history:', error);
    return [];
  }
}

// GAP 5: Approval Workflow
export interface ApprovalRequest {
  entity_type: string;
  entity_id: string;
  approval_type: string;
  required_role: string;
  organizationId: string;
  clientId?: string;
}

export interface ApprovalSubmission {
  approvalId: string;
  userId: string;
  notes?: string;
}

export async function createApprovalRequirement(request: ApprovalRequest): Promise<any> {
  try {
    const response = await fetch(`${API_URL}/api/approvals/requirements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error('Failed to create approval requirement');
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to create approval requirement:', error);
    throw error;
  }
}

export async function submitApproval(submission: ApprovalSubmission): Promise<any> {
  try {
    const response = await fetch(`${API_URL}/api/approvals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submission)
    });

    if (!response.ok) {
      throw new Error('Failed to submit approval');
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to submit approval:', error);
    throw error;
  }
}

export async function checkApprovalStatus(entityType: string, entityId: string): Promise<{
  required: boolean;
  approved: boolean;
  approvals: any[];
}> {
  try {
    const response = await fetch(`${API_URL}/api/approvals/status/${entityType}/${entityId}`);
    if (!response.ok) {
      throw new Error('Failed to check approval status');
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to check approval status:', error);
    return { required: false, approved: false, approvals: [] };
  }
}

// GAP 1: Statute Overrides
export interface StatuteOverride {
  stateCode: string;
  taxType: string;
  changeType: string;
  previousValue: any;
  newValue: any;
  effectiveDate: string;
  source: string;
  citation: string;
  notes?: string;
  organizationId: string;
  enteredBy: string;
}

export async function createStatuteOverride(override: StatuteOverride): Promise<any> {
  try {
    const response = await fetch(`${API_URL}/api/statutes/overrides`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(override)
    });

    if (!response.ok) {
      throw new Error(`Failed to create statute override: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to create statute override:', error);
    throw error;
  }
}

export async function getStatuteOverrides(organizationId: string, filters?: {
  stateCode?: string;
  taxType?: string;
  validationStatus?: string;
}): Promise<any[]> {
  try {
    const params = new URLSearchParams();
    params.append('organizationId', organizationId);
    if (filters?.stateCode) params.append('stateCode', filters.stateCode);
    if (filters?.taxType) params.append('taxType', filters.taxType);
    if (filters?.validationStatus) params.append('validationStatus', filters.validationStatus);

    const response = await fetch(`${API_URL}/api/statutes/overrides?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch statute overrides');
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch statute overrides:', error);
    return [];
  }
}

export async function validateStatuteOverride(overrideId: string, userId: string): Promise<any> {
  try {
    const response = await fetch(`${API_URL}/api/statutes/overrides/${overrideId}/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });

    if (!response.ok) {
      throw new Error('Failed to validate statute override');
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to validate statute override:', error);
    throw error;
  }
}

// GAP 6: Nexus Memos (System of Record)
export interface NexusMemoCreate {
  organizationId: string;
  clientId: string;
  title: string;
  memoType: 'INITIAL' | 'SUPPLEMENTAL' | 'REVISED';
  sections: any;
  conclusion?: string;
  recommendations?: string[];
  statuteVersions?: any;
  isSupplemental?: boolean;
  supersedes_memo_id?: string;
}

export async function createNexusMemo(memo: NexusMemoCreate): Promise<any> {
  try {
    const response = await fetch(`${API_URL}/api/memos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(memo)
    });

    if (!response.ok) {
      throw new Error('Failed to create nexus memo');
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to create nexus memo:', error);
    throw error;
  }
}

export async function getNexusMemos(organizationId: string, clientId?: string): Promise<any[]> {
  try {
    const params = new URLSearchParams();
    params.append('organizationId', organizationId);
    if (clientId) params.append('clientId', clientId);

    const response = await fetch(`${API_URL}/api/memos?${params.toString()}`);
    if (!response.ok) {
      throw new Error('Failed to fetch nexus memos');
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch nexus memos:', error);
    return [];
  }
}

export async function getMemoById(memoId: string): Promise<any> {
  try {
    const response = await fetch(`${API_URL}/api/memos/${memoId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch memo');
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch memo:', error);
    throw error;
  }
}
