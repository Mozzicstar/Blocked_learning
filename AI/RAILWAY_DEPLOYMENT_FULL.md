# 🚀 BLOCKEDLEARNING AI - Complete Railway Deployment Guide

Deploy the BLOCKEDLEARNING AI service to Railway in 5 minutes!

## Table of Contents

1. [Quick Start](#quick-start)
2. [Prerequisites](#prerequisites)
3. [Step-by-Step Guide](#step-by-step-guide)
4. [Environment Variables](#environment-variables)
5. [Testing](#testing)
6. [Monitoring](#monitoring)
7. [Troubleshooting](#troubleshooting)
8. [Advanced Configuration](#advanced-configuration)

---

## Quick Start

**Already familiar with Railway? Deploy in 3 steps:**

```bash
# 1. Push code to GitHub
git add . && git commit -m "Railway deployment" && git push

# 2. Create Railway project and connect GitHub repo
# Visit: https://railway.app → New Project → Deploy from GitHub

# 3. Add environment variables and Redis
# In Railway dashboard: Variables + Add Redis service

Done! Your service will be live in 2-3 minutes.
```

---

## Prerequisites

You need:

1. **GitHub Account** - For connecting repository
2. **Railway Account** - Free tier available at https://railway.app
3. **Gemini API Key** - Get from https://aistudio.google.com/app/apikey
4. **Code Pushed to GitHub** - Repository accessible from Railway

### Optional

- Railway CLI: `npm install -g @railway/cli`
- curl or Postman for testing endpoints

---

## Step-by-Step Guide

### Step 1: Prepare Your Code

Ensure your code is committed and pushed to GitHub:

```bash
cd /workspaces/Blocked_learning
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

**What Railway needs:**
- ✅ `Dockerfile` - For building container
- ✅ `requirements.txt` - Python dependencies
- ✅ `main.py` - Application entry point
- ✅ `.dockerignore` - Files to exclude (provided)
- ✅ `railway.json` - Configuration (provided)

### Step 2: Create Railway Project

1. Visit **https://railway.app/dashboard**
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Authorize Railway to access your GitHub account
5. Select **"Blocked_learning"** repository
6. Choose **"Select Subdirectory"** → Type `AI`
7. Click **"Deploy"**

Railway will:
- Detect the Dockerfile
- Build the image (2-3 minutes)
- Start the container
- Assign you a temporary domain

### Step 3: Add Redis Service

Redis is required for caching. Railway makes it easy:

1. Go to your Railway project dashboard
2. Click **"+ New Service"**
3. Select **"Database"** → **"Redis"**
4. Click **"Create"**
5. Wait for provisioning (2-3 minutes)

Railway automatically:
- Creates Redis instance
- Sets `REDIS_URL` environment variable
- Connects to your AI service

### Step 4: Configure Environment Variables

In Railway Dashboard → **Variables**:

Add these variables:

```
GEMINI_API_KEY        = your_api_key_from_aistudio.google.com
DEBUG                 = false
RATE_LIMIT_PER_MINUTE = 10
```

These are set automatically:
- `REDIS_URL` - Set by Redis service
- `PORT` - Set by Railway (typically 8000)

### Step 5: Verify Deployment

1. Go to **"Deployments"** tab
2. Wait for status to show **"Success"** ✅
3. Click on the deployment to view logs
4. Look for: `"Uvicorn running on 0.0.0.0:8000"`

### Step 6: Get Your Live Domain

1. Go to **"Settings"** tab
2. Look for **"Domains"** section
3. Your domain: `project-name.up.railway.app`

### Step 7: Test Your Service

```bash
# Health check
curl https://your-domain.up.railway.app/

# Should return:
# {
#   "service": "BLOCKEDLEARNING AI",
#   "status": "running",
#   "version": "3.0.0",
#   "total_endpoints": 13
# }
```

---

## Environment Variables

### Required Variables

| Variable | Value | Source |
|----------|-------|--------|
| `GEMINI_API_KEY` | Your API key | https://aistudio.google.com/app/apikey |
| `DEBUG` | `false` | Set manually (production) |

### Auto-Set Variables

| Variable | Set By | Value |
|----------|--------|-------|
| `REDIS_URL` | Redis service | `redis://redis:6379/0` |
| `PORT` | Railway | Usually `8000` |
| `RATE_LIMIT_PER_MINUTE` | Manual | `10` (adjust as needed) |

### Optional Variables

```
LOG_LEVEL=INFO              # Logging level
TIMEOUT=30                  # Request timeout
CACHE_TTL_HOURS=24         # Cache duration
```

---

## Testing

### Quick Test

```bash
# Replace YOUR_DOMAIN with your Railway domain
DOMAIN="https://your-domain.up.railway.app"

# Test health
curl $DOMAIN/

# Test an endpoint
curl -X POST $DOMAIN/mentor/profile \
  -H "Content-Type: application/json" \
  -d '{
    "wallet": "0x123",
    "user_context": {
      "skill_level": "beginner",
      "completed_modules": []
    }
  }'
```

### Full Test Suite

Run all 13 endpoint tests:

```bash
./test-railway-deployment.sh https://your-domain.up.railway.app
```

This tests:
- ✅ 3 mentor endpoints
- ✅ 5 content endpoints
- ✅ 4 audit/generation endpoints
- ✅ 1 health check

### Automated Testing (Postman)

Import Postman collection:

```json
{
  "info": {"name": "BLOCKEDLEARNING API"},
  "item": [
    {
      "name": "Health Check",
      "request": {"method": "GET", "url": "{{domain}}/"}
    },
    {
      "name": "Mentor Explain",
      "request": {
        "method": "POST",
        "url": "{{domain}}/mentor/explain",
        "body": {...}
      }
    }
    // ... add all 13 endpoints
  ]
}
```

---

## Monitoring

### View Logs

```bash
# If you have Railway CLI installed
railway logs -s ai-service

# Follow logs in real-time
railway logs -s ai-service --follow
```

### Monitor Metrics

In Railway Dashboard:

1. Click your deployment
2. Go to **"Metrics"** tab
3. Monitor:
   - CPU usage
   - Memory usage
   - Network in/out
   - Request count
   - Error rate

### Set Up Alerts

1. Go to **"Settings"** → **"Alerts"**
2. Create alert for:
   - Service down
   - High CPU/Memory
   - High error rate
   - Deployment failures

---

## Troubleshooting

### Service Won't Start

**Error:** Build fails or container won't start

**Solutions:**

1. **Check logs:**
   ```bash
   railway logs -s ai-service
   ```

2. **Common issues:**
   - Missing dependencies → Add to `requirements.txt`
   - Missing environment variable → Add in Railway dashboard
   - Port conflict → Railway auto-assigns, should be fine
   - Dockerfile error → Check `Dockerfile` syntax

3. **Rebuild:**
   ```bash
   git push  # Triggers redeploy
   ```

### GEMINI_API_KEY Not Found

**Error:** `GEMINI_API_KEY missing`

**Solution:**

1. Get API key: https://aistudio.google.com/app/apikey
2. In Railway Dashboard → **Variables**
3. Add: `GEMINI_API_KEY = your_key`
4. Redeploy service

### Redis Connection Failed

**Error:** `Cannot connect to redis://redis:6379`

**Solutions:**

1. Verify Redis service exists in Railway project
2. Check `REDIS_URL` variable is set correctly
3. Restart Redis service:
   - Railway Dashboard → Redis service → Restart
4. Check logs for Redis errors

### High Memory Usage

**Problem:** Memory usage increasing over time

**Solutions:**

1. **Reduce cache TTL:**
   - Environment: `CACHE_TTL_HOURS=12`

2. **Limit request size:**
   - Check for large uploads

3. **Monitor processes:**
   - Check for memory leaks in logs

4. **Scale up:**
   - Railway → Plan → Higher tier

### Slow Response Times

**Problem:** API responses taking >5 seconds

**Solutions:**

1. **Check Gemini API:**
   - May be rate-limited
   - Check API quotas

2. **Check Redis:**
   - Is caching working?
   - Monitor Redis memory

3. **Check logs:**
   ```bash
   railway logs -s ai-service | grep "slow"
   ```

4. **Upgrade plan:**
   - Faster CPU/Memory available

---

## Advanced Configuration

### Custom Domain

1. Railway Dashboard → **Domain**
2. Click **"Generate Custom Domain"** OR
3. Add your own domain:
   - Add DNS CNAME record pointing to Railway's domain
   - Wait for verification (5-10 minutes)

### Auto-Deployment from GitHub

Already configured via Railway's GitHub integration!

Every push to `main` triggers redeploy automatically.

To disable:
- Railway Dashboard → **Settings** → **Auto-deploy** → Off

### Environment-Specific Configs

Create multiple environments:

```bash
# Production (current)
# Staging
# Development
```

In Railway:
1. Create separate projects for each
2. Use different API keys per environment
3. Route traffic as needed

### Scale Horizontally

Add more instances:

Railway Dashboard → **Settings** → **Scaling**
- Increase replicas for load balancing
- Each replica shares Redis cache

### Backup & Restore

**Redis backup:**
- Railway auto-backups (included with paid plans)
- Manual backup: Contact Railway support

**Code backup:**
- GitHub is your backup
- All changes tracked in git history

### CI/CD Pipeline

GitHub Actions already configured in `.github/workflows/railway-deploy.yml`

To enable:
1. Set `RAILWAY_TOKEN` secret in GitHub
2. Get token from https://railway.app/account
3. Add to GitHub → Settings → Secrets
4. Auto-deploy triggers on push

---

## Performance Tips

1. **Enable caching**: Uses Redis automatically
2. **Adjust TTLs**: Longer TTL = better hit rate
3. **Monitor metrics**: Use Railway dashboard
4. **Optimize endpoints**: See `/docs` for response times
5. **Use CDN**: Optional, for static content

---

## Cost Optimization

**Estimated costs:**
- AI Service: $5-10/month (based on usage)
- Redis: $5/month (shared tier)
- **Total**: ~$10-15/month

**Ways to save:**
- Use shared Redis tier
- Start with minimal plan
- Monitor and scale as needed
- Use caching aggressively

---

## Security Checklist

- ✅ DEBUG mode disabled
- ✅ API key not in logs
- ✅ HTTPS enforced (Railway default)
- ✅ Rate limiting active
- ✅ CORS configured
- ✅ Input validation enabled
- ✅ No default credentials

---

## Support & Resources

- **Railway Docs**: https://docs.railway.app
- **FastAPI Docs**: https://fastapi.tiangolo.com
- **Gemini API**: https://ai.google.dev
- **Railway Discord**: https://discord.gg/railway

---

## Next Steps

1. ✅ Deploy service to Railway
2. ✅ Test all 13 endpoints
3. ✅ Configure monitoring
4. ⬜ Integrate with Backend
5. ⬜ Connect Frontend
6. ⬜ Set up analytics
7. ⬜ Optimize performance

---

## Deployment Summary

| Step | Time | Status |
|------|------|--------|
| Repository setup | 2 min | ✅ |
| Create Railway project | 1 min | ✅ |
| Connect GitHub | 1 min | ✅ |
| Build & deploy | 3-5 min | ✅ |
| Add Redis | 2-3 min | ✅ |
| Configure variables | 1 min | ✅ |
| Test endpoints | 2 min | ✅ |
| **Total** | **~15 min** | **✅** |

---

**Your BLOCKEDLEARNING AI service is now live on Railway! 🎉**

For updates, check: https://your-domain.up.railway.app/docs
