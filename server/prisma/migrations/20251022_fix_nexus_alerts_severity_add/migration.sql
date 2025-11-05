-- Ensure nexus_alerts.severity exists with NOT NULL DEFAULT 'medium'
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'nexus_alerts'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'nexus_alerts' AND column_name = 'severity'
    ) THEN
      ALTER TABLE "nexus_alerts" ADD COLUMN "severity" TEXT;
    END IF;

    UPDATE "nexus_alerts" SET "severity" = 'medium' WHERE "severity" IS NULL;
    ALTER TABLE "nexus_alerts" ALTER COLUMN "severity" SET DEFAULT 'medium';
    ALTER TABLE "nexus_alerts" ALTER COLUMN "severity" SET NOT NULL;
  END IF;
END $$;













