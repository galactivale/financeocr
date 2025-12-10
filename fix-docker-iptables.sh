#!/bin/bash

# Fix Docker iptables issues
# Usage: sudo bash fix-docker-iptables.sh

set -e

echo "🔧 Fixing Docker iptables issues..."
echo ""

# Step 1: Stop Docker
echo "Step 1: Stopping Docker..."
sudo systemctl stop docker
sleep 2

# Step 2: Flush iptables rules (be careful - this removes all rules)
echo "Step 2: Flushing iptables rules..."
sudo iptables -t filter -F DOCKER-ISOLATION-STAGE-1 2>/dev/null || true
sudo iptables -t filter -F DOCKER-ISOLATION-STAGE-2 2>/dev/null || true
sudo iptables -t filter -X DOCKER-ISOLATION-STAGE-1 2>/dev/null || true
sudo iptables -t filter -X DOCKER-ISOLATION-STAGE-2 2>/dev/null || true

# Step 3: Remove Docker's iptables rules
echo "Step 3: Removing Docker iptables chains..."
sudo iptables -t filter -F DOCKER 2>/dev/null || true
sudo iptables -t filter -X DOCKER 2>/dev/null || true
sudo iptables -t nat -F DOCKER 2>/dev/null || true
sudo iptables -t nat -X DOCKER 2>/dev/null || true

# Step 4: Clean up Docker networks
echo "Step 4: Cleaning up Docker networks..."
sudo docker network prune -f 2>/dev/null || true

# Step 5: Restart Docker (this will recreate iptables rules)
echo "Step 5: Restarting Docker..."
sudo systemctl start docker
sleep 5

# Step 6: Verify Docker is running
if sudo systemctl is-active --quiet docker; then
    echo "✅ Docker is running"
else
    echo "❌ Docker failed to start"
    exit 1
fi

# Step 7: Test network creation
echo "Step 7: Testing network creation..."
if sudo docker network create test-network 2>/dev/null; then
    echo "✅ Network creation test successful"
    sudo docker network rm test-network 2>/dev/null || true
else
    echo "⚠️  Network creation test failed, trying alternative fix..."
    
    # Alternative: Restart Docker with iptables=false temporarily
    echo "  Attempting alternative fix..."
    sudo systemctl stop docker
    
    # Backup Docker daemon.json if it exists
    if [ -f /etc/docker/daemon.json ]; then
        sudo cp /etc/docker/daemon.json /etc/docker/daemon.json.backup
    fi
    
    # Try to fix iptables by resetting Docker's network
    sudo rm -rf /var/lib/docker/network/files 2>/dev/null || true
    
    sudo systemctl start docker
    sleep 5
fi

echo ""
echo "✅ iptables fix complete!"
echo ""
echo "Try running docker-compose again:"
echo "  docker-compose up -d"

