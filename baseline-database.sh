#!/bin/bash
# Script to baseline an existing database and apply missing migrations

set -e

echo "🔄 Baseling database and applying migrations..."

# Check if backend container is running
if ! docker ps | grep -q vaultcpa-backend; then
    echo "❌ Backend container is not running. Please start it first with:"
    echo "   docker-compose up -d backend"
    exit 1
fi

echo "📦 Generating Prisma client..."
docker-compose exec backend npx prisma generate

echo "🔍 Checking migration status..."
docker-compose exec backend npx prisma migrate status

echo ""
echo "📋 Available migrations:"
ls -la server/prisma/migrations/ | grep -E "^d" | awk '{print $NF}'

echo ""
echo "🚀 Attempting to apply migrations..."
echo "   (This will create missing tables without affecting existing data)"

# Try to deploy migrations (this will apply only missing ones)
docker-compose exec backend npx prisma migrate deploy || {
    echo ""
    echo "⚠️  Migration deploy failed. This might mean the database needs to be baselined."
    echo ""
    echo "🔧 Option 1: Mark all existing migrations as applied (if tables already exist)"
    echo "   Run: docker-compose exec backend npx prisma migrate resolve --applied 20251022_add_generated_dashboards"
    echo ""
    echo "🔧 Option 2: Create the missing table manually"
    echo "   The migration SQL is in: server/prisma/migrations/20251022_add_generated_dashboards/migration.sql"
    echo ""
    echo "🔧 Option 3: Reset and reapply (⚠️  WARNING: This will delete all data)"
    echo "   Run: docker-compose exec backend npx prisma migrate reset"
    exit 1
}

echo "✅ Migrations completed successfully!"

