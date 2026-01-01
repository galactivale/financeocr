-- GAP 1: Statute Change Management System
-- Table: statute_overrides
CREATE TABLE statute_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  state_code CHAR(2),
  tax_type VARCHAR(50),

  -- What changed
  change_type VARCHAR(100),
  previous_value JSONB,
  new_value JSONB,
  effective_date DATE,

  -- Source & validation
  source VARCHAR(100),
  citation TEXT,
  external_url TEXT,
  validation_status VARCHAR(50) DEFAULT 'PENDING',
  validated_by UUID,
  validated_at TIMESTAMP,

  -- Who entered it
  entered_by UUID NOT NULL,
  entered_at TIMESTAMP DEFAULT NOW(),

  -- Supersedes official library
  overrides_library_version UUID,

  -- Impact tracking
  clients_affected INTEGER DEFAULT 0,
  memos_generated INTEGER DEFAULT 0,

  -- Metadata
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_statute_overrides_org ON statute_overrides(organization_id);
CREATE INDEX idx_statute_overrides_state ON statute_overrides(state_code);
CREATE INDEX idx_statute_overrides_status ON statute_overrides(validation_status);

-- Table: client_statute_impacts
CREATE TABLE client_statute_impacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  override_id UUID REFERENCES statute_overrides(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  previous_nexus_status VARCHAR(50),
  new_nexus_status VARCHAR(50),
  requires_supplemental_memo BOOLEAN DEFAULT FALSE,
  supplemental_memo_id UUID,
  reviewed_by UUID,
  reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_client_statute_impacts_client ON client_statute_impacts(client_id);
CREATE INDEX idx_client_statute_impacts_override ON client_statute_impacts(override_id);

-- GAP 2: PII Detection (no dedicated tables needed, will use JSON metadata in uploads)

-- GAP 3: Enhanced Audit Trail System (extending existing audit_log)
-- Update existing audit_log table with additional fields
ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS entity_type VARCHAR(50);
ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS entity_id UUID;
ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS previous_value JSONB;
ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS new_value JSONB;
ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS action_hash VARCHAR(64);
ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS previous_action_id UUID;
ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS client_id UUID;
ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS upload_id UUID;
ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS memo_id UUID;

CREATE INDEX IF NOT EXISTS idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_client ON audit_log(client_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_memo ON audit_log(memo_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_timestamp ON audit_log(created_at);

-- GAP 4: Document Hash & Nexus Memos
-- Main nexus memos table
CREATE TABLE nexus_memos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,

  -- Memo metadata
  title VARCHAR(500) NOT NULL,
  memo_type VARCHAR(50) DEFAULT 'INITIAL', -- 'INITIAL', 'SUPPLEMENTAL', 'AMENDMENT'

  -- Content
  sections JSONB NOT NULL,
  conclusion TEXT,
  recommendations TEXT[],

  -- Statute tracking
  statute_versions JSONB,
  generated_under_rules JSONB,

  -- Supplemental tracking
  is_supplemental BOOLEAN DEFAULT FALSE,
  supersedes_memo_id UUID REFERENCES nexus_memos(id),
  related_override_id UUID REFERENCES statute_overrides(id),

  -- Hash & integrity
  document_hash VARCHAR(64),
  content_hash VARCHAR(64),
  pdf_hash VARCHAR(64),
  sealed_at TIMESTAMP,
  sealed_by UUID,
  is_sealed BOOLEAN DEFAULT FALSE,
  is_editable BOOLEAN DEFAULT TRUE,

  -- File storage
  pdf_url TEXT,
  pdf_path TEXT,

  -- Attestation
  attestation JSONB,
  prepared_by UUID,
  approved_by UUID,
  approved_at TIMESTAMP,

  -- Metadata
  metadata JSONB DEFAULT '{}',
  tags VARCHAR(100)[],
  status VARCHAR(50) DEFAULT 'DRAFT', -- 'DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'SEALED'

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_nexus_memos_org ON nexus_memos(organization_id);
CREATE INDEX idx_nexus_memos_client ON nexus_memos(client_id);
CREATE INDEX idx_nexus_memos_status ON nexus_memos(status);
CREATE INDEX idx_nexus_memos_sealed ON nexus_memos(is_sealed);
CREATE INDEX idx_nexus_memos_supersedes ON nexus_memos(supersedes_memo_id);

-- Memo hash verification log
CREATE TABLE memo_hash_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  memo_id UUID NOT NULL REFERENCES nexus_memos(id) ON DELETE CASCADE,
  hash VARCHAR(64) NOT NULL,
  algorithm VARCHAR(20) DEFAULT 'SHA-256',
  verified BOOLEAN NOT NULL,
  verification_timestamp TIMESTAMP DEFAULT NOW(),
  verified_by UUID,
  stored_hash VARCHAR(64),
  current_hash VARCHAR(64),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_memo_hash_memo ON memo_hash_verifications(memo_id);

-- Statute versions table
CREATE TABLE statute_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state_code CHAR(2),
  tax_type VARCHAR(50),
  version_number VARCHAR(20),
  effective_from DATE,
  effective_to DATE,
  rule_data JSONB,
  source VARCHAR(50), -- 'OFFICIAL', 'OVERRIDE'
  override_id UUID REFERENCES statute_overrides(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_statute_versions_state ON statute_versions(state_code);
CREATE INDEX idx_statute_versions_effective ON statute_versions(effective_from);

-- Memo statute versions junction table
CREATE TABLE memo_statute_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  memo_id UUID NOT NULL REFERENCES nexus_memos(id) ON DELETE CASCADE,
  statute_version_id UUID NOT NULL REFERENCES statute_versions(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(memo_id, statute_version_id)
);

-- GAP 5: Mandatory Human Approval System
-- Approval requirements configuration
CREATE TABLE approval_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  action_type VARCHAR(100) NOT NULL,
  required_role VARCHAR(50),
  approval_count INTEGER DEFAULT 1,
  can_self_approve BOOLEAN DEFAULT FALSE,
  requires_review_by_role VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_approval_req_org ON approval_requirements(organization_id);
CREATE INDEX idx_approval_req_action ON approval_requirements(action_type);

-- Approvals tracking
CREATE TABLE approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID NOT NULL,
  approval_type VARCHAR(100),
  required_role VARCHAR(50),
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMP,
  approval_notes TEXT,
  status VARCHAR(50) DEFAULT 'PENDING', -- 'PENDING', 'APPROVED', 'REJECTED'
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_approvals_entity ON approvals(entity_type, entity_id);
CREATE INDEX idx_approvals_status ON approvals(status);
CREATE INDEX idx_approvals_org ON approvals(organization_id);

-- Data uploads tracking (for nexus memo workflow)
CREATE TABLE data_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,

  -- File info
  file_name VARCHAR(500) NOT NULL,
  file_type VARCHAR(50),
  file_size BIGINT,
  file_path TEXT,

  -- Processing status
  status VARCHAR(50) DEFAULT 'UPLOADED', -- 'UPLOADED', 'VALIDATED', 'MAPPED', 'PROCESSED', 'FAILED'

  -- Document classification
  document_classification JSONB,

  -- PII detection
  pii_detected JSONB,
  pii_severity VARCHAR(20),

  -- Column mapping
  column_mappings JSONB,
  mappings_confirmed BOOLEAN DEFAULT FALSE,
  mappings_confirmed_by UUID,
  mappings_confirmed_at TIMESTAMP,

  -- Validation
  validation_result JSONB,
  validation_approved BOOLEAN DEFAULT FALSE,
  validation_approved_by UUID,
  validation_approved_at TIMESTAMP,

  -- Processed data
  processed_data JSONB,
  row_count INTEGER,
  error_count INTEGER,

  -- Metadata
  uploaded_by UUID NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_data_uploads_org ON data_uploads(organization_id);
CREATE INDEX idx_data_uploads_client ON data_uploads(client_id);
CREATE INDEX idx_data_uploads_status ON data_uploads(status);

-- State normalizations tracking
CREATE TABLE state_normalizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  upload_id UUID NOT NULL REFERENCES data_uploads(id) ON DELETE CASCADE,
  original_value VARCHAR(255),
  normalized_value CHAR(2),
  confidence DECIMAL(5, 2),
  auto_corrected BOOLEAN DEFAULT TRUE,
  approved BOOLEAN DEFAULT FALSE,
  approved_by UUID,
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_state_norm_upload ON state_normalizations(upload_id);
CREATE INDEX idx_state_norm_approved ON state_normalizations(approved);

-- Column mappings tracking (detailed)
CREATE TABLE column_mapping_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  upload_id UUID NOT NULL REFERENCES data_uploads(id) ON DELETE CASCADE,
  source_column VARCHAR(255) NOT NULL,
  mapped_to VARCHAR(100),
  confidence DECIMAL(5, 2),
  mapping_type VARCHAR(50), -- 'AUTO', 'MANUAL', 'EXCLUDED'
  approved BOOLEAN DEFAULT FALSE,
  approved_by UUID,
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_col_mapping_upload ON column_mapping_details(upload_id);

-- Update timestamp triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_statute_overrides_updated_at BEFORE UPDATE ON statute_overrides
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_nexus_memos_updated_at BEFORE UPDATE ON nexus_memos
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_data_uploads_updated_at BEFORE UPDATE ON data_uploads
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
