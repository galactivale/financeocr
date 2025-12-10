#!/bin/bash

# Disk Space Cleanup Script for FinanceOCR Server
# Run with: bash cleanup-disk-space.sh

echo "=== Disk Space Analysis ==="
echo ""

# 1. Check overall disk usage
echo "📊 Overall Disk Usage:"
df -h
echo ""

# 2. Check Docker disk usage
echo "🐳 Docker Disk Usage:"
docker system df
echo ""

# 3. Find large directories (top 10)
echo "📁 Largest Directories (top 10):"
du -h --max-depth=1 / 2>/dev/null | sort -rh | head -10
echo ""

# 4. Find large files (top 20)
echo "📄 Largest Files (top 20):"
find / -type f -size +100M 2>/dev/null | head -20
echo ""

# 5. Docker-specific cleanup (safe operations)
echo "🧹 Safe Docker Cleanup Options:"
echo ""
echo "To clean up Docker (run these manually):"
echo "  # Remove unused containers, networks, images (dangling)"
echo "  docker system prune -a"
echo ""
echo "  # Remove unused volumes (BE CAREFUL - this removes unused volumes)"
echo "  docker volume prune"
echo ""
echo "  # Remove all stopped containers"
echo "  docker container prune"
echo ""
echo "  # Remove unused images"
echo "  docker image prune -a"
echo ""
echo "  # Remove build cache"
echo "  docker builder prune -a"
echo ""

# 6. Check log file sizes
echo "📋 Log File Sizes:"
find /var/log -type f -size +10M 2>/dev/null | xargs ls -lh 2>/dev/null | head -10
echo ""

# 7. Check Docker logs
echo "🐳 Docker Container Logs:"
docker ps --format "{{.Names}}" | while read container; do
    size=$(docker inspect --format='{{.LogPath}}' $container 2>/dev/null | xargs ls -lh 2>/dev/null | awk '{print $5}')
    if [ ! -z "$size" ]; then
        echo "  $container: $size"
    fi
done
echo ""

echo "=== Cleanup Recommendations ==="
echo ""
echo "1. Clean Docker system: docker system prune -a"
echo "2. Clean Docker volumes (if safe): docker volume prune"
echo "3. Clean Docker build cache: docker builder prune -a"
echo "4. Clean old logs: journalctl --vacuum-time=7d"
echo "5. Clean apt cache: apt-get clean && apt-get autoclean"
echo ""

