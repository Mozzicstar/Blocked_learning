# BLOCKEDLEARNING — Documentation Organization Summary

## Overview

All design documents have been organized into role-based folders with complete setup guides. Each role has:

1. **DESIGN.md** — Complete technical specification
2. **README.md** — Development setup and quick reference
3. **Supporting files** — Project structure and dependencies

---

## Folder Structure

```
Blocked_learning/
│
├── README.md                          ← Main project README
│                                         (Integration, architecture, API contracts)
│
├── Frontend/
│   ├── docs/DESIGN.md                 ← Full Frontend design doc
│   ├── README.md                      ← Frontend setup guide
│   ├── pages/                         (To be implemented)
│   ├── components/                    (To be implemented)
│   └── public/
│
├── Backend/
│   ├── docs/DESIGN.md                 ← Full Backend design doc
│   ├── README.md                      ← Backend setup guide
│   ├── src/routes/                    (To be implemented)
│   ├── src/services/                  (To be implemented)
│   ├── migrations/                    (To be implemented)
│   └── seeds/                         (To be implemented)
│
├── contracts/
│   ├── docs/DESIGN.md                 ← Full Blockchain design doc
│   ├── README.md                      ← Blockchain setup guide
│   ├── contracts/                     (To be implemented)
│   ├── scripts/                       (To be implemented)
│   └── test/                          (To be implemented)
│
└── AI/
    ├── docs/DESIGN.md                 ← Full AI design doc
    ├── README.md                      ← AI setup guide
    ├── services/                      (To be implemented)
    ├── knowledge_base.json            (To be implemented)
    └── test/                          (To be implemented)
```

---

## Document Quick Reference

| Role | Design Doc | Setup Guide | Purpose |
|------|-----------|-----------|---------|
| **Frontend** | `Frontend/docs/DESIGN.md` | `Frontend/README.md` | Next.js app, wallet UI, course player |
| **Backend** | `Backend/docs/DESIGN.md` | `Backend/README.md` | Fastify API, DB schema, IP orchestration |
| **Blockchain** | `contracts/docs/DESIGN.md` | `contracts/README.md` | Smart contracts, Origin SDK, testnet deploy |
| **AI / CheckMate** | `AI/docs/DESIGN.md` | `AI/README.md` | Rule-based mentor, topic matching, suggestions |

---

## What's in Each Design Doc

### Frontend/docs/DESIGN.md

✅ Purpose & tech stack  
✅ Pages & components breakdown  
✅ API integration contracts (exact endpoints)  
✅ UX flows (wallet connect, upload, learning)  
✅ Error handling & edge cases  
✅ Testing checklist  
✅ Deployment instructions  
✅ Deliverables list

### Backend/docs/DESIGN.md

✅ Purpose & tech stack  
✅ API endpoints (complete list with request/response shapes)  
✅ Data models (Postgres schema)  
✅ Authentication flow (signed nonce)  
✅ IP registration orchestration  
✅ CheckMate rule engine (backend side)  
✅ Trending aggregator  
✅ Error handling & monitoring  
✅ Deployment notes  
✅ Deliverables list

### contracts/docs/DESIGN.md

✅ Purpose & tech stack  
✅ Smart contracts (IPRegistry, CourseDirectory)  
✅ Onchain workflows (register course, certificates)  
✅ Events & notifications  
✅ Security & gas optimization  
✅ Testing & deployment  
✅ Deliverables list

### AI/docs/DESIGN.md

✅ Purpose & MVP approach  
✅ Tech stack (Python, FastAPI, spaCy)  
✅ Knowledge base structure  
✅ Mentor endpoints (/explain, /suggest, /profile)  
✅ Rule examples (security gaps, project suggestions)  
✅ Optional LLM enhancements (post-MVP)  
✅ Evaluation metrics  
✅ Deliverables list

---

## What's in Each Role README

### Frontend/README.md

✅ Quick start (npm install, env vars)  
✅ Project structure  
✅ Key components to implement  
✅ API integration examples  
✅ Testing & deployment  
✅ Common tasks  
✅ Troubleshooting

### Backend/README.md

✅ Quick start (npm install, env vars)  
✅ Database setup (schema, migrations, seeding)  
✅ Project structure  
✅ API endpoints overview  
✅ Implementation order  
✅ Key services (Auth, Blockchain, CheckMate)  
✅ Testing, build & deploy  
✅ Common tasks  
✅ Troubleshooting

