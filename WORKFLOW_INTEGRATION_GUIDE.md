# Nexus Memo Workflow - Complete Integration Guide

**Route:** `/dashboard/managing-partner/nexus-memos/new`

This document shows how all 6 Critical Gaps are integrated into the complete nexus memo workflow from start to finish.

---

## 🔄 Complete Workflow Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    4-Step Nexus Memo Workflow                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Step 1: UPLOAD                                                │
│  └─> GAP 2: PII Detection & Redaction                          │
│  └─> GAP 3: Audit Trail (UPLOAD_INITIATED, PII_DETECTED)       │
│                                                                 │
│  Step 2: VALIDATION                                             │
│  └─> GAP 5: Mandatory Human Approval                           │
│  └─> GAP 3: Audit Trail (MAPPING_CONFIRMED, APPROVAL)          │
│                                                                 │
│  Step 3: REVIEW ALERTS                                         │
│  └─> GAP 1: Statute Override Entry                             │
│  └─> GAP 3: Audit Trail (STATUTE_OVERRIDE_CREATED)             │
│                                                                 │
│  Step 4: GENERATE MEMOS                                        │
│  └─> GAP 6: System of Record (Create Memo in DB)               │
│  └─> GAP 4: Document Hash & Seal                               │
│  └─> GAP 3: Audit Trail (MEMO_GENERATED, MEMO_SEALED)          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📋 Step-by-Step Workflow Integration

### **Step 1: Upload Files** ([UploadStep.tsx](app/dashboard/managing-partner/nexus-memos/new/components/UploadStep.tsx))

**User Actions:**
1. Drag & drop or select CSV/Excel files
2. Files automatically upload to backend
3. **[GAP 2]** PII detection runs automatically on each file

**Critical Gaps Integration:**

#### **GAP 2: PII Detection & Redaction**
```typescript
// Line 160-196 in UploadStep.tsx
// Automatic PII detection after file upload
if (result.previewData && result.previewData.length > 0) {
  const piiResult = await detectPII(dataRows, headers);

  if (piiResult.severity !== 'NONE') {
    // Show PII warning modal
    setShowPIIWarning(true);
    await logPIIWarning(uploadId, piiResult, 'SHOWN');
  }
}
```

**API Called:** `POST /api/pii/detect`

**User Experience:**
- If **HIGH/MEDIUM** risk PII detected → Shows [PIIWarningModal](app/components/modals/PIIWarningModal.tsx)
- Modal displays:
  - Detected PII columns (e.g., "SSN", "email", "phone")
  - Pattern matches with masked sample values
  - Severity indicator (HIGH/MEDIUM/LOW)
- User options:
  - ✅ **Auto-Exclude PII & Continue** (recommended)
  - ⚠️ **Proceed Anyway** (logs override)
  - ❌ **Cancel Upload**

#### **GAP 3: Audit Trail**
```typescript
// Line 171-181 in UploadStep.tsx
await logAuditAction({
  action: 'PII_DETECTED',
  entity_type: 'UPLOAD',
  entity_id: uploadId,
  details: {
    severity: piiResult.severity,
    totalIssues: piiResult.totalIssues,
    fileName: file.name
  }
});
```

**API Called:** `POST /api/audit/log`

**Audit Actions Logged:**
- `UPLOAD_INITIATED` - When user starts upload
- `PII_DETECTED` - When PII is found
- `PII_WARNING_SHOWN` - When modal is displayed
- `PII_OVERRIDE` - If user proceeds with PII
- `PII_AUTO_EXCLUDED` - If user chooses auto-exclude

---

### **Step 2: Data Validation** ([DataValidationStep.tsx](app/dashboard/managing-partner/nexus-memos/new/components/DataValidationStep.tsx))

**User Actions:**
1. System runs automated validation pipeline (7 stages)
2. Review column mappings and state normalizations
3. **[GAP 5]** Confirm approval before proceeding

**Critical Gaps Integration:**

#### **GAP 5: Mandatory Human Approval**
```typescript
// Line 694-732 in DataValidationStep.tsx
{!isRunning && canProceed && (
  <Card className="bg-blue-500/10 border border-blue-500/30">
    <CardBody>
      <h4>Data Validation Approval Required</h4>
      <p>Before proceeding, please confirm you have reviewed and approved:</p>
      <ul>
        <li>{columnMappings.length} column mapping(s)</li>
        <li>{stateNormalizations.length} state normalization(s)</li>
        <li>{validationSummary.validRows} valid data row(s)</li>
      </ul>
      <Checkbox isSelected={approvalConfirmed} onValueChange={setApprovalConfirmed}>
        I have reviewed and approve these data mappings and normalizations
      </Checkbox>
    </CardBody>
  </Card>
)}
```

