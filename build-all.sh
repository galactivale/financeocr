#!/bin/bash

# Build All Services Script
# Run with: bash build-all.sh

echo "=== Building All FinanceOCR Services ==="
echo ""

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Stop all services
echo "🛑 Stopping all services..."
docker-compose down

# Build all services with no cache
echo "🔨 Building all services (this may take a while)..."
docker-compose build --no-cache

# Start all services
echo "🚀 Starting all services..."
docker-compose up -d

# Show status
echo ""
echo "📊 Service Status:"
docker-compose ps

# Show logs
echo ""
echo "📋 Recent logs (last 20 lines of each service):"
echo ""
echo "--- Backend Logs ---"
docker-compose logs --tail=20 backend
echo ""
echo "--- Frontend Logs ---"
docker-compose logs --tail=20 frontend
echo ""
echo "--- Postgres Logs ---"
docker-compose logs --tail=20 postgres
echo ""

echo "✅ Build complete!"
echo ""
echo "To watch logs in real-time:"
echo "  docker-compose logs -f"

