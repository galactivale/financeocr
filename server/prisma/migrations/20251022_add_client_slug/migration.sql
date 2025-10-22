-- Add missing slug column to clients, backfill, and enforce constraints
DO $$
BEGIN
  -- Add column if it does not exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'clients' AND column_name = 'slug'
  ) THEN
    ALTER TABLE "clients" ADD COLUMN "slug" TEXT;
  END IF;

  -- Backfill slug values for existing rows where slug is NULL using a safe slugify of name + short id suffix
  -- Create a helper function if needed (inline slugify using lower/regex replace available in PostgreSQL)
  UPDATE "clients"
  SET "slug" =
    lower(regexp_replace(coalesce(name, id::text), '[^a-zA-Z0-9]+', '-', 'g')) || '-' || substr(id::text, 1, 6)
  WHERE slug IS NULL;

  -- Create unique index if not exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'clients_slug_key'
  ) THEN
    CREATE UNIQUE INDEX "clients_slug_key" ON "clients" ("slug");
  END IF;

  -- Enforce NOT NULL
  ALTER TABLE "clients" ALTER COLUMN "slug" SET NOT NULL;
END $$;

