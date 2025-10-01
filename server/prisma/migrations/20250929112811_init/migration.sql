-- CreateTable
CREATE TABLE "organizations" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "legal_name" TEXT,
    "tax_id" TEXT,
    "subscription_tier" TEXT NOT NULL DEFAULT 'trial',
    "subscription_status" TEXT NOT NULL DEFAULT 'active',
    "subscription_started_at" TIMESTAMP(3),
    "subscription_expires_at" TIMESTAMP(3),
    "settings" JSONB NOT NULL DEFAULT '{}',
    "branding" JSONB NOT NULL DEFAULT '{}',
    "features" JSONB NOT NULL DEFAULT '{}',
    "email" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "address_line1" TEXT,
    "address_line2" TEXT,
    "city" TEXT,
    "state" TEXT,
    "postal_code" TEXT,
    "country" TEXT NOT NULL DEFAULT 'US',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "mfa_enabled" BOOLEAN NOT NULL DEFAULT false,
    "mfa_secret" TEXT,
    "first_name" TEXT,
    "last_name" TEXT,
    "display_name" TEXT,
    "avatar_url" TEXT,
    "title" TEXT,
    "department" TEXT,
    "cpa_license" TEXT,
    "cpa_state" TEXT,
    "cpa_expiration" TIMESTAMP(3),
    "role" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "last_login" TIMESTAMP(3),
    "login_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "legal_name" TEXT,
    "tax_id" TEXT,
    "industry" TEXT,
    "foundedYear" INTEGER,
    "employee_count" INTEGER,
    "annual_revenue" DECIMAL(65,30),
    "fiscal_year_end" TIMESTAMP(3),
    "risk_level" TEXT,
    "penalty_exposure" DECIMAL(65,30),
    "quality_score" INTEGER,
    "assigned_partner" TEXT,
    "assigned_manager" TEXT,
    "assigned_staff" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "assigned_since" TIMESTAMP(3),
    "last_review" TIMESTAMP(3),
    "next_review" TIMESTAMP(3),
    "primary_contact_name" TEXT,
    "primary_contact_email" TEXT,
    "primary_contact_phone" TEXT,
    "address_line1" TEXT,
    "address_line2" TEXT,
    "city" TEXT,
    "state" TEXT,
    "postal_code" TEXT,
    "country" TEXT NOT NULL DEFAULT 'US',
    "status" TEXT NOT NULL DEFAULT 'active',
    "avatar_url" TEXT,
    "notes" TEXT,
    "tags" TEXT[],
    "custom_fields" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alerts" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "client_id" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "issue" TEXT,
    "state_code" TEXT,
    "state_name" TEXT,
    "current_amount" DECIMAL(65,30),
    "threshold_amount" DECIMAL(65,30),
    "penalty_risk" DECIMAL(65,30),
    "priority" TEXT NOT NULL,
    "severity" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "type" TEXT,
    "category" TEXT,
    "deadline" TIMESTAMP(3),
    "detected_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMP(3),
    "assigned_to" TEXT,
    "assigned_at" TIMESTAMP(3),
    "actions" TEXT[],
    "resolution_notes" TEXT,
    "affected_tenants" TEXT[],
    "affected_services" TEXT[],
    "users_affected" INTEGER,
    "estimated_downtime" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,

    CONSTRAINT "alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "client_id" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "type" TEXT,
    "priority" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "assigned_to" TEXT,
    "assigned_by" TEXT,
    "assigned_at" TIMESTAMP(3),
    "due_date" TIMESTAMP(3),
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "estimated_hours" DECIMAL(65,30),
    "actual_hours" DECIMAL(65,30),
    "progress" INTEGER NOT NULL DEFAULT 0,
    "state_code" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "client_id" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT,
    "category" TEXT,
    "file_name" TEXT,
    "file_size" BIGINT,
    "file_type" TEXT,
    "file_url" TEXT,
    "file_path" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "version" INTEGER NOT NULL DEFAULT 1,
    "parent_document_id" TEXT,
    "visibility" TEXT NOT NULL DEFAULT 'private',
    "tags" TEXT[],
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploaded_by" TEXT,
    "reviewed_by" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "approved_by" TEXT,
    "approved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "professional_decisions" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "decision_date" TIMESTAMP(3) NOT NULL,
    "decision_type" TEXT NOT NULL,
    "decision_summary" TEXT NOT NULL,
    "professional_reasoning" TEXT NOT NULL,
    "risk_level" TEXT,
    "financial_exposure" DECIMAL(65,30),
    "status" TEXT NOT NULL DEFAULT 'draft',
    "decision_maker_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "peer_reviewer_id" TEXT,

    CONSTRAINT "professional_decisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_permissions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "granted" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_states" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "state_code" TEXT NOT NULL,
    "state_name" TEXT NOT NULL,
    "revenue" DECIMAL(65,30),
    "threshold" DECIMAL(65,30),
    "threshold_percentage" DECIMAL(65,30),
    "transaction_count" INTEGER,
    "transaction_threshold" INTEGER,
    "status" TEXT,
    "days_since_threshold" INTEGER,
    "projected_crossover_date" TIMESTAMP(3),
    "penalty_min" DECIMAL(65,30),
    "penalty_max" DECIMAL(65,30),
    "registration_status" TEXT,
    "registration_date" TIMESTAMP(3),
    "registration_number" TEXT,
    "filing_frequency" TEXT,
    "next_filing_date" TIMESTAMP(3),
    "last_filing_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "client_states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "task_steps" (
    "id" TEXT NOT NULL,
    "task_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "step_order" INTEGER NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "completed_at" TIMESTAMP(3),
    "completed_by" TEXT,
    "estimated_time" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "task_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alert_actions" (
    "id" TEXT NOT NULL,
    "alert_id" TEXT NOT NULL,
    "user_id" TEXT,
    "action" TEXT NOT NULL,
    "details" TEXT,
    "old_value" TEXT,
    "new_value" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alert_actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compliance_standards" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "standard_name" TEXT NOT NULL,
    "standard_code" TEXT,
    "description" TEXT,
    "category" TEXT,
    "status" TEXT,
    "last_review_date" TIMESTAMP(3),
    "next_review_date" TIMESTAMP(3),
    "reviewed_by" TEXT,
    "documentation_url" TEXT,
    "compliance_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "compliance_standards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regulatory_changes" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "state_code" TEXT,
    "federal" BOOLEAN NOT NULL DEFAULT false,
    "effective_date" TIMESTAMP(3),
    "announcement_date" TIMESTAMP(3),
    "impact_level" TEXT,
    "affected_clients" INTEGER,
    "status" TEXT,
    "regulation_reference" TEXT,
    "documentation_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "regulatory_changes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "integrations" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT,
    "config" JSONB NOT NULL DEFAULT '{}',
    "credentials" JSONB NOT NULL DEFAULT '{}',
    "status" TEXT NOT NULL DEFAULT 'inactive',
    "last_sync" TIMESTAMP(3),
    "sync_frequency" TEXT,
    "next_sync" TIMESTAMP(3),
    "error_count" INTEGER NOT NULL DEFAULT 0,
    "last_error" TEXT,
    "last_error_at" TIMESTAMP(3),
    "performance_score" INTEGER,
    "version" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,

    CONSTRAINT "integrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "performance_metrics" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "metric_date" TIMESTAMP(3) NOT NULL,
    "metric_type" TEXT NOT NULL,
    "value" DECIMAL(65,30),
    "target" DECIMAL(65,30),
    "variance" DECIMAL(65,30),
    "unit" TEXT,
    "category" TEXT,
    "tags" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "performance_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_log" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT,
    "user_id" TEXT,
    "action" TEXT NOT NULL,
    "resource_type" TEXT NOT NULL,
    "resource_id" TEXT,
    "old_values" JSONB,
    "new_values" JSONB,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "details" TEXT,
    "severity" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization_metadata" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organization_metadata_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organizations_slug_key" ON "organizations"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "users_organization_id_email_key" ON "users"("organization_id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "user_sessions_token_key" ON "user_sessions"("token");

-- CreateIndex
CREATE UNIQUE INDEX "user_permissions_user_id_resource_action_key" ON "user_permissions"("user_id", "resource", "action");

-- CreateIndex
CREATE UNIQUE INDEX "client_states_client_id_state_code_key" ON "client_states"("client_id", "state_code");

-- CreateIndex
CREATE UNIQUE INDEX "performance_metrics_organization_id_metric_date_metric_type_key" ON "performance_metrics"("organization_id", "metric_date", "metric_type");

-- CreateIndex
CREATE UNIQUE INDEX "organization_metadata_organization_id_key_key" ON "organization_metadata"("organization_id", "key");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_assigned_partner_fkey" FOREIGN KEY ("assigned_partner") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_assigned_manager_fkey" FOREIGN KEY ("assigned_manager") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professional_decisions" ADD CONSTRAINT "professional_decisions_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professional_decisions" ADD CONSTRAINT "professional_decisions_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professional_decisions" ADD CONSTRAINT "professional_decisions_decision_maker_id_fkey" FOREIGN KEY ("decision_maker_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professional_decisions" ADD CONSTRAINT "professional_decisions_peer_reviewer_id_fkey" FOREIGN KEY ("peer_reviewer_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_permissions" ADD CONSTRAINT "user_permissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_states" ADD CONSTRAINT "client_states_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_states" ADD CONSTRAINT "client_states_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_steps" ADD CONSTRAINT "task_steps_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alert_actions" ADD CONSTRAINT "alert_actions_alert_id_fkey" FOREIGN KEY ("alert_id") REFERENCES "alerts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compliance_standards" ADD CONSTRAINT "compliance_standards_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "regulatory_changes" ADD CONSTRAINT "regulatory_changes_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "integrations" ADD CONSTRAINT "integrations_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "performance_metrics" ADD CONSTRAINT "performance_metrics_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_metadata" ADD CONSTRAINT "organization_metadata_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
