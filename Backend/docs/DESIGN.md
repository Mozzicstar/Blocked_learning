# BLOCKEDLEARNING — Backend Developer Design Doc

## Purpose

Provide API surface used by frontend, orchestrate the IP registration process with Camp, manage user progress, host CheckMate rule-engine endpoints, and provide trending aggregation. Use a fast, simple stack suitable for hackathon delivery.

## Tech Stack

* Node.js + **Fastify** (lightweight & fast) or Express if preferred
* Database: **Supabase (Postgres)** recommended for speed; fallback to PostgreSQL
* Cache: Redis (optional)
* Blockchain libs: `ethers.js` or `viem`
* Camp Origin SDK integration (server side)
* AI rule-engine: run as internal module or lightweight FastAPI microservice (optional)
* Hosting: Vercel serverless functions or Railway/Render
* Storage helper: direct upload to IPFS/Camp via SDK from frontend (recommended) or backend streaming

## API Endpoints (full list)

### Auth

* `POST /api/auth/nonce` — issue nonce for signature-based login
* `POST /api/auth/verify` — verify signed nonce, issue session token (JWT) if needed
* `GET /api/me` — returns user profile

### Courses

* `GET /api/courses` — list (merge onchain + DB)
* `GET /api/courses/:id` — metadata & modules
* `POST /api/courses/upload` — record metadata, return `tempId`
* `POST /api/courses/publish` — triggers onchain registration via Origin SDK
* `GET /api/courses/onchain` — query onchain courses

### Progress & CheckMate

* `GET /api/user/progress` — get progress
* `POST /api/user/progress` — mark module complete
* `POST /api/mentor/explain` — forward to CheckMate logic
* `POST /api/mentor/suggest` — forward to CheckMate logic

### Trending

* `GET /api/trending` — aggregated feed (cache + update job)

### Admin

* `GET /api/admin/stats` — usage metrics
* `POST /api/admin/seed` — seed sample courses (dev only)

## Data Models (Postgres)

```
users (id, wallet, display_name, created_at)
courses (id, title, desc, creator_wallet, file_cid, ip_token_id, metadata_hash, tags, status)
modules (id, course_id, title, resource_url, order)
progress (id, user_id, module_id, completed_at)
trending (id, title, summary, source, created_at)
```

## Authentication Flow

### Recommended: Signed Nonce

* Frontend requests `nonce` → backend stores nonce with timestamp
* User signs nonce in wallet → frontend posts `signature` to `/api/auth/verify` with wallet address
* Backend recovers address via ethers.js; if matches, return JWT or session cookie

### For Hackathon Speed:

* Accept wallet address in header but include note to implement signed-nonce logic later

## IP Registration Orchestration

* Backend calls Camp Origin SDK with metadata (JSON includes `fileCid`, `title`, `tags`, `royalty`), receives `ipTokenId` & tx hash. Update DB and return to frontend.
* For demo fallback: store metadata and simulate onchain result (if testnet congestion).

## CheckMate Implementation (backend side)

* For MVP, implement CheckMate as **rule-based logic**:
  * Input: user progress, completed modules, tags
  * Rules: simple priority rules mapping skills to gaps and next recommended modules
* Expose the CheckMate endpoints described earlier
* Keep the logic in a module `/services/checkmate.js` for easy upgrade to AI later

## Trending Aggregator

* Use free APIs (CoinGecko, CryptoPanic, RSS) or curated static items for demo
* Run a cron job to refresh trending DB or cache every X minutes

## Error Handling & Monitoring

* Centralized error middleware
* Logging (pino for Fastify)
* Sentry integration optional
* Rate limiting for mentor endpoints

## Testing & Local Dev

* Provide Postman collection
* Seed script to populate DB with demo courses
* Unit tests (Jest) for critical flows

## Deployment

* Provide `Dockerfile` + `docker-compose` for local
* Use environment variables for secrets (CAMP_SDK_KEY, DATABASE_URL)
* For hackathon: host on Railway or Vercel serverless with Supabase managed DB

## Deliverables

* `/backend` with README, Postman, migrations, seeds, and docs
* Base URL for frontend `NEXT_PUBLIC_API_BASE`
* Integration guide for blockchain dev (contract addresses & ABI locations)

## AI Integration (CheckMate AI Service)

**Status:** ✅ Completed and deployed

### AI Service Endpoint

* **Base URL:** `https://blockedlearning-production.up.railway.app`
* **Docs:** `https://blockedlearning-production.up.railway.app/docs`
* **Health Check:** `GET /health`

### How to Integrate CheckMate Endpoints

The AI service provides 13 endpoints across 4 categories. Backend should proxy/forward requests from frontend to the AI service:

#### 1. Learning Mentor (5 endpoints)

* `POST /mentor/explain` — Personalized explanations with code examples
* `POST /mentor/suggest` — Smart next-step recommendations
* `POST /mentor/profile` — Learning profile analysis & 4-week plan
* `POST /mentor/audit-code` — Security vulnerability detection
* `POST /mentor/generate-project` — Custom project templates

#### 2. Content Intelligence (4 endpoints)

* `POST /analyze/video` — Auto-generate metadata from video
* `POST /analyze/quality` — Content quality scoring
* `POST /generate/quiz` — Auto-create quizzes from videos
* `POST /generate/thumbnail` — Smart thumbnail generation

#### 3. Search & Recommendations (3 endpoints)

* `POST /search/semantic` — Semantic search for content
* `POST /recommend/next` — Video recommendations
* `GET /trends/industry` — Industry trends and career insights

#### 4. Health & Status (1 endpoint)

* `GET /health` — Service health check

### Backend Integration Example

```javascript
// Add proxy route in backend
app.post('/api/mentor/explain', async (req, res) => {
  const response = await fetch('https://blockedlearning-production.up.railway.app/mentor/explain', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req.body)
  });
  const data = await response.json();
  res.json(data);
});

// Repeat for other endpoints or create generic proxy middleware
```

### Environment Variables

* `AI_SERVICE_URL=https://blockedlearning-production.up.railway.app`
* `RATE_LIMIT=10` (requests per minute for AI endpoints)

### Features Delivered

* **Phase 1 (MVP):** All 13 endpoints tested and working ✅
* **Learning Mentor:** Explain, suggest, profile, audit-code, project generation
* **Content Intelligence:** Video analysis, quality scoring, quiz generation, thumbnail generation
* **Trending:** Industry trends with career insights
* **Tech Stack:** FastAPI + Python 3.11, Redis cache, Google Gemini 2.0 Flash AI
