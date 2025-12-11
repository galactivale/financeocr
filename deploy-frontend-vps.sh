#!/bin/bash

# Script to deploy frontend on VPS
# Run this on your VPS server

set -e

echo "=== Deploying Frontend on VPS ==="

# Navigate to project directory
cd ~/financeocr || { echo "ERROR: ~/financeocr directory not found!"; exit 1; }

# Pull latest changes
echo "=== Pulling latest changes from GitHub ==="
git pull origin main

# Enable BuildKit
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

# Stop existing frontend container
echo "=== Stopping existing frontend container ==="
docker-compose stop frontend || true
docker-compose rm -f frontend || true

# Build frontend with no cache
echo "=== Building frontend (this may take several minutes) ==="
docker-compose build --no-cache frontend

# Start frontend
echo "=== Starting frontend container ==="
docker-compose up -d frontend

# Show logs
echo "=== Frontend logs (last 50 lines) ==="
docker-compose logs --tail 50 frontend

echo ""
echo "=== Deployment complete! ==="
echo "Check status with: docker-compose ps frontend"
echo "View logs with: docker-compose logs -f frontend"

