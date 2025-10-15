#!/bin/bash

# Memory monitoring script for VPS deployment

echo "🖥️  VPS Memory Monitor"
echo "====================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Function to check memory usage
check_memory() {
    echo "📊 System Memory Usage:"
    echo "----------------------"
    free -h
    
    echo ""
    echo "🐳 Docker Container Memory:"
    echo "--------------------------"
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}"
    
    echo ""
    echo "💾 Disk Usage:"
    echo "-------------"
    df -h /
    
    echo ""
    echo "🔄 Swap Usage:"
    echo "-------------"
    swapon --show
    
    echo ""
    echo "📈 Memory Pressure:"
    echo "------------------"
    if [ -f /proc/pressure/memory ]; then
        cat /proc/pressure/memory
    else
        echo "Memory pressure info not available"
    fi
}

# Function to check if memory is critical
check_critical() {
    # Get memory usage percentage
    MEMORY_USAGE=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100.0}')
    
    if [ "$MEMORY_USAGE" -gt 90 ]; then
        echo -e "${RED}⚠️  CRITICAL: Memory usage is ${MEMORY_USAGE}%${NC}"
        echo "Recommendations:"
        echo "1. Restart services: make vps-down && make vps"
        echo "2. Clean up Docker: docker system prune -f"
        echo "3. Check for memory leaks in logs"
        return 1
    elif [ "$MEMORY_USAGE" -gt 80 ]; then
        echo -e "${YELLOW}⚠️  WARNING: Memory usage is ${MEMORY_USAGE}%${NC}"
        echo "Consider monitoring more closely"
        return 0
    else
        echo -e "${GREEN}✅ Memory usage is healthy: ${MEMORY_USAGE}%${NC}"
        return 0
    fi
}

# Main execution
if [ "$1" = "--watch" ]; then
    echo "Watching memory usage (press Ctrl+C to stop)..."
    while true; do
        clear
        check_memory
        check_critical
        echo ""
        echo "Last updated: $(date)"
        echo "Press Ctrl+C to stop monitoring"
        sleep 30
    done
else
    check_memory
    check_critical
fi
