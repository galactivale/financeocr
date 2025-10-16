-- Fix database permissions for vaultcpa_user
-- This script ensures the user has all necessary permissions

-- Connect to the vaultcpa database
\c vaultcpa;

-- Grant all privileges on the public schema
GRANT ALL ON SCHEMA public TO vaultcpa_user;

-- Grant all privileges on all existing tables
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO vaultcpa_user;

-- Grant all privileges on all existing sequences
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO vaultcpa_user;

-- Set default privileges for future tables and sequences
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO vaultcpa_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO vaultcpa_user;

-- Grant usage on the public schema
GRANT USAGE ON SCHEMA public TO vaultcpa_user;

-- Make vaultcpa_user the owner of the database
ALTER DATABASE vaultcpa OWNER TO vaultcpa_user;

-- Show current permissions
\du vaultcpa_user
\l vaultcpa
