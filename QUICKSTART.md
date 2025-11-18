# 📚 BLOCKEDLEARNING — Quick Navigation Guide

## Start Here 👇

### New Team Member? Follow This Order:

1. **Read:** `/README.md` (5 min)
   - Project overview
   - Architecture
   - Integration flow

2. **Find Your Role:**
   - Frontend Developer → Go to step 3a
   - Backend Developer → Go to step 3b
   - Blockchain Developer → Go to step 3c
   - AI Developer → Go to step 3d

### 3a. Frontend Developer

```
Start here:
├── Frontend/README.md           ← Setup & quick start (5 min)
├── Frontend/docs/DESIGN.md      ← Full specification (20 min)
└── /README.md (Integration Flow section) ← API contracts
```

**First Tasks:**
1. Clone repo, install dependencies
2. Create `.env.local` with `NEXT_PUBLIC_API_BASE`
3. Run `npm run dev` in Frontend folder
4. Scaffold `/pages` structure
5. Implement `WalletConnectButton` component

### 3b. Backend Developer

```
Start here:
├── Backend/README.md            ← Setup & quick start (5 min)
├── Backend/docs/DESIGN.md       ← Full specification (20 min)
└── /README.md (Integration Flow section) ← API contracts
```

**First Tasks:**
1. Clone repo, install dependencies
2. Create `.env` with `DATABASE_URL`, `CAMP_SDK_KEY`
3. Set up Postgres (local or Supabase)
4. Run migrations: `npm run migrate`
5. Run `npm run dev` to start server
6. Implement auth endpoints (`/api/auth/nonce`, `/api/auth/verify`)

### 3c. Blockchain Developer

```
Start here:
├── contracts/README.md          ← Setup & quick start (5 min)
├── contracts/docs/DESIGN.md     ← Full specification (20 min)
└── /README.md (Integration Flow section) ← API contracts
```

**First Tasks:**
1. Clone repo, install dependencies
2. Create `.env` with `PRIVATE_KEY`, `CAMP_TESTNET_RPC`
3. Run `npm run compile` to check setup
4. Run `npm run test` to verify environment
5. Create `contracts/IPRegistry.sol` based on spec
6. Run `npm run deploy:testnet` to test deployment

### 3d. AI Developer

```
Start here:
├── AI/README.md                 ← Setup & quick start (5 min)
├── AI/docs/DESIGN.md            ← Full specification (20 min)
└── /README.md (Integration Flow section) ← API contracts
```

**First Tasks:**
1. Clone repo, set up Python venv
2. Create `.env` with `BACKEND_DB_URL`
3. Run `pip install -r requirements.txt`
4. Create `knowledge_base.json` with topics
5. Implement `services/mentor.py` with rule engine
6. Run `uvicorn main:app --reload` to start server

---

## Document Index

### 📄 Main Documents

| File | Purpose | Read Time |
|------|---------|-----------|
| `/README.md` | Project overview, architecture, API contracts | 10 min |
| `/ORGANIZATION.md` | This structure explanation | 5 min |
| `/QUICKSTART.md` | This file (quick navigation) | 3 min |

### 🎨 Frontend

| File | Purpose | Read Time |
|------|---------|-----------|
| `Frontend/README.md` | Setup, project structure, components | 8 min |
| `Frontend/docs/DESIGN.md` | Full spec, UX flows, API integration | 15 min |

### 🔌 Backend

| File | Purpose | Read Time |
|------|---------|-----------|
| `Backend/README.md` | Setup, DB schema, API overview | 8 min |
| `Backend/docs/DESIGN.md` | Full spec, endpoints, implementation order | 15 min |

### ⛓️ Blockchain

| File | Purpose | Read Time |
|------|---------|-----------|
| `contracts/README.md` | Setup, contracts, deployment workflow | 8 min |
| `contracts/docs/DESIGN.md` | Full spec, SDK integration, security | 12 min |

### 🤖 AI

