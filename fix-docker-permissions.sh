#!/bin/bash

# Fix Docker Permission Issues
# Run with: bash fix-docker-permissions.sh

set -e

echo "=== Fixing Docker Permission Issues ==="
echo ""

PROBLEMATIC_CONTAINER="a2b34f48bdfb"

# 1. Kill the container process directly if it's running
echo "🔪 Step 1: Force killing container process..."
CONTAINER_PID=$(sudo docker inspect -f '{{.State.Pid}}' "$PROBLEMATIC_CONTAINER" 2>/dev/null || echo "")
if [ ! -z "$CONTAINER_PID" ] && [ "$CONTAINER_PID" != "0" ]; then
    echo "  Found container PID: $CONTAINER_PID"
    sudo kill -9 "$CONTAINER_PID" 2>/dev/null || echo "  Process may already be stopped"
fi

# 2. Stop all containers forcefully
echo "🛑 Step 2: Stopping all containers..."
sudo docker stop $(sudo docker ps -aq) 2>/dev/null || echo "Some containers may already be stopped"

# 3. Force kill the problematic container
echo "🔪 Step 3: Force killing problematic container..."
sudo docker kill "$PROBLEMATIC_CONTAINER" 2>/dev/null || echo "Container may already be stopped"

# 4. Remove problematic postgres containers (all variations)
echo "🗑️  Step 4: Removing problematic postgres containers..."
sudo docker rm -f "$PROBLEMATIC_CONTAINER" 2>/dev/null || echo "Container $PROBLEMATIC_CONTAINER may not exist or already removed"

# Remove all postgres containers
sudo docker ps -a --filter "name=vaultcpa-postgres" --format "{{.ID}}" | while read -r id; do
    [ ! -z "$id" ] && sudo docker rm -f "$id" 2>/dev/null || true
done

sudo docker ps -a --filter "name=postgres" --format "{{.ID}}" | while read -r id; do
    [ ! -z "$id" ] && sudo docker rm -f "$id" 2>/dev/null || true
done

# 5. Clean up docker-compose
echo "🧹 Step 5: Cleaning up docker-compose..."
sudo docker-compose down 2>/dev/null || echo "docker-compose down completed"

# 6. Remove orphaned containers
echo "🧹 Step 6: Removing orphaned containers..."
sudo docker container prune -f

# 7. Remove any containers in "Created" state
echo "🧹 Step 7: Removing containers in Created state..."
sudo docker ps -a --filter "status=created" --format "{{.ID}}" | while read -r id; do
    [ ! -z "$id" ] && sudo docker rm -f "$id" 2>/dev/null || true
done

# 8. Check for zombie containerd processes
echo "🔍 Step 8: Checking for zombie processes..."
sudo ps aux | grep -i containerd | grep -v grep | awk '{print $2}' | while read -r pid; do
    if [ ! -z "$pid" ]; then
        echo "  Found containerd process: $pid"
    fi
done

# 9. Restart Docker service
echo "🔄 Step 9: Restarting Docker service..."
sudo systemctl restart docker 2>/dev/null || echo "Docker service restart attempted"
sleep 3

# 10. Final attempt to remove the container
echo "🔪 Step 10: Final removal attempt..."
if sudo docker ps -a | grep -q "$PROBLEMATIC_CONTAINER"; then
    echo "  Container still exists, attempting final removal..."
    sudo docker kill "$PROBLEMATIC_CONTAINER" 2>/dev/null || true
    sudo docker rm -f "$PROBLEMATIC_CONTAINER" 2>/dev/null || true
    
    # If still exists, try removing by name
    sudo docker rm -f vaultcpa-postgres 2>/dev/null || true
fi

# 11. Verify removal
if sudo docker ps -a | grep -q "$PROBLEMATIC_CONTAINER"; then
    echo ""
    echo "⚠️  WARNING: Container $PROBLEMATIC_CONTAINER still exists!"
    echo "   This may require manual intervention or system reboot."
    echo "   Try: sudo docker rm -f $PROBLEMATIC_CONTAINER"
else
    echo ""
    echo "✅ Container successfully removed!"
fi

# 12. Clean up system
echo "🧹 Step 11: Cleaning up Docker system..."
sudo docker system prune -af --volumes 2>/dev/null || echo "System prune completed"

echo ""
echo "✅ Cleanup complete. You can now run:"
echo "   sudo docker-compose up -d"

