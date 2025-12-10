#!/bin/bash

# Fix AppArmor profile for snap Docker Compose
# Usage: bash fix-snap-docker-compose.sh

set -e

echo "🔧 Fixing snap Docker Compose AppArmor profile..."
echo ""

# Step 1: Ensure snapd.apparmor service is enabled and started
echo "Step 1: Enabling and starting snapd.apparmor service..."
sudo systemctl enable snapd.apparmor.service
sudo systemctl start snapd.apparmor.service
sleep 2

# Verify service is running
if sudo systemctl is-active --quiet snapd.apparmor.service; then
    echo "✅ snapd.apparmor service is running"
else
    echo "❌ snapd.apparmor service failed to start"
    echo "   Attempting to restart..."
    sudo systemctl restart snapd.apparmor.service
    sleep 2
fi

# Step 2: Check if Docker Compose is installed via snap
echo ""
echo "Step 2: Checking Docker Compose installation..."
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose not found!"
    echo "   Installing docker-compose..."
    sudo apt-get update
    sudo apt-get install -y docker-compose
fi

DOCKER_COMPOSE_PATH=$(which docker-compose)
echo "  Docker Compose found at: $DOCKER_COMPOSE_PATH"

# Step 3: If installed via snap, configure AppArmor profile
if echo "$DOCKER_COMPOSE_PATH" | grep -q snap; then
    echo "  ⚠️  Docker Compose is installed via snap"
    echo ""
    echo "Step 3: Configuring AppArmor profile for snap.docker.compose..."
    
    # Check if profile directory exists
    if [ -d "/var/lib/snapd/apparmor/profiles" ]; then
        echo "  Found AppArmor profiles directory"
        
        # List available profiles
        echo "  Available snap AppArmor profiles:"
        ls -la /var/lib/snapd/apparmor/profiles/ | grep -E "docker|compose" || echo "    No docker/compose profiles found"
        
        # Try to load all snap profiles
        echo ""
        echo "  Loading all snap AppArmor profiles..."
        sudo apparmor_parser -r /var/lib/snapd/apparmor/profiles/* 2>/dev/null || echo "    Some profiles may have failed to load"
        
        # Specifically try docker-compose profile
        if [ -f "/var/lib/snapd/apparmor/profiles/snap.docker.compose" ]; then
            echo "  Loading snap.docker.compose profile..."
            sudo apparmor_parser -r /var/lib/snapd/apparmor/profiles/snap.docker.compose
            echo "✅ snap.docker.compose profile loaded"
        else
            echo "  ⚠️  snap.docker.compose profile not found"
            echo "     This may be normal if the profile hasn't been generated yet"
        fi
    else
        echo "  ⚠️  AppArmor profiles directory not found"
    fi
    
    # Step 4: Restart snapd.apparmor to regenerate profiles
    echo ""
    echo "Step 4: Restarting snapd.apparmor to regenerate profiles..."
    sudo systemctl restart snapd.apparmor.service
    sleep 3
    
    # Step 5: Verify profile is loaded
    echo ""
    echo "Step 5: Verifying AppArmor profiles..."
    if sudo aa-status 2>/dev/null | grep -q "snap.docker.compose"; then
        echo "✅ snap.docker.compose profile is loaded"
    else
        echo "⚠️  snap.docker.compose profile not found in aa-status"
        echo "   This may be normal - the profile will be loaded when needed"
    fi
else
    echo "  ℹ️  Docker Compose is not installed via snap (using standard installation)"
fi

# Step 6: Alternative - use docker compose (without hyphen) if available
echo ""
echo "Step 6: Checking for 'docker compose' (plugin version)..."
if docker compose version &> /dev/null; then
    echo "✅ 'docker compose' plugin is available"
    echo "   You can use 'docker compose' instead of 'docker-compose'"
    echo "   Example: docker compose up -d"
fi

# Step 7: Test docker-compose
echo ""
echo "Step 7: Testing docker-compose..."
if docker-compose version &> /dev/null; then
    echo "✅ docker-compose is working"
    docker-compose version
else
    echo "❌ docker-compose test failed"
    echo "   Try using: docker compose (without hyphen)"
fi

echo ""
echo "✅ Configuration complete!"
echo ""
echo "💡 Tip: If issues persist, try using 'docker compose' instead of 'docker-compose':"
echo "   docker compose up -d"

