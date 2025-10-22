-- Ensure severity column exists, set NOT NULL and DEFAULT 'medium' on nexus_alerts
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'nexus_alerts'
  ) THEN
    -- Add column if missing
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'nexus_alerts' AND column_name = 'severity'
    ) THEN
      ALTER TABLE "nexus_alerts" ADD COLUMN "severity" TEXT;
    END IF;

    -- Backfill existing NULL values to 'medium'
    EXECUTE 'UPDATE "nexus_alerts" SET "severity" = ''medium'' WHERE "severity" IS NULL';

    -- Apply NOT NULL and DEFAULT
    EXECUTE 'ALTER TABLE "nexus_alerts" ALTER COLUMN "severity" SET DEFAULT ''medium''' ;
    EXECUTE 'ALTER TABLE "nexus_alerts" ALTER COLUMN "severity" SET NOT NULL' ;
  END IF;
END $$;

