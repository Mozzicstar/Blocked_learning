#!/bin/bash

# Railway Deployment Script
# This script helps you deploy to Railway

set -e

echo "╔════════════════════════════════════════════════════╗"
echo "║   BLOCKEDLEARNING AI - Railway Deployment Script   ║"
echo "╚════════════════════════════════════════════════════╝"
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

echo "✅ Railway CLI found"
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "❌ Git repository not initialized"
    echo "Please run: git init && git add . && git commit -m 'Initial commit'"
    exit 1
fi

echo "✅ Git repository found"
echo ""

# Login to Railway
echo "🔐 Logging into Railway..."
railway login
echo ""

# Navigate to AI directory
echo "📁 Navigating to AI directory..."
cd AI
echo ""

# Link/create Railway project
echo "🔗 Linking to Railway project (or creating new one)..."
railway link
echo ""

# Add environment variables
echo "⚙️  Setting up environment variables..."
echo "Please ensure these variables are set in Railway dashboard:"
echo "  • GEMINI_API_KEY (your API key)"
echo "  • DEBUG=false (for production)"
echo "  • RATE_LIMIT_PER_MINUTE=10"
echo ""

read -p "Have you set up the environment variables? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Please set up environment variables in Railway dashboard first"
    exit 1
fi

echo ""
echo "🚀 Deploying to Railway..."
railway up

echo ""
echo "✅ Deployment in progress! Monitor at: https://railway.app"
echo ""
echo "View logs with: railway logs -s ai-service"
echo "Get service URL with: railway status"
