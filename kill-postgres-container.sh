#!/bin/bash

# Aggressive script to kill and remove the problematic postgres container
# Run with: sudo bash kill-postgres-container.sh

set -e

CONTAINER_ID="a2b34f48bdfb"

echo "🔪 Aggressively removing container: $CONTAINER_ID"
echo ""

# Method 1: Try normal stop and remove
echo "Method 1: Normal stop..."
docker stop $CONTAINER_ID 2>/dev/null || echo "  Normal stop failed (expected)"
docker rm -f $CONTAINER_ID 2>/dev/null || echo "  Normal remove failed"

# Method 2: Get container PID and kill it directly
echo "Method 2: Killing container process..."
CONTAINER_PID=$(docker inspect -f '{{.State.Pid}}' $CONTAINER_ID 2>/dev/null || echo "")
if [ ! -z "$CONTAINER_PID" ] && [ "$CONTAINER_PID" != "0" ]; then
    echo "  Found PID: $CONTAINER_PID"
    kill -9 $CONTAINER_PID 2>/dev/null || echo "  Kill failed"
    sleep 1
fi

# Method 3: Use docker kill
echo "Method 3: Docker kill..."
docker kill $CONTAINER_ID 2>/dev/null || echo "  Docker kill failed"
sleep 1

# Method 4: Force remove with sudo
echo "Method 4: Force remove with sudo..."
sudo docker kill $CONTAINER_ID 2>/dev/null || echo "  Sudo kill failed"
sudo docker rm -f $CONTAINER_ID 2>/dev/null || echo "  Sudo remove failed"

# Method 5: Find and kill containerd-shim process
echo "Method 5: Killing containerd-shim processes..."
CONTAINER_NAME=$(docker inspect -f '{{.Name}}' $CONTAINER_ID 2>/dev/null | sed 's/\///' || echo "")
if [ ! -z "$CONTAINER_NAME" ]; then
    echo "  Container name: $CONTAINER_NAME"
    # Find containerd-shim processes for this container
    ps aux | grep containerd-shim | grep "$CONTAINER_ID" | awk '{print $2}' | while read pid; do
        if [ ! -z "$pid" ]; then
            echo "  Killing containerd-shim PID: $pid"
            sudo kill -9 $pid 2>/dev/null || true
        fi
    done
fi

# Method 6: Restart Docker daemon
if docker ps -a | grep -q "$CONTAINER_ID"; then
    echo "Method 6: Restarting Docker daemon..."
    sudo systemctl stop docker
    sleep 2
    sudo systemctl start docker
    sleep 3
    
    # Try again after restart
    echo "  Attempting removal after Docker restart..."
    sudo docker rm -f $CONTAINER_ID 2>/dev/null || echo "  Still failed after restart"
fi

# Method 7: Remove by name if ID doesn't work
echo "Method 7: Removing by container name..."
sudo docker ps -a --filter "id=$CONTAINER_ID" --format "{{.ID}}" | while read id; do
    [ ! -z "$id" ] && sudo docker rm -f "$id" 2>/dev/null || true
done

# Method 8: Remove all postgres containers
echo "Method 8: Removing all postgres containers..."
sudo docker ps -a --filter "name=postgres" --format "{{.ID}}" | while read id; do
    if [ "$id" == "$CONTAINER_ID" ] || [ ! -z "$id" ]; then
        echo "  Removing container: $id"
        sudo docker kill "$id" 2>/dev/null || true
        sudo docker rm -f "$id" 2>/dev/null || true
    fi
done

# Method 9: Use docker system prune
echo "Method 9: Pruning stopped containers..."
sudo docker container prune -f

# Final check
if docker ps -a | grep -q "$CONTAINER_ID"; then
    echo ""
    echo "❌ ERROR: Container $CONTAINER_ID still exists!"
    echo ""
    echo "Last resort options:"
    echo "1. Reboot the server: sudo reboot"
    echo "2. Manually remove from Docker's filesystem (risky):"
    echo "   sudo systemctl stop docker"
    echo "   sudo rm -rf /var/lib/docker/containers/$CONTAINER_ID"
    echo "   sudo systemctl start docker"
    exit 1
else
    echo ""
    echo "✅ Container $CONTAINER_ID successfully removed!"
fi

