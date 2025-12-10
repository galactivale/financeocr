#!/bin/bash

# Configure AppArmor for Docker compatibility
# Usage: bash configure-apparmor.sh

set -e

echo "🔧 Configuring AppArmor for Docker..."
echo ""

# Check if AppArmor is installed
if ! command -v aa-status &> /dev/null; then
    echo "⚠️  AppArmor is not installed. Installing..."
    sudo apt-get update
    sudo apt-get install -y apparmor apparmor-utils
fi

# Check AppArmor status
echo "📊 Checking AppArmor status..."
sudo aa-status 2>/dev/null || echo "  AppArmor status check"

# Enable and start snapd.apparmor service
echo ""
echo "🔧 Enabling snapd.apparmor service..."
sudo systemctl enable snapd.apparmor.service 2>/dev/null || echo "  Service may already be enabled"
sudo systemctl start snapd.apparmor.service 2>/dev/null || echo "  Service may already be running"

# Check service status
echo ""
echo "📊 Checking snapd.apparmor service status..."
if sudo systemctl is-active --quiet snapd.apparmor.service; then
    echo "✅ snapd.apparmor service is running"
else
    echo "⚠️  snapd.apparmor service is not running"
    echo "   Attempting to start..."
    sudo systemctl start snapd.apparmor.service
fi

if sudo systemctl is-enabled --quiet snapd.apparmor.service; then
    echo "✅ snapd.apparmor service is enabled"
else
    echo "⚠️  snapd.apparmor service is not enabled"
    echo "   Enabling..."
    sudo systemctl enable snapd.apparmor.service
fi

# Remove unknown AppArmor profiles that might interfere with Docker
echo ""
echo "🧹 Removing unknown AppArmor profiles..."
sudo aa-remove-unknown 2>/dev/null || echo "  No unknown profiles to remove"

# Check Docker AppArmor profile
echo ""
echo "🐳 Checking Docker AppArmor configuration..."
if sudo aa-status 2>/dev/null | grep -q docker; then
    echo "✅ Docker AppArmor profile found"
else
    echo "ℹ️  Docker AppArmor profile not found (this may be normal)"
fi

# Ensure AppArmor is in enforcing mode (not disabled)
echo ""
echo "📋 AppArmor status:"
sudo aa-status 2>/dev/null | head -5 || echo "  Status check"

# Restart Docker to ensure AppArmor changes take effect
echo ""
echo "🔄 Restarting Docker to apply AppArmor changes..."
sudo systemctl restart docker
sleep 3

# Verify Docker is running
if sudo systemctl is-active --quiet docker; then
    echo "✅ Docker is running"
else
    echo "❌ Docker failed to start"
    exit 1
fi

echo ""
echo "✅ AppArmor configuration complete!"
echo ""
echo "📝 Summary:"
echo "  - snapd.apparmor service: $(sudo systemctl is-active snapd.apparmor.service 2>/dev/null || echo 'unknown')"
echo "  - snapd.apparmor enabled: $(sudo systemctl is-enabled snapd.apparmor.service 2>/dev/null || echo 'unknown')"
echo "  - Docker service: $(sudo systemctl is-active docker 2>/dev/null || echo 'unknown')"

