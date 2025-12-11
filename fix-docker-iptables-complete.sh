#!/bin/bash

# Complete fix for Docker iptables chain issues
# This creates the chains before Docker starts
# Usage: sudo bash fix-docker-iptables-complete.sh

set -e

echo "🔧 Complete Docker iptables fix..."
echo ""

# Step 1: Stop Docker
echo "Step 1: Stopping Docker..."
sudo systemctl stop docker
sleep 3

# Step 2: Flush and remove existing chains
echo "Step 2: Cleaning up existing iptables chains..."
sudo iptables -t filter -F DOCKER-ISOLATION-STAGE-1 2>/dev/null || true
sudo iptables -t filter -F DOCKER-ISOLATION-STAGE-2 2>/dev/null || true
sudo iptables -t filter -X DOCKER-ISOLATION-STAGE-1 2>/dev/null || true
sudo iptables -t filter -X DOCKER-ISOLATION-STAGE-2 2>/dev/null || true
sudo iptables -t filter -F DOCKER 2>/dev/null || true
sudo iptables -t filter -X DOCKER 2>/dev/null || true
sudo iptables -t nat -F DOCKER 2>/dev/null || true
sudo iptables -t nat -X DOCKER 2>/dev/null || true

# Step 3: Create the chains manually
echo "Step 3: Creating iptables chains..."
sudo iptables -t filter -N DOCKER-ISOLATION-STAGE-1
sudo iptables -t filter -N DOCKER-ISOLATION-STAGE-2
sudo iptables -t filter -N DOCKER
sudo iptables -t nat -N DOCKER

# Step 4: Add rules to the chains
echo "Step 4: Setting up chain rules..."
sudo iptables -t filter -A DOCKER-ISOLATION-STAGE-1 -j RETURN
sudo iptables -t filter -A DOCKER-ISOLATION-STAGE-2 -j RETURN
sudo iptables -t filter -A DOCKER -j RETURN
sudo iptables -t nat -A DOCKER -j RETURN

# Step 5: Insert chains into FORWARD chain
echo "Step 5: Inserting chains into FORWARD chain..."
# Remove existing rules if any
sudo iptables -t filter -D FORWARD -j DOCKER-ISOLATION-STAGE-1 2>/dev/null || true
# Insert at the beginning
sudo iptables -t filter -I FORWARD 1 -j DOCKER-ISOLATION-STAGE-1

# Step 6: Configure Docker daemon
echo "Step 6: Configuring Docker daemon..."
sudo mkdir -p /etc/docker

# Backup existing config
if [ -f /etc/docker/daemon.json ]; then
    sudo cp /etc/docker/daemon.json /etc/docker/daemon.json.backup.$(date +%Y%m%d_%H%M%S)
fi

# Create daemon.json with proper settings
cat <<EOF | sudo tee /etc/docker/daemon.json > /dev/null
{
  "iptables": true,
  "ip-forward": true,
  "bridge": "",
  "default-address-pools": [
    {
      "base": "172.17.0.0/16",
      "size": 24
    }
  ],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
EOF

echo "  Docker daemon configured"

# Step 7: Clean up Docker network files
echo "Step 7: Cleaning up Docker network files..."
sudo rm -rf /var/lib/docker/network/files 2>/dev/null || true

# Step 8: Start Docker
echo "Step 8: Starting Docker..."
sudo systemctl start docker
sleep 5

# Step 9: Verify Docker is running
if sudo systemctl is-active --quiet docker; then
    echo "✅ Docker is running"
else
    echo "❌ Docker failed to start"
    echo "   Checking logs..."
    sudo journalctl -u docker.service --no-pager -n 20
    exit 1
fi

# Step 10: Verify chains exist
echo "Step 10: Verifying iptables chains..."
if sudo iptables -t filter -L DOCKER-ISOLATION-STAGE-2 -n &>/dev/null; then
    echo "✅ DOCKER-ISOLATION-STAGE-2 chain exists"
else
    echo "⚠️  Chain still missing, recreating..."
    sudo iptables -t filter -N DOCKER-ISOLATION-STAGE-2
    sudo iptables -t filter -A DOCKER-ISOLATION-STAGE-2 -j RETURN
fi

# Step 11: Test network creation
echo "Step 11: Testing network creation..."
if sudo docker network create test-network 2>/dev/null; then
    echo "✅ Network creation test successful"
    sudo docker network rm test-network 2>/dev/null || true
else
    echo "❌ Network creation still failing"
    echo ""
    echo "Checking iptables chains:"
    sudo iptables -t filter -L DOCKER-ISOLATION-STAGE-1 -n || echo "  DOCKER-ISOLATION-STAGE-1 missing"
    sudo iptables -t filter -L DOCKER-ISOLATION-STAGE-2 -n || echo "  DOCKER-ISOLATION-STAGE-2 missing"
    exit 1
fi

echo ""
echo "✅ Docker iptables fix complete!"
echo ""
echo "You can now run:"
echo "  docker-compose up -d"

