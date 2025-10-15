# Docker Setup for VaultCPA Dashboard

This document provides comprehensive instructions for running the VaultCPA Dashboard application using Docker.

## 🐳 Architecture Overview

The application consists of 4 main services:

- **Frontend**: Next.js application (Port 3000)
- **Backend**: Express.js API server (Port 5000)
- **Database**: PostgreSQL database (Port 5432)
- **PgAdmin**: Database administration tool (Port 8080)

## 📋 Prerequisites

- Docker Desktop installed and running
- Docker Compose v3.8+
- At least 4GB RAM available for Docker
- Ports 3000, 5000, 5432, and 8080 available

## 🚀 Quick Start

### Development Mode

```bash
# Clone the repository (if not already done)
git clone <repository-url>
cd nextui-dashboard

# Start all services in development mode
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

### Production Mode

```bash
# Start production services
docker-compose -f docker-compose.prod.yml up -d --build
```

## 🔧 Service Details

### Frontend (Next.js)
- **Container**: `vaultcpa-frontend`
- **Port**: 3000
- **URL**: http://localhost:3000
- **Features**: 
  - Hot reloading in development
  - Optimized production build
  - Standalone output for Docker

### Backend (Express.js)
- **Container**: `vaultcpa-backend`
- **Port**: 5000
- **URL**: http://localhost:5000
- **Features**:
  - Prisma ORM integration
  - Health check endpoint
  - Auto-restart on failure

### Database (PostgreSQL)
- **Container**: `vaultcpa-postgres`
- **Port**: 5432
- **Database**: vaultcpa
- **User**: vaultcpa_user
- **Password**: vaultcpa_secure_password_2024
- **Features**:
  - Automatic schema initialization
  - Health checks
  - Persistent data storage

### PgAdmin (Database Admin)
- **Container**: `vaultcpa-pgadmin`
- **Port**: 8080
- **URL**: http://localhost:8080
- **Login**: admin@vaultcpa.com / admin123
- **Features**:
  - Web-based database management
  - Pre-configured connection to PostgreSQL

## 🛠️ Development Commands

### Start Services
```bash
# Start all services
docker-compose up

# Start specific service
docker-compose up frontend
docker-compose up backend
docker-compose up postgres

# Start with rebuild
docker-compose up --build
```

### Stop Services
```bash
# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ This will delete all data)
docker-compose down -v
```

### View Logs
```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs frontend
docker-compose logs backend
docker-compose logs postgres

# Follow logs in real-time
docker-compose logs -f frontend
```

### Execute Commands
```bash
# Run commands in frontend container
docker-compose exec frontend npm run build
docker-compose exec frontend npm install

# Run commands in backend container
docker-compose exec backend npm run migrate
docker-compose exec backend npm run seed

# Access database shell
docker-compose exec postgres psql -U vaultcpa_user -d vaultcpa
```

## 🔒 Environment Variables

### Frontend Environment Variables
```bash
NODE_ENV=production
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Backend Environment Variables
```bash
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://vaultcpa_user:vaultcpa_secure_password_2024@postgres:5432/vaultcpa
JWT_SECRET=your_jwt_secret_key_here
CORS_ORIGIN=http://localhost:3000
```

### Database Environment Variables
```bash
POSTGRES_DB=vaultcpa
POSTGRES_USER=vaultcpa_user
POSTGRES_PASSWORD=vaultcpa_secure_password_2024
```

## 🏗️ Build Process

### Frontend Build
1. Multi-stage Docker build
2. Dependencies installation
3. Next.js build with standalone output
4. Optimized production image

### Backend Build
1. Dependencies installation
2. Prisma client generation
3. Production-ready Node.js image

## 🔍 Health Checks

All services include health checks:

- **Frontend**: HTTP check on port 3000
- **Backend**: HTTP check on `/health` endpoint
- **Database**: PostgreSQL readiness check

## 📊 Monitoring

### Service Status
```bash
# Check service status
docker-compose ps

# Check health status
docker-compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
```

### Resource Usage
```bash
# View resource usage
docker stats

# View specific container stats
docker stats vaultcpa-frontend vaultcpa-backend vaultcpa-postgres
```

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using the port
   netstat -tulpn | grep :3000
   
   # Kill process using port
   sudo kill -9 <PID>
   ```

2. **Database Connection Issues**
   ```bash
   # Check database logs
   docker-compose logs postgres
   
   # Restart database
   docker-compose restart postgres
   ```

3. **Build Failures**
   ```bash
   # Clean build cache
   docker-compose build --no-cache
   
   # Remove all containers and rebuild
   docker-compose down
   docker-compose up --build
   ```

4. **Permission Issues**
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   ```

### Reset Everything
```bash
# Stop all services and remove everything
docker-compose down -v --remove-orphans
docker system prune -a
docker-compose up --build
```

## 🚀 Production Deployment

### Using Production Compose
```bash
# Start production services
docker-compose -f docker-compose.prod.yml up -d

# Scale services (if needed)
docker-compose -f docker-compose.prod.yml up -d --scale backend=2
```

### Environment Variables for Production
Create a `.env` file with production values:
```bash
POSTGRES_PASSWORD=your_secure_password
JWT_SECRET=your_secure_jwt_secret
CORS_ORIGIN=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## 📝 Additional Notes

- The application uses Docker volumes for persistent data storage
- Health checks ensure services are ready before dependent services start
- All services are configured with automatic restart policies
- The frontend uses Next.js standalone output for optimal Docker performance
- Database schema is automatically initialized on first run

## 🔗 Useful Links

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **PgAdmin**: http://localhost:8080
- **Database**: localhost:5432

## 📞 Support

If you encounter any issues with the Docker setup, please check the logs first:
```bash
docker-compose logs
```

For additional help, refer to the main README.md or create an issue in the repository.
