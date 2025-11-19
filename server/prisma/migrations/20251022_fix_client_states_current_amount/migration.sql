-- Ensure client_states.current_amount exists as DECIMAL NOT NULL DEFAULT 0
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'client_states'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'client_states' AND column_name = 'current_amount'
    ) THEN
      ALTER TABLE "client_states" ADD COLUMN "current_amount" DECIMAL(65,30);
    END IF;

    UPDATE "client_states" SET "current_amount" = 0 WHERE "current_amount" IS NULL;
    ALTER TABLE "client_states" ALTER COLUMN "current_amount" SET DEFAULT 0;
    ALTER TABLE "client_states" ALTER COLUMN "current_amount" SET NOT NULL;
  END IF;
END $$;

















