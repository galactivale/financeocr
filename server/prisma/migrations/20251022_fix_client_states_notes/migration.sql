-- Ensure client_states.notes exists as TEXT (nullable)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'client_states'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'client_states' AND column_name = 'notes'
    ) THEN
      ALTER TABLE "client_states" ADD COLUMN "notes" TEXT;
    END IF;
  END IF;
END $$;

















