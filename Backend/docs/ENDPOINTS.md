# Backend Endpoints

## Endpoints You Consume

### Camp Origin SDK
- Calls to register IP (internal, not HTTP)

### Blockchain Events
- Watch on-chain events for IP registration

## Endpoints You Provide

### Auth
- `POST /api/auth/nonce` → `{ nonce }`
- `POST /api/auth/verify` body `{ wallet, signature, nonce }` → `{ token, user: { wallet, displayName } }`
- `GET /api/me` → `{ wallet, displayName?, profileUrl? }`

### Courses
- `GET /api/courses` → `[{ id, title, description, creator, ipTokenId, fileUrl, tags, difficulty, createdAt }]`
- `GET /api/courses/:id` → `{ id, title, modules, creator, ipTokenId, metadataHash }`
- `POST /api/courses/upload` body `{ title, description, tags, fileCid, fileName, price? }` → `{ tempId, registerPayload }`
- `POST /api/courses/publish` body `{ tempId, metadataHash, creator }` → calls Origin SDK
- `GET /api/courses/onchain` → filtered on-chain courses

### Progress
- `GET /api/user/progress` → `{ completedModules: [moduleId], badges, xp }`
- `POST /api/user/progress` body `{ moduleId }` → `{ success: true, nextSuggestion }`

### CheckMate (Mentor)
- `POST /api/mentor/suggest` body `{ wallet, progress }` → `{ suggestion, nextModules, rationale }`
- `POST /api/mentor/explain` body `{ question }` → `{ topic, explanation, recommendedModules }`

### Trending
- `GET /api/trending` → `[{ id, title, summary, tag, sourceUrl, date }]`

### Admin (Dev Only)
- `GET /api/admin/stats` → usage metrics
- `POST /api/admin/seed` → seed demo data

---

**Port:** `3001` (default)

**Auth:** Signed nonce verification (ethers.js `recoverAddress`)

**DB:** PostgreSQL (Supabase or local)

**SDK:** Camp Origin SDK for IP registration
