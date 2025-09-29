-- =====================================================
-- VaultCPA Multi-Tenant Database Schema
-- PostgreSQL 14+
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- CORE TENANT MANAGEMENT
-- =====================================================

-- Organizations (Tenant Management)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) UNIQUE NOT NULL, -- unique subdomain/path: acme-accounting
    name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255),
    tax_id VARCHAR(50),
    
    -- Subscription & Status
    subscription_tier VARCHAR(50) DEFAULT 'trial', -- trial, basic, professional, enterprise
    subscription_status VARCHAR(50) DEFAULT 'active', -- active, suspended, cancelled
    subscription_started_at TIMESTAMP,
    subscription_expires_at TIMESTAMP,
    
    -- Configuration
    settings JSONB DEFAULT '{}',
    branding JSONB DEFAULT '{}', -- logo, colors, etc.
    features JSONB DEFAULT '{}', -- enabled features
    
    -- Contact Information
    email VARCHAR(255),
    phone VARCHAR(50),
    website VARCHAR(255),
    
    -- Address
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(50),
    postal_code VARCHAR(20),
    country VARCHAR(50) DEFAULT 'US',
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    
    CONSTRAINT slug_format CHECK (slug ~ '^[a-z0-9-]+$')
);

-- Organization Metadata
CREATE TABLE organization_metadata (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    key VARCHAR(100) NOT NULL,
    value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(organization_id, key)
);

-- =====================================================
-- USER MANAGEMENT & AUTHENTICATION
-- =====================================================

-- Users (Multi-tenant)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Authentication
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    mfa_enabled BOOLEAN DEFAULT FALSE,
    mfa_secret VARCHAR(255),
    
    -- Profile
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    display_name VARCHAR(255),
    avatar_url VARCHAR(500),
    
    -- Professional Details
    title VARCHAR(100),
    department VARCHAR(100),
    cpa_license VARCHAR(100),
    cpa_state VARCHAR(50),
    cpa_expiration DATE,
    
    -- Role & Status
    role VARCHAR(50) NOT NULL, -- managing-partner, tax-manager, staff-accountant, system-admin
    status VARCHAR(50) DEFAULT 'pending', -- active, inactive, suspended, pending
    
    -- Activity Tracking
    last_login TIMESTAMP,
    login_count INTEGER DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    
    UNIQUE(organization_id, email)
);

-- User Sessions
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(token)
);

-- User Permissions (Fine-grained access control)
CREATE TABLE user_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    resource VARCHAR(100) NOT NULL, -- clients, compliance, analytics, etc.
    action VARCHAR(50) NOT NULL, -- view, create, edit, delete
    granted BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, resource, action)
);

-- =====================================================
-- CLIENT MANAGEMENT
-- =====================================================

-- Clients
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Basic Information
    name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255),
    tax_id VARCHAR(50),
    industry VARCHAR(100),
    
    -- Business Details
    founded_year INTEGER,
    employee_count INTEGER,
    annual_revenue DECIMAL(15, 2),
    fiscal_year_end DATE,
    
    -- Risk Assessment
    risk_level VARCHAR(50), -- critical, high, warning, low
    penalty_exposure DECIMAL(15, 2),
    quality_score INTEGER,
    
    -- Assignment
    assigned_partner UUID REFERENCES users(id),
    assigned_manager UUID REFERENCES users(id),
    assigned_staff UUID[] DEFAULT '{}', -- Array of user IDs
    assigned_since DATE,
    
    -- Review Tracking
    last_review DATE,
    next_review DATE,
    
    -- Contact Information
    primary_contact_name VARCHAR(255),
    primary_contact_email VARCHAR(255),
    primary_contact_phone VARCHAR(50),
    
    -- Address
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(50),
    postal_code VARCHAR(20),
    country VARCHAR(50) DEFAULT 'US',
    
    -- Status
    status VARCHAR(50) DEFAULT 'active', -- active, inactive, suspended, prospective
    
    -- Metadata
    avatar_url VARCHAR(500),
    notes TEXT,
    tags TEXT[],
    custom_fields JSONB DEFAULT '{}',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

