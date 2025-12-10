#!/bin/bash

# Script to resolve merge conflicts during git pull
# Usage: bash resolve-merge-conflict.sh

set -e

echo "🔧 Resolving merge conflict..."
echo ""

cd ~/financeocr || { echo "Error: financeocr directory not found!"; exit 1; }

# Check if there are uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "📦 Stashing local changes..."
    git stash push -m "Local changes before pull $(date +%Y-%m-%d_%H:%M:%S)"
    echo "✅ Changes stashed"
    echo ""
fi

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Check if stash has changes
if git stash list | grep -q "Local changes before pull"; then
    echo ""
    echo "⚠️  You had local changes that were stashed."
    echo "   To view stashed changes: git stash show"
    echo "   To apply stashed changes: git stash pop"
    echo "   To discard stashed changes: git stash drop"
fi

echo ""
echo "✅ Merge conflict resolved! Latest changes pulled."