**User Experience:**
- After validation completes, approval card appears
- Shows summary of what's being approved
- **Required checkbox** - Cannot proceed without checking
- Button states:
  - Unchecked: "Approval Required" (disabled)
  - Checked: "Continue to Analysis" (enabled)

#### **Approval Submission**
```typescript
// Line 303-328 in DataValidationStep.tsx
if (approvalId) {
  await submitApproval({
    approvalId,
    userId,
    notes: `Approved ${columnMappings.length} column mappings...`
  });

  await logAuditAction({
    action: 'NORMALIZATION_APPROVED',
    entity_type: 'UPLOAD',
    entity_id: uploadId,
    details: { mappingsCount, normalizationsCount, approvalId }
  });
}
```

**API Called:**
- `POST /api/approvals` - Submit approval
- `POST /api/audit/log` - Log approval action

**Audit Actions Logged:**
- `MAPPING_SUGGESTED` - System suggests mappings
- `MAPPING_CONFIRMED` - User confirms mappings
- `STATE_NORMALIZED` - Auto-corrections applied
- `NORMALIZATION_APPROVED` - User approves normalizations

---

### **Step 3: Review Alerts** ([AlertsStep.tsx](app/dashboard/managing-partner/nexus-memos/new/components/AlertsStep.tsx))

**User Actions:**
1. Review generated nexus alerts (RED/ORANGE/YELLOW)
2. Filter alerts by severity or judgment required
3. **[GAP 1]** Enter statute overrides for law changes
4. Mark known issues

**Critical Gaps Integration:**

#### **GAP 1: Statute Override Entry**
```typescript
// Line 550-558 in AlertsStep.tsx
{/* GAP 1: Statute Override Entry */}
<Button
  color="secondary"
  variant="flat"
  startContent={<Save className="w-4 h-4" />}
  onPress={() => setShowStatuteOverrideModal(true)}
>
  Enter Statute Override
</Button>
```

**User Experience:**
- Button visible in top-right of alerts page
- Opens [StatuteOverrideModal](app/components/modals/StatuteOverrideModal.tsx)
- Modal fields:
  - State (dropdown: AL, AK, AZ, etc.)
  - Tax Type (Sales Tax, Income Tax, Franchise Tax, etc.)
  - Change Type (Threshold Adjustment, Rate Change, etc.)
  - Previous/New Threshold values
  - Effective Date
  - Source (Bloomberg Alert, State Website, etc.)
  - Citation (TX Tax Code §123.456)
  - Notes

#### **Statute Override Submission**
```typescript
// Line 427-462 in AlertsStep.tsx
const handleStatuteOverrideSave = async (data) => {
  const override = await createStatuteOverride({
    ...data,
    organizationId,
    enteredBy: userId
  });

  await logAuditAction({
    action: 'STATUTE_OVERRIDE_CREATED',
    entity_type: 'STATUTE_OVERRIDE',
    entity_id: override.id,
    details: {
      stateCode: data.stateCode,
      taxType: data.taxType,
      effectiveDate: data.effectiveDate
    }
  });

  alert(`Statute override for ${data.stateCode} recorded and pending validation.`);
}
```

**API Called:**
- `POST /api/statutes/overrides` - Create override
- `POST /api/audit/log` - Log creation

**Database Records Created:**
- `statute_overrides` table entry with status: **PENDING**
- Awaits partner validation before affecting client memos

**Audit Actions Logged:**
- `ALERT_GENERATED` - System creates alerts
- `STATUTE_OVERRIDE_CREATED` - Override entered
- `JUDGMENT_RECORDED` - User records firm position

---

### **Step 4: Generate Memos** ([MemosStep.tsx](app/dashboard/managing-partner/nexus-memos/new/components/MemosStep.tsx))

**User Actions:**
1. System generates memo from alerts
2. **[GAP 6]** Memo created in database (System of Record)
3. Review memo preview
4. **[GAP 4]** Seal memo with cryptographic hash
5. Verify memo integrity
6. Download PDF/Word

**Critical Gaps Integration:**

#### **GAP 6: System of Record Architecture**
```typescript
// Line 67-110 in MemosStep.tsx
const memo = await createNexusMemo({
  organizationId,
  clientId,
  title: `Nexus Analysis - ${new Date().toLocaleDateString()}`,
  memoType: 'INITIAL',
  sections: {
    summary: generatedMemos.summary,
    alerts: alerts,
    stateAnalysis: generatedMemos.stateAnalysis
  },
  conclusion: generatedMemos.summary,
  recommendations: generatedMemos.recommendations,
  statuteVersions: generatedMemos.doctrineMetadata
});

setMemoId(memo.id);

await logAuditAction({
  action: 'MEMO_GENERATED',
  entity_type: 'MEMO',
  entity_id: memo.id,
  details: { alertsCount, filesProcessed }
});
```