-- Client State Nexus
CREATE TABLE client_states (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- State Information
    state_code VARCHAR(2) NOT NULL,
    state_name VARCHAR(100) NOT NULL,
    
    -- Revenue & Threshold
    revenue DECIMAL(15, 2),
    threshold DECIMAL(15, 2),
    threshold_percentage DECIMAL(5, 2),
    
    -- Transaction Tracking
    transaction_count INTEGER,
    transaction_threshold INTEGER,
    
    -- Status
    status VARCHAR(50), -- critical, warning, monitoring, compliant
    days_since_threshold INTEGER,
    projected_crossover_date DATE,
    
    -- Penalty Exposure
    penalty_min DECIMAL(15, 2),
    penalty_max DECIMAL(15, 2),
    
    -- Registration
    registration_status VARCHAR(50), -- registered, pending, not-required
    registration_date DATE,
    registration_number VARCHAR(100),
    
    -- Compliance
    filing_frequency VARCHAR(50), -- monthly, quarterly, annual
    next_filing_date DATE,
    last_filing_date DATE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(client_id, state_code)
);

-- Client Communications
CREATE TABLE client_communications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Communication Details
    type VARCHAR(50) NOT NULL, -- email, phone, meeting, advisory, written-advisory, phone-consultation, in-person-meeting
    subject VARCHAR(255),
    summary TEXT,
    
    -- Participants
    user_id UUID REFERENCES users(id),
    participants TEXT[], -- Array of participant names/emails
    
    -- Scheduling
    communication_date TIMESTAMP NOT NULL,
    duration INTEGER, -- in minutes
    
    -- Status
    status VARCHAR(50), -- scheduled, completed, cancelled, sent, delivered, read
    follow_up TEXT,
    follow_up_date DATE,
    
    -- Attachments & References
    attachments JSONB DEFAULT '[]',
    related_decision_id UUID,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

-- =====================================================
-- ALERTS & MONITORING
-- =====================================================

-- Alerts
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    
    -- Alert Details
    title VARCHAR(255) NOT NULL,
    description TEXT,
    issue VARCHAR(255),
    
    -- State & Location
    state_code VARCHAR(2),
    state_name VARCHAR(100),
    
    -- Financial Impact
    current_amount DECIMAL(15, 2),
    threshold_amount DECIMAL(15, 2),
    penalty_risk DECIMAL(15, 2),
    
    -- Priority & Status
    priority VARCHAR(50) NOT NULL, -- high, medium, low
    severity VARCHAR(50), -- critical, high, medium, low
    status VARCHAR(50) DEFAULT 'new', -- new, in-progress, resolved, escalated, false_positive
    
    -- Type & Category
    type VARCHAR(100), -- nexus-threshold, registration, compliance, penalty, regulatory
    category VARCHAR(100),
    
    -- Timing
    deadline DATE,
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    
    -- Assignment
    assigned_to UUID REFERENCES users(id),
    assigned_at TIMESTAMP,
    
    -- Actions & Resolution
    actions TEXT[],
    resolution_notes TEXT,
    
    -- Affected Resources
    affected_tenants TEXT[],
    affected_services TEXT[],
    
    -- Impact Assessment
    users_affected INTEGER,
    estimated_downtime VARCHAR(100),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

-- Alert Actions (Audit trail for alert handling)
CREATE TABLE alert_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_id UUID NOT NULL REFERENCES alerts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    
    action VARCHAR(100) NOT NULL, -- assigned, status_changed, commented, resolved
    details TEXT,
    old_value VARCHAR(255),
    new_value VARCHAR(255),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TASKS & WORKFLOW
-- =====================================================

-- Tasks
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    
    -- Task Details
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Categorization
    category VARCHAR(100), -- registration, compliance, monitoring, analysis
    type VARCHAR(100),
    
    -- Priority & Status
    priority VARCHAR(50), -- high, medium, low
    status VARCHAR(50) DEFAULT 'pending', -- pending, in-progress, completed, blocked, cancelled
    
    -- Assignment
    assigned_to UUID REFERENCES users(id),
    assigned_by UUID REFERENCES users(id),
    assigned_at TIMESTAMP,
    
    -- Timing
    due_date DATE,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    
    -- Effort Tracking
    estimated_hours DECIMAL(5, 2),
    actual_hours DECIMAL(5, 2),
    
    -- Progress
    progress INTEGER DEFAULT 0, -- 0-100
    
    -- State Information
    state_code VARCHAR(2),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

-- Task Steps
CREATE TABLE task_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    
    title VARCHAR(255) NOT NULL,
    description TEXT,
    step_order INTEGER NOT NULL,
    
    -- Status
    completed BOOLEAN DEFAULT FALSE,
    required BOOLEAN DEFAULT TRUE,
    completed_at TIMESTAMP,
    completed_by UUID REFERENCES users(id),
    
    -- Timing
    estimated_time INTEGER, -- in minutes
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- DOCUMENTS & DATA MANAGEMENT
-- =====================================================

