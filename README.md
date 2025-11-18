# BLOCKEDLEARNING

A blockchain-powered educational platform where learners access verifiable courses on Camp Network, with CheckMate AI mentor guidance. Built for TechyJaunt × Camp Buildathon.

## 🎯 Project Overview

**Goal:** Build a platform to register and deliver educational content as verifiable IP on Camp Network, with a rule-based AI mentor (MVP).

**Core Features:**
- Wallet authentication & on-chain course registration
- Learner dashboard with progress tracking
- CheckMate mentor guidance based on skill gaps
- Trending topics aggregator
- Creator upload & IP tokenization

## 📋 Quick Start

### Prerequisites

- Node.js 18+
- Python 3.9+ (for AI service)
- Wallet with Camp testnet tokens
- Environment variables configured (see each role folder)

### Setup by Role

Each role has a dedicated folder with design docs and implementation guides:

| Role | Folder | Design Doc | Setup |
|------|--------|-----------|-------|
| Frontend | `/Frontend` | `Frontend/docs/DESIGN.md` | See `Frontend/README.md` |
| Backend | `/Backend` | `Backend/docs/DESIGN.md` | See `Backend/README.md` |
| Blockchain | `/contracts` | `contracts/docs/DESIGN.md` | See `contracts/README.md` |
| AI / CheckMate | `/AI` | `AI/docs/DESIGN.md` | See `AI/README.md` |

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                       │
│  Pages: Landing, Dashboard, Courses, Creator, Trending     │
│  State: Zustand | Wallet: Web3Modal + ethers.js           │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
┌───────▼────────────┐   ┌──────▼──────────────────┐
│  Backend (Fastify) │   │ Blockchain (Camp Origin │
│                    │   │         SDK)            │
│ • Auth (nonce)     │   │ • IP registration       │
│ • Course CRUD      │   │ • Metadata tokenization │
│ • Progress track   │   │ • Event indexing        │
│ • CheckMate routes │   │ • Testnet: Basecamp     │
└────────┬───────────┘   └─────────────────────────┘
         │
    ┌────▼────────────────┐
    │  AI / CheckMate     │
    │ • Rule-based mentor │
    │ • Topic matching    │
    │ • Skill gap detect  │
    └─────────────────────┘
```

## 🔄 Integration Flow

### 1. Authentication

```
User clicks "Connect Wallet"
  ↓
Web3Modal → get address
  ↓
POST /api/auth/nonce (optional signed nonce)
  ↓
Store JWT / session → redirect to dashboard
```

### 2. Course Upload & Registration

```
Creator fills form + uploads file
  ↓
Frontend uploads to IPFS/Camp → fileCid
  ↓
POST /api/courses/upload → tempId
  ↓
Backend calls Origin SDK → registers IP
  ↓
Receives: ipTokenId, metadataHash, txHash
  ↓
Frontend shows success with on-chain proof
```

### 3. Learning & CheckMate

```
Learner views course modules
  ↓
Marks module complete → POST /api/user/progress
  ↓
POST /api/mentor/suggest → CheckMate analyzes progress
  ↓
Returns: skill gaps, next recommended modules, project suggestions
  ↓
