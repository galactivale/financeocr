-- CreateTable: generated_dashboards to match Prisma model GeneratedDashboard
CREATE TABLE IF NOT EXISTS "generated_dashboards" (
  "id" TEXT NOT NULL,
  "organization_id" UUID NOT NULL,
  "client_name" TEXT NOT NULL,
  "unique_url" TEXT NOT NULL,
  "client_info" JSONB NOT NULL,
  "key_metrics" JSONB NOT NULL,
  "states_monitored" TEXT[] NOT NULL,
  "personalized_data" JSONB NOT NULL DEFAULT '{}',
  "generated_clients" JSONB,
  "generated_alerts" JSONB,
  "generated_tasks" JSONB,
  "generated_analytics" JSONB,
  "generated_client_states" JSONB,
  "generated_nexus_alerts" JSONB,
  "generated_nexus_activities" JSONB,
  "generated_system_health" JSONB,
  "generated_reports" JSONB,
  "generated_communications" JSONB,
  "generated_decisions" JSONB,
  "last_updated" TIMESTAMP(3) NOT NULL,
  "is_active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "generated_dashboards_pkey" PRIMARY KEY ("id")
);

-- Uniqueness and indexes
CREATE UNIQUE INDEX IF NOT EXISTS "generated_dashboards_unique_url_key" ON "generated_dashboards" ("unique_url");
CREATE INDEX IF NOT EXISTS "generated_dashboards_unique_url_idx" ON "generated_dashboards" ("unique_url");
CREATE INDEX IF NOT EXISTS "generated_dashboards_client_name_idx" ON "generated_dashboards" ("client_name");
CREATE INDEX IF NOT EXISTS "generated_dashboards_is_active_idx" ON "generated_dashboards" ("is_active");

-- FKs (add only if missing)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'generated_dashboards_organization_id_fkey'
  ) THEN
    ALTER TABLE "generated_dashboards"
      ADD CONSTRAINT "generated_dashboards_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

