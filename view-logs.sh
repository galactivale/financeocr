#!/bin/bash

# View logs for services
# Usage: bash view-logs.sh [service-name] [lines]
# Example: bash view-logs.sh frontend 50

SERVICE=${1:-""}
LINES=${2:-100}

cd ~/financeocr 2>/dev/null || { echo "⚠️  Not in financeocr directory"; }

if [ -z "$SERVICE" ]; then
    echo "📋 All Services Logs (last $LINES lines):"
    echo "=========================================="
    echo ""
    echo "--- Frontend ---"
    sudo docker-compose logs --tail=$LINES frontend
    echo ""
    echo "--- Backend ---"
    sudo docker-compose logs --tail=$LINES backend
    echo ""
    echo "--- Postgres ---"
    sudo docker-compose logs --tail=$LINES postgres
    echo ""
    echo "--- Nginx ---"
    sudo docker-compose logs --tail=$LINES nginx
else
    echo "📋 $SERVICE Logs (last $LINES lines):"
    echo "====================================="
    sudo docker-compose logs --tail=$LINES $SERVICE
fi

