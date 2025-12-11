#!/bin/bash

# Script to check frontend container logs and diagnose issues

echo "=== Frontend Container Status ==="
docker ps -a | grep vaultcpa-frontend

echo ""
echo "=== Recent Frontend Logs (last 50 lines) ==="
docker logs --tail 50 vaultcpa-frontend 2>&1

echo ""
echo "=== Checking if server.js exists in container ==="
docker exec vaultcpa-frontend ls -la server.js 2>&1 || echo "server.js not found!"

echo ""
echo "=== Checking .next/standalone directory ==="
docker exec vaultcpa-frontend ls -la .next/standalone 2>&1 || echo ".next/standalone not found!"

echo ""
echo "=== Checking if build completed successfully ==="
docker exec vaultcpa-frontend ls -la .next/static 2>&1 || echo ".next/static not found!"

echo ""
echo "=== Container Exit Code ==="
docker inspect vaultcpa-frontend --format='{{.State.ExitCode}}' 2>&1

echo ""
echo "=== Container Error (if any) ==="
docker inspect vaultcpa-frontend --format='{{.State.Error}}' 2>&1