Frontend displays mentor guidance
```

## 📡 API Contracts

All endpoints assume `API_BASE = ${NEXT_PUBLIC_API_BASE}`

### Core Endpoints

**Auth**
- `POST /api/auth/nonce` → nonce for signing
- `POST /api/auth/verify` → verify signature → JWT
- `GET /api/me` → user profile

**Courses**
- `GET /api/courses` → list all
- `GET /api/courses/:id` → details + modules
- `POST /api/courses/upload` → metadata upload
- `GET /api/courses/onchain` → filtered to on-chain registered

**Progress**
- `GET /api/user/progress` → user progress
- `POST /api/user/progress` → mark module complete

**CheckMate**
- `POST /api/mentor/suggest` → recommend next steps
- `POST /api/mentor/explain` → topic explanation + links

**Trending**
- `GET /api/trending` → trending topics feed

**Blockchain**
- `POST /api/register-ip` → register course IP on-chain
- `GET /api/contract-info` → addresses & ABIs

## 📦 Tech Stack

| Component | Tech | Why |
|-----------|------|-----|
| Frontend | Next.js, TailwindCSS, Web3Modal | Fast, Vercel-friendly, wallet UX |
| Backend | Fastify, Postgres/Supabase, ethers.js | Lightweight, scalable, quick setup |
| Blockchain | Camp Origin SDK, Solidity (optional) | IP tokenization, testnet-ready |
| AI / CheckMate | Python FastAPI, spaCy, rules-based | MVP-ready, upgrade path to LLM |

## 🚀 Deployment

### Frontend
- **Host:** Vercel (auto-deploy from `main`)
- **Env vars:** `NEXT_PUBLIC_API_BASE`, `NEXT_PUBLIC_CONTRACT_ADDRESSES`
- **Command:** `vercel deploy`

### Backend
- **Host:** Railway, Render, or Vercel serverless + Supabase DB
- **Env vars:** `DATABASE_URL`, `CAMP_SDK_KEY`, `JWT_SECRET`
- **Command:** `npm run build && npm start`

### Blockchain
- **Testnet:** Camp Basecamp testnet
- **Deploy:** `npx hardhat run scripts/deploy.js --network basecamp`
- **Output:** Capture contract address & ABI → store in backend env

### AI / CheckMate
- **Host:** Railway or self-hosted
- **Env vars:** `BACKEND_DB_URL` (to query progress)
- **Command:** `uvicorn main:app --reload`

## 🧪 Testing & Demo Checklist

### Must-Pass Tests

- [ ] Wallet connects (Camp testnet)
- [ ] Creator uploads course → file CID + metadata saved
- [ ] Course registered on-chain → ipTokenId visible
- [ ] Learner views course, marks module complete
- [ ] CheckMate suggests next module based on progress
- [ ] Trending tab displays topics
- [ ] Responsive on mobile/tablet/desktop
- [ ] Error handling: network, tx rejection, upload failure

### Demo Script (5 min)

1. **Connect:** Click "Connect Wallet" → show address in header
2. **Upload:** Creator panel → upload test course → show temp listing
3. **Register:** Backend registers IP → show ipTokenId on course card
4. **Learn:** Learner clicks course → view modules → mark 1–2 complete
5. **CheckMate:** Suggest next step based on completed modules
6. **Trending:** Show trending tab with sample topics

## 📁 Folder Structure

```
Blocked_learning/
├── Frontend/
│   ├── docs/DESIGN.md         (Frontend design doc)
│   ├── README.md              (Frontend setup)
│   ├── pages/                 (Next.js pages)
│   ├── components/            (React components)
│   └── public/
├── Backend/
│   ├── docs/DESIGN.md         (Backend design doc)
│   ├── README.md              (Backend setup)
│   ├── src/routes/            (API endpoints)
│   ├── src/services/          (Business logic)
│   ├── migrations/            (DB schema)
│   └── seeds/                 (Demo data)
├── contracts/
│   ├── docs/DESIGN.md         (Blockchain design doc)
│   ├── README.md              (Contracts setup)
│   ├── contracts/             (Solidity files)
│   ├── scripts/               (Deploy scripts)
│   └── test/
├── AI/
│   ├── docs/DESIGN.md         (AI design doc)
│   ├── README.md              (AI setup)
│   ├── services/              (FastAPI or Node service)
│   ├── knowledge_base.json    (Rules & topics)
│   └── test/
└── README.md                  (This file)
```

## 🔐 Environment Variables

### Frontend (.env.local)

```
NEXT_PUBLIC_API_BASE=http://localhost:3001 (dev) or https://api.blocked-learning.xyz (prod)
NEXT_PUBLIC_CONTRACT_ADDRESSES={"registry":"0x...","courses":"0x..."}
```

### Backend (.env)

```
DATABASE_URL=postgresql://...
CAMP_SDK_KEY=your_camp_sdk_key
JWT_SECRET=your_jwt_secret
NODE_ENV=development
PORT=3001
```

### Blockchain (.env)

```
PRIVATE_KEY=your_wallet_private_key
CAMP_TESTNET_RPC=https://basecamp.camp/rpc
```

### AI (.env)

```
BACKEND_DB_URL=postgresql://...
OPENAI_API_KEY=your_key (optional, for future LLM)
```

## 📚 Resources & Docs

- **[Camp Network Docs](https://camp.xyz)** — Origin SDK, testnet info
- **[Next.js Docs](https://nextjs.org/docs)** — Framework reference
- **[Fastify Docs](https://www.fastify.io)** — Backend framework
- **[Supabase Docs](https://supabase.com/docs)** — DB & auth
- **[Web3Modal Docs](https://docs.web3modal.com)** — Wallet connection

## 🛠️ Development Workflow

### For Each Role

1. **Clone & setup** → follow role-specific README
2. **Read design doc** → `{role}/docs/DESIGN.md`
3. **Local dev** → `npm run dev` or equivalent
4. **Test against mock API/data** → seeds provided
5. **Integrate with other roles** → once endpoints ready
6. **Deploy to staging** → test full stack
7. **Deploy to production** → via CI/CD (Vercel, Railway, etc.)

### Communication

- **API contracts:** Defined in this README (Integration Flow section)
- **Breaking changes:** Update design docs + notify team
- **Blockers:** Escalate in daily standup

## 🎯 Hackathon Timeline (3-Day)

### Day 1: Foundational

- [ ] Repo scaffold & env setup
- [ ] Frontend: auth + dashboard skeleton
- [ ] Backend: DB schema + auth endpoints live
- [ ] Blockchain: deploy contracts to testnet
- [ ] AI: knowledge base initialized

### Day 2: Core Features

- [ ] Frontend: course list, upload form, player
- [ ] Backend: course CRUD, IP registration orchestration
- [ ] Blockchain: mint test certificates (optional)
- [ ] AI: CheckMate suggest & explain endpoints live

### Day 3: Polish & Demo

- [ ] All endpoints integrated & tested
- [ ] Frontend responsive + styled
- [ ] CheckMate suggestions working
- [ ] Trending page populated
- [ ] Deploy all services
- [ ] Record 2–3 min demo video
- [ ] Write README + submit to Camp

## 📝 License

See LICENSE file for details.

## 👥 Contributors

- Frontend Developer: [Name]
- Backend Developer: [Name]
- Blockchain Developer: [Name]
- AI Developer: [Name]

---

**Questions?** Reference the design doc for your role in `/docs/DESIGN.md`. For integration issues, check this README's "Integration Flow" section.

