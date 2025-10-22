-- Create missing core tables required by generation if they don't exist

-- nexus_alerts
CREATE TABLE IF NOT EXISTS "nexus_alerts" (
  "id" TEXT NOT NULL,
  "client_id" TEXT NOT NULL,
  "organization_id" TEXT NOT NULL,
  "state_code" TEXT NOT NULL,
  "alert_type" TEXT NOT NULL,
  "priority" TEXT NOT NULL DEFAULT 'medium',
  "status" TEXT NOT NULL DEFAULT 'open',
  "title" TEXT NOT NULL,
  "description" TEXT,
  "threshold_amount" DECIMAL(65,30),
  "current_amount" DECIMAL(65,30) NOT NULL DEFAULT 0,
  "deadline" TIMESTAMP(3),
  "penalty_risk" DECIMAL(65,30),
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "nexus_alerts_pkey" PRIMARY KEY ("id")
);

-- nexus_activities
CREATE TABLE IF NOT EXISTS "nexus_activities" (
  "id" TEXT NOT NULL,
  "client_id" TEXT NOT NULL,
  "organization_id" TEXT NOT NULL,
  "state_code" TEXT NOT NULL,
  "activity_type" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "amount" DECIMAL(65,30),
  "threshold_amount" DECIMAL(65,30),
  "status" TEXT NOT NULL DEFAULT 'completed',
  "metadata" JSONB,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "nexus_activities_pkey" PRIMARY KEY ("id")
);

-- business_profiles
CREATE TABLE IF NOT EXISTS "business_profiles" (
  "id" TEXT NOT NULL,
  "organization_id" TEXT NOT NULL,
  "client_id" TEXT NOT NULL UNIQUE,
  "legal_name" TEXT NOT NULL,
  "dba_name" TEXT,
  "entity_type" TEXT NOT NULL,
  "formation_date" TIMESTAMP(3) NOT NULL,
  "federal_ein" TEXT NOT NULL,
  "primary_industry" TEXT NOT NULL,
  "naics_code" TEXT,
  "business_model" TEXT,
  "market_focus" TEXT,
  "revenue_growth_yoy" DOUBLE PRECISION,
  "funding_stage" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "business_profiles_pkey" PRIMARY KEY ("id")
);

-- contacts
CREATE TABLE IF NOT EXISTS "contacts" (
  "id" TEXT NOT NULL,
  "organization_id" TEXT NOT NULL,
  "client_id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "title" TEXT,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "mobile" TEXT,
  "role" TEXT NOT NULL,
  "specialization" TEXT,
  "notes" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- business_locations
CREATE TABLE IF NOT EXISTS "business_locations" (
  "id" TEXT NOT NULL,
  "organization_id" TEXT NOT NULL,
  "client_id" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "state" TEXT NOT NULL,
  "postal_code" TEXT NOT NULL,
  "country" TEXT NOT NULL DEFAULT 'US',
  "property_type" TEXT,
  "employee_count" INTEGER NOT NULL,
  "nexus_relevant" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "business_locations_pkey" PRIMARY KEY ("id")
);

-- revenue_breakdowns
CREATE TABLE IF NOT EXISTS "revenue_breakdowns" (
  "id" TEXT NOT NULL,
  "organization_id" TEXT NOT NULL,
  "client_id" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "amount" DECIMAL(65,30) NOT NULL,
  "percentage" DOUBLE PRECISION NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "revenue_breakdowns_pkey" PRIMARY KEY ("id")
);

-- customer_demographics
CREATE TABLE IF NOT EXISTS "customer_demographics" (
  "id" TEXT NOT NULL,
  "organization_id" TEXT NOT NULL,
  "client_id" TEXT NOT NULL UNIQUE,
  "total_active_customers" INTEGER NOT NULL,
  "average_contract_value" DECIMAL(65,30) NOT NULL,
  "customer_retention_rate" DOUBLE PRECISION NOT NULL,
  "monthly_recurring_revenue" DECIMAL(65,30) NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "customer_demographics_pkey" PRIMARY KEY ("id")
);

-- geographic_distributions
CREATE TABLE IF NOT EXISTS "geographic_distributions" (
  "id" TEXT NOT NULL,
  "organization_id" TEXT NOT NULL,
  "client_id" TEXT NOT NULL,
  "state_code" TEXT NOT NULL,
  "customer_count" INTEGER NOT NULL,
  "percentage" DOUBLE PRECISION NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "geographic_distributions_pkey" PRIMARY KEY ("id")
);

-- communications
CREATE TABLE IF NOT EXISTS "communications" (
  "id" TEXT NOT NULL,
  "organization_id" TEXT NOT NULL,
  "client_id" TEXT NOT NULL,
  "alert_id" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'sent',
  "sent_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "delivery_date" TIMESTAMP(3),
  "read_date" TIMESTAMP(3),
  "failure_reason" TEXT,
  "recipient_email" TEXT,
  "recipient_phone" TEXT,
  "professional_reasoning" TEXT,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "communications_pkey" PRIMARY KEY ("id")
);

-- audit_trails
CREATE TABLE IF NOT EXISTS "audit_trails" (
  "id" TEXT NOT NULL,
  "organization_id" TEXT NOT NULL,
  "client_id" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "entity_type" TEXT NOT NULL,
  "entity_id" TEXT,
  "entity_name" TEXT,
  "old_values" JSONB,
  "new_values" JSONB,
  "change_description" TEXT,
  "performed_by" TEXT,
  "performed_by_name" TEXT,
  "user_role" TEXT,
  "ip_address" TEXT,
  "user_agent" TEXT,
  "session_id" TEXT,
  "performed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "audit_trails_pkey" PRIMARY KEY ("id")
);

-- data_processing
CREATE TABLE IF NOT EXISTS "data_processing" (
  "id" TEXT NOT NULL,
  "organization_id" TEXT NOT NULL,
  "client_id" TEXT NOT NULL,
  "file_name" TEXT NOT NULL,
  "file_type" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "quality" INTEGER,
  "processed_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "data_processing_pkey" PRIMARY KEY ("id")
);

-- Foreign keys omitted to avoid type mismatches; Prisma relations still operate without DB-level FKs

