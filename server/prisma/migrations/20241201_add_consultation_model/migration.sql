-- CreateTable
CREATE TABLE "consultations" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "alert_id" TEXT,
    "topic" TEXT NOT NULL,
    "description" TEXT,
    "scheduled_date" TIMESTAMP(3) NOT NULL,
    "scheduled_time" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "exposure_amount" DECIMAL(65,30),
    "exposure_currency" TEXT NOT NULL DEFAULT 'USD',
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "prep_status" TEXT NOT NULL DEFAULT 'pending',
    "prep_notes" TEXT,
    "talking_points" TEXT,
    "advisory_package" TEXT,
    "meeting_type" TEXT NOT NULL DEFAULT 'call',
    "meeting_link" TEXT,
    "meeting_location" TEXT,
    "outcome" TEXT,
    "follow_up_required" BOOLEAN NOT NULL DEFAULT false,
    "follow_up_date" TIMESTAMP(3),
    "follow_up_notes" TEXT,
    "notes" TEXT,
    "documents" TEXT[],
    "recording_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3),
    "cancelled_at" TIMESTAMP(3),

    CONSTRAINT "consultations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "consultations_client_id_idx" ON "consultations"("client_id");

-- CreateIndex
CREATE INDEX "consultations_scheduled_date_idx" ON "consultations"("scheduled_date");

-- CreateIndex
CREATE INDEX "consultations_status_idx" ON "consultations"("status");

-- CreateIndex
CREATE INDEX "consultations_prep_status_idx" ON "consultations"("prep_status");

-- AddForeignKey
ALTER TABLE "consultations" ADD CONSTRAINT "consultations_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultations" ADD CONSTRAINT "consultations_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultations" ADD CONSTRAINT "consultations_alert_id_fkey" FOREIGN KEY ("alert_id") REFERENCES "alerts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