-- Documents
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    
    -- Document Details
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(100), -- tax-return, financial-statement, compliance, advisory, other
    category VARCHAR(100),
    
    -- File Information
    file_name VARCHAR(255),
    file_size BIGINT,
    file_type VARCHAR(100), -- MIME type
    file_url VARCHAR(500),
    file_path VARCHAR(500),
    
    -- Status
    status VARCHAR(50) DEFAULT 'draft', -- draft, review, approved, filed, archived
    
    -- Versioning
    version INTEGER DEFAULT 1,
    parent_document_id UUID REFERENCES documents(id),
    
    -- Access Control
    visibility VARCHAR(50) DEFAULT 'private', -- private, client, team, public
    
    -- Metadata
    tags TEXT[],
    metadata JSONB DEFAULT '{}',
    
    -- Audit
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    uploaded_by UUID REFERENCES users(id),
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP,
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- PROFESSIONAL DECISIONS & AUDIT TRAIL
-- =====================================================

-- Professional Decisions
CREATE TABLE professional_decisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    
    -- Decision Details
    decision_date DATE NOT NULL,
    decision_type VARCHAR(100) NOT NULL, -- nexus-threshold-analysis, registration-strategy, compliance-assessment, penalty-mitigation, voluntary-disclosure
    decision_summary TEXT NOT NULL,
    professional_reasoning TEXT NOT NULL,
    
    -- Risk Assessment
    risk_level VARCHAR(50), -- critical, high, medium, low
    financial_exposure DECIMAL(15, 2),
    
    -- Status & Workflow
    status VARCHAR(50) DEFAULT 'draft', -- draft, peer-review, legal-review, approved, complete
    
    -- Professional Standards Compliance
    ssts_compliance BOOLEAN DEFAULT FALSE,
    peer_review_completed BOOLEAN DEFAULT FALSE,
    client_communication_documented BOOLEAN DEFAULT FALSE,
    implementation_verified BOOLEAN DEFAULT FALSE,
    
    -- References
    statutory_references TEXT[],
    
    -- Peer Review
    peer_reviewer_id UUID REFERENCES users(id),
    peer_reviewer_license VARCHAR(100),
    peer_review_date DATE,
    peer_review_status VARCHAR(50), -- approved, conditional, requires-modification
    peer_review_comments TEXT,
    
    -- Client Communication
    communication_date DATE,
    communication_type VARCHAR(100),
    communication_participants TEXT[],
    communication_summary TEXT,
    client_response TEXT,
    
    -- Implementation Tracking
    implementation_date DATE,
    compliance_status VARCHAR(50), -- compliant, in-progress, non-compliant
    verification_method VARCHAR(255),
    outcome_documentation TEXT,
    
    -- Digital Authentication
    cpa_signature VARCHAR(255),
    signature_timestamp TIMESTAMP,
    hash_value VARCHAR(255),
    integrity_verified BOOLEAN DEFAULT FALSE,
    
    -- Legal Defensibility
    court_ready BOOLEAN DEFAULT FALSE,
    malpractice_defense BOOLEAN DEFAULT FALSE,
    regulatory_examination BOOLEAN DEFAULT FALSE,
    professional_liability BOOLEAN DEFAULT FALSE,
    
    -- Business Impact
    client_retention BOOLEAN DEFAULT TRUE,
    revenue_impact DECIMAL(15, 2),
    risk_mitigation DECIMAL(15, 2),
    professional_reputation VARCHAR(50), -- enhanced, maintained, at-risk
    
    -- Decision Maker
    decision_maker_id UUID REFERENCES users(id),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- COMPLIANCE & REGULATORY
-- =====================================================

-- Compliance Standards
CREATE TABLE compliance_standards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    standard_name VARCHAR(255) NOT NULL,
    standard_code VARCHAR(100),
    description TEXT,
    category VARCHAR(100),
    
    -- Status
    status VARCHAR(50), -- compliant, non-compliant, pending, not-applicable
    
    -- Review
    last_review_date DATE,
    next_review_date DATE,
    reviewed_by UUID REFERENCES users(id),
    
    -- Documentation
    documentation_url VARCHAR(500),
    compliance_notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Regulatory Changes
