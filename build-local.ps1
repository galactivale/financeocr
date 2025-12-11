# PowerShell script to build and test the frontend Docker image locally on Windows

Write-Host "=== Building Frontend Docker Image Locally ===" -ForegroundColor Green

# Enable BuildKit (should be enabled by default in Docker Desktop)
$env:DOCKER_BUILDKIT = "1"
$env:COMPOSE_DOCKER_CLI_BUILD = "1"

Write-Host "DOCKER_BUILDKIT: $env:DOCKER_BUILDKIT"
Write-Host "COMPOSE_DOCKER_CLI_BUILD: $env:COMPOSE_DOCKER_CLI_BUILD"

Write-Host ""
Write-Host "=== Building frontend image ===" -ForegroundColor Yellow
docker build -t financeocr-frontend:local -f Dockerfile .

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "=== Build completed successfully! ===" -ForegroundColor Green
    Write-Host ""
    Write-Host "=== Testing the image ===" -ForegroundColor Yellow
    Write-Host "Checking if server.js exists in the image..."
    
    # Check if server.js exists in the built image
    docker run --rm financeocr-frontend:local ls -la server.js 2>&1
    
    Write-Host ""
    Write-Host "=== Image details ===" -ForegroundColor Yellow
    docker images financeocr-frontend:local
    
    Write-Host ""
    Write-Host "=== To run the container locally ===" -ForegroundColor Cyan
    Write-Host "docker run -p 3000:3000 financeocr-frontend:local"
} else {
    Write-Host ""
    Write-Host "=== Build failed! ===" -ForegroundColor Red
    exit 1
}

