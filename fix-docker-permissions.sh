#!/bin/bash

# Fix Docker Permission Issues
# Run with: bash fix-docker-permissions.sh

echo "=== Fixing Docker Permission Issues ==="
echo ""

# 1. Stop all containers forcefully
echo "🛑 Stopping all containers..."
docker stop $(docker ps -aq) 2>/dev/null || echo "Some containers may already be stopped"

# 2. Remove the problematic container
echo "🗑️  Removing problematic containers..."
docker rm -f a2b34f48bdfb 2>/dev/null || echo "Container may not exist"
docker rm -f b0558ba4943e 2>/dev/null || echo "Container may not exist"

# 3. Clean up docker-compose
echo "🧹 Cleaning up docker-compose..."
docker-compose down 2>/dev/null || echo "docker-compose down completed"

# 4. Remove orphaned containers
echo "🧹 Removing orphaned containers..."
docker container prune -f

# 5. Restart Docker service (if needed)
echo "🔄 Checking Docker service..."
sudo systemctl restart docker 2>/dev/null || echo "Docker service restart attempted"

echo ""
echo "✅ Cleanup complete. You can now run:"
echo "   docker-compose up -d"

