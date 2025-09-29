@echo off
REM VaultCPA Database Setup Script for Windows
REM This script sets up the PostgreSQL database with Docker

echo 🚀 Setting up VaultCPA Database with Docker...

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

echo [INFO] Starting PostgreSQL container...

REM Stop any existing containers
docker-compose down 2>nul

REM Start the database
docker-compose up -d postgres

echo [INFO] Waiting for PostgreSQL to be ready...

REM Wait for PostgreSQL to be ready
set /a attempt=1
set /a max_attempts=30

:wait_loop
if %attempt% gtr %max_attempts% (
    echo [ERROR] PostgreSQL failed to start within the expected time.
    pause
    exit /b 1
)

docker-compose exec -T postgres pg_isready -U vaultcpa_user -d vaultcpa >nul 2>&1
if %errorlevel% equ 0 (
    echo [SUCCESS] PostgreSQL is ready!
    goto postgres_ready
)

echo [INFO] Attempt %attempt%/%max_attempts% - waiting for PostgreSQL...
timeout /t 2 /nobreak >nul
set /a attempt+=1
goto wait_loop

:postgres_ready

REM Start PgAdmin
echo [INFO] Starting PgAdmin...
docker-compose up -d pgadmin

REM Wait a moment for PgAdmin to start
timeout /t 5 /nobreak >nul

echo [SUCCESS] Database setup completed successfully!
echo.
echo 📊 Database Information:
echo   Database Name: vaultcpa
echo   Username: vaultcpa_user
echo   Password: vaultcpa_secure_password_2024
echo   Host: localhost
echo   Port: 5432
echo.
echo 🔧 PgAdmin Access:
echo   URL: http://localhost:8080
echo   Email: admin@vaultcpa.com
echo   Password: admin123
echo.
echo 📋 Connection Details for PgAdmin:
echo   Host: postgres (when connecting from PgAdmin)
echo   Port: 5432
echo   Database: vaultcpa
echo   Username: vaultcpa_user
echo   Password: vaultcpa_secure_password_2024
echo.
echo 🔍 Useful Commands:
echo   View logs: docker-compose logs -f postgres
echo   Stop database: docker-compose down
echo   Restart database: docker-compose restart postgres
echo   Access database: docker-compose exec postgres psql -U vaultcpa_user -d vaultcpa
echo.

REM Test database connection
echo [INFO] Testing database connection...
docker-compose exec -T postgres psql -U vaultcpa_user -d vaultcpa -c "SELECT version();" >nul 2>&1
if %errorlevel% equ 0 (
    echo [SUCCESS] Database connection test passed!
) else (
    echo [ERROR] Database connection test failed!
    pause
    exit /b 1
)

REM Show database status
echo [INFO] Database Status:
docker-compose ps

echo.
echo [SUCCESS] 🎉 VaultCPA Database is ready to use!
echo.
echo Press any key to continue...
pause >nul

