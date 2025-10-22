-- CreateTable: decision_tables
CREATE TABLE "decision_tables" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "decision_id" TEXT NOT NULL,
    "decision_type" TEXT NOT NULL,
    "decision_title" TEXT NOT NULL,
    "decision_description" TEXT NOT NULL,
    "decision_date" TIMESTAMP(3) NOT NULL,
    "decision_maker" TEXT NOT NULL,
    "decision_maker_role" TEXT NOT NULL,
    "risk_level" TEXT NOT NULL,
    "financial_exposure" DECIMAL(65,30),
    "exposure_currency" TEXT NOT NULL DEFAULT 'USD',
    "decision_rationale" TEXT NOT NULL,
    "supporting_evidence" TEXT[] NOT NULL,
    "alternatives_considered" TEXT[] NOT NULL,
    "peer_reviewer" TEXT,
    "peer_review_date" TIMESTAMP(3),
    "peer_review_notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "implementation_date" TIMESTAMP(3),
    "follow_up_required" BOOLEAN NOT NULL DEFAULT false,
    "follow_up_date" TIMESTAMP(3),
    "follow_up_notes" TEXT,
    "related_alerts" TEXT[] NOT NULL,
    "related_tasks" TEXT[] NOT NULL,
    "related_documents" TEXT[] NOT NULL,
    "tags" TEXT[] NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "decision_tables_pkey" PRIMARY KEY ("id")
);

-- Uniqueness
CREATE UNIQUE INDEX "decision_tables_decision_id_key" ON "decision_tables" ("decision_id");

-- Indexes
CREATE INDEX "decision_tables_client_id_idx" ON "decision_tables" ("client_id");
CREATE INDEX "decision_tables_decision_type_idx" ON "decision_tables" ("decision_type");
CREATE INDEX "decision_tables_decision_date_idx" ON "decision_tables" ("decision_date");
CREATE INDEX "decision_tables_status_idx" ON "decision_tables" ("status");
CREATE INDEX "decision_tables_risk_level_idx" ON "decision_tables" ("risk_level");

-- Foreign keys
ALTER TABLE "decision_tables"
  ADD CONSTRAINT "decision_tables_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "decision_tables"
  ADD CONSTRAINT "decision_tables_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

