#!/bin/bash

# Quick deployment script (without full rebuild)
# Usage: bash quick-deploy.sh

set -e

echo "⚡ Quick deployment (pulling changes and restarting)..."
echo ""

cd ~/financeocr || { echo "Error: financeocr directory not found!"; exit 1; }

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Restart services
echo "🔄 Restarting services..."
sudo docker-compose down
sudo docker-compose up -d

# Wait a moment
sleep 5

# Show status
echo ""
echo "📊 Service status:"
sudo docker-compose ps

echo ""
echo "✅ Quick deployment complete!"

