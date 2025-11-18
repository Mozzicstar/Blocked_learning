# Frontend Endpoints

## Endpoints You'll Consume

### Auth
- `GET /api/me` → `{ wallet, displayName?, profileUrl? }`

### Courses
- `GET /api/courses` → `[{ id, title, description, creator, ipTokenId, fileUrl, tags, difficulty, createdAt }]`
- `GET /api/courses/:id` → `{ id, title, modules:[{id, title, resourceUrl, type}], creator, ipTokenId, metadataHash }`
- `POST /api/courses/upload` (you upload file first) → `{ tempId, next: "register-onchain", registerPayload }`
- `GET /api/courses/onchain` → on-chain registered courses

### Progress
- `GET /api/user/progress` → `{ completedModules: [moduleId], badges: [...], xp }`
- `POST /api/user/progress` body `{ moduleId }` → marks completion

### CheckMate
- `POST /api/mentor/suggest` body `{ wallet, progress }` → `{ suggestion, nextSteps }`
- `POST /api/mentor/explain` body `{ question }` → `{ topic, explanation, recommendedModules }`

### Blockchain
- `POST /api/register-ip` body `{ tempId, metadataHash, creator }` → `{ txHash, ipTokenId }`
- `GET /api/contract-info` → contract addresses & ABIs

### Trending
- `GET /api/trending` → `[{ id, title, summary, tag, sourceUrl, date }]`

## Endpoints You Provide

None (Frontend is a consumer only)

---

**Base URL:** `process.env.NEXT_PUBLIC_API_BASE`

**Auth:** Store JWT in localStorage/cookie after `/api/me` call

**Wallet:** Web3Modal for provider, ethers.js for signing
