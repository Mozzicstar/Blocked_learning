do # BLOCKEDLEARNING Backend Development Todo List

## 🚀 Phase 1: Project Setup & Infrastructure

### [ ] 1.1 Initialize Node.js Project
- [ ] Create `package.json` with Fastify (or Express) as main framework
- [ ] Install dependencies: `fastify`, `@fastify/cors`, `pg` (PostgreSQL), `ethers.js`, `jsonwebtoken`, `dotenv`
- [ ] Create `.gitignore` file
- [ ] Set up `tsconfig.json` for TypeScript (if using TS)
- [ ] Create `.env.example` with all required environment variables

### [ ] 1.2 Database Setup
- [ ] Install & configure PostgreSQL (or create Supabase project)
- [ ] Create initial migration files structure (`src/db/migrations/`)
- [ ] Create database client connection file (`src/db/client.ts`)
- [ ] Write migration for initial schema:
  - `users` table (id, wallet, display_name, created_at)
  - `courses` table (id, title, description, creator_wallet, file_cid, ip_token_id, metadata_hash, tags, status, created_at)
  - `modules` table (id, course_id, title, resource_url, module_order)
  - `progress` table (id, user_id, module_id, completed_at)
  - `trending` table (id, title, summary, source, created_at)

### [ ] 1.3 Fastify App Setup
- [ ] Create `src/app.ts` with Fastify instance
- [ ] Configure CORS middleware
- [ ] Set up global error handling middleware
- [ ] Configure request logging (pino)
- [ ] Create `src/types/index.ts` with TypeScript interfaces

