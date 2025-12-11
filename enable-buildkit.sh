#!/bin/bash

# Script to enable BuildKit on the server

echo "=== Enabling Docker BuildKit ==="

# Enable BuildKit for current session
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

# Make it permanent in bashrc
if ! grep -q "DOCKER_BUILDKIT=1" ~/.bashrc; then
    echo "" >> ~/.bashrc
    echo "# Enable Docker BuildKit" >> ~/.bashrc
    echo "export DOCKER_BUILDKIT=1" >> ~/.bashrc
    echo "export COMPOSE_DOCKER_CLI_BUILD=1" >> ~/.bashrc
    echo "✓ Added BuildKit to ~/.bashrc"
else
    echo "✓ BuildKit already in ~/.bashrc"
fi

# Also set in Docker daemon config (if needed)
if [ -f /etc/docker/daemon.json ]; then
    echo "✓ Docker daemon.json exists"
else
    echo "Creating /etc/docker/daemon.json with BuildKit enabled..."
    sudo mkdir -p /etc/docker
    echo '{"features":{"buildkit":true}}' | sudo tee /etc/docker/daemon.json
    echo "⚠ You may need to restart Docker: sudo systemctl restart docker"
fi

echo ""
echo "=== Current BuildKit Status ==="
echo "DOCKER_BUILDKIT: ${DOCKER_BUILDKIT:-not set}"
echo "COMPOSE_DOCKER_CLI_BUILD: ${COMPOSE_DOCKER_CLI_BUILD:-not set}"

echo ""
echo "=== Next Steps ==="
echo "1. Source the bashrc: source ~/.bashrc"
echo "2. Or restart your shell session"
echo "3. Rebuild: docker-compose build --no-cache frontend"
echo "4. Start: docker-compose up -d frontend"

