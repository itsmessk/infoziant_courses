#!/bin/bash

# Exit on error
set -e

echo "🚀 Building Infoziant application..."

# Install dependencies
echo "📦 Installing server dependencies..."
npm install

# Install and build client
echo "📦 Installing client dependencies and building..."
cd client
npm install
npm run build
cd ..

echo "✅ Build completed successfully!"
echo "📋 Next steps:"
echo "   1. Set environment variables in .env"
echo "   2. Start the application with: npm start"
echo "   3. Or build Docker image with: docker build -t infoziant ." 