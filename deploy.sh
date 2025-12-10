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

# Step 3: Fix Docker permissions (if needed)
echo -e "${YELLOW}Step 3: Checking for Docker permission issues...${NC}"
if [ -f "fix-docker-permissions.sh" ]; then
    chmod +x fix-docker-permissions.sh
    echo "  Running Docker permission fix..."
    sudo bash fix-docker-permissions.sh 2>/dev/null || echo "  No permission issues found"
fi
echo -e "${GREEN}✓ Docker permissions checked${NC}"
echo ""

# Step 4: Stop all services
echo -e "${YELLOW}Step 4: Stopping all services...${NC}"
sudo docker-compose down || echo "  Some services may already be stopped"
echo -e "${GREEN}✓ Services stopped${NC}"
echo ""

# Step 5: Remove problematic containers
echo -e "${YELLOW}Step 5: Cleaning up problematic containers...${NC}"
if [ -f "force-remove-containers.sh" ]; then
    chmod +x force-remove-containers.sh
    sudo bash force-remove-containers.sh 2>/dev/null || echo "  No problematic containers found"
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

# Step 8: Start all services
echo -e "${YELLOW}Step 8: Starting all services...${NC}"
sudo docker-compose up -d || { echo -e "${RED}Error: Failed to start services!${NC}"; exit 1; }
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

