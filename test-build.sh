#!/bin/bash

echo "🧪 Testing build locally before Docker deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check for missing dependencies
echo "🔍 Checking for missing dependencies..."
if ! npm list autoprefixer > /dev/null 2>&1; then
    echo "⚠️  autoprefixer not found, installing..."
    npm install autoprefixer --save-dev
fi

# Test Next.js build
echo "🏗️  Testing Next.js build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful! Ready for Docker deployment."
else
    echo "❌ Build failed. Please fix the errors above before deploying."
    exit 1
fi
