# Fix VPS Database Authentication Issue - PowerShell Version
# This script helps set up the PostgreSQL database with correct credentials

Write-Host "🔧 Fixing VPS Database Authentication Issue" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# Check if PostgreSQL service is running
$postgresService = Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue
if (-not $postgresService) {
    Write-Host "❌ PostgreSQL service not found. Please install PostgreSQL first." -ForegroundColor Red
    exit 1
}

if ($postgresService.Status -ne "Running") {
    Write-Host "📦 Starting PostgreSQL service..." -ForegroundColor Yellow
    Start-Service -Name $postgresService.Name
    Set-Service -Name $postgresService.Name -StartupType Automatic
}

Write-Host "🔍 PostgreSQL service status: $($postgresService.Status)" -ForegroundColor Green

# Set environment variables for PostgreSQL
$env:PGPASSWORD = "vaultcpa_secure_password_2024"

# Create the database and user
Write-Host "🗄️  Setting up database and user..." -ForegroundColor Yellow

$sqlCommands = @"
-- Drop existing user and database if they exist
DROP DATABASE IF EXISTS vaultcpa;
DROP USER IF EXISTS vaultcpa_user;

-- Create user with password
CREATE USER vaultcpa_user WITH PASSWORD 'vaultcpa_secure_password_2024';

-- Create database
CREATE DATABASE vaultcpa OWNER vaultcpa_user;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE vaultcpa TO vaultcpa_user;
"@

try {
    # Execute SQL commands
    $sqlCommands | psql -U postgres -h localhost
    
    # Connect to the new database and set up schema privileges
    $schemaCommands = @"
\c vaultcpa
GRANT ALL ON SCHEMA public TO vaultcpa_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO vaultcpa_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO vaultcpa_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO vaultcpa_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO vaultcpa_user;
"@
    
    $schemaCommands | psql -U postgres -h localhost
    
    Write-Host "✅ Database and user created successfully!" -ForegroundColor Green
}
catch {
    Write-Host "❌ Failed to create database and user: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test the connection
Write-Host "🧪 Testing database connection..." -ForegroundColor Yellow
try {
    $testResult = psql -h localhost -U vaultcpa_user -d vaultcpa -c "SELECT version();" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Database connection test successful!" -ForegroundColor Green
        Write-Host $testResult -ForegroundColor Gray
    } else {
        Write-Host "❌ Database connection test failed" -ForegroundColor Red
        Write-Host $testResult -ForegroundColor Red
    }
}
catch {
    Write-Host "❌ Database connection test failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🔧 If authentication still fails, you may need to:" -ForegroundColor Yellow
Write-Host "1. Update pg_hba.conf to allow password authentication" -ForegroundColor White
Write-Host "2. Restart PostgreSQL service" -ForegroundColor White
Write-Host "3. Check firewall settings" -ForegroundColor White

Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Restart PostgreSQL service if needed" -ForegroundColor White
Write-Host "2. Test connection again" -ForegroundColor White
Write-Host "3. Start your Docker containers" -ForegroundColor White

Write-Host ""
Write-Host "🎉 Database setup complete!" -ForegroundColor Green
