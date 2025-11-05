-- Ensure client_states.registration_required exists with NOT NULL DEFAULT false
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'client_states'
  ) THEN
    -- Add column if missing
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'client_states' AND column_name = 'registration_required'
    ) THEN
      ALTER TABLE "client_states" ADD COLUMN "registration_required" BOOLEAN;
    END IF;

    -- Backfill NULLs to false
    UPDATE "client_states" SET "registration_required" = false WHERE "registration_required" IS NULL;

    -- Enforce default and not null
    ALTER TABLE "client_states" ALTER COLUMN "registration_required" SET DEFAULT false;
    ALTER TABLE "client_states" ALTER COLUMN "registration_required" SET NOT NULL;
  END IF;
END $$;













