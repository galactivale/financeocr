#!/bin/bash

# VaultCPA Docker Setup Test Script

echo "🐳 Testing VaultCPA Docker Setup..."
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if a service is running
check_service() {
    local service_name=$1
    local url=$2
    local expected_status=$3
    
    echo -n "Checking $service_name... "
    
    if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "$expected_status"; then
        echo -e "${GREEN}✓ UP${NC}"
        return 0
    else
        echo -e "${RED}✗ DOWN${NC}"
        return 1
    fi
}

# Function to check database connection
check_database() {
    echo -n "Checking Database... "
    
    if docker-compose exec -T postgres pg_isready -U vaultcpa_user -d vaultcpa > /dev/null 2>&1; then
        echo -e "${GREEN}✓ UP${NC}"
        return 0
    else
        echo -e "${RED}✗ DOWN${NC}"
        return 1
    fi
}

# Function to check container status
check_container() {
    local container_name=$1
    echo -n "Checking $container_name container... "
    
    if docker-compose ps | grep -q "$container_name.*Up"; then
        echo -e "${GREEN}✓ RUNNING${NC}"
        return 0
    else
        echo -e "${RED}✗ NOT RUNNING${NC}"
        return 1
    fi
}

echo ""
echo "📋 Container Status:"
echo "-------------------"
check_container "vaultcpa-frontend"
check_container "vaultcpa-backend"
check_container "vaultcpa-postgres"
check_container "vaultcpa-pgadmin"

echo ""
echo "🌐 Service Health Checks:"
echo "------------------------"
check_service "Frontend" "http://localhost:3000/api/health" "200"
check_service "Backend" "http://localhost:5000/health" "200"
check_database

echo ""
echo "🔗 Service URLs:"
echo "---------------"
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:5000"
echo "PgAdmin: http://localhost:8080"
echo "Database: localhost:5432"

echo ""
echo "📊 Docker Status:"
echo "----------------"
docker-compose ps

echo ""
echo "💾 Disk Usage:"
echo "-------------"
docker system df

echo ""
echo "🔍 Recent Logs (last 10 lines):"
echo "-------------------------------"
echo "Frontend logs:"
docker-compose logs --tail=5 frontend
echo ""
echo "Backend logs:"
docker-compose logs --tail=5 backend

echo ""
echo -e "${YELLOW}Test completed!${NC}"
echo "If any services are down, try running:"
echo "  make restart"
echo "  make logs"
echo "  make health"
