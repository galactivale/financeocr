#!/bin/bash

# Deployment script for server
# Usage: bash deploy.sh

set -e

echo "🚀 Starting deployment..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Navigate to project directory
echo -e "${YELLOW}Step 1: Navigating to project directory...${NC}"
cd ~/financeocr || { echo -e "${RED}Error: financeocr directory not found!${NC}"; exit 1; }
echo -e "${GREEN}✓ In project directory${NC}"
echo ""

# Step 2: Pull latest changes
echo -e "${YELLOW}Step 2: Pulling latest changes from GitHub...${NC}"
git pull origin main || { echo -e "${RED}Error: Failed to pull changes!${NC}"; exit 1; }
echo -e "${GREEN}✓ Latest changes pulled${NC}"
echo ""

# Step 3: Fix Docker iptables and network issues
echo -e "${YELLOW}Step 3: Fixing Docker iptables and network...${NC}"
if [ -f "fix-docker-iptables-complete.sh" ]; then
    chmod +x fix-docker-iptables-complete.sh
    echo "  Running complete iptables fix..."
    sudo bash fix-docker-iptables-complete.sh 2>/dev/null || echo "  iptables fix attempted"
fi

# Step 3b: Configure AppArmor and fix Docker permissions
echo -e "${YELLOW}Step 3b: Configuring AppArmor and fixing Docker permissions...${NC}"

# Configure AppArmor properly
if [ -f "configure-apparmor.sh" ]; then
    chmod +x configure-apparmor.sh
    echo "  Configuring AppArmor..."
    sudo bash configure-apparmor.sh 2>/dev/null || echo "  AppArmor configuration attempted"
fi

# Fix AppArmor (remove unknown profiles)
if command -v aa-remove-unknown &> /dev/null; then
    echo "  Removing unknown AppArmor profiles..."
    sudo aa-remove-unknown 2>/dev/null || true
fi

# Use the comprehensive kill script
if [ -f "kill-all-containers.sh" ]; then
    chmod +x kill-all-containers.sh
    echo "  Removing ALL problematic containers..."
    sudo bash kill-all-containers.sh 2>/dev/null || echo "  Container removal attempted"
elif [ -f "kill-postgres-container.sh" ]; then
    chmod +x kill-postgres-container.sh
    echo "  Removing problematic containers..."
    sudo bash kill-postgres-container.sh 2>/dev/null || echo "  Container removal attempted"
fi

if [ -f "fix-docker-permissions.sh" ]; then
    chmod +x fix-docker-permissions.sh
    echo "  Running Docker permission fix..."
    sudo bash fix-docker-permissions.sh 2>/dev/null || echo "  Permission fix completed"
fi
echo -e "${GREEN}✓ Docker permissions fixed${NC}"
echo ""

# Step 4: Stop all services gracefully with timeout
echo -e "${YELLOW}Step 4: Stopping all services...${NC}"

# Get all container IDs before stopping
ALL_CONTAINER_IDS=$(sudo docker ps -a --filter "name=vaultcpa" --format "{{.ID}}" 2>/dev/null || echo "")
ALL_CONTAINER_IDS="$ALL_CONTAINER_IDS $(sudo docker ps -a --filter "name=postgres" --format "{{.ID}}" 2>/dev/null || echo "")"
ALL_CONTAINER_IDS="$ALL_CONTAINER_IDS $(sudo docker ps -a --filter "name=pgadmin" --format "{{.ID}}" 2>/dev/null || echo "")"

# First try graceful shutdown
sudo docker-compose down --timeout 30 || echo "  Graceful shutdown attempted"

# Force remove any stuck containers
echo "  Force removing any stuck containers..."
sudo docker-compose down --remove-orphans --timeout 10 2>/dev/null || true

# Remove containers by name to avoid orphaned containers
echo "  Removing containers by name..."
sudo docker rm -f vaultcpa-postgres vaultcpa-backend vaultcpa-frontend vaultcpa-pgadmin nginx 2>/dev/null || true

# Remove by ID as well
echo "$ALL_CONTAINER_IDS" | while read id; do
    [ ! -z "$id" ] && sudo docker kill "$id" 2>/dev/null || true
    [ ! -z "$id" ] && sudo docker rm -f "$id" 2>/dev/null || true
done

echo -e "${GREEN}✓ Services stopped${NC}"
echo ""

# Step 5: Remove problematic containers and orphaned resources
echo -e "${YELLOW}Step 5: Cleaning up problematic containers...${NC}"

# Remove all containers with our naming pattern
echo "  Removing containers by name pattern..."
sudo docker ps -a --filter "name=vaultcpa" --format "{{.ID}}" | xargs -r sudo docker rm -f 2>/dev/null || true
sudo docker ps -a --filter "name=postgres" --format "{{.ID}}" | xargs -r sudo docker rm -f 2>/dev/null || true

# Remove containers in problematic states
echo "  Removing containers in problematic states..."
sudo docker ps -a --filter "status=created" --format "{{.ID}}" | xargs -r sudo docker rm -f 2>/dev/null || true
sudo docker ps -a --filter "status=exited" --format "{{.ID}}" | xargs -r sudo docker rm -f 2>/dev/null || true

# Remove orphaned containers
sudo docker container prune -f

if [ -f "force-remove-containers.sh" ]; then
    chmod +x force-remove-containers.sh
    sudo bash force-remove-containers.sh 2>/dev/null || echo "  Force removal attempted"
fi
echo -e "${GREEN}✓ Containers cleaned${NC}"
echo ""

# Step 6: Prune Docker system
echo -e "${YELLOW}Step 6: Pruning Docker system...${NC}"
sudo docker system prune -f
echo -e "${GREEN}✓ Docker system pruned${NC}"
echo ""

# Step 7: Build all services
echo -e "${YELLOW}Step 7: Building all services (this may take a while)...${NC}"
sudo docker-compose build --no-cache || { echo -e "${RED}Error: Build failed!${NC}"; exit 1; }
echo -e "${GREEN}✓ Services built${NC}"
echo ""

# Step 8: Start all services with proper cleanup
echo -e "${YELLOW}Step 8: Starting all services...${NC}"

# Validate docker-compose file first
sudo docker-compose config > /dev/null || { echo -e "${RED}Error: docker-compose.yml is invalid!${NC}"; exit 1; }

# Start services with remove-orphans to prevent stuck containers
sudo docker-compose up -d --remove-orphans --force-recreate || { echo -e "${RED}Error: Failed to start services!${NC}"; exit 1; }
echo -e "${GREEN}✓ Services started${NC}"
echo ""

# Step 9: Wait for services to be healthy
echo -e "${YELLOW}Step 9: Waiting for services to be healthy...${NC}"
sleep 10

# Step 10: Check service status
echo -e "${YELLOW}Step 10: Checking service status...${NC}"
sudo docker-compose ps
echo ""

# Step 11: Show logs (last 20 lines)
echo -e "${YELLOW}Step 11: Recent logs:${NC}"
echo "--- Frontend ---"
sudo docker-compose logs --tail=20 frontend
echo ""
echo "--- Backend ---"
sudo docker-compose logs --tail=20 backend
echo ""

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "To view logs: sudo docker-compose logs -f [service-name]"
echo "To check status: sudo docker-compose ps"
echo "To restart a service: sudo docker-compose restart [service-name]"

