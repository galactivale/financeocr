#!/bin/bash

# Fix Docker Permission Issues
# Run with: bash fix-docker-permissions.sh

echo "=== Fixing Docker Permission Issues ==="
echo ""

# 1. Stop all containers forcefully
echo "🛑 Stopping all containers..."
sudo docker stop $(sudo docker ps -aq) 2>/dev/null || echo "Some containers may already be stopped"

# 2. Remove problematic postgres containers (all variations)
echo "🗑️  Removing problematic postgres containers..."
sudo docker rm -f a2b34f48bdfb 2>/dev/null || echo "Container a2b34f48bdfb may not exist"
sudo docker rm -f $(sudo docker ps -a --filter "name=vaultcpa-postgres" --format "{{.ID}}") 2>/dev/null || echo "No postgres containers found"
sudo docker rm -f $(sudo docker ps -a --filter "name=postgres" --format "{{.ID}}") 2>/dev/null || echo "No postgres containers found"

# 3. Clean up docker-compose
echo "🧹 Cleaning up docker-compose..."
sudo docker-compose down 2>/dev/null || echo "docker-compose down completed"

# 4. Remove orphaned containers
echo "🧹 Removing orphaned containers..."
sudo docker container prune -f

# 5. Remove any containers in "Created" state
echo "🧹 Removing containers in Created state..."
sudo docker ps -a --filter "status=created" --format "{{.ID}}" | xargs -r sudo docker rm -f 2>/dev/null || echo "No created containers to remove"

# 6. Restart Docker service (if needed)
echo "🔄 Checking Docker service..."
sudo systemctl restart docker 2>/dev/null || echo "Docker service restart attempted"

echo ""
echo "✅ Cleanup complete. You can now run:"
echo "   sudo docker-compose up -d"

