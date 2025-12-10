#!/bin/bash

# Script to resolve merge conflicts during git pull
# Usage: bash resolve-merge-conflict.sh [--discard-local]

set -e

DISCARD_LOCAL=false
if [ "$1" == "--discard-local" ]; then
    DISCARD_LOCAL=true
fi

echo "🔧 Resolving merge conflict..."
echo ""

cd ~/financeocr || { echo "Error: financeocr directory not found!"; exit 1; }

# Check if there are uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    if [ "$DISCARD_LOCAL" = true ]; then
        echo "🗑️  Discarding local changes..."
        git checkout -- .
        git clean -fd
        echo "✅ Local changes discarded"
    else
        echo "📦 Stashing local changes..."
        git stash push -m "Local changes before pull $(date +%Y-%m-%d_%H:%M:%S)"
        echo "✅ Changes stashed"
    fi
    echo ""
fi

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Check if stash has changes (only if we stashed, not discarded)
if [ "$DISCARD_LOCAL" = false ] && git stash list | grep -q "Local changes before pull"; then
    echo ""
    echo "⚠️  You had local changes that were stashed."
    echo "   To view stashed changes: git stash show"
    echo "   To apply stashed changes: git stash pop"
    echo "   To discard stashed changes: git stash drop"
fi

echo ""
echo "✅ Merge conflict resolved! Latest changes pulled."

