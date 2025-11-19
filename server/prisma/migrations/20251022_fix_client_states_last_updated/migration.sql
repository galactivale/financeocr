-- Ensure client_states.last_updated exists as TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'client_states'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'client_states' AND column_name = 'last_updated'
    ) THEN
      ALTER TABLE "client_states" ADD COLUMN "last_updated" TIMESTAMP(3);
    END IF;

    UPDATE "client_states" SET "last_updated" = CURRENT_TIMESTAMP WHERE "last_updated" IS NULL;
    ALTER TABLE "client_states" ALTER COLUMN "last_updated" SET DEFAULT CURRENT_TIMESTAMP;
    ALTER TABLE "client_states" ALTER COLUMN "last_updated" SET NOT NULL;
  END IF;
END $$;

















