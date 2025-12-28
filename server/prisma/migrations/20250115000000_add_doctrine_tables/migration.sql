-- CreateTable
CREATE TABLE "doctrine_rules" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "state" TEXT,
    "tax_type" TEXT,
    "activity_pattern" JSONB,
    "posture" TEXT,
    "decision" TEXT,
    "scope" TEXT NOT NULL,
    "client_id" TEXT,
    "office_id" TEXT,
    "organization_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "version" INTEGER NOT NULL DEFAULT 1,
    "rationale_internal" TEXT,
    "review_due_at" TIMESTAMP(3),
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "doctrine_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctrine_approvals" (
    "id" TEXT NOT NULL,
    "rule_id" TEXT NOT NULL,
    "approver_id" TEXT NOT NULL,
    "approver_role" TEXT,
    "approved_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "action" TEXT NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "doctrine_approvals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctrine_impact_metrics" (
    "id" TEXT NOT NULL,
    "rule_id" TEXT NOT NULL,
    "total_clients_affected" INTEGER NOT NULL DEFAULT 0,
    "total_memos_generated" INTEGER NOT NULL DEFAULT 0,
    "total_revenue_covered" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "last_applied_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "doctrine_impact_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctrine_version_events" (
    "id" TEXT NOT NULL,
    "rule_id" TEXT NOT NULL,
    "from_version" INTEGER,
    "to_version" INTEGER NOT NULL,
    "action_type" TEXT NOT NULL,
    "actor_id" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT,
    "previous_snapshot" JSONB,
    "new_snapshot" JSONB NOT NULL,

    CONSTRAINT "doctrine_version_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "doctrine_rules_organization_id_idx" ON "doctrine_rules"("organization_id");

-- CreateIndex
CREATE INDEX "doctrine_rules_client_id_idx" ON "doctrine_rules"("client_id");

-- CreateIndex
CREATE INDEX "doctrine_rules_scope_idx" ON "doctrine_rules"("scope");

-- CreateIndex
CREATE INDEX "doctrine_rules_status_idx" ON "doctrine_rules"("status");

-- CreateIndex
CREATE INDEX "doctrine_rules_state_idx" ON "doctrine_rules"("state");

-- CreateIndex
CREATE INDEX "doctrine_rules_tax_type_idx" ON "doctrine_rules"("tax_type");

-- CreateIndex
CREATE INDEX "doctrine_approvals_rule_id_idx" ON "doctrine_approvals"("rule_id");

-- CreateIndex
CREATE INDEX "doctrine_approvals_approver_id_idx" ON "doctrine_approvals"("approver_id");

-- CreateIndex
CREATE INDEX "doctrine_version_events_rule_id_idx" ON "doctrine_version_events"("rule_id");

-- CreateIndex
CREATE INDEX "doctrine_version_events_timestamp_idx" ON "doctrine_version_events"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "doctrine_impact_metrics_rule_id_key" ON "doctrine_impact_metrics"("rule_id");

-- AddForeignKey
ALTER TABLE "doctrine_rules" ADD CONSTRAINT "doctrine_rules_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctrine_rules" ADD CONSTRAINT "doctrine_rules_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctrine_approvals" ADD CONSTRAINT "doctrine_approvals_rule_id_fkey" FOREIGN KEY ("rule_id") REFERENCES "doctrine_rules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctrine_impact_metrics" ADD CONSTRAINT "doctrine_impact_metrics_rule_id_fkey" FOREIGN KEY ("rule_id") REFERENCES "doctrine_rules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctrine_version_events" ADD CONSTRAINT "doctrine_version_events_rule_id_fkey" FOREIGN KEY ("rule_id") REFERENCES "doctrine_rules"("id") ON DELETE CASCADE ON UPDATE CASCADE;


