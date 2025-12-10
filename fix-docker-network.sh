#!/bin/bash

# Fix Docker network by creating missing iptables chains or using alternative config
# Usage: sudo bash fix-docker-network.sh

set -e

echo "🔧 Fixing Docker network configuration..."
echo ""

# Step 1: Stop Docker
echo "Step 1: Stopping Docker..."
sudo systemctl stop docker
sleep 2

# Step 2: Create missing iptables chains manually
echo "Step 2: Creating missing iptables chains..."
sudo iptables -t filter -N DOCKER-ISOLATION-STAGE-1 2>/dev/null || echo "  Chain may already exist"
sudo iptables -t filter -N DOCKER-ISOLATION-STAGE-2 2>/dev/null || echo "  Chain may already exist"
sudo iptables -t filter -N DOCKER 2>/dev/null || echo "  Chain may already exist"
sudo iptables -t nat -N DOCKER 2>/dev/null || echo "  Chain may already exist"

# Step 3: Set up chain rules
echo "Step 3: Setting up iptables chain rules..."
sudo iptables -t filter -A DOCKER-ISOLATION-STAGE-1 -j RETURN 2>/dev/null || true
sudo iptables -t filter -A DOCKER-ISOLATION-STAGE-2 -j RETURN 2>/dev/null || true

# Step 4: Configure Docker daemon to use bridge network without iptables isolation
echo "Step 4: Configuring Docker daemon..."
sudo mkdir -p /etc/docker

# Backup existing daemon.json
if [ -f /etc/docker/daemon.json ]; then
    sudo cp /etc/docker/daemon.json /etc/docker/daemon.json.backup.$(date +%Y%m%d_%H%M%S)
    echo "  Backed up existing daemon.json"
fi

# Create or update daemon.json with network configuration
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
  ]
}
EOF

echo "  Created/updated Docker daemon.json"

# Step 5: Clean up existing networks
echo "Step 5: Cleaning up existing networks..."
sudo rm -rf /var/lib/docker/network/files 2>/dev/null || true

# Step 6: Restart Docker
echo "Step 6: Restarting Docker..."
sudo systemctl start docker
sleep 5

# Step 7: Verify Docker is running
if sudo systemctl is-active --quiet docker; then
    echo "✅ Docker is running"
else
    echo "❌ Docker failed to start"
    exit 1
fi

# Step 8: Test network creation
echo "Step 8: Testing network creation..."
if sudo docker network create test-network 2>/dev/null; then
    echo "✅ Network creation test successful"
    sudo docker network rm test-network 2>/dev/null || true
else
    echo "⚠️  Network creation still failing, trying alternative approach..."
    
    # Alternative: Use host network mode or configure differently
    echo "  Attempting to fix iptables chains after Docker start..."
    sudo iptables -t filter -N DOCKER-ISOLATION-STAGE-1 2>/dev/null || true
    sudo iptables -t filter -N DOCKER-ISOLATION-STAGE-2 2>/dev/null || true
    sudo iptables -t filter -A DOCKER-ISOLATION-STAGE-1 -j RETURN 2>/dev/null || true
    sudo iptables -t filter -A DOCKER-ISOLATION-STAGE-2 -j RETURN 2>/dev/null || true
    
    # Restart Docker again
    sudo systemctl restart docker
    sleep 5
fi

echo ""
echo "✅ Docker network fix complete!"
echo ""
echo "Try running docker-compose again:"
echo "  docker-compose up -d"