CREATE TABLE regulatory_changes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Jurisdiction
    state_code VARCHAR(2),
    federal BOOLEAN DEFAULT FALSE,
    
    -- Timing
    effective_date DATE,
    announcement_date DATE,
    
    -- Impact
    impact_level VARCHAR(50), -- high, medium, low
    affected_clients INTEGER,
    
    -- Status
    status VARCHAR(50), -- pending, active, implemented
    
    -- References
    regulation_reference VARCHAR(255),
    documentation_url VARCHAR(500),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INTEGRATIONS
-- =====================================================

-- Third-party Integrations
CREATE TABLE integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Integration Details
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL, -- quickbooks, avalara, regulatory, thomson, cch, custom
    provider VARCHAR(255),
    
    -- Configuration
    config JSONB DEFAULT '{}',
    credentials JSONB DEFAULT '{}', -- encrypted
    
    -- Status
    status VARCHAR(50) DEFAULT 'inactive', -- active, inactive, error, syncing, maintenance
    
    -- Sync Information
    last_sync TIMESTAMP,
    sync_frequency VARCHAR(50), -- real-time, hourly, daily, weekly
    next_sync TIMESTAMP,
    
    -- Performance
    error_count INTEGER DEFAULT 0,
    last_error TEXT,
    last_error_at TIMESTAMP,
    performance_score INTEGER, -- 0-100
    
    -- Version
    version VARCHAR(50),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

-- Integration Logs
CREATE TABLE integration_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    integration_id UUID NOT NULL REFERENCES integrations(id) ON DELETE CASCADE,
    
    action VARCHAR(100) NOT NULL, -- sync, auth, config, error
    status VARCHAR(50), -- success, failure, warning
    
    details TEXT,
    error_message TEXT,
    
    records_processed INTEGER,
    duration INTEGER, -- in milliseconds
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ANALYTICS & REPORTING
-- =====================================================

-- Performance Metrics (Daily aggregates)
CREATE TABLE performance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    metric_date DATE NOT NULL,
    metric_type VARCHAR(100) NOT NULL, -- revenue, client_retention, task_completion, etc.
    
    -- Values
    value DECIMAL(15, 2),
    target DECIMAL(15, 2),
    variance DECIMAL(15, 2),
    
    -- Metadata
    unit VARCHAR(50),
    category VARCHAR(100),
    tags TEXT[],
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(organization_id, metric_date, metric_type)
);

-- =====================================================
-- SYSTEM ADMINISTRATION
-- =====================================================

-- System Alerts (For system admins)
CREATE TABLE system_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    type VARCHAR(100) NOT NULL, -- infrastructure, security, performance, integration, compliance
    severity VARCHAR(50) NOT NULL, -- critical, high, medium, low
    
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Affected Resources
    affected_tenants UUID[],
    affected_services TEXT[],
    
    -- Impact
    users_affected INTEGER,
    estimated_downtime VARCHAR(100),
    
    -- Status
    status VARCHAR(50) DEFAULT 'active', -- active, investigating, resolved, false_positive
    
    -- Assignment
    assigned_to UUID REFERENCES users(id),
    
    -- Timing
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    resolution_time INTEGER, -- in minutes
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Log (System-wide audit trail)
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Action Details
    action VARCHAR(100) NOT NULL, -- create, update, delete, login, logout, etc.
    resource_type VARCHAR(100) NOT NULL, -- user, client, document, decision, etc.
    resource_id UUID,
    
    -- Changes
    old_values JSONB,
    new_values JSONB,
    
    -- Request Details
    ip_address INET,
    user_agent TEXT,
    
    -- Metadata
    details TEXT,
    severity VARCHAR(50), -- info, warning, error, critical
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Organizations
CREATE INDEX idx_organizations_slug ON organizations(slug);
CREATE INDEX idx_organizations_status ON organizations(subscription_status);

-- Users
CREATE INDEX idx_users_organization ON users(organization_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);

-- Clients
CREATE INDEX idx_clients_organization ON clients(organization_id);
CREATE INDEX idx_clients_assigned_partner ON clients(assigned_partner);
CREATE INDEX idx_clients_assigned_manager ON clients(assigned_manager);
CREATE INDEX idx_clients_risk_level ON clients(risk_level);
CREATE INDEX idx_clients_status ON clients(status);

-- Client States
CREATE INDEX idx_client_states_client ON client_states(client_id);
CREATE INDEX idx_client_states_status ON client_states(status);
CREATE INDEX idx_client_states_state_code ON client_states(state_code);

