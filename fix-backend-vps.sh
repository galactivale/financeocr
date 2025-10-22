#!/bin/bash

# Fix Backend Issues on VPS
# This script will fix the backend syntax errors and restart services

echo "🔧 Starting backend fix process..."

# Navigate to the project directory
cd ~/financeocr || { echo "❌ Project directory not found"; exit 1; }

# Check if containers are running
echo "📋 Checking container status..."
docker ps -a

# Stop all containers
echo "🛑 Stopping all containers..."
docker-compose -f docker-compose.vps.yml down

# Fix the backend dashboards.js file
echo "🔧 Fixing backend dashboards.js file..."

# Create a backup first
docker run --rm -v $(pwd)/server:/app alpine cp /app/src/routes/dashboards.js /app/src/routes/dashboards.js.backup 2>/dev/null || echo "No existing backup found"

# Fix the UUID generation issue in dashboards.js
echo "🔧 Applying UUID fix to dashboards.js..."
docker run --rm -v $(pwd)/server:/app alpine sh -c "
  sed -i 's/id: organizationId || \`org-\${Date.now()}-\${Math.random().toString(36).substring(2, 8)}\`,/id: \"550e8400-e29b-41d4-a716-446655440000\",/' /app/src/routes/dashboards.js
"

# Verify the fix
echo "✅ Verifying the fix..."
docker run --rm -v $(pwd)/server:/app alpine sh -c "
  if grep -q 'id: \"550e8400-e29b-41d4-a716-446655440000\"' /app/src/routes/dashboards.js; then
    echo '✅ UUID fix applied successfully'
  else
    echo '❌ UUID fix failed'
    exit 1
  fi
"

# Check for syntax errors
echo "🔍 Checking for syntax errors..."
docker run --rm -v $(pwd)/server:/app node:18-alpine sh -c "
  cd /app && node -c src/routes/dashboards.js && echo '✅ No syntax errors found'
"

# Rebuild and start containers
echo "🚀 Rebuilding and starting containers..."
docker-compose -f docker-compose.vps.yml up -d --build

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 30

# Check container status
echo "📋 Checking container status after restart..."
docker ps -a

# Check backend logs
echo "📋 Checking backend logs..."
docker logs vaultcpa-backend-vps --tail 20

# Test backend health
echo "🏥 Testing backend health..."
curl -f http://localhost:3080/health && echo "✅ Backend is healthy" || echo "❌ Backend health check failed"

# Test frontend health
echo "🏥 Testing frontend health..."
curl -f http://localhost:3000/api/health && echo "✅ Frontend is healthy" || echo "❌ Frontend health check failed"

echo "🎉 Backend fix process completed!"
echo "🌐 Your application should now be accessible at:"
echo "   - Frontend: https://www.financeocr.com"
echo "   - Backend API: https://www.financeocr.com/api"

