-- Ensure client_states.threshold_amount exists as DECIMAL and nullable
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'client_states'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'client_states' AND column_name = 'threshold_amount'
    ) THEN
      ALTER TABLE "client_states" ADD COLUMN "threshold_amount" DECIMAL(65,30);
    END IF;
  END IF;
END $$;





