#!/bin/bash

echo "🔧 Fixing Docker build issues..."

# 1. Test local build first
echo "📦 Testing local build..."
npm install

# Check if autoprefixer is installed
if ! npm list autoprefixer > /dev/null 2>&1; then
    echo "Installing autoprefixer..."
    npm install autoprefixer --save-dev
fi

# Test build
echo "🏗️  Testing Next.js build..."
if npm run build; then
    echo "✅ Local build successful!"
else
    echo "❌ Local build failed. Please fix errors first."
    exit 1
fi

# 2. Clean up any existing containers
echo "🧹 Cleaning up existing containers..."
docker-compose -f docker-compose.vps.yml down 2>/dev/null || true
docker system prune -f

# 3. Build with fixed Dockerfile
echo "🐳 Building with fixed Dockerfile..."
docker build -f Dockerfile.fixed -t vaultcpa-frontend-fixed .

if [ $? -eq 0 ]; then
    echo "✅ Docker build successful!"
    
    # 4. Update docker-compose to use fixed image
    echo "📝 Updating docker-compose configuration..."
    cat > docker-compose.fixed.yml << 'EOF'
version: '3.8'

services:
  # Database
  postgres:
    image: postgres:15-alpine
    container_name: vaultcpa-postgres-fixed
    environment:
      POSTGRES_DB: vaultcpa
      POSTGRES_USER: vaultcpa_user
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-vaultcpa_secure_password_2024}
      POSTGRES_INITDB_ARGS: "--encoding=UTF-8 --lc-collate=C --lc-ctype=C"
      POSTGRES_SHARED_BUFFERS: 128MB
      POSTGRES_EFFECTIVE_CACHE_SIZE: 256MB
      POSTGRES_WORK_MEM: 4MB
      POSTGRES_MAINTENANCE_WORK_MEM: 64MB
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./vaultcpa_schema.sql:/docker-entrypoint-initdb.d/01-schema.sql
      - ./init-db.sh:/docker-entrypoint-initdb.d/02-init.sh
    networks:
      - vaultcpa-network
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 300M
        reservations:
          memory: 200M
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U vaultcpa_user -d vaultcpa"]
      interval: 30s
      timeout: 10s
      retries: 3

  # Backend API Server
  backend:
    build:
      context: ./server
      dockerfile: Dockerfile.vps
    container_name: vaultcpa-backend-fixed
    environment:
      NODE_ENV: production
      PORT: 5000
      DATABASE_URL: postgresql://vaultcpa_user:${POSTGRES_PASSWORD:-vaultcpa_secure_password_2024}@postgres:5432/vaultcpa
      JWT_SECRET: ${JWT_SECRET:-your_jwt_secret_key_here}
      CORS_ORIGIN: ${CORS_ORIGIN:-https://financeocr.com}
      NODE_OPTIONS: "--max-old-space-size=256"
    ports:
      - "5000:5000"
    networks:
      - vaultcpa-network
    depends_on:
      postgres:
        condition: service_healthy
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 400M
        reservations:
          memory: 300M
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:5000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # Frontend Next.js App (using fixed image)
  frontend:
    image: vaultcpa-frontend-fixed
    container_name: vaultcpa-frontend-fixed
    environment:
      NODE_ENV: production
      NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL:-https://financeocr.com}
      NEXT_PUBLIC_APP_URL: ${NEXT_PUBLIC_APP_URL:-https://financeocr.com}
      NODE_OPTIONS: "--max-old-space-size=256"
    ports:
      - "3000:3000"
    networks:
      - vaultcpa-network
    depends_on:
      backend:
        condition: service_healthy
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 300M
        reservations:
          memory: 200M
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

volumes:
  postgres_data:
    driver: local

networks:
  vaultcpa-network:
    driver: bridge
EOF

    echo "🚀 Starting services with fixed configuration..."
    docker-compose -f docker-compose.fixed.yml up -d
    
    echo "✅ Deployment complete!"
    echo "🌐 Your application should be available at: http://localhost:3000"
    echo "📊 API should be available at: http://localhost:5000"
    
else
    echo "❌ Docker build failed. Please check the errors above."
    exit 1
fi