**API Called:**
- `POST /api/memos` - Create memo in database
- `POST /api/audit/log` - Log generation

**Database Records:**
- Entry in `nexus_memos` table
- Status: `DRAFT` (editable)
- Fields: title, sections, recommendations, statute_versions
- Supports versioning (supersedes_memo_id for revisions)

#### **GAP 4: Document Hash & Tamper Detection**

**Seal Memo:**
```typescript
// Line 108-143 in MemosStep.tsx
const handleSealMemo = async () => {
  const result = await sealMemo(memoId, userId);

  setIsSealed(true);
  setSealedHash(result.hash);

  await logAuditAction({
    action: 'MEMO_SEALED',
    entity_type: 'MEMO',
    entity_id: memoId,
    details: { hash: result.hash, sealedAt: result.sealedAt }
  });

  alert(`Memo sealed successfully! Hash: ${result.hash.substring(0, 16)}...`);
}
```

**API Called:** `POST /api/memos/{memoId}/seal`

**User Experience:**
- Before sealing:
  - Blue card with Shield icon
  - "Seal Memo for Integrity Protection"
  - Description of what sealing does
  - Primary button: "Seal Memo"

- After sealing:
  - Green card with Lock icon
  - "Memo Sealed"
  - SHA-256 hash displayed in monospace font
  - Status: read-only
  - "Verify Integrity" button available

**Verify Integrity:**
```typescript
// Line 146-183 in MemosStep.tsx
const handleVerifyMemo = async () => {
  const result = await verifyMemoIntegrity(memoId);

  await logAuditAction({
    action: result.verified ? 'HASH_VERIFIED' : 'TAMPER_DETECTED',
    entity_type: 'MEMO',
    entity_id: memoId,
    details: {
      verified: result.verified,
      storedHash: result.storedHash,
      currentHash: result.currentHash
    },
    severity: result.verified ? 'INFO' : 'WARNING'
  });

  if (result.verified) {
    alert('✓ Memo integrity verified! Document has not been tampered with.');
  } else {
    alert('⚠️ TAMPER DETECTED! Document has been modified since sealing.');
  }
}
```

**API Called:** `POST /api/memos/{memoId}/verify`

**Verification Display:**
- Shows verification status badge (VERIFIED/TAMPERED)
- Displays timestamp of last verification
- Color-coded:
  - Green: Verified
  - Red: Tampered

**Audit Actions Logged:**
- `MEMO_GENERATED` - Memo created
- `MEMO_SEALED` - Memo finalized with hash
- `HASH_VERIFIED` - Integrity check passed
- `TAMPER_DETECTED` - Integrity check failed

---

## 🔐 Security & Compliance Features

### **Audit Trail (GAP 3) - Complete Coverage**

Every action in the workflow is logged with:
- **User ID** - Who performed the action
- **Timestamp** - When it occurred
- **Entity Type & ID** - What was affected
- **Action Details** - Specific data changed
- **Hash Chain** - Links to previous action for integrity
- **IP Address & User Agent** - Request metadata

**Audit Trail Query:**
```typescript
const trail = await getAuditTrail('MEMO', memoId);
// Returns chronological list of all actions for a memo
```

**API Called:** `GET /api/audit/trail/{entityType}/{entityId}`

### **Hash Integrity (GAP 4)**

**Three-Level Hashing:**
1. **Content Hash** - SHA-256 of JSON data
2. **PDF Hash** - SHA-256 of PDF binary
3. **Document Hash** - SHA-256 of combined hashes

**Stored in Database:**
```sql
UPDATE nexus_memos SET
  document_hash = 'sha256_hash_here',
  content_hash = 'content_hash_here',
  pdf_hash = 'pdf_hash_here',
  sealed_at = NOW(),
  sealed_by = 'user_id',
  is_sealed = true,
  is_editable = false,
  status = 'SEALED'
WHERE id = 'memo_id'
```

**Verification History:**
All verification attempts logged in `memo_hash_verifications` table.

---

## 📊 Data Flow Summary