-- Alerts
CREATE INDEX idx_alerts_organization ON alerts(organization_id);
CREATE INDEX idx_alerts_client ON alerts(client_id);
CREATE INDEX idx_alerts_status ON alerts(status);
CREATE INDEX idx_alerts_priority ON alerts(priority);
CREATE INDEX idx_alerts_assigned_to ON alerts(assigned_to);

-- Tasks
CREATE INDEX idx_tasks_organization ON tasks(organization_id);
CREATE INDEX idx_tasks_client ON tasks(client_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);

-- Documents
CREATE INDEX idx_documents_organization ON documents(organization_id);
CREATE INDEX idx_documents_client ON documents(client_id);
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_documents_type ON documents(type);

-- Professional Decisions
CREATE INDEX idx_decisions_organization ON professional_decisions(organization_id);
CREATE INDEX idx_decisions_client ON professional_decisions(client_id);
CREATE INDEX idx_decisions_date ON professional_decisions(decision_date);
CREATE INDEX idx_decisions_status ON professional_decisions(status);

-- Audit Log
CREATE INDEX idx_audit_log_organization ON audit_log(organization_id);
CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_audit_log_resource ON audit_log(resource_type, resource_id);
CREATE INDEX idx_audit_log_created ON audit_log(created_at);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_organization_metadata_updated_at BEFORE UPDATE ON organization_metadata FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_client_states_updated_at BEFORE UPDATE ON client_states FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_alerts_updated_at BEFORE UPDATE ON alerts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_professional_decisions_updated_at BEFORE UPDATE ON professional_decisions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_compliance_standards_updated_at BEFORE UPDATE ON compliance_standards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_regulatory_changes_updated_at BEFORE UPDATE ON regulatory_changes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_integrations_updated_at BEFORE UPDATE ON integrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_alerts_updated_at BEFORE UPDATE ON system_alerts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tenant tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_decisions ENABLE ROW LEVEL SECURITY;

-- Example RLS policy for users table
CREATE POLICY tenant_isolation ON users
    USING (organization_id = current_setting('app.current_organization_id')::UUID);

-- Similar policies should be created for other tables

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- Active clients with risk summary
CREATE VIEW v_active_clients_summary AS
SELECT 
    c.id,
    c.organization_id,
    c.name,
    c.industry,
    c.risk_level,
    c.penalty_exposure,
    c.assigned_manager,
    COUNT(DISTINCT cs.id) as state_count,
    COUNT(DISTINCT a.id) FILTER (WHERE a.status IN ('new', 'in-progress')) as active_alerts,
    COUNT(DISTINCT t.id) FILTER (WHERE t.status IN ('pending', 'in-progress')) as active_tasks
FROM clients c
LEFT JOIN client_states cs ON c.id = cs.client_id
LEFT JOIN alerts a ON c.id = a.client_id
LEFT JOIN tasks t ON c.id = t.client_id
WHERE c.status = 'active'
GROUP BY c.id;

-- User workload summary
CREATE VIEW v_user_workload AS
SELECT 
    u.id,
    u.organization_id,
    u.first_name,
    u.last_name,
    u.role,
    COUNT(DISTINCT t.id) FILTER (WHERE t.status IN ('pending', 'in-progress')) as active_tasks,
    COUNT(DISTINCT a.id) FILTER (WHERE a.status IN ('new', 'in-progress')) as active_alerts,
    COUNT(DISTINCT c.id) as assigned_clients
FROM users u
LEFT JOIN tasks t ON u.id = t.assigned_to
LEFT JOIN alerts a ON u.id = a.assigned_to
LEFT JOIN clients c ON u.id = c.assigned_manager
WHERE u.status = 'active'
GROUP BY u.id;

-- =====================================================
-- SAMPLE DATA INSERTION
-- =====================================================

-- Insert sample organization
INSERT INTO organizations (slug, name, legal_name, subscription_tier, subscription_status, email)
VALUES 
    ('acme-accounting', 'Acme Accounting', 'Acme Accounting LLP', 'professional', 'active', 'admin@acmeaccounting.com'),
    ('smith-tax-pros', 'Smith Tax Pros', 'Smith Tax Professionals Inc', 'enterprise', 'active', 'info@smithtaxpros.com');

-- Note: Additional sample data should be inserted based on specific testing needs

-- =====================================================
-- ADDITIONAL ENHANCEMENTS
-- =====================================================

