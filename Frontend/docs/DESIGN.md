# BLOCKEDLEARNING — Frontend Developer Design Doc

## Purpose

Build a responsive, accessible, and production-grade frontend that allows learners and creators to connect wallets, upload and consume blockchain-only courses, view CheckMate guidance, and browse Trending topics. Must integrate with backend APIs and on-chain endpoints.

## Tech Stack

* Framework: **Next.js** (recommended for routing and Vercel deploy)
* Styling: **TailwindCSS**
* Wallet: **Web3Modal** + **ethers.js** (or **viem**)
* HTTP: **Axios**
* State: **Zustand** or **React Context**
* Build & Deploy: **Vercel**
* Linting & Type safety: **ESLint**, **Prettier**, optionally **TypeScript** (recommended)

## Pages & Components

### Pages (routes)

* `/` — Landing / About / Connect Wallet CTA
* `/dashboard` — Learner dashboard (progress, recommendations)
* `/courses` — Marketplace (list & filters)
* `/courses/[id]` — Course viewer (modules, content player, mark complete)
* `/creator/upload` — Creator upload form
* `/creator/my-courses` — Creator management & IP status
* `/trending` — Trending topics list
* `/checkmate` — Mentor panel (optionally modal/sidebar used across pages)

### Reusable Components

* `WalletConnectButton` (connect/disconnect, show address)
* `CourseCard` (title, creator, tags, ipTokenId, CTA)
* `CoursePlayer` (video/pdf embed, fallback download)
* `ProgressBar` / `Badge`
* `UploadForm` (title, description, tags, file input)
* `MentorPanel` (CheckMate UI)
* `TrendingList` / `TrendingCard`
* `Toast` / `Modal` for UX feedback

## UX & Accessibility

* Mobile-first responsive design
* Keyboard navigable, proper ARIA labels
* Clear transaction states & user feedback for blockchain interactions
* Graceful error messages (network, wallet, tx failures)

## Integration Contracts (APIs)

Assume backend base URL `API_BASE`.

### Auth / User

* `GET ${API_BASE}/api/me` — returns `{ wallet, displayName?, profileUrl? }`

### Courses

* `GET ${API_BASE}/api/courses` → list
  * Response: `[{ id, title, description, creator, ipTokenId, fileUrl, tags, difficulty, createdAt }]`

* `GET ${API_BASE}/api/courses/:id` → course details + modules
  * Response: `{ id, title, modules:[{id, title, resourceUrl, type}], creator, ipTokenId, metadataHash }`

* `POST ${API_BASE}/api/courses/upload` → initial upload metadata (frontend uploads file to IPFS or storage and provides fileCid)
  * Request: `{ title, description, tags, fileCid, fileName, price? }`
  * Response: `{ tempId, next: "register-onchain", registerPayload }`

* `GET ${API_BASE}/api/courses/onchain` → onchain-registered courses

### Progress

* `GET ${API_BASE}/api/user/progress` → `{ completedModules: [moduleId], badges: [...], xp }`
* `POST ${API_BASE}/api/user/progress` body `{ moduleId }` → marks completion, triggers optional onchain event via backend

### CheckMate

* `POST ${API_BASE}/api/mentor/suggest` body `{ topic, progress }` → `{ suggestion, nextSteps, recommended_modules }`
* `POST ${API_BASE}/api/mentor/explain` body `{ topic, level }` → `{ topic, explanation, code_examples, difficulty_level }`
* `POST ${API_BASE}/api/mentor/profile` body `{ wallet, total_modules, topics_breakdown, learning_pace, total_hours, skill_level }` → `{ skill_level, strengths, weaknesses, four_week_plan, career_readiness }`
* `POST ${API_BASE}/api/mentor/audit-code` body `{ code }` → `{ vulnerabilities, severity, recommendations }`
* `POST ${API_BASE}/api/mentor/generate-project` body `{ topic, difficulty }` → `{ project_name, description, modules, starter_code }`

### Blockchain

* `POST ${API_BASE}/api/register-ip` body `{ tempId, metadataHash, creator }` → `{ txHash, ipTokenId }`
* `GET ${API_BASE}/api/contract-info` → returns contract addresses & ABIs for frontend read calls

### Content Intelligence

