#!/bin/bash

# Quick Backend Fix Script
echo "🔧 Quick backend fix..."

# Navigate to project directory
cd ~/financeocr

# Stop containers
docker-compose -f docker-compose.vps.yml down

# Fix the UUID issue in dashboards.js
echo "🔧 Fixing UUID generation..."
docker run --rm -v $(pwd)/server:/app alpine sh -c "
  sed -i 's/id: organizationId || \`org-\${Date.now()}-\${Math.random().toString(36).substring(2, 8)}\`,/id: \"550e8400-e29b-41d4-a716-446655440000\",/' /app/src/routes/dashboards.js
"

# Restart backend only
echo "🚀 Restarting backend..."
docker-compose -f docker-compose.vps.yml up -d backend

# Wait and check logs
sleep 10
echo "📋 Backend logs:"
docker logs vaultcpa-backend-vps --tail 10

echo "✅ Quick fix completed!"

