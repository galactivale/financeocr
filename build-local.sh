#!/bin/bash

# Script to build and test the frontend Docker image locally

set -e

echo "=== Building Frontend Docker Image Locally ==="

# Enable BuildKit (should be enabled by default in Docker Desktop)
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

echo "DOCKER_BUILDKIT: ${DOCKER_BUILDKIT}"
echo "COMPOSE_DOCKER_CLI_BUILD: ${COMPOSE_DOCKER_CLI_BUILD}"

echo ""
echo "=== Building frontend image ==="
docker build -t financeocr-frontend:local -f Dockerfile .

echo ""
echo "=== Build completed successfully! ==="
echo ""
echo "=== Testing the image ==="
echo "Checking if server.js exists in the image..."

# Check if server.js exists in the built image
docker run --rm financeocr-frontend:local ls -la server.js 2>&1 || echo "WARNING: server.js not found"

echo ""
echo "=== Image details ==="
docker images financeocr-frontend:local

echo ""
echo "=== To run the container locally ==="
echo "docker run -p 3000:3000 financeocr-frontend:local"