* `POST ${API_BASE}/api/analyze/video` body `{ video_id, title }` → `{ metadata, topics, objectives, difficulty_level }`
* `POST ${API_BASE}/api/generate/quiz` body `{ video_id }` → `{ quiz_questions, answers, difficulty }`

### Trending

* `GET ${API_BASE}/api/trending` → `[{ id, title, summary, tag, sourceUrl, date }]`
* `GET ${API_BASE}/api/trends/industry` → `{ trending_skills, career_paths, market_insights, salary_trends }`

## UX Flows (exact)

### Connect Wallet

* Click `WalletConnectButton` → Web3Modal prompt → get `address` → POST `/api/me` signature flow optional → store in state/localStorage → redirect to `/dashboard`.

### Upload Course

* Creator fills `UploadForm` → frontend uploads file to IPFS/Camp storage (or streams to backend) → receives `fileCid` → call `POST /api/courses/upload` with metadata → backend returns `registerPayload` → call `POST /api/register-ip` or prompt creator to sign and trigger onchain registration → show success with ipTokenId and gateway URL.

### Course Viewing & Completion

* Load modules sequentially → each module `Mark as completed` triggers `POST /api/user/progress` → update CheckMate recommendations and progress UI.

## Error Handling & Edge Cases

* Wallet not installed: show install link and fallback to manual address input (dev mode only).
* Transaction rejected: show error toast with `err.message`, allow retry.
* File upload failed: retry and allow smaller chunk uploads.
* Slow gateways: show loading spinner and fallback download link.

## Testing & QA

* Unit tests for major UI components (Jest + React Testing Library)
* Integration tests for wallet flow (mock provider)
* Manual test checklist (demo-ready):
  * Connect wallet, display address
  * Upload a test course, show temp listing
  * Register IP and show ipTokenId
  * Mark a module complete, CheckMate suggests next step
  * Trending page shows items
  * Responsive across mobile/tablet/desktop

## Dev & Deployment

* Repo branch: `frontend`
* CI: Vercel auto-deploy on `main`
* Env vars in Vercel: `NEXT_PUBLIC_API_BASE`, `NEXT_PUBLIC_CONTRACT_ADDRESSES` (read-only)
* Provide `frontend/README.md` with setup commands, env vars, and local mock data

## Deliverables

* Deployed Vercel URL
* `/frontend` folder with clear README and component docs
* Storybook (optional) for components

## AI Integration (CheckMate Mentor Panel)

**Status:** ✅ AI service deployed and ready for integration

### Available AI Features

The CheckMate mentor system is now powered by the deployed AI service. Frontend can integrate:

#### Learning Mentor Features

* **Explain Topics** — Get personalized explanations with code examples
* **Next-Step Suggestions** — AI recommends what to learn next based on progress
* **Learning Profile** — Comprehensive analysis with 4-week personalized learning plan
* **Code Auditing** — Security vulnerability detection for practice code
* **Project Generation** — Custom project templates based on skill level and topic

#### Content Intelligence Features

* **Video Analysis** — Auto-generate metadata (topics, objectives, difficulty) from video content
* **Quality Scoring** — Assess content quality to maintain standards
* **Quiz Generation** — Auto-create quizzes from video content
* **Thumbnail Generation** — Smart AI-generated thumbnails

#### Discovery Features

* **Semantic Search** — Find content using natural language
* **Recommendations** — Get personalized video recommendations
* **Industry Trends** — See trending skills and career paths with salary insights

### Integration Points

1. Add "CheckMate Mentor" button/panel to `/dashboard` and `/courses/[id]`
2. Create `components/MentorPanel.tsx` that calls `/api/mentor/*` endpoints
3. Show "Industry Trends" on `/trending` page with career insights
4. Add quiz generation UI to course upload flow for creators

### Example Component

```tsx
// components/MentorChat.tsx
const mentorExplain = async (topic: string, level: string) => {
  const res = await fetch('/api/mentor/explain', {
    method: 'POST',
    body: JSON.stringify({ topic, level })
  });
  return res.json();
};
```

### Service Details

* **AI Model:** Google Gemini 2.0 Flash
* **Deployed On:** Railway https://blockedlearning-production.up.railway.app/
* **All Endpoints:** Documented at `/docs` endpoint
* **Response Time:** ~2-5 seconds per request
https://blockedlearning-production.up.railway.app/