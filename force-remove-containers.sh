#!/bin/bash

# Force remove problematic Docker containers and fix permissions
# This script aggressively removes containers that Docker can't stop normally

set -e

echo "🔧 Force removing problematic containers..."

# Container ID that's causing issues
PROBLEMATIC_CONTAINER="a2b34f48bdfb"

# Step 1: Try to stop with docker (may fail, that's OK)
echo "Step 1: Attempting normal stop..."
docker stop "$PROBLEMATIC_CONTAINER" 2>/dev/null || echo "  ⚠ Normal stop failed (expected)"

# Step 2: Force kill the container process if it exists
echo "Step 2: Force killing container process..."
CONTAINER_PID=$(docker inspect -f '{{.State.Pid}}' "$PROBLEMATIC_CONTAINER" 2>/dev/null || echo "")
if [ ! -z "$CONTAINER_PID" ] && [ "$CONTAINER_PID" != "0" ]; then
    echo "  Found PID: $CONTAINER_PID"
    kill -9 "$CONTAINER_PID" 2>/dev/null || echo "  ⚠ Kill failed (may already be stopped)"
fi

# Step 3: Use docker kill (more aggressive than stop)
echo "Step 3: Force killing with docker kill..."
docker kill "$PROBLEMATIC_CONTAINER" 2>/dev/null || echo "  ⚠ Docker kill failed"

# Step 4: Remove container forcefully (even if not stopped)
echo "Step 4: Force removing container..."
docker rm -f "$PROBLEMATIC_CONTAINER" 2>/dev/null || echo "  ⚠ Force remove failed, trying with sudo..."

# Step 5: If still failing, use sudo
if docker ps -a | grep -q "$PROBLEMATIC_CONTAINER"; then
    echo "Step 5: Using sudo to force remove..."
    sudo docker kill "$PROBLEMATIC_CONTAINER" 2>/dev/null || true
    sudo docker rm -f "$PROBLEMATIC_CONTAINER" 2>/dev/null || true
fi

# Step 6: Remove any other problematic postgres containers
echo "Step 6: Removing other problematic postgres containers..."
docker ps -a --filter "name=postgres" --format "{{.ID}}" | while read -r container_id; do
    if [ "$container_id" != "$PROBLEMATIC_CONTAINER" ]; then
        echo "  Removing container: $container_id"
        docker rm -f "$container_id" 2>/dev/null || sudo docker rm -f "$container_id" 2>/dev/null || true
    fi
done

# Step 7: Remove all containers in "Created" state
echo "Step 7: Removing containers in 'Created' state..."
docker ps -a --filter "status=created" --format "{{.ID}}" | while read -r container_id; do
    echo "  Removing created container: $container_id"
    docker rm -f "$container_id" 2>/dev/null || sudo docker rm -f "$container_id" 2>/dev/null || true
done

# Step 8: Prune all unused containers
echo "Step 8: Pruning unused containers..."
docker container prune -f

# Step 9: If still having issues, restart Docker daemon
if docker ps -a | grep -q "$PROBLEMATIC_CONTAINER"; then
    echo "Step 9: Container still exists, restarting Docker daemon..."
    sudo systemctl restart docker
    sleep 3
    
    # Try one more time after restart
    sudo docker rm -f "$PROBLEMATIC_CONTAINER" 2>/dev/null || true
fi

# Step 10: Verify removal
if docker ps -a | grep -q "$PROBLEMATIC_CONTAINER"; then
    echo "❌ ERROR: Container $PROBLEMATIC_CONTAINER still exists!"
    echo "   Manual intervention may be required."
    echo "   Try: sudo docker rm -f $PROBLEMATIC_CONTAINER"
    exit 1
else
    echo "✅ Successfully removed problematic container!"
fi

echo ""
echo "🧹 Cleaning up Docker system..."
docker system prune -af --volumes

echo ""
echo "✅ Cleanup complete! You can now run: docker-compose up -d"

