# BLOCKEDLEARNING — Frontend Developer Design Doc

## 🎯 Backend Status: ✅ COMPLETE & DEPLOYED

**Backend API:** https://blockbackend-production.up.railway.app/  
**AI Service:** https://blockedlearning-production.up.railway.app/  
**All Endpoints:** Tested & Working ✓

Backend is ready for immediate integration!

---

## 🚀 YOUR NEXT STEPS

### 1. Environment Setup

```bash
NEXT_PUBLIC_API_BASE=https://blockbackend-production.up.railway.app
NEXT_PUBLIC_AI_SERVICE=https://blockedlearning-production.up.railway.app
```

### 2. Priority Integration Order

**Phase 1 - Core Features (Start Here):**
- ✅ Wallet connection → `/api/auth/nonce`
- ✅ Course marketplace → `/api/courses`
- ✅ Course viewer → `/api/courses/:id`
- ✅ User dashboard → `/api/user/progress`
- ✅ Creator dashboard → `/api/courses/creator/:wallet`

**Phase 2 - AI-Powered Features:**
- ✅ CheckMate mentor → `/api/mentor/explain`, `/api/mentor/suggest`
- ✅ Code audit → `/api/mentor/audit-code`
- ✅ Project generator → `/api/mentor/generate-project`
- ✅ Semantic search → `/api/search/semantic`
- ✅ Content analysis → `/api/analyze/video`, `/api/analyze/quality`
- ✅ Quiz generation → `/api/generate/quiz`

**Phase 3 - Creator & Admin:**
- ✅ Course upload → `/api/courses/upload`
- ✅ **Course publish (NEW!)** → `/api/courses/publish` - Register course on-chain
- ✅ Admin dashboard → `/api/admin/stats`, `/api/admin/users`
- ✅ User management → `/api/admin/ban`
- ✅ Blockchain course registration now fully implemented!

**Phase 4 - Discovery:**
- ✅ Trending topics → `/api/trending`
- ✅ Learning profiles → `/api/mentor/profile/:wallet`

### 3. Quick Test

All endpoints are live:
```bash
curl https://blockbackend-production.up.railway.app/health
curl https://blockbackend-production.up.railway.app/api/courses
```

---

## Tech Stack

* **Framework:** Next.js
* **Styling:** TailwindCSS
* **Wallet:** Web3Modal + ethers.js
* **HTTP:** Axios or fetch
* **State:** Zustand
* **Deploy:** Vercel

## Key Backend Endpoints

### Auth
- `POST /api/auth/nonce` → Generate nonce for wallet
- `POST /api/auth/verify` → Verify signature (optional)
- `GET /api/me` → Get user info

### Courses
- `GET /api/courses` → List all courses
- `GET /api/courses/:id` → Course details + modules
- `POST /api/courses/upload` → Upload course metadata
- `POST /api/courses/publish` → **[NEW]** Register course on-chain & publish
- `GET /api/courses/onchain` → On-chain registered courses
- `GET /api/blockchain/courses/total` → Total courses on-chain
- `GET /api/blockchain/courses/:id` → On-chain course details

### Progress
- `GET /api/user/progress` → User's progress
- `POST /api/user/progress` → Mark module complete

### CheckMate AI Mentor
- `POST /api/mentor/explain` → Get topic explanation
- `POST /api/mentor/suggest` → Next-step recommendations
- `POST /api/mentor/profile/:wallet` → Learning profile analysis
- `POST /api/mentor/audit-code` → Code security audit
- `POST /api/mentor/generate-project` → Generate project template

### Content
- `POST /api/analyze/video` → Analyze video content
- `POST /api/generate/quiz` → Generate quiz
- `POST /api/search/semantic` → Semantic search

### Admin
- `GET /api/admin/stats` → Platform statistics
- `GET /api/admin/users` → User list

### Blockchain (NEW!)
- `POST /api/blockchain/courses/register` → Register course on-chain
- `GET /api/blockchain/courses/:id` → Get on-chain course details
- `GET /api/blockchain/courses/total` → Get total courses registered
- `GET /api/blockchain/certificates/total` → Get total certificates issued
- `GET /api/blockchain/status` → Check blockchain connection status

## Key Components to Build

### Core
* `WalletConnectButton` - Connect/disconnect wallet
* `CourseCard` - Display course info
* `CoursePlayer` - Video/content viewer
* `ProgressBar` - Show completion

### AI Features
* `MentorPanel` - CheckMate AI assistant
* `SemanticSearch` - Natural language search
* `TrendingList` - Industry trends

### Creator
* `UploadForm` - Course upload UI
* `CreatorDashboard` - Manage courses

## Example Integration

```tsx
// Fetch courses
const fetchCourses = async () => {
  const response = await fetch(
    'https://blockbackend-production.up.railway.app/api/courses'
  );
  return response.json();
};

// CheckMate mentor
const askMentor = async (question: string) => {
  const response = await fetch(
    'https://blockbackend-production.up.railway.app/api/mentor/explain',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question })
    }
  );
  return response.json();
};

// [NEW] Publish course on blockchain
const publishCourse = async (courseId: string) => {
  const response = await fetch(
    'https://blockbackend-production.up.railway.app/api/courses/publish',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId })
    }
  );
  return response.json();
};

// [NEW] Get blockchain course details
const getOnchainCourse = async (courseId: string) => {
  const response = await fetch(
    `https://blockbackend-production.up.railway.app/api/blockchain/courses/${courseId}`
  );
  return response.json();
};
```

## Publishing a Course to Blockchain (NEW!)

**Flow:**
1. Creator uploads course via `/api/courses/upload`
2. Creator clicks "Publish" to register on-chain
3. Frontend calls `/api/courses/publish` with `courseId`
4. Backend:
   - Registers course on IPRegistry smart contract
   - Returns `courseId`, `txHash`, `metadataHash`
5. Frontend displays transaction confirmation
6. Course is now on-chain with immutable metadata!

## Deliverables

* **Vercel Deployment** - Live frontend
* **Wallet Integration** - Full auth flow
* **Course Marketplace** - Browse & view courses
* **Course Publisher** - Upload and publish courses on-chain
* **CheckMate Mentor** - AI assistant UI
* **User Dashboard** - Progress tracking
* **Blockchain Integration** - Course registration on Camp Network testnet

**Backend is 100% ready** — All endpoints tested & live!
- ✅ Core API functional
- ✅ AI service integrated
- ✅ Blockchain write operations implemented
- ✅ Database configured
- ✅ Authentication working