-- Client Revenue Tracking (Historical data)
CREATE TABLE client_revenue_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    state_code VARCHAR(2),
    
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    revenue DECIMAL(15, 2) NOT NULL,
    transaction_count INTEGER,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(client_id, state_code, period_start, period_end)
);

-- Consultation Scheduling
CREATE TABLE consultations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    
    -- Consultation Details
    topic VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Scheduling
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    duration INTEGER, -- in minutes
    timezone VARCHAR(100),
    
    -- Status
    status VARCHAR(50) DEFAULT 'scheduled', -- scheduled, completed, cancelled, rescheduled
    
    -- Preparation
    prep_status VARCHAR(50) DEFAULT 'pending', -- pending, in-progress, complete
    prep_notes TEXT,
    
    -- Financial Impact
    exposure_amount DECIMAL(15, 2),
    
    -- Participants
    lead_advisor UUID REFERENCES users(id),
    participants UUID[],
    
    -- Outcomes
    outcome_summary TEXT,
    follow_up_required BOOLEAN DEFAULT FALSE,
    follow_up_notes TEXT,
    
    -- Meeting Details
    meeting_link VARCHAR(500),
    meeting_location VARCHAR(255),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

-- Advisory Documents (Generated advisories)
CREATE TABLE advisory_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    
    -- Document Details
    type VARCHAR(100) NOT NULL, -- nexus-analysis, registration-advisory, compliance-update, penalty-mitigation
    title VARCHAR(255) NOT NULL,
    issue VARCHAR(255),
    
    -- Content
    content TEXT,
    template_id UUID,
    
    -- Status
    status VARCHAR(50) DEFAULT 'draft', -- draft, review, sent, delivered, acknowledged
    urgency VARCHAR(50), -- urgent, high, normal, low
    
    -- Delivery
    sent_date DATE,
    delivered_date DATE,
    acknowledged_date DATE,
    acknowledged_by VARCHAR(255),
    
    -- Metadata
    version INTEGER DEFAULT 1,
    document_url VARCHAR(500),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

-- Risk Factors (Detailed risk tracking)
CREATE TABLE risk_factors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    
    -- Risk Details
    category VARCHAR(100) NOT NULL, -- nexus, compliance, financial, operational, regulatory
    factor_name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Assessment
    likelihood VARCHAR(50), -- very-high, high, medium, low, very-low
    impact VARCHAR(50), -- critical, high, medium, low, minimal
    risk_score INTEGER, -- calculated score 0-100
    
    -- Mitigation
    mitigation_strategy TEXT,
    mitigation_status VARCHAR(50), -- not-started, in-progress, implemented, monitoring
    mitigation_owner UUID REFERENCES users(id),
    
    -- Status
    status VARCHAR(50) DEFAULT 'active', -- active, resolved, monitoring, accepted
    
    -- Review
    last_review_date DATE,
    next_review_date DATE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insurance Policies (Professional liability tracking)
CREATE TABLE insurance_policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Policy Details
    policy_number VARCHAR(100) NOT NULL,
    provider VARCHAR(255) NOT NULL,
    policy_type VARCHAR(100) NOT NULL, -- professional-liability, malpractice, general-liability, cyber
    
    -- Coverage
    coverage_amount DECIMAL(15, 2),
    deductible DECIMAL(15, 2),
    coverage_details JSONB DEFAULT '{}',
    
    -- Dates
    effective_date DATE NOT NULL,
    expiration_date DATE NOT NULL,
    
    -- Status
    status VARCHAR(50) DEFAULT 'active', -- active, expired, cancelled, pending-renewal
    
    -- Premium
    annual_premium DECIMAL(15, 2),
    payment_frequency VARCHAR(50), -- annual, semi-annual, quarterly, monthly
    
    -- Documents
    policy_document_url VARCHAR(500),
    
    -- Renewal
    renewal_reminder_date DATE,
    auto_renew BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insurance Claims
CREATE TABLE insurance_claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    policy_id UUID REFERENCES insurance_policies(id) ON DELETE SET NULL,
    
    -- Claim Details
    claim_number VARCHAR(100),
    claim_type VARCHAR(100),
    description TEXT,
    
    -- Dates
    incident_date DATE NOT NULL,
    filed_date DATE NOT NULL,
    closed_date DATE,
    
    -- Status
    status VARCHAR(50) DEFAULT 'filed', -- filed, investigating, approved, denied, settled, closed
    
    -- Financial
    claimed_amount DECIMAL(15, 2),
    approved_amount DECIMAL(15, 2),
    paid_amount DECIMAL(15, 2),
    
    -- Related
    client_id UUID REFERENCES clients(id),
    related_decision_id UUID REFERENCES professional_decisions(id),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Benchmarks (Industry and peer benchmarks)
