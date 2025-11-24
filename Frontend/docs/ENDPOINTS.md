# Frontend API Endpoints Reference

**Backend URL:** `https://blockbackend-production.up.railway.app`  
**Status:** ✅ All endpoints deployed and tested

---

## 🔐 Authentication

**POST /api/auth/nonce** - Generate nonce for wallet signature
```typescript
POST /api/auth/nonce
Body: { "wallet": "0x..." }
Response: { "statusCode": 200, "nonce": "...", "expiresIn": 300 }
```

**POST /api/auth/verify** - Verify signature & get JWT *(optional)*
**GET /api/me** - Get user profile *(requires auth)*

---

## 📚 Courses

**GET /api/courses** - List all courses with pagination
```typescript
GET /api/courses?limit=10&offset=0
Response: {
  "statusCode": 200,
  "data": [...courses],
  "pagination": { "limit": 10, "offset": 0, "total": 100 }
}
```

**GET /api/courses/:id** - Get course details with modules  
**GET /api/courses/creator/:wallet** - Get courses by creator  
**GET /api/courses/onchain** - Get blockchain-registered courses  
**POST /api/courses/upload** - Upload course metadata  
**POST /api/courses/publish** - Publish to blockchain *(requires blockchain)*

---

## 📊 Progress Tracking

**GET /api/user/progress** - Get user's progress  
**POST /api/user/progress** - Mark module complete  
**GET /api/user/progress/:courseId** - Course-specific progress

*Note: Requires `x-user-id` header for now (JWT auth coming)*

---

## 🤖 CheckMate AI Mentor

**POST /api/mentor/explain** - Get AI explanation
```typescript
Body: { "question": "What is a smart contract?" }
```

**POST /api/mentor/suggest** - Next-step recommendations  
**GET /api/mentor/profile/:wallet** - Learning profile analysis  
**POST /api/mentor/audit-code** - Smart contract security audit  
**POST /api/mentor/generate-project** - Generate project template

---

## 🎬 Content Analysis

**POST /api/analyze/video** - Analyze video content  
**POST /api/analyze/quality** - Content quality scoring  
**POST /api/generate/quiz** - Generate quiz from content  
**POST /api/search/semantic** - Natural language search

---

## 🔥 Trending

**GET /api/trending** - Get trending topics & skills

---

## 👨‍💼 Admin Dashboard

**GET /api/admin/stats** - Platform statistics
```typescript
Response: {
  "totalUsers": 150,
  "totalCourses": 45,
  "totalXp": 15000,
  "topUsers": [...]
}
```

**GET /api/admin/users** - List all users  
**POST /api/admin/ban** - Ban/unban user

---

## 📝 Quick Start

```typescript
// .env.local
NEXT_PUBLIC_API_BASE=https://blockbackend-production.up.railway.app

// Fetch courses
const res = await fetch(`${API_BASE}/api/courses`);
const data = await res.json();

// Ask CheckMate
const res = await fetch(`${API_BASE}/api/mentor/explain`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ question: 'What is DeFi?' })
});
```

**See Backend/docs/ENDPOINTS.md for full API documentation**
