#!/bin/bash
# Script to manually apply the generated_dashboards migration if it's missing

set -e

echo "🔄 Applying missing generated_dashboards table migration..."

# Check if backend container is running
if ! docker ps | grep -q vaultcpa-backend; then
    echo "❌ Backend container is not running. Please start it first with:"
    echo "   docker-compose up -d backend"
    exit 1
fi

# Check if table already exists
echo "🔍 Checking if generated_dashboards table exists..."
TABLE_EXISTS=$(docker-compose exec -T postgres psql -U vaultcpa_user -d vaultcpa -tAc "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'generated_dashboards');" | tr -d '[:space:]')

if [ "$TABLE_EXISTS" = "t" ]; then
    echo "✅ Table 'generated_dashboards' already exists!"
    echo "📝 Marking migration as applied..."
    docker-compose exec backend npx prisma migrate resolve --applied 20251022_add_generated_dashboards
    echo "✅ Migration marked as applied!"
else
    echo "📋 Table 'generated_dashboards' does not exist. Creating it..."
    
    # Read the migration SQL file
    MIGRATION_FILE="server/prisma/migrations/20251022_add_generated_dashboards/migration.sql"
    
    if [ ! -f "$MIGRATION_FILE" ]; then
        echo "❌ Migration file not found: $MIGRATION_FILE"
        exit 1
    fi
    
    # Apply the migration SQL directly
    echo "🚀 Applying migration SQL..."
    docker-compose exec -T postgres psql -U vaultcpa_user -d vaultcpa < "$MIGRATION_FILE"
    
    if [ $? -eq 0 ]; then
        echo "✅ Table created successfully!"
        echo "📝 Marking migration as applied..."
        docker-compose exec backend npx prisma migrate resolve --applied 20251022_add_generated_dashboards
        echo "✅ Migration completed and marked as applied!"
    else
        echo "❌ Failed to apply migration SQL"
        exit 1
    fi
fi

echo ""
echo "🔄 Regenerating Prisma client..."
docker-compose exec backend npx prisma generate

echo "✅ All done! The generated_dashboards table should now be available."