CREATE TABLE benchmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Benchmark Details
    benchmark_type VARCHAR(100) NOT NULL, -- revenue, client-retention, productivity, efficiency
    benchmark_name VARCHAR(255) NOT NULL,
    
    -- Values
    benchmark_value DECIMAL(15, 2) NOT NULL,
    unit VARCHAR(50),
    
    -- Context
    industry VARCHAR(100),
    firm_size VARCHAR(50), -- small, medium, large, enterprise
    region VARCHAR(100),
    
    -- Period
    period_start DATE,
    period_end DATE,
    
    -- Source
    source VARCHAR(255),
    data_source VARCHAR(50), -- internal, industry-report, peer-group
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications (User notifications)
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Notification Details
    type VARCHAR(100) NOT NULL, -- alert, task, message, system, reminder
    title VARCHAR(255) NOT NULL,
    message TEXT,
    
    -- Priority
    priority VARCHAR(50) DEFAULT 'normal', -- urgent, high, normal, low
    
    -- Status
    read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    
    -- Action
    action_url VARCHAR(500),
    action_label VARCHAR(100),
    
    -- Related Resources
    related_resource_type VARCHAR(100),
    related_resource_id UUID,
    
    -- Delivery
    delivery_method VARCHAR(50) DEFAULT 'in-app', -- in-app, email, sms
    sent_at TIMESTAMP,
    
    -- Expiry
    expires_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Comments (General comment system)
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Resource
    resource_type VARCHAR(100) NOT NULL, -- client, task, alert, decision, document
    resource_id UUID NOT NULL,
    
    -- Comment
    content TEXT NOT NULL,
    
    -- Threading
    parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    
    -- Status
    edited BOOLEAN DEFAULT FALSE,
    edited_at TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activity Feed (System-wide activity tracking)
CREATE TABLE activity_feed (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Activity Details
    activity_type VARCHAR(100) NOT NULL, -- client_update, task_completed, alert_resolved, decision_made, etc.
    description TEXT NOT NULL,
    
    -- Related Resources
    client_id UUID REFERENCES clients(id),
    resource_type VARCHAR(100),
    resource_id UUID,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    
    -- Visibility
    visibility VARCHAR(50) DEFAULT 'team', -- personal, team, organization, public
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Templates (Document and communication templates)
CREATE TABLE templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Template Details
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100), -- advisory, communication, document, report
    type VARCHAR(100), -- email, letter, memo, report, analysis
    
    -- Content
    subject VARCHAR(255),
    content TEXT NOT NULL,
    
    -- Variables
    variables JSONB DEFAULT '[]', -- Array of variable definitions
    
    -- Status
    status VARCHAR(50) DEFAULT 'active', -- active, archived, draft
    
    -- Usage
    usage_count INTEGER DEFAULT 0,
    last_used_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

