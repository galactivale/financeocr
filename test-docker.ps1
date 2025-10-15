# VaultCPA Docker Setup Test Script (PowerShell)

Write-Host "🐳 Testing VaultCPA Docker Setup..." -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

# Function to check if a service is running
function Test-Service {
    param(
        [string]$ServiceName,
        [string]$Url,
        [string]$ExpectedStatus
    )
    
    Write-Host "Checking $ServiceName... " -NoNewline
    
    try {
        $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 5
        if ($response.StatusCode -eq $ExpectedStatus) {
            Write-Host "✓ UP" -ForegroundColor Green
            return $true
        } else {
            Write-Host "✗ DOWN (Status: $($response.StatusCode))" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "✗ DOWN" -ForegroundColor Red
        return $false
    }
}

# Function to check database connection
function Test-Database {
    Write-Host "Checking Database... " -NoNewline
    
    try {
        $result = docker-compose exec -T postgres pg_isready -U vaultcpa_user -d vaultcpa 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ UP" -ForegroundColor Green
            return $true
        } else {
            Write-Host "✗ DOWN" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "✗ DOWN" -ForegroundColor Red
        return $false
    }
}

# Function to check container status
function Test-Container {
    param([string]$ContainerName)
    
    Write-Host "Checking $ContainerName container... " -NoNewline
    
    try {
        $result = docker-compose ps | Select-String $ContainerName | Select-String "Up"
        if ($result) {
            Write-Host "✓ RUNNING" -ForegroundColor Green
            return $true
        } else {
            Write-Host "✗ NOT RUNNING" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "✗ NOT RUNNING" -ForegroundColor Red
        return $false
    }
}

Write-Host ""
Write-Host "📋 Container Status:" -ForegroundColor Yellow
Write-Host "-------------------"
Test-Container "vaultcpa-frontend"
Test-Container "vaultcpa-backend"
Test-Container "vaultcpa-postgres"
Test-Container "vaultcpa-pgadmin"

Write-Host ""
Write-Host "🌐 Service Health Checks:" -ForegroundColor Yellow
Write-Host "------------------------"
Test-Service "Frontend" "http://localhost:3000/api/health" "200"
Test-Service "Backend" "http://localhost:5000/health" "200"
Test-Database

Write-Host ""
Write-Host "🔗 Service URLs:" -ForegroundColor Yellow
Write-Host "---------------"
Write-Host "Frontend: http://localhost:3000"
Write-Host "Backend API: http://localhost:5000"
Write-Host "PgAdmin: http://localhost:8080"
Write-Host "Database: localhost:5432"

Write-Host ""
Write-Host "📊 Docker Status:" -ForegroundColor Yellow
Write-Host "----------------"
docker-compose ps

Write-Host ""
Write-Host "💾 Disk Usage:" -ForegroundColor Yellow
Write-Host "-------------"
docker system df

Write-Host ""
Write-Host "🔍 Recent Logs (last 5 lines):" -ForegroundColor Yellow
Write-Host "-------------------------------"
Write-Host "Frontend logs:" -ForegroundColor Cyan
docker-compose logs --tail=5 frontend
Write-Host ""
Write-Host "Backend logs:" -ForegroundColor Cyan
docker-compose logs --tail=5 backend

Write-Host ""
Write-Host "Test completed!" -ForegroundColor Green
Write-Host "If any services are down, try running:" -ForegroundColor Yellow
Write-Host "  make restart"
Write-Host "  make logs"
Write-Host "  make health"
