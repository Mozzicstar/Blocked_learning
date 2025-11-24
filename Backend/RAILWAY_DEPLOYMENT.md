# Backend Service - Railway Deployment Guide

## Issue
The root-level Dockerfile and railway.json are configured for the AI service, which causes Railway to deploy the AI service instead of the Backend service.

## Solution

### Step 1: Create New Service in Railway

1. Go to your Railway project dashboard
2. Click **"+ New"** → **"GitHub Repo"**
3. Select your `Blocked_learning` repository

### Step 2: Configure Root Directory

⚠️ **This is the critical step!**

1. Go to your new service's **Settings**
2. Find **"Root Directory"** setting
3. Set it to: `Backend`
4. Click **"Save"**

This tells Railway to:
- Use `Backend/Dockerfile` (not the root Dockerfile)
- Use `Backend/railway.json` (not the root railway.json)
- Build context is within the Backend folder

### Step 3: Set Environment Variables

In the Railway service **Variables** tab, add:

```bash
# Required
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_jwt_secret_key
AI_SERVICE_URL=https://blockedlearning-production.up.railway.app

# Optional
NODE_ENV=production
PORT=3001
```

### Step 4: Deploy

1. Railway will automatically deploy when you push to the main branch
2. Or manually trigger: **Deployments** → **Deploy**

### Step 5: Verify Deployment

Once deployed:
1. Get your Backend service URL from Railway dashboard
2. Test the health endpoint: `https://your-backend-url/api/health`
3. You should see: `{"status":"ok","service":"backend"}`

## Service Architecture

```
Railway Project:
├── AI Service (already deployed)
│   └── URL: https://blockedlearning-production.up.railway.app/
│   └── Root Directory: AI (or root with AI Dockerfile)
│
└── Backend Service (to be deployed)
    └── URL: https://your-backend-url.up.railway.app/
    └── Root Directory: Backend ← SET THIS!
```

## Build Configuration

The Backend service uses:
- **Dockerfile**: `Backend/Dockerfile` (multi-stage Node.js build)
- **Start Command**: `node dist/server.js`
- **Health Check**: `/api/health`
- **Port**: 3001

## Troubleshooting

### If Railway still deploys AI service:
1. Double-check **Root Directory** is set to `Backend` in Settings
2. Check **Build Command** is not overridden in Settings
3. Verify the deployment logs show TypeScript compilation, not Python

### If build fails:
1. Check that `package-lock.json` exists in Backend folder
2. Verify Node version is compatible (using Node 20 in Dockerfile)
3. Check environment variables are set

### If health check fails:
1. Ensure PORT environment variable matches what your app expects
2. Check that `/api/health` endpoint exists in your code
3. Review application logs for startup errors

## Commands for Local Testing

```bash
# Test the Docker build locally
cd Backend
docker build -t backend-test .
docker run -p 3001:3001 -e DATABASE_URL=your_db_url backend-test

# Test health endpoint
curl http://localhost:3001/api/health
```

## Links

- AI Service: https://blockedlearning-production.up.railway.app/
- Backend Service: (will be assigned after deployment)
- Railway Dashboard: https://railway.app