### [ ] 1.4 Environment & Config
- [ ] Create `.env` file with all variables:
  - `DATABASE_URL` (PostgreSQL connection string)
  - `CAMP_SDK_KEY` (for blockchain integration)
  - `JWT_SECRET` (random secret for JWT tokens)
  - `NODE_ENV` (development/production)
  - `PORT` (3001)
  - `CORS_ORIGIN` (frontend URL)
  - `AI_SERVICE_URL` (https://blockedlearning-production.up.railway.app)

---

## 🔐 Phase 2: Authentication System

### [ ] 2.1 Nonce Generation & Storage
- [ ] Create `src/services/authService.ts`
- [ ] Implement `generateNonce()` function (random string with timestamp)
- [ ] Store nonce in database with expiration (5 min TTL)
- [ ] Implement `POST /api/auth/nonce` endpoint

### [ ] 2.2 Signature Verification
- [ ] Implement `verifySignature(wallet, signature, nonce)` using ethers.js
- [ ] Use `ethers.recoverAddress()` to verify signed nonce
- [ ] Generate JWT token on success
- [ ] Implement `POST /api/auth/verify` endpoint
- [ ] Return JWT token + user profile

### [ ] 2.3 JWT Middleware
- [ ] Create `src/middleware/auth.ts` for JWT verification
- [ ] Implement `verifyToken(token)` middleware
- [ ] Attach user data to request object
- [ ] Apply middleware to protected routes

### [ ] 2.4 User Profile Endpoint
- [ ] Create user profile fetch logic
- [ ] Implement `GET /api/me` endpoint (requires JWT)
- [ ] Return: wallet, displayName, profileUrl, createdAt

---

## 📚 Phase 3: Course Management

### [ ] 3.1 Course Listing
- [ ] Implement `GET /api/courses` endpoint
- [ ] Merge onchain courses (from Camp SDK) + database courses
- [ ] Add filtering by tags, difficulty, creator
- [ ] Add pagination support
- [ ] Return: id, title, description, creator, ipTokenId, fileUrl, tags, difficulty, createdAt

### [ ] 3.2 Course Detail Page
- [ ] Implement `GET /api/courses/:id` endpoint
- [ ] Fetch course metadata + modules from database
- [ ] Fetch onchain data (ipTokenId, metadataHash) if available
- [ ] Return complete course structure with modules list

### [ ] 3.3 Course Upload
- [ ] Implement `POST /api/courses/upload` endpoint
- [ ] Accept: title, description, tags, fileCid, fileName, price (optional)
- [ ] Store metadata in database with `status: 'draft'`
- [ ] Generate `tempId` for later reference
- [ ] Prepare `registerPayload` for blockchain registration
- [ ] Return tempId + registerPayload to frontend

### [ ] 3.4 Course Publishing (Blockchain Registration)
- [ ] Implement `POST /api/courses/publish` endpoint
- [ ] Accept: tempId, metadataHash, creator
- [ ] Call Camp Origin SDK to register IP token
- [ ] Store returned `ipTokenId` and `txHash` in database
- [ ] Update course status to `'published'`
- [ ] Return: ipTokenId, txHash, metadataHash

### [ ] 3.5 Onchain Courses Query
- [ ] Implement `GET /api/courses/onchain` endpoint
- [ ] Query Camp SDK for registered IP tokens
- [ ] Filter & return onchain courses only
- [ ] Include ipTokenId, metadata references

### [ ] 3.6 Course Service Logic
- [ ] Create `src/services/courseService.ts`
- [ ] Implement business logic for course CRUD operations
- [ ] Add validation for course data
- [ ] Handle database transactions for course creation

---

## 👥 Phase 4: Progress Tracking

### [ ] 4.1 User Progress Fetching
- [ ] Implement `GET /api/user/progress` endpoint
- [ ] Query `progress` table for authenticated user
- [ ] Return: completedModules (array of moduleIds), badges, xp
- [ ] Calculate user's learning statistics

### [ ] 4.2 Module Completion
- [ ] Implement `POST /api/user/progress` endpoint
- [ ] Accept: moduleId
- [ ] Insert record in `progress` table with timestamp
- [ ] Update user's XP/badges if applicable
- [ ] Call CheckMate to get next suggestion
- [ ] Return: success, nextSuggestion

### [ ] 4.3 Progress Validation
- [ ] Add validation to prevent duplicate completions
- [ ] Ensure module exists before marking complete
- [ ] Track completion timestamp for analytics

---

## 🧠 Phase 5: CheckMate Integration (Mentor/AI Service)

### [ ] 5.1 AI Service Proxy Setup
- [ ] Create generic HTTP client for AI service calls
- [ ] Add error handling & retry logic for AI service calls
- [ ] Add rate limiting (10 requests/minute per user)
- [ ] Create `src/services/aiServiceClient.ts`

### [ ] 5.2 Mentor Endpoints - Explain
- [ ] Implement `POST /api/mentor/explain` endpoint
- [ ] Accept: topic, level (beginner/intermediate/advanced)
- [ ] Forward request to AI service: `POST /mentor/explain`
- [ ] Return: explanation, code examples, recommended modules
- [ ] Add caching for repeated explanations

### [ ] 5.3 Mentor Endpoints - Suggest
- [ ] Implement `POST /api/mentor/suggest` endpoint
- [ ] Accept: wallet, progress data
- [ ] Forward request to AI service: `POST /mentor/suggest`
- [ ] Return: suggestion, nextModules, rationale
- [ ] Cache results per user

### [ ] 5.4 Mentor Endpoints - Profile
- [ ] Implement `POST /api/mentor/profile` endpoint (or internal call)
- [ ] Accept: wallet, modules_completed, learning_pace, total_hours
- [ ] Call AI service: `POST /mentor/profile`
- [ ] Return: skill_level, strengths, weaknesses, 4-week plan
- [ ] Store profile results for dashboard display

### [ ] 5.5 Mentor Endpoints - Code Audit
- [ ] Implement `POST /api/mentor/audit-code` endpoint
- [ ] Accept: code (string)
- [ ] Forward to AI service: `POST /mentor/audit-code`
- [ ] Return: vulnerabilities, suggestions, severity scores
- [ ] Display results for user review

### [ ] 5.6 Mentor Endpoints - Project Generation
- [ ] Implement `POST /api/mentor/generate-project` endpoint
- [ ] Accept: topic, difficulty
- [ ] Call AI service: `POST /mentor/generate-project`
- [ ] Return: project template, modules, estimated hours
- [ ] Store generated projects in database

---

## 📊 Phase 6: Content Intelligence (AI Service Integration)

### [ ] 6.1 Video Analysis
- [ ] Implement `POST /api/analyze/video` endpoint
- [ ] Accept: video_id, title
- [ ] Forward to AI service: `POST /analyze/video`
- [ ] Return: generated title, topics, objectives, duration_estimate
- [ ] Store analysis results in database

### [ ] 6.2 Content Quality Scoring
- [ ] Implement `POST /api/analyze/quality` endpoint
- [ ] Accept: content
- [ ] Call AI service: `POST /analyze/quality`
- [ ] Return: quality_score, issues, recommendations
- [ ] Flag low-quality content for review

### [ ] 6.3 Quiz Generation
- [ ] Implement `POST /api/generate/quiz` endpoint
- [ ] Accept: video_id or content
- [ ] Call AI service: `POST /generate/quiz`
- [ ] Return: quiz questions, answers, difficulty
- [ ] Store quizzes in database, link to courses/modules

### [ ] 6.4 Thumbnail Generation
- [ ] Implement `POST /api/generate/thumbnail` endpoint (optional MVP)
- [ ] Accept: video_id, video_content_url
- [ ] Call AI service: `POST /generate/thumbnail`
- [ ] Return: thumbnail URL/data
- [ ] Store thumbnail reference

---

## 🔍 Phase 7: Search & Recommendations

### [ ] 7.1 Semantic Search
- [ ] Implement `POST /api/search/semantic` endpoint
- [ ] Accept: query (string)
- [ ] Forward to AI service: `POST /search/semantic`
- [ ] Return: search results with relevance scores
- [ ] Combine with database search for better UX

### [ ] 7.2 Video Recommendations
- [ ] Implement `POST /api/recommend/next` endpoint
- [ ] Accept: user_id, current_video_id
- [ ] Call AI service: `POST /recommend/next`
- [ ] Return: recommended videos, reason for recommendation
- [ ] Consider user progress & learning style

### [ ] 7.3 Industry Trends
- [ ] Implement `GET /api/trending` endpoint
- [ ] Either:
  - Option A: Call AI service `GET /trends/industry` directly
  - Option B: Cache trends in database, update via cron job
- [ ] Return: trending skills, career paths, market demand
- [ ] Add filtering by skill/topic

---

## 📈 Phase 8: Blockchain Integration

### [ ] 8.1 Camp SDK Setup
- [ ] Import Camp Origin SDK in `src/services/blockchain.ts`
- [ ] Initialize SDK with `CAMP_SDK_KEY`
- [ ] Set up RPC endpoint connection (testnet)

### [ ] 8.2 IP Registration Flow
- [ ] Implement `registerIP(metadata)` function
- [ ] Accept: fileCid, title, tags, creator, royalty (optional)
- [ ] Call Camp Origin SDK to create IP token
- [ ] Handle response: ipTokenId, metadataHash, txHash
- [ ] Return results to caller

### [ ] 8.3 Event Listening (Optional)
- [ ] Set up event listener for IP registration events
- [ ] Listen for contract events from Camp
- [ ] Update database when events are detected
- [ ] Handle failed registrations

### [ ] 8.4 Blockchain Service Integration
- [ ] Create `src/services/blockchain.ts`
- [ ] Export `registerIP()`, `getOnchainCourses()`, etc.
- [ ] Add error handling & logging
- [ ] Implement retry logic for failed transactions

---

## 🎯 Phase 9: Admin & Utilities

### [ ] 9.1 Admin Stats Endpoint
- [ ] Implement `GET /api/admin/stats` endpoint (dev only, auth restricted)
- [ ] Return: total users, total courses, total progress records, trending stats
- [ ] Add endpoint protection (admin role check)

### [ ] 9.2 Seed Data Script
- [ ] Create `src/scripts/seed.ts` for demo data
- [ ] Implement `POST /api/admin/seed` endpoint (dev only)
- [ ] Seed sample users, courses, modules, progress
- [ ] Use realistic blockchain test data

### [ ] 9.3 Database Migrations CLI
- [ ] Create migration runner (`npm run migrate`)
- [ ] Create migration generator (`npm run generate-migration`)
- [ ] Document migration process

---

## 🧪 Phase 10: Testing & Documentation

### [ ] 10.1 Unit Tests
- [ ] Create test files for each service
- [ ] Test authService functions (nonce generation, signature verification)
- [ ] Test courseService functions (CRUD operations)
- [ ] Test checkmate/mentor logic
- [ ] Aim for 80%+ coverage

### [ ] 10.2 Integration Tests
- [ ] Test full auth flow (nonce → verify → JWT)
- [ ] Test course upload → publish flow
- [ ] Test progress tracking flow
- [ ] Test AI service integration with mock responses

### [ ] 10.3 Postman Collection
- [ ] Create `postman-collection.json`
- [ ] Document all endpoints with example requests/responses
- [ ] Include environment variables setup instructions
- [ ] Add authentication examples

### [ ] 10.4 API Documentation
- [ ] Create comprehensive API docs
- [ ] Document request/response schemas
- [ ] Provide code examples for each endpoint
- [ ] Include error codes & messages

---

## 🚢 Phase 11: Deployment & DevOps

### [ ] 11.1 Docker Setup
- [ ] Create `Dockerfile` for backend
- [ ] Create `docker-compose.yml` with PostgreSQL + backend
- [ ] Test local Docker build
- [ ] Add healthcheck endpoint

### [ ] 11.2 Environment Configuration
- [ ] Create `.env.example` with all required variables
- [ ] Document each environment variable purpose
- [ ] Provide defaults for development

### [ ] 11.3 Railway Deployment
- [ ] Create `railway.json` (if needed)
- [ ] Set up Railway project
- [ ] Configure environment variables in Railway
- [ ] Deploy and test in production
- [ ] Set up monitoring/alerts

### [ ] 11.4 Error Handling & Logging
- [ ] Implement centralized error middleware
- [ ] Add request/response logging with pino
- [ ] Set up error tracking (Sentry optional)
- [ ] Add performance monitoring

---

## 🔗 Phase 12: Frontend Integration & Polish

### [ ] 12.1 CORS Configuration
- [ ] Configure CORS_ORIGIN for frontend URL
- [ ] Test frontend ↔ backend communication
- [ ] Handle preflight requests

### [ ] 12.2 Response Standardization
- [ ] Standardize all API responses (success/error format)
- [ ] Add consistent error messages
- [ ] Include request IDs for debugging

### [ ] 12.3 API Rate Limiting
- [ ] Implement rate limiting middleware
- [ ] Limit AI service calls (10 req/min per user)
- [ ] Return rate limit headers

### [ ] 12.4 Caching Strategy
- [ ] Implement Redis caching (optional)
- [ ] Cache frequently accessed data:
  - Course listings
  - User profiles
  - AI service responses
- [ ] Set appropriate TTLs

---

## 📋 Final Checklist

### [ ] All Core Endpoints Implemented
- [ ] ✅ Auth (3 endpoints)
- [ ] ✅ Courses (5 endpoints)
- [ ] ✅ Progress (2 endpoints)
- [ ] ✅ CheckMate/Mentor (2-5 endpoints via AI service)
- [ ] ✅ Trending (1 endpoint)
- [ ] ✅ Admin (2 endpoints)

### [ ] Integration Complete
- [ ] ✅ AI Service fully integrated (13 endpoints proxied)
- [ ] ✅ Blockchain (Camp SDK) for IP registration
- [ ] ✅ Database with PostgreSQL/Supabase
- [ ] ✅ Authentication with JWT

### [ ] Quality Assurance
- [ ] ✅ Tests written & passing
- [ ] ✅ Error handling comprehensive
- [ ] ✅ Logging in place
- [ ] ✅ Documentation complete

### [ ] Deployment Ready
- [ ] ✅ Docker configuration
- [ ] ✅ Environment variables defined
- [ ] ✅ Deployed to Railway/Vercel
- [ ] ✅ Monitoring configured

---

## 🎯 Quick Start Commands

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Run database migrations
npm run migrate

# Seed sample data
npm run seed

# Start development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build

# Deploy to Railway
railway up
```

---

## 📌 Key Dependencies

- **Framework:** Fastify (lightweight, fast)
- **Database:** PostgreSQL + pg driver
- **Blockchain:** ethers.js + Camp Origin SDK
- **Auth:** jsonwebtoken + ethers.recoverAddress
- **Validation:** joi or zod
- **Testing:** Jest + supertest
- **HTTP Client:** node-fetch or axios
- **Logging:** pino
- **Environment:** dotenv

---

## 📞 Important Notes

1. **AI Service is Ready:** All 13 endpoints are deployed and working at `https://blockedlearning-production.up.railway.app`
2. **Proxy Pattern:** Use proxy pattern to forward frontend requests to AI service endpoints
3. **Database First:** Set up database migrations before other work
4. **Auth First:** Implement authentication early to protect other endpoints
5. **Rate Limiting:** Essential for AI service endpoints to avoid excessive costs

---

**Status:** Ready to start! Begin with Phase 1 & 2 setup, then move through phases sequentially.

