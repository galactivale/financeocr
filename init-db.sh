#!/bin/bash
set -e

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
until pg_isready -h localhost -p 5432 -U vaultcpa_user; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done

echo "PostgreSQL is ready!"

# Create additional databases if needed
echo "Creating additional databases..."

# Create a test database
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Create test database
    CREATE DATABASE vaultcpa_test;
    
    -- Grant privileges
    GRANT ALL PRIVILEGES ON DATABASE vaultcpa TO vaultcpa_user;
    GRANT ALL PRIVILEGES ON DATABASE vaultcpa_test TO vaultcpa_user;
    
    -- Connect to main database and create extensions
    \c vaultcpa;
    
    -- Enable required extensions
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    
    -- Create a read-only user for reporting
    CREATE USER vaultcpa_readonly WITH PASSWORD 'readonly_password_2024';
    GRANT CONNECT ON DATABASE vaultcpa TO vaultcpa_readonly;
    GRANT USAGE ON SCHEMA public TO vaultcpa_readonly;
    
    -- Note: We'll grant SELECT privileges after tables are created by the schema
    -- This will be done in a separate script after schema initialization
    
    -- Create a backup user
    CREATE USER vaultcpa_backup WITH PASSWORD 'backup_password_2024';
    GRANT CONNECT ON DATABASE vaultcpa TO vaultcpa_backup;
    
    -- Set up logging
    ALTER SYSTEM SET log_statement = 'all';
    ALTER SYSTEM SET log_min_duration_statement = 1000;
    ALTER SYSTEM SET log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h ';
    
    -- Reload configuration
    SELECT pg_reload_conf();
    
    -- Display database information
    \l
    \du
EOSQL

echo "Database initialization completed successfully!"

# Grant read-only permissions after schema is loaded
echo "Setting up read-only user permissions..."
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Grant SELECT on all existing tables to read-only user
    GRANT SELECT ON ALL TABLES IN SCHEMA public TO vaultcpa_readonly;
    
    -- Grant SELECT on all future tables
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO vaultcpa_readonly;
    
    -- Grant usage on sequences for read-only user
    GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO vaultcpa_readonly;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE ON SEQUENCES TO vaultcpa_readonly;
EOSQL

echo "Read-only user permissions configured!"

# Create a simple health check function
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Create a health check function
    CREATE OR REPLACE FUNCTION health_check()
    RETURNS TABLE(
        database_name TEXT,
        current_time TIMESTAMP,
        active_connections INTEGER,
        database_size TEXT
    ) AS \$\$
    BEGIN
        RETURN QUERY
        SELECT 
            current_database()::TEXT,
            NOW(),
            (SELECT count(*) FROM pg_stat_activity WHERE datname = current_database())::INTEGER,
            pg_size_pretty(pg_database_size(current_database()))::TEXT;
    END;
    \$\$ LANGUAGE plpgsql;
    
    -- Grant execute permission to read-only user
    GRANT EXECUTE ON FUNCTION health_check() TO vaultcpa_readonly;
EOSQL

echo "Health check function created!"

echo "VaultCPA Database initialization completed successfully!"
echo "Database: vaultcpa"
echo "User: vaultcpa_user"
echo "Read-only User: vaultcpa_readonly"
echo "Test Database: vaultcpa_test"
echo "PgAdmin: http://localhost:8080 (admin@vaultcpa.com / admin123)"

