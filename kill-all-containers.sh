#!/bin/bash

# Aggressive script to kill and remove ALL problematic containers
# Run with: sudo bash kill-all-containers.sh

set -e

echo "🔪 Aggressively removing ALL problematic containers..."
echo ""

# List of known problematic container IDs
PROBLEMATIC_CONTAINERS=(
    "a2b34f48bdfb"  # postgres
    "c733351705ee"  # pgadmin
)

# Get all containers with our naming pattern
ALL_CONTAINERS=$(docker ps -a --filter "name=vaultcpa" --format "{{.ID}}" 2>/dev/null || echo "")
ALL_CONTAINERS="$ALL_CONTAINERS $(docker ps -a --filter "name=postgres" --format "{{.ID}}" 2>/dev/null || echo "")"
ALL_CONTAINERS="$ALL_CONTAINERS $(docker ps -a --filter "name=pgadmin" --format "{{.ID}}" 2>/dev/null || echo "")"

# Combine all container IDs
ALL_IDS="$ALL_CONTAINERS ${PROBLEMATIC_CONTAINERS[@]}"

# Remove duplicates and empty entries
UNIQUE_IDS=$(echo $ALL_IDS | tr ' ' '\n' | grep -v '^$' | sort -u)

echo "Found containers to remove:"
echo "$UNIQUE_IDS" | while read id; do
    [ ! -z "$id" ] && echo "  - $id"
done
echo ""

# Function to aggressively remove a container
remove_container() {
    local CONTAINER_ID=$1
    local CONTAINER_NAME=$(docker inspect -f '{{.Name}}' $CONTAINER_ID 2>/dev/null | sed 's/\///' || echo "unknown")
    
    echo "🔪 Removing container: $CONTAINER_ID ($CONTAINER_NAME)"
    
    # Method 1: Normal stop
    docker stop $CONTAINER_ID 2>/dev/null || echo "  ⚠ Normal stop failed"
    
    # Method 2: Get PID and kill
    CONTAINER_PID=$(docker inspect -f '{{.State.Pid}}' $CONTAINER_ID 2>/dev/null || echo "")
    if [ ! -z "$CONTAINER_PID" ] && [ "$CONTAINER_PID" != "0" ]; then
        echo "  Killing PID: $CONTAINER_PID"
        kill -9 $CONTAINER_PID 2>/dev/null || true
        sleep 1
    fi
    
    # Method 3: Docker kill
    docker kill $CONTAINER_ID 2>/dev/null || echo "  ⚠ Docker kill failed"
    sleep 1
    
    # Method 4: Force remove
    docker rm -f $CONTAINER_ID 2>/dev/null || echo "  ⚠ Force remove failed"
    
    # Method 5: Sudo force remove
    sudo docker kill $CONTAINER_ID 2>/dev/null || true
    sudo docker rm -f $CONTAINER_ID 2>/dev/null || echo "  ⚠ Sudo remove failed"
    
    # Method 6: Find and kill containerd-shim
    ps aux | grep containerd-shim | grep "$CONTAINER_ID" | awk '{print $2}' | while read pid; do
        if [ ! -z "$pid" ]; then
            echo "  Killing containerd-shim PID: $pid"
            sudo kill -9 $pid 2>/dev/null || true
        fi
    done
}

# Remove all containers
echo "$UNIQUE_IDS" | while read container_id; do
    if [ ! -z "$container_id" ]; then
        remove_container "$container_id"
    fi
done

# Remove containers in problematic states
echo ""
echo "🧹 Removing containers in problematic states..."
docker ps -a --filter "status=created" --format "{{.ID}}" | while read id; do
    [ ! -z "$id" ] && sudo docker rm -f "$id" 2>/dev/null || true
done

docker ps -a --filter "status=exited" --format "{{.ID}}" | while read id; do
    [ ! -z "$id" ] && sudo docker rm -f "$id" 2>/dev/null || true
done

# Fix AppArmor if on Ubuntu
if command -v aa-remove-unknown &> /dev/null; then
    echo ""
    echo "🔧 Fixing AppArmor..."
    sudo aa-remove-unknown 2>/dev/null || true
fi

# Restart Docker daemon if containers still exist
REMAINING=$(docker ps -a --filter "name=vaultcpa" --format "{{.ID}}" 2>/dev/null | wc -l)
if [ "$REMAINING" -gt 0 ]; then
    echo ""
    echo "🔄 Restarting Docker daemon..."
    sudo systemctl stop docker
    sleep 2
    sudo systemctl start docker
    sleep 3
    
    # Try one more time
    echo "$UNIQUE_IDS" | while read container_id; do
        [ ! -z "$container_id" ] && sudo docker rm -f "$container_id" 2>/dev/null || true
    done
fi

# Final cleanup
echo ""
echo "🧹 Final cleanup..."
sudo docker container prune -f
sudo docker system prune -f

echo ""
echo "✅ Container removal complete!"

