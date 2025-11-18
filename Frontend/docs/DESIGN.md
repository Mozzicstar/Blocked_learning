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

* `POST ${API_BASE}/api/mentor/suggest` body `{ wallet, progress }` → `{ suggestion, nextSteps }`
* `POST ${API_BASE}/api/mentor/explain` body `{ question }` → `{ topic, explanation, recommendedModules }`

### Blockchain

* `POST ${API_BASE}/api/register-ip` body `{ tempId, metadataHash, creator }` → `{ txHash, ipTokenId }`
* `GET ${API_BASE}/api/contract-info` → returns contract addresses & ABIs for frontend read calls

### Trending

* `GET ${API_BASE}/api/trending` → `[{ id, title, summary, tag, sourceUrl, date }]`

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
