#!/bin/bash

# Fix VPS Database Authentication Issue
# This script helps set up the PostgreSQL database with correct credentials

echo "🔧 Fixing VPS Database Authentication Issue"
echo "=========================================="

# Check if we're running in Docker
if [ -f /.dockerenv ]; then
    echo "❌ This script should be run on the VPS host, not inside Docker containers"
    exit 1
fi

# Check if PostgreSQL is running
if ! systemctl is-active --quiet postgresql; then
    echo "📦 Starting PostgreSQL service..."
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
fi

echo "🔍 Checking PostgreSQL status..."
sudo systemctl status postgresql --no-pager -l

# Connect to PostgreSQL as postgres user and create the database and user
echo "🗄️  Setting up database and user..."

sudo -u postgres psql << EOF
-- Drop existing user and database if they exist
DROP DATABASE IF EXISTS vaultcpa;
DROP USER IF EXISTS vaultcpa_user;

-- Create user with password
CREATE USER vaultcpa_user WITH PASSWORD 'vaultcpa_secure_password_2024';

-- Create database
CREATE DATABASE vaultcpa OWNER vaultcpa_user;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE vaultcpa TO vaultcpa_user;

-- Connect to the database and grant schema privileges
\c vaultcpa
GRANT ALL ON SCHEMA public TO vaultcpa_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO vaultcpa_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO vaultcpa_user;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO vaultcpa_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO vaultcpa_user;

\q
EOF

if [ $? -eq 0 ]; then
    echo "✅ Database and user created successfully!"
else
    echo "❌ Failed to create database and user"
    exit 1
fi

# Test the connection
echo "🧪 Testing database connection..."
PGPASSWORD='vaultcpa_secure_password_2024' psql -h localhost -U vaultcpa_user -d vaultcpa -c "SELECT version();"

if [ $? -eq 0 ]; then
    echo "✅ Database connection test successful!"
else
    echo "❌ Database connection test failed"
    exit 1
fi

# Check PostgreSQL configuration
echo "⚙️  Checking PostgreSQL configuration..."
echo "Current pg_hba.conf settings:"
sudo grep -E "^(local|host)" /etc/postgresql/*/main/pg_hba.conf | head -10

echo ""
echo "🔧 If authentication still fails, you may need to:"
echo "1. Update pg_hba.conf to allow password authentication"
echo "2. Restart PostgreSQL service"
echo "3. Check firewall settings"

echo ""
echo "📋 Next steps:"
echo "1. Run: sudo systemctl restart postgresql"
echo "2. Test connection again"
echo "3. Start your Docker containers"

echo ""
echo "🎉 Database setup complete!"