-- State Tax Information (Reference data)
CREATE TABLE state_tax_info (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    state_code VARCHAR(2) NOT NULL UNIQUE,
    state_name VARCHAR(100) NOT NULL,
    
    -- Thresholds
    economic_nexus_threshold DECIMAL(15, 2),
    transaction_threshold INTEGER,
    
    -- Details
    filing_requirements JSONB DEFAULT '{}',
    registration_process JSONB DEFAULT '{}',
    compliance_notes TEXT,
    
    -- Rates & Fees
    corporate_tax_rate DECIMAL(5, 2),
    sales_tax_rate DECIMAL(5, 2),
    registration_fee DECIMAL(10, 2),
    annual_fee DECIMAL(10, 2),
    
    -- Important Dates
    filing_deadlines JSONB DEFAULT '{}',
    
    -- Resources
    department_of_revenue_url VARCHAR(500),
    registration_portal_url VARCHAR(500),
    
    -- Status
    active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Feature Flags (For gradual rollout and A/B testing)
CREATE TABLE feature_flags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    flag_key VARCHAR(100) NOT NULL UNIQUE,
    flag_name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Status
    enabled BOOLEAN DEFAULT FALSE,
    
    -- Targeting
    target_organizations UUID[], -- Specific organizations
    target_roles TEXT[], -- Specific user roles
    rollout_percentage INTEGER DEFAULT 0, -- 0-100
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reports (Saved custom reports)
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Report Details
    name VARCHAR(255) NOT NULL,
    description TEXT,
    report_type VARCHAR(100), -- financial, compliance, performance, custom
    
    -- Configuration
    query_config JSONB NOT NULL, -- Stores filter, grouping, and display settings
    
    -- Scheduling
    scheduled BOOLEAN DEFAULT FALSE,
    schedule_frequency VARCHAR(50), -- daily, weekly, monthly, quarterly
    schedule_day INTEGER,
    schedule_time TIME,
    
    -- Recipients
    recipients UUID[], -- Array of user IDs
    
    -- Access
    visibility VARCHAR(50) DEFAULT 'private', -- private, team, organization
    
    -- Usage
    last_run_at TIMESTAMP,
    run_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

-- API Keys (For integration purposes)
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Key Details
    key_name VARCHAR(255) NOT NULL,
    key_hash VARCHAR(255) NOT NULL, -- Store hashed key
    key_prefix VARCHAR(20) NOT NULL, -- First few chars for identification
    
    -- Permissions
    permissions JSONB DEFAULT '[]', -- Array of allowed operations
    
    -- Status
    active BOOLEAN DEFAULT TRUE,
    
    -- Usage
    last_used_at TIMESTAMP,
    usage_count INTEGER DEFAULT 0,
    
    -- Expiry
    expires_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

-- Webhooks (For event notifications)
CREATE TABLE webhooks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Webhook Details
    name VARCHAR(255) NOT NULL,
    url VARCHAR(500) NOT NULL,
    
    -- Events
    events TEXT[] NOT NULL, -- Array of event types to listen to
    
    -- Security
    secret VARCHAR(255), -- For signature verification
    
    -- Status
    active BOOLEAN DEFAULT TRUE,
    
    -- Retry Configuration
    retry_on_failure BOOLEAN DEFAULT TRUE,
    max_retries INTEGER DEFAULT 3,
    
    -- Usage
    last_triggered_at TIMESTAMP,
    success_count INTEGER DEFAULT 0,
    failure_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id)
);

-- Webhook Deliveries (Delivery logs)
CREATE TABLE webhook_deliveries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    webhook_id UUID NOT NULL REFERENCES webhooks(id) ON DELETE CASCADE,
    
    -- Event
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB,
    
    -- Delivery
    status VARCHAR(50) NOT NULL, -- success, failure, pending
    response_status INTEGER,
    response_body TEXT,
    
    -- Timing
    attempt_number INTEGER DEFAULT 1,
    delivered_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ADDITIONAL INDEXES
-- =====================================================

CREATE INDEX idx_client_revenue_history_client ON client_revenue_history(client_id);
CREATE INDEX idx_client_revenue_history_period ON client_revenue_history(period_start, period_end);
CREATE INDEX idx_consultations_organization ON consultations(organization_id);
CREATE INDEX idx_consultations_client ON consultations(client_id);
CREATE INDEX idx_consultations_status ON consultations(status);
CREATE INDEX idx_advisory_documents_client ON advisory_documents(client_id);
CREATE INDEX idx_advisory_documents_status ON advisory_documents(status);
CREATE INDEX idx_risk_factors_client ON risk_factors(client_id);
CREATE INDEX idx_risk_factors_status ON risk_factors(status);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_comments_resource ON comments(resource_type, resource_id);
CREATE INDEX idx_activity_feed_organization ON activity_feed(organization_id);
CREATE INDEX idx_activity_feed_client ON activity_feed(client_id);
CREATE INDEX idx_templates_organization ON templates(organization_id);
CREATE INDEX idx_state_tax_info_state ON state_tax_info(state_code);

-- =====================================================
-- ADDITIONAL TRIGGERS
-- =====================================================

CREATE TRIGGER update_consultations_updated_at BEFORE UPDATE ON consultations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_advisory_documents_updated_at BEFORE UPDATE ON advisory_documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_risk_factors_updated_at BEFORE UPDATE ON risk_factors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_insurance_policies_updated_at BEFORE UPDATE ON insurance_policies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_insurance_claims_updated_at BEFORE UPDATE ON insurance_claims FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_state_tax_info_updated_at BEFORE UPDATE ON state_tax_info FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_feature_flags_updated_at BEFORE UPDATE ON feature_flags FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_webhooks_updated_at BEFORE UPDATE ON webhooks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();