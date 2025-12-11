#!/bin/bash
# Script to run Prisma migrations in production

set -e

echo "🔄 Running Prisma migrations..."

# Generate Prisma client first
echo "📦 Generating Prisma client..."
npx prisma generate

# Run migrations
echo "🚀 Applying database migrations..."
npx prisma migrate deploy

echo "✅ Migrations completed successfully!"

