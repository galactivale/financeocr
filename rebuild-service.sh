#!/bin/bash

# Rebuild a specific service
# Usage: bash rebuild-service.sh [service-name]
# Example: bash rebuild-service.sh frontend

set -e

if [ -z "$1" ]; then
    echo "Usage: bash rebuild-service.sh [service-name]"
    echo "Available services: frontend, backend, postgres, pgadmin, nginx"
    exit 1
fi

SERVICE=$1

echo "🔨 Rebuilding service: $SERVICE"
echo ""

cd ~/financeocr || { echo "Error: financeocr directory not found!"; exit 1; }

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Stop the service
echo "🛑 Stopping $SERVICE..."
sudo docker-compose stop $SERVICE

# Remove the service container
echo "🗑️  Removing $SERVICE container..."
sudo docker-compose rm -f $SERVICE

# Rebuild the service
echo "🔨 Rebuilding $SERVICE..."
sudo docker-compose build --no-cache $SERVICE

# Start the service
echo "🚀 Starting $SERVICE..."
sudo docker-compose up -d $SERVICE

# Wait and check status
sleep 5
echo ""
echo "📊 $SERVICE status:"
sudo docker-compose ps $SERVICE

echo ""
echo "📋 Recent logs:"
sudo docker-compose logs --tail=30 $SERVICE

echo ""
echo "✅ $SERVICE rebuild complete!"