| File | Purpose | Read Time |
|------|---------|-----------|
| `AI/README.md` | Setup, API endpoints, implementation | 8 min |
| `AI/docs/DESIGN.md` | Full spec, knowledge base, rules | 12 min |

---

## Quick Reference: API Endpoints

### When You Need to Know What's Available:

Check `/README.md` under **"API Contracts"** section.

**Core endpoints:**
- **Auth:** `POST /api/auth/nonce`, `POST /api/auth/verify`, `GET /api/me`
- **Courses:** `GET /api/courses`, `GET /api/courses/:id`, `POST /api/courses/upload`
- **Progress:** `GET /api/user/progress`, `POST /api/user/progress`
- **CheckMate:** `POST /api/mentor/suggest`, `POST /api/mentor/explain`
- **Trending:** `GET /api/trending`
- **Blockchain:** `POST /api/register-ip`, `GET /api/contract-info`

---

## Common Questions

### Q: Where do I find the full API specification?

**A:** `/README.md` → "API Contracts" section

Also check your role's design doc for more detail:
- Frontend: `Frontend/docs/DESIGN.md` → "Integration Contracts"
- Backend: `Backend/docs/DESIGN.md` → "API Endpoints"

### Q: What's the database schema?

**A:** `Backend/README.md` → "Database Schema" section

Or check: `Backend/docs/DESIGN.md` → "Data Models"

### Q: How do I deploy?

**A:** Check your role's README:
- Frontend: `Frontend/README.md` → "Build & Deploy"
- Backend: `Backend/README.md` → "Build & Deploy"
- Blockchain: `contracts/README.md` → "Deployment Workflow"
- AI: `AI/README.md` → "Deployment"

### Q: How do my endpoints integrate with others?

**A:** `/README.md` → "Integration Flow" section

### Q: What tech stack should I use?

**A:** Check your role's `docs/DESIGN.md` → "Tech Stack" section

### Q: What are the deliverables?

**A:** Check your role's `docs/DESIGN.md` → "Deliverables" section

### Q: What do I implement first?

**A:** Check your role's `README.md` → "Implementation Order" (if applicable)

Or: `/README.md` → "Hackathon Timeline"

---

## Team Communication

### Where to Find Integration Info?

| Need | Location |
|------|----------|
| API Contracts | `/README.md` - "API Contracts" |
| Architecture | `/README.md` - "Architecture" + "Integration Flow" |
| Data Models | `Backend/docs/DESIGN.md` |
| Deployment Info | Your role's `README.md` |
| Tech Stack | Your role's `docs/DESIGN.md` |
| Example Requests/Responses | Your role's `docs/DESIGN.md` |

### Updating Docs During Development

When you change something:
1. Update your role's `docs/DESIGN.md`
2. If it affects API, update `/README.md` API Contracts section
3. Notify team in standup

---

## File Checklist

✅ `/README.md` — Main project guide  
✅ `/ORGANIZATION.md` — Structure explanation  
✅ `/QUICKSTART.md` — This file  
✅ `/Frontend/README.md` — Frontend setup  
✅ `/Frontend/docs/DESIGN.md` — Frontend spec  
✅ `/Backend/README.md` — Backend setup  
✅ `/Backend/docs/DESIGN.md` — Backend spec  
✅ `/contracts/README.md` — Blockchain setup  
✅ `/contracts/docs/DESIGN.md` — Blockchain spec  
✅ `/AI/README.md` — AI setup  
✅ `/AI/docs/DESIGN.md` — AI spec  

---

## Next Steps

1. **Pick your role** (Frontend / Backend / Blockchain / AI)
2. **Read your role's README** (5 min)
3. **Read your role's DESIGN.md** (15-20 min)
4. **Check main README.md** for integration points (5 min)
5. **Start implementing!** 🚀

---

**Questions?** Check the relevant `docs/DESIGN.md` for your role, or the main `README.md` for architecture/integration.

**Stuck?** Check the "Troubleshooting" section in your role's README.

**Ready?** Start with your role's README now! →
