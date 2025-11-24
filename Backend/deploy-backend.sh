#!/bin/bash

# Backend Service - Railway Deployment Helper
# This script helps verify your setup before deploying to Railway

set -e

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║   BLOCKEDLEARNING Backend - Railway Deployment Helper     ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Change to Backend directory
cd "$(dirname "$0")"
echo "📁 Working directory: $(pwd)"
echo ""

# Check required files
echo "🔍 Checking required files..."
FILES=("package.json" "package-lock.json" "Dockerfile" "railway.json" "tsconfig.json")
ALL_FILES_EXIST=true

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "  ${GREEN}✓${NC} $file"
    else
        echo -e "  ${RED}✗${NC} $file (MISSING!)"
        ALL_FILES_EXIST=false
    fi
done
echo ""

if [ "$ALL_FILES_EXIST" = false ]; then
    echo -e "${RED}❌ Some required files are missing!${NC}"
    exit 1
fi

# Check if Railway CLI is installed
echo "🔍 Checking Railway CLI..."
if command -v railway &> /dev/null; then
    echo -e "  ${GREEN}✓${NC} Railway CLI is installed"
    RAILWAY_VERSION=$(railway --version 2>&1 || echo "unknown")
    echo "    Version: $RAILWAY_VERSION"
else
    echo -e "  ${YELLOW}⚠${NC}  Railway CLI not found"
    echo "    Install with: npm install -g @railway/cli"
fi
echo ""

# Check Node.js version
echo "🔍 Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "  ${GREEN}✓${NC} Node.js $NODE_VERSION"
    
    # Check if version is 18 or higher
    MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$MAJOR_VERSION" -lt 18 ]; then
        echo -e "  ${YELLOW}⚠${NC}  Node.js 18+ recommended (using $NODE_VERSION)"
    fi
else
    echo -e "  ${RED}✗${NC} Node.js not found"
fi
echo ""

# Test TypeScript compilation
echo "🔨 Testing TypeScript compilation..."
if npm run build > /tmp/build.log 2>&1; then
    echo -e "  ${GREEN}✓${NC} TypeScript compilation successful"
    echo "    Build output: dist/"
else
    echo -e "  ${RED}✗${NC} TypeScript compilation failed"
    echo "    Check /tmp/build.log for details"
    tail -n 20 /tmp/build.log
    exit 1
fi
echo ""

# Check Docker (if available)
echo "🐳 Checking Docker..."
if command -v docker &> /dev/null; then
    echo -e "  ${GREEN}✓${NC} Docker is installed"
    
    # Offer to test Docker build
    read -p "  Would you like to test the Docker build? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "  Building Docker image (this may take a few minutes)..."
        if docker build -t backend-test . > /tmp/docker.log 2>&1; then
            echo -e "  ${GREEN}✓${NC} Docker build successful"
        else
            echo -e "  ${RED}✗${NC} Docker build failed"
            echo "    Check /tmp/docker.log for details"
            tail -n 30 /tmp/docker.log
            exit 1
        fi
    fi
else
    echo -e "  ${YELLOW}⚠${NC}  Docker not found (not required for Railway deployment)"
fi
echo ""

# Summary
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                      SUMMARY                              ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
echo "Your Backend service is ready for Railway deployment!"
echo ""
echo "Next steps:"
echo "  1. Go to Railway Dashboard: https://railway.app"
echo "  2. Create new service from GitHub repo"
echo "  3. ⚠️  IMPORTANT: Set Root Directory to 'Backend' in Settings"
echo "  4. Add environment variables:"
echo "     • DATABASE_URL"
echo "     • JWT_SECRET"
echo "     • AI_SERVICE_URL=https://blockedlearning-production.up.railway.app"
echo "  5. Deploy!"
echo ""
echo "For detailed instructions, see:"
echo "  • RAILWAY_DEPLOYMENT.md"
echo "  • DEPLOY_CHECKLIST.md"
echo ""
echo -e "${GREEN}✅ Pre-deployment checks complete!${NC}"
