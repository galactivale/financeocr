/*
  Warnings:

  - You are about to drop the column `days_since_threshold` on the `client_states` table. All the data in the column will be lost.
  - You are about to drop the column `filing_frequency` on the `client_states` table. All the data in the column will be lost.
  - You are about to drop the column `last_filing_date` on the `client_states` table. All the data in the column will be lost.
  - You are about to drop the column `next_filing_date` on the `client_states` table. All the data in the column will be lost.
  - You are about to drop the column `penalty_max` on the `client_states` table. All the data in the column will be lost.
  - You are about to drop the column `penalty_min` on the `client_states` table. All the data in the column will be lost.
  - You are about to drop the column `projected_crossover_date` on the `client_states` table. All the data in the column will be lost.
  - You are about to drop the column `registration_status` on the `client_states` table. All the data in the column will be lost.
  - You are about to drop the column `revenue` on the `client_states` table. All the data in the column will be lost.
  - You are about to drop the column `threshold` on the `client_states` table. All the data in the column will be lost.
  - You are about to drop the column `threshold_percentage` on the `client_states` table. All the data in the column will be lost.
  - You are about to drop the column `transaction_count` on the `client_states` table. All the data in the column will be lost.
  - You are about to drop the column `transaction_threshold` on the `client_states` table. All the data in the column will be lost.
  - Made the column `status` on table `client_states` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "client_states" DROP COLUMN "days_since_threshold",
DROP COLUMN "filing_frequency",
DROP COLUMN "last_filing_date",
DROP COLUMN "next_filing_date",
DROP COLUMN "penalty_max",
DROP COLUMN "penalty_min",
DROP COLUMN "projected_crossover_date",
DROP COLUMN "registration_status",
DROP COLUMN "revenue",
DROP COLUMN "threshold",
DROP COLUMN "threshold_percentage",
DROP COLUMN "transaction_count",
DROP COLUMN "transaction_threshold",
ADD COLUMN     "current_amount" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "registration_required" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "threshold_amount" DECIMAL(65,30),
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'monitoring';

-- CreateTable
CREATE TABLE "state_tax_info" (
    "id" TEXT NOT NULL,
    "state_code" TEXT NOT NULL,
    "state_name" TEXT NOT NULL,
    "threshold_amount" DECIMAL(65,30) NOT NULL,
    "registration_deadline" INTEGER NOT NULL DEFAULT 30,
    "penalty_rate" DECIMAL(65,30) NOT NULL DEFAULT 0.1,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "state_tax_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nexus_alerts" (
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
    "acknowledged_at" TIMESTAMP(3),
    "acknowledged_by" TEXT,
    "resolved_at" TIMESTAMP(3),
    "resolved_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nexus_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nexus_activities" (
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

-- CreateIndex
CREATE UNIQUE INDEX "state_tax_info_state_code_key" ON "state_tax_info"("state_code");

-- CreateIndex
CREATE INDEX "state_tax_info_state_code_idx" ON "state_tax_info"("state_code");

-- CreateIndex
CREATE INDEX "nexus_alerts_client_id_idx" ON "nexus_alerts"("client_id");

-- CreateIndex
CREATE INDEX "nexus_alerts_state_code_idx" ON "nexus_alerts"("state_code");

-- CreateIndex
CREATE INDEX "nexus_alerts_priority_idx" ON "nexus_alerts"("priority");

-- CreateIndex
CREATE INDEX "nexus_alerts_status_idx" ON "nexus_alerts"("status");

-- CreateIndex
CREATE INDEX "nexus_alerts_alert_type_idx" ON "nexus_alerts"("alert_type");

-- CreateIndex
CREATE INDEX "nexus_activities_client_id_idx" ON "nexus_activities"("client_id");

-- CreateIndex
CREATE INDEX "nexus_activities_state_code_idx" ON "nexus_activities"("state_code");

-- CreateIndex
CREATE INDEX "nexus_activities_activity_type_idx" ON "nexus_activities"("activity_type");

-- CreateIndex
CREATE INDEX "nexus_activities_created_at_idx" ON "nexus_activities"("created_at");

-- CreateIndex
CREATE INDEX "client_states_client_id_idx" ON "client_states"("client_id");

-- CreateIndex
CREATE INDEX "client_states_state_code_idx" ON "client_states"("state_code");

-- CreateIndex
CREATE INDEX "client_states_status_idx" ON "client_states"("status");

-- AddForeignKey
ALTER TABLE "nexus_alerts" ADD CONSTRAINT "nexus_alerts_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nexus_alerts" ADD CONSTRAINT "nexus_alerts_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nexus_activities" ADD CONSTRAINT "nexus_activities_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nexus_activities" ADD CONSTRAINT "nexus_activities_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