```
User Upload File
     │
     ▼
[PII Detection] ──────────> [Audit Log: PII_DETECTED]
     │
     ├─> HIGH/MEDIUM ──> [Show Warning Modal]
     │                        │
     │                        ├─> Auto-Exclude ──> [Audit Log: PII_AUTO_EXCLUDED]
     │                        └─> Proceed ──────> [Audit Log: PII_OVERRIDE]
     │
     ▼
[Data Validation]
     │
     ├──> [Auto-Mapping] ──────> [Audit Log: MAPPING_SUGGESTED]
     ├──> [Normalization] ─────> [Audit Log: STATE_NORMALIZED]
     │
     ▼
[Approval Required] ─────────> [User Confirms]
     │                                │
     │                                ▼
     │                          [Submit Approval] ──> [Audit Log: NORMALIZATION_APPROVED]
     │
     ▼
[Generate Alerts]
     │
     ├──> [Alert Detection] ──> [Audit Log: ALERT_GENERATED]
     │
     ├──> [Optional: Enter Statute Override]
     │         │
     │         └──> [Save Override] ──> [Audit Log: STATUTE_OVERRIDE_CREATED]
     │
     ▼
[Generate Memo]
     │
     ├──> [Create in DB] ──────> [Audit Log: MEMO_GENERATED]
     │         │
     │         └──> nexus_memos table (status: DRAFT)
     │
     ▼
[Seal Memo]
     │
     ├──> [Generate SHA-256 Hash]
     ├──> [Update DB: is_sealed=true, is_editable=false]
     ├──> [Log Hash in memo_hash_verifications]
     └──> [Audit Log: MEMO_SEALED]
     │
     ▼
[Verify Integrity]
     │
     ├──> [Regenerate Hash from Current Data]
     ├──> [Compare to Stored Hash]
     ├──> [Log Verification Attempt]
     └──> [Audit Log: HASH_VERIFIED or TAMPER_DETECTED]
```

---

## 🎯 Benefits of Integrated Workflow

### **For Managing Partners:**
✅ **Complete Visibility** - Every action tracked and auditable
✅ **Risk Mitigation** - PII detection prevents privacy violations
✅ **Compliance Ready** - Sealed documents provide legal defensibility
✅ **Knowledge Management** - Statute overrides captured centrally

### **For Clients:**
✅ **Data Privacy** - PII automatically detected and excluded
✅ **Quality Control** - Mandatory approvals ensure accuracy
✅ **Audit Trail** - Complete history of analysis decisions
✅ **Document Integrity** - Tamper-proof sealed memos

### **For Auditors:**
✅ **Forensic Capability** - Reconstruct any memo's creation history
✅ **Verification** - Cryptographic proof of document authenticity
✅ **Transparency** - All statute overrides and judgments documented
✅ **Accountability** - User actions traceable to individual

---

## 🔌 Backend API Endpoints Required

To complete the integration, implement these backend routes:

### **PII Detection (GAP 2)**
```
POST   /api/pii/detect              - Detect PII in data
POST   /api/pii/log-warning         - Log PII warning action
```

### **Audit Trail (GAP 3)**
```
POST   /api/audit/log               - Log audit action
GET    /api/audit/trail/:type/:id   - Get audit trail
```

### **Document Hash (GAP 4)**
```
POST   /api/memos/:id/seal          - Seal memo with hash
POST   /api/memos/:id/verify        - Verify memo integrity
GET    /api/memos/:id/verification-history - Get verification log
```

### **Approvals (GAP 5)**
```
POST   /api/approvals/requirements  - Create approval requirement
POST   /api/approvals               - Submit approval
GET    /api/approvals/status/:type/:id - Check approval status
```

### **Statute Overrides (GAP 1)**
```
POST   /api/statutes/overrides      - Create statute override
GET    /api/statutes/overrides      - Get overrides (with filters)
POST   /api/statutes/overrides/:id/validate - Validate override
```

### **Nexus Memos (GAP 6)**
```
POST   /api/memos                   - Create nexus memo
GET    /api/memos                   - Get memos (with filters)
GET    /api/memos/:id               - Get specific memo
```

---

## 📝 Implementation Checklist

### **Frontend** ✅ **COMPLETE**
- [x] PII Warning Modal component
- [x] Statute Override Modal component
- [x] API client functions
- [x] UploadStep PII detection integration
- [x] DataValidationStep approval workflow
- [x] AlertsStep statute override button
- [x] MemosStep seal & verify UI

### **Backend** ⏳ **PENDING**
- [ ] Implement `/api/pii/*` routes
- [ ] Implement `/api/audit/*` routes
- [ ] Implement `/api/memos/*` routes (with seal/verify)
- [ ] Implement `/api/approvals/*` routes
- [ ] Implement `/api/statutes/overrides/*` routes
- [ ] Connect routes to utility functions (audit-logger.js, pii-detector.js, document-hash.js)

### **Testing** ⏳ **PENDING**
- [ ] End-to-end workflow test
- [ ] PII detection accuracy test
- [ ] Hash verification test
- [ ] Approval workflow test
- [ ] Audit chain integrity test

---

## 🚀 Ready for Backend Implementation

All frontend components are ready and waiting for backend API endpoints. The utility functions are already implemented in:
- `server/src/utils/audit-logger.js`
- `server/src/utils/pii-detector.js`
- `server/src/utils/document-hash.js`

Next step: Create the backend routes to connect everything together! 🎯
