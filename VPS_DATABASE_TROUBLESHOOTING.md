# VPS Database Authentication Troubleshooting Guide

## Problem
The backend container is failing to connect to PostgreSQL with the error:
```
Authentication failed against database server at `postgres`, the provided database credentials for `vaultcpa_user` are not valid.
```

## Root Causes
1. **Database user doesn't exist** - The `vaultcpa_user` hasn't been created
2. **Wrong password** - The password doesn't match what's configured
3. **Database doesn't exist** - The `vaultcpa` database hasn't been created
4. **Permission issues** - User doesn't have proper permissions
5. **PostgreSQL configuration** - pg_hba.conf doesn't allow password authentication

## Solutions

### Option 1: Use the Fixed Docker Compose (Recommended)
```bash
# Stop current containers
docker-compose -f docker-compose.vps.yml down

# Remove old database volume (WARNING: This will delete all data)
docker volume rm nextui-dashboard_postgres_data

# Use the fixed compose file
docker-compose -f docker-compose.vps-fixed.yml up -d
```

### Option 2: Manual Database Setup (Linux VPS)
```bash
# Make the script executable
chmod +x fix-vps-database.sh

# Run the database setup script
./fix-vps-database.sh
```

### Option 3: Manual Database Setup (Windows VPS)
```powershell
# Run the PowerShell script
.\fix-vps-database.ps1
```

### Option 4: Manual PostgreSQL Commands
```bash
# Connect to PostgreSQL as superuser
sudo -u postgres psql

# Run these commands in psql:
DROP DATABASE IF EXISTS vaultcpa;
DROP USER IF EXISTS vaultcpa_user;
CREATE USER vaultcpa_user WITH PASSWORD 'vaultcpa_secure_password_2024';
CREATE DATABASE vaultcpa OWNER vaultcpa_user;
GRANT ALL PRIVILEGES ON DATABASE vaultcpa TO vaultcpa_user;
\c vaultcpa
GRANT ALL ON SCHEMA public TO vaultcpa_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO vaultcpa_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO vaultcpa_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO vaultcpa_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO vaultcpa_user;
\q
```

## Environment Variables Check
Make sure these environment variables are set correctly:

```bash
# Check current environment variables
echo $POSTGRES_PASSWORD
echo $GEMINI_API_KEY
echo $JWT_SECRET

# Set them if missing
export POSTGRES_PASSWORD="vaultcpa_secure_password_2024"
export GEMINI_API_KEY="AIzaSyAATadcL-l2ZBoLoWnCeEixbrV2PFM3POc"
export JWT_SECRET="your_jwt_secret_key_here"
```

## PostgreSQL Configuration Check
If authentication still fails, check PostgreSQL configuration:

```bash
# Check pg_hba.conf
sudo cat /etc/postgresql/*/main/pg_hba.conf | grep -v "^#"

# Look for lines like:
# local   all             all                                     md5
# host    all             all             127.0.0.1/32            md5
# host    all             all             ::1/128                 md5

# If using Docker, check container logs
docker logs vaultcpa-postgres-vps
```

## Testing the Fix
After applying any solution, test the connection:

```bash
# Test database connection
PGPASSWORD='vaultcpa_secure_password_2024' psql -h localhost -U vaultcpa_user -d vaultcpa -c "SELECT version();"

# Test Docker containers
docker-compose -f docker-compose.vps-fixed.yml ps
docker-compose -f docker-compose.vps-fixed.yml logs backend --tail=20
```

## Common Issues and Solutions

### Issue: "role vaultcpa_user does not exist"
**Solution**: Run the database setup script or manually create the user

### Issue: "database vaultcpa does not exist"
**Solution**: Create the database with proper ownership

### Issue: "permission denied for schema public"
**Solution**: Grant proper permissions to the user

### Issue: "password authentication failed"
**Solution**: Check password in environment variables and database user

### Issue: "connection refused"
**Solution**: Check if PostgreSQL is running and accessible

## Prevention
To prevent this issue in the future:

1. **Always use the fixed docker-compose file** (`docker-compose.vps-fixed.yml`)
2. **Set environment variables** before starting containers
3. **Use the database initialization scripts** provided
4. **Monitor container logs** during startup

## Quick Fix Commands
```bash
# Complete reset (WARNING: Deletes all data)
docker-compose -f docker-compose.vps.yml down -v
docker-compose -f docker-compose.vps-fixed.yml up -d

# Check status
docker-compose -f docker-compose.vps-fixed.yml ps
docker-compose -f docker-compose.vps-fixed.yml logs backend --tail=10
```