### contracts/README.md

✅ Quick start (npm install, compile, test)  
✅ Project structure  
✅ Core contracts (IPRegistry, CourseDirectory)  
✅ Backend integration guide  
✅ Frontend integration guide  
✅ Deployment workflow (local → testnet → verify)  
✅ Scripts (deploy, register, info)  
✅ Security considerations  
✅ Common tasks  
✅ Troubleshooting

### AI/README.md

✅ Quick start (Python venv, install, run)  
✅ Project structure  
✅ Core components (knowledge base, mentor service, NLP)  
✅ API endpoints (suggest, explain, profile)  
✅ Implementation steps  
✅ Rule examples  
✅ Database integration  
✅ Future enhancements (LLM, embeddings)  
✅ Deployment  
✅ Troubleshooting

---

## Main README.md (Root)

### Covers:

✅ Project overview & features  
✅ Architecture diagram  
✅ Integration flow (auth → upload → learning → CheckMate)  
✅ API contracts (all endpoints in one place)  
✅ Tech stack table  
✅ Deployment per role  
✅ Testing & demo checklist  
✅ Folder structure  
✅ Environment variables template  
✅ Development workflow  
✅ Hackathon timeline (3-day sprint)  
✅ Resources & links

---

## How to Use This Organization

### For Each Developer:

1. **Read your role's README** → `{Role}/README.md`
   - Get up and running quickly
   - Understand local development setup

2. **Read your role's DESIGN.md** → `{Role}/docs/DESIGN.md`
   - Understand full specifications
   - See API contracts and deliverables

3. **Check main README.md** → `README.md`
   - Understand integration points
   - See how your role connects to others
   - Review API contracts for endpoints you consume

4. **Start implementing** following the structure provided

---

## Integration Points (From Main README)

### Frontend → Backend

**Consumes:**
- `GET /api/courses`
- `POST /api/courses/upload`
- `GET /api/user/progress`
- `POST /api/mentor/suggest`
- `GET /api/trending`

### Backend → Blockchain

**Calls:**
- Camp Origin SDK (register IP)
- Watch on-chain events

**Exposes:**
- Contract addresses & ABIs to frontend

### AI → Backend

**Reads:**
- User progress (DB query)
- Course metadata (DB query)

**Exposes:**
- `/api/mentor/suggest`
- `/api/mentor/explain`

---

## Next Steps

### Immediate Actions:

1. **Share this structure with team** → each role reads their folder
2. **Frontend dev:** Start with `Frontend/README.md` → scaffold Next.js
3. **Backend dev:** Start with `Backend/README.md` → set up Fastify + DB
4. **Blockchain dev:** Start with `contracts/README.md` → deploy test contract
5. **AI dev:** Start with `AI/README.md` → initialize knowledge base

### Day 1 Checklist:

- [ ] All devs read their README + DESIGN.md
- [ ] Repos cloned & environments set up
- [ ] Local dev servers running (frontend, backend, AI)
- [ ] Mock data / seed data loaded
- [ ] Team alignment on API contracts

### Daily Communication:

- API contracts live in **main README.md** (Integration Flow section)
- Design updates → update the `/docs/DESIGN.md` for your role
- Blockers → escalate in standup

---

## Files Created

**Main Documentation:**
- `/README.md` — Project overview & integration guide
- `/Frontend/README.md` — Frontend setup & dev guide
- `/Backend/README.md` — Backend setup & dev guide
- `/contracts/README.md` — Blockchain setup & deploy guide
- `/AI/README.md` — AI setup & mentor dev guide

**Design Documents:**
- `/Frontend/docs/DESIGN.md` — Full frontend spec
- `/Backend/docs/DESIGN.md` — Full backend spec
- `/contracts/docs/DESIGN.md` — Full blockchain spec
- `/AI/docs/DESIGN.md` — Full AI spec

**Folder Structure:**
- `/Frontend/docs/` — Frontend documentation folder
- `/Backend/docs/` — Backend documentation folder
- `/contracts/docs/` — Blockchain documentation folder
- `/AI/docs/` — AI documentation folder

---


---

*Generated for TechyJaunt × Camp Buildathon*
