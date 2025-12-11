#!/bin/bash

# Script to check Docker version and environment differences

echo "=== Docker Version ==="
docker --version
docker version

echo ""
echo "=== Docker Compose Version ==="
docker compose version 2>/dev/null || docker-compose --version

echo ""
echo "=== Docker BuildKit Status ==="
echo "DOCKER_BUILDKIT: ${DOCKER_BUILDKIT:-not set}"
echo "COMPOSE_DOCKER_CLI_BUILD: ${COMPOSE_DOCKER_CLI_BUILD:-not set}"

echo ""
echo "=== Docker Info ==="
docker info | grep -E "Operating System|Architecture|Kernel Version|OSType|OS Version|Docker Root Dir"

echo ""
echo "=== Node.js Version (if available in container) ==="
docker run --rm node:18-alpine node --version 2>/dev/null || echo "Cannot check Node.js version"

echo ""
echo "=== Docker BuildKit Features ==="
docker buildx version 2>/dev/null || echo "buildx not available"

echo ""
echo "=== Checking for .dockerignore ==="
if [ -f .dockerignore ]; then
    echo ".dockerignore exists"
    echo "First 20 lines:"
    head -20 .dockerignore
else
    echo ".dockerignore not found"
fi

echo ""
echo "=== Package Manager Lock Files ==="
ls -la package-lock.json* 2>/dev/null || echo "No package-lock.json found"

echo ""
echo "=== Next.js Config ==="
if [ -f next.config.js ]; then
    echo "next.config.js exists"
    grep -E "output|standalone" next.config.js || echo "No output/standalone config found"
else
    echo "next.config.js not found"
fi

