# VPS Deployment Guide (1GB RAM)

This guide provides instructions for deploying the VaultCPA Dashboard on a VPS with limited resources (1GB RAM).

## 🖥️ System Requirements

### Minimum Requirements:
- **RAM**: 1GB (1024MB)
- **CPU**: 1 vCPU
- **Storage**: 10GB SSD
- **OS**: Ubuntu 20.04+ or similar Linux distribution

### Recommended Requirements:
- **RAM**: 2GB (for better performance)
- **CPU**: 2 vCPU
- **Storage**: 20GB SSD

## 🚀 Quick VPS Setup

### 1. Server Preparation

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Logout and login again to apply docker group changes
```

### 2. Memory Optimization

```bash
# Create swap file (2GB)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make swap permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Optimize swappiness
echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
echo 'vm.vfs_cache_pressure=50' | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### 3. Deploy Application

```bash
# Clone repository
git clone <your-repo-url>
cd nextui-dashboard

# Create environment file
cat > .env << EOF
POSTGRES_PASSWORD=your_secure_password_here
JWT_SECRET=your_secure_jwt_secret_here
CORS_ORIGIN=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
EOF

# Start VPS-optimized services
docker-compose -f docker-compose.vps.yml up -d --build
```

## 📊 Memory Allocation

### VPS Configuration (1GB RAM):
- **PostgreSQL**: 300MB limit (200MB reserved)
- **Backend**: 400MB limit (300MB reserved)
- **Frontend**: 300MB limit (200MB reserved)
- **System + Docker**: ~200MB
- **Total**: ~1GB

### Memory Breakdown:
```
Total RAM: 1024MB
├── PostgreSQL: 300MB (30%)
├── Backend API: 400MB (40%)
├── Frontend: 300MB (30%)
├── System: 200MB (20%)
└── Buffer: 24MB (2%)
```

## ⚙️ Performance Optimizations

### 1. PostgreSQL Optimizations
```sql
-- Applied via docker-compose.vps.yml
shared_buffers = 128MB
effective_cache_size = 256MB
work_mem = 4MB
maintenance_work_mem = 64MB
max_connections = 50
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
```

### 2. Node.js Optimizations
```bash
# Memory limits set in containers
NODE_OPTIONS="--max-old-space-size=256"
```

### 3. Docker Optimizations
```bash
# Clean up unused resources
docker system prune -f

# Limit Docker daemon memory
echo '{"default-ulimits":{"memlock":{"Hard":-1,"Name":"memlock","Soft":-1}}}' | sudo tee /etc/docker/daemon.json
sudo systemctl restart docker
```

## 🔧 Monitoring & Maintenance

### Memory Monitoring
```bash
# Check memory usage
free -h
docker stats --no-stream

# Check swap usage
swapon --show
```

### Service Health
```bash
# Check service status
docker-compose -f docker-compose.vps.yml ps

# View logs
docker-compose -f docker-compose.vps.yml logs -f

# Check health endpoints
curl http://localhost:3000/api/health
curl http://localhost:5000/health
```

### Automatic Cleanup
```bash
# Create cleanup script
cat > cleanup.sh << 'EOF'
#!/bin/bash
# Clean up Docker resources
docker system prune -f
docker volume prune -f

# Clean up logs older than 7 days
find /var/log -name "*.log" -type f -mtime +7 -delete

# Clean up package cache
apt autoremove -y
apt autoclean
EOF

chmod +x cleanup.sh

# Add to crontab (run weekly)
echo "0 2 * * 0 /path/to/cleanup.sh" | crontab -
```

## 🚨 Troubleshooting

### High Memory Usage
```bash
# Check memory usage
docker stats --no-stream

# Restart services if needed
docker-compose -f docker-compose.vps.yml restart

# Check for memory leaks
docker-compose -f docker-compose.vps.yml logs | grep -i "out of memory"
```

### Slow Performance
```bash
# Check disk I/O
iostat -x 1

# Check CPU usage
top

# Optimize database
docker-compose -f docker-compose.vps.yml exec postgres psql -U vaultcpa_user -d vaultcpa -c "VACUUM ANALYZE;"
```

### Service Failures
```bash
# Check service logs
docker-compose -f docker-compose.vps.yml logs [service-name]

# Restart specific service
docker-compose -f docker-compose.vps.yml restart [service-name]

# Rebuild if needed
docker-compose -f docker-compose.vps.yml up -d --build [service-name]
```

## 🔒 Security Considerations

### 1. Firewall Setup
```bash
# Install UFW
sudo apt install ufw -y

# Configure firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 2. SSL/TLS Setup
```bash
# Install Certbot
sudo apt install certbot -y

# Get SSL certificate
sudo certbot certonly --standalone -d yourdomain.com

# Auto-renewal
echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -
```

### 3. Environment Security
```bash
# Secure environment file
chmod 600 .env
chown root:root .env
```

## 📈 Scaling Options

### If You Need More Performance:

1. **Upgrade VPS**:
   - 2GB RAM: Better performance
   - 4GB RAM: Optimal performance

2. **Database Optimization**:
   - Use external managed database (AWS RDS, DigitalOcean Managed DB)
   - Implement database connection pooling

3. **Caching**:
   - Add Redis for session storage
   - Implement CDN for static assets

4. **Load Balancing**:
   - Use Nginx as reverse proxy
   - Implement horizontal scaling

## 🎯 Performance Expectations

### 1GB RAM VPS:
- **Concurrent Users**: 10-20 users
- **Response Time**: 2-5 seconds
- **Database Queries**: Moderate performance
- **File Uploads**: Limited to small files

### 2GB RAM VPS:
- **Concurrent Users**: 50-100 users
- **Response Time**: 1-2 seconds
- **Database Queries**: Good performance
- **File Uploads**: Better handling

## 📞 Support

If you encounter issues with VPS deployment:

1. Check memory usage: `free -h`
2. Check service logs: `docker-compose -f docker-compose.vps.yml logs`
3. Monitor resource usage: `docker stats`
4. Review this guide for optimization tips

## 🔗 Useful Commands

```bash
# VPS-specific commands
make vps-deploy    # Deploy to VPS
make vps-logs      # View VPS logs
make vps-status    # Check VPS status
make vps-cleanup   # Clean up VPS resources

# Direct Docker commands
docker-compose -f docker-compose.vps.yml up -d
docker-compose -f docker-compose.vps.yml down
docker-compose -f docker-compose.vps.yml logs -f
```
