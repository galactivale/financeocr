#!/bin/bash
# Script to run database migrations on the backend container

set -e

echo "🔄 Running database migrations..."

# Check if backend container is running
if ! docker ps | grep -q vaultcpa-backend; then
    echo "❌ Backend container is not running. Please start it first with:"
    echo "   docker-compose up -d backend"
    exit 1
fi

# Run migrations inside the backend container
echo "📦 Generating Prisma client..."
docker-compose exec backend npx prisma generate

echo "🚀 Applying database migrations..."
docker-compose exec backend npx prisma migrate deploy

echo "✅ Migrations completed successfully!"

