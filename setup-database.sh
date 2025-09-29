#!/bin/bash

# VaultCPA Database Setup Script
# This script sets up the PostgreSQL database with Docker

set -e

echo "🚀 Setting up VaultCPA Database with Docker..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Make init script executable
chmod +x init-db.sh

print_status "Starting PostgreSQL container..."

# Stop any existing containers
docker-compose down 2>/dev/null || true

# Start the database
docker-compose up -d postgres

print_status "Waiting for PostgreSQL to be ready..."

# Wait for PostgreSQL to be ready
max_attempts=30
attempt=1
while [ $attempt -le $max_attempts ]; do
    if docker-compose exec -T postgres pg_isready -U vaultcpa_user -d vaultcpa >/dev/null 2>&1; then
        print_success "PostgreSQL is ready!"
        break
    fi
    
    if [ $attempt -eq $max_attempts ]; then
        print_error "PostgreSQL failed to start within the expected time."
        exit 1
    fi
    
    print_status "Attempt $attempt/$max_attempts - waiting for PostgreSQL..."
    sleep 2
    ((attempt++))
done

# Start PgAdmin
print_status "Starting PgAdmin..."
docker-compose up -d pgadmin

# Wait a moment for PgAdmin to start
sleep 5

print_success "Database setup completed successfully!"
echo ""
echo "📊 Database Information:"
echo "  Database Name: vaultcpa"
echo "  Username: vaultcpa_user"
echo "  Password: vaultcpa_secure_password_2024"
echo "  Host: localhost"
echo "  Port: 5432"
echo ""
echo "🔧 PgAdmin Access:"
echo "  URL: http://localhost:8080"
echo "  Email: admin@vaultcpa.com"
echo "  Password: admin123"
echo ""
echo "📋 Connection Details for PgAdmin:"
echo "  Host: postgres (when connecting from PgAdmin)"
echo "  Port: 5432"
echo "  Database: vaultcpa"
echo "  Username: vaultcpa_user"
echo "  Password: vaultcpa_secure_password_2024"
echo ""
echo "🔍 Useful Commands:"
echo "  View logs: docker-compose logs -f postgres"
echo "  Stop database: docker-compose down"
echo "  Restart database: docker-compose restart postgres"
echo "  Access database: docker-compose exec postgres psql -U vaultcpa_user -d vaultcpa"
echo ""

# Test database connection
print_status "Testing database connection..."
if docker-compose exec -T postgres psql -U vaultcpa_user -d vaultcpa -c "SELECT version();" >/dev/null 2>&1; then
    print_success "Database connection test passed!"
else
    print_error "Database connection test failed!"
    exit 1
fi

# Show database status
print_status "Database Status:"
docker-compose ps

echo ""
print_success "🎉 VaultCPA Database is ready to use!"

