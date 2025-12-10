#!/bin/bash

# Server status and health check script
# Usage: bash server-status.sh

echo "📊 Server Status Report"
echo "========================"
echo ""

cd ~/financeocr 2>/dev/null || { echo "⚠️  Not in financeocr directory"; }

# Docker service status
echo "🐳 Docker Services:"
echo "-------------------"
sudo docker-compose ps
echo ""

# Service health checks
echo "🏥 Health Checks:"
echo "------------------"

# Check postgres
if sudo docker exec vaultcpa-postgres pg_isready -U vaultcpa_user -d vaultcpa > /dev/null 2>&1; then
    echo "✅ Postgres: Healthy"
else
    echo "❌ Postgres: Unhealthy"
fi

# Check backend
if curl -f http://localhost:3080/health > /dev/null 2>&1; then
    echo "✅ Backend: Healthy"
else
    echo "❌ Backend: Unhealthy"
fi

# Check frontend
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend: Healthy"
else
    echo "❌ Frontend: Unhealthy"
fi

# Check nginx
if curl -f http://localhost/health > /dev/null 2>&1; then
    echo "✅ Nginx: Healthy"
else
    echo "❌ Nginx: Unhealthy"
fi

echo ""

# Disk usage
echo "💾 Disk Usage:"
echo "--------------"
df -h / | tail -1
echo ""

# Docker disk usage
echo "🐳 Docker Disk Usage:"
echo "---------------------"
sudo docker system df
echo ""

# Recent errors
echo "⚠️  Recent Errors (last 10 lines):"
echo "-----------------------------------"
sudo docker-compose logs --tail=10 2>&1 | grep -i error || echo "No recent errors found"
echo ""

# Memory usage
echo "🧠 Memory Usage:"
echo "----------------"
free -h
echo ""

echo "✅ Status check complete!"

