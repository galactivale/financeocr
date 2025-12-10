#!/bin/bash

# Stop and remove ALL containers
# Usage: bash stop-all-containers.sh

set -e

echo "🛑 Stopping and removing ALL containers..."
echo ""

# Method 1: Stop all running containers
echo "Step 1: Stopping all running containers..."
sudo docker stop $(sudo docker ps -aq) 2>/dev/null || echo "  No running containers"

# Method 2: Remove all containers
echo "Step 2: Removing all containers..."
sudo docker rm -f $(sudo docker ps -aq) 2>/dev/null || echo "  No containers to remove"

# Method 3: Remove by name pattern (our containers)
echo "Step 3: Removing containers by name pattern..."
sudo docker ps -a --filter "name=vaultcpa" --format "{{.ID}}" | xargs -r sudo docker rm -f 2>/dev/null || true
sudo docker ps -a --filter "name=postgres" --format "{{.ID}}" | xargs -r sudo docker rm -f 2>/dev/null || true
sudo docker ps -a --filter "name=pgadmin" --format "{{.ID}}" | xargs -r sudo docker rm -f 2>/dev/null || true

# Method 4: Remove containers in problematic states
echo "Step 4: Removing containers in problematic states..."
sudo docker ps -a --filter "status=created" --format "{{.ID}}" | xargs -r sudo docker rm -f 2>/dev/null || true
sudo docker ps -a --filter "status=exited" --format "{{.ID}}" | xargs -r sudo docker rm -f 2>/dev/null || true

# Method 5: Prune all stopped containers
echo "Step 5: Pruning all stopped containers..."
sudo docker container prune -f

# Method 6: Use docker-compose down
echo "Step 6: Using docker-compose down..."
cd ~/financeocr 2>/dev/null && sudo docker-compose down --remove-orphans 2>/dev/null || echo "  docker-compose down completed"

echo ""
echo "✅ All containers stopped and removed!"

# Show remaining containers (if any)
REMAINING=$(sudo docker ps -aq | wc -l)
if [ "$REMAINING" -gt 0 ]; then
    echo ""
    echo "⚠️  Warning: $REMAINING container(s) still exist:"
    sudo docker ps -a
    echo ""
    echo "To force remove remaining containers, run:"
    echo "  sudo docker rm -f \$(sudo docker ps -aq)"
else
    echo ""
    echo "✅ No containers remaining!"
fi

