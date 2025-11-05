-- Ensure nexus_alerts acknowledged/resolved columns exist (nullable)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'nexus_alerts'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'nexus_alerts' AND column_name = 'acknowledged_at'
    ) THEN
      ALTER TABLE "nexus_alerts" ADD COLUMN "acknowledged_at" TIMESTAMP(3);
    END IF;
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'nexus_alerts' AND column_name = 'acknowledged_by'
    ) THEN
      ALTER TABLE "nexus_alerts" ADD COLUMN "acknowledged_by" TEXT;
    END IF;
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'nexus_alerts' AND column_name = 'resolved_at'
    ) THEN
      ALTER TABLE "nexus_alerts" ADD COLUMN "resolved_at" TIMESTAMP(3);
    END IF;
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'nexus_alerts' AND column_name = 'resolved_by'
    ) THEN
      ALTER TABLE "nexus_alerts" ADD COLUMN "resolved_by" TEXT;
    END IF;
  END IF;
END $$;














