# Backend Railway Deployment Checklist ✅

## Pre-Deployment Checklist

- [ ] Railway CLI installed (`npm install -g @railway/cli`)
- [ ] Git repository initialized and committed
- [ ] Database (PostgreSQL) provisioned in Railway
- [ ] AI Service already deployed at: https://blockedlearning-production.up.railway.app/

## Deployment Steps

### 1. Create New Service in Railway
```bash
# Login to Railway
railway login

# Create new service from GitHub repo
# In Railway Dashboard: + New → GitHub Repo → Select Blocked_learning
```

### 2. Configure Service Settings ⚠️ CRITICAL

**In Railway Dashboard → Service Settings:**

| Setting | Value |
|---------|-------|
| **Root Directory** | `Backend` |
| Service Name | `backend` or `blockedlearning-backend` |
| Region | Same as AI service for better latency |

### 3. Set Environment Variables

**In Railway Dashboard → Variables:**

```bash
# Database
DATABASE_URL=${{Postgres.DATABASE_URL}}  # Link to your Postgres service

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# AI Service
AI_SERVICE_URL=https://blockedlearning-production.up.railway.app

# Optional Settings
NODE_ENV=production
PORT=3001
DEBUG=false
CORS_ORIGIN=*
```

### 4. Deploy

Railway will auto-deploy on push to main branch, or:
- Click **"Deploy"** button in Railway dashboard
- Or use CLI: `railway up` (from Backend directory)

### 5. Post-Deployment Verification

```bash
# Get your backend URL from Railway dashboard
BACKEND_URL="your-backend-url.up.railway.app"

# Test health endpoint
curl https://$BACKEND_URL/health

# Expected response:
# {
#   "status": "ok",
#   "timestamp": "2025-11-24T...",
#   "service": "BLOCKEDLEARNING Backend"
# }

# Test root endpoint
curl https://$BACKEND_URL/

# Test a protected endpoint (should require auth)
curl https://$BACKEND_URL/api/courses
```

## Configuration Files Summary

### ✅ Files Used by Railway

| File | Purpose | Location |
|------|---------|----------|
| `Dockerfile` | Multi-stage Node.js build | `Backend/Dockerfile` |
| `railway.json` | Railway configuration | `Backend/railway.json` |
| `package.json` | Dependencies & scripts | `Backend/package.json` |
| `tsconfig.json` | TypeScript config | `Backend/tsconfig.json` |

### ⚠️ Files NOT Used (Root Level - for AI Service)

- `/Dockerfile` → For AI service (Python)
- `/railway.json` → For AI service
- `/deploy-railway.sh` → For AI service

## Common Issues & Solutions

### Issue: Builds AI service instead of Backend
**Solution:** Set Root Directory to `Backend` in service settings

### Issue: Health check fails
**Solution:** Health endpoint is at `/health` (not `/api/health`)

### Issue: Database connection fails
**Solution:** Ensure DATABASE_URL is set and Postgres service is running

### Issue: TypeScript compilation errors
**Solution:** Check `tsconfig.json` and run `npm run build` locally first

### Issue: Missing dependencies
**Solution:** Ensure `package-lock.json` is committed to repo

## Architecture Overview

```
┌─────────────────────────────────────────┐
│         Railway Project                 │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────────────────────────┐  │
│  │  AI Service (Python/FastAPI)     │  │
│  │  • Root: AI/ or /                │  │
│  │  • Port: 8000                    │  │
│  │  • URL: blockedlearning-...     │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │  Backend Service (Node.js)       │  │
│  │  • Root: Backend/  ← SET THIS!   │  │
│  │  • Port: 3001                    │  │
│  │  • URL: [to be assigned]         │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │  PostgreSQL Database             │  │
│  │  • Linked to Backend service     │  │
│  └──────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

## Environment Variable Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | Yes | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | Yes | Secret key for JWT tokens | `your-secret-key-min-32-chars` |
| `AI_SERVICE_URL` | Yes | AI service endpoint | `https://blockedlearning-production.up.railway.app` |
| `NODE_ENV` | No | Node environment | `production` |
| `PORT` | No | Server port (Railway sets this) | `3001` |
| `DEBUG` | No | Enable debug logging | `false` |
| `CORS_ORIGIN` | No | Allowed CORS origins | `*` or `https://yourdomain.com` |

## Monitoring & Logs

```bash
# View deployment logs
railway logs

# View specific service logs (if multiple services)
railway logs -s backend

# Check service status
railway status

# Open Railway dashboard
railway open
```

## Rollback Procedure

If deployment fails:
1. Go to Railway Dashboard → Deployments
2. Find the last working deployment
3. Click "Redeploy" on that version

## Next Steps After Deployment

- [ ] Update Frontend with new Backend URL
- [ ] Test all API endpoints
- [ ] Set up custom domain (optional)
- [ ] Configure monitoring/alerts
- [ ] Document the Backend URL for team
