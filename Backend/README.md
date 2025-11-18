# Backend Setup & Development

Welcome, Backend Developer! This folder contains the BLOCKEDLEARNING API server.

## Quick Reference

- **Design Doc:** See `docs/DESIGN.md` for full specifications
- **Tech Stack:** Node.js + Fastify (or Express), PostgreSQL/Supabase, ethers.js
- **Deploy:** Railway, Render, or Vercel serverless
- **Start Development:** `npm run dev`

## Prerequisites

- Node.js 18+
- PostgreSQL 12+ (or Supabase)
- Camp SDK key & testnet RPC endpoint

## Installation

```bash
cd Backend
npm install
```

## Environment Setup

Create `.env`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/blockedlearning
CAMP_SDK_KEY=your_camp_sdk_key
JWT_SECRET=your_random_jwt_secret
NODE_ENV=development
PORT=3001
CORS_ORIGIN=http://localhost:3000
```

## Development

```bash
npm run dev
```

Server runs on `http://localhost:3001`.

## Database

### Setup

```bash
# Run migrations
npm run migrate

# Seed demo data
npm run seed
```

### Schema

```sql
-- users
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  wallet VARCHAR(42) UNIQUE NOT NULL,
  display_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- courses
CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  creator_wallet VARCHAR(42) NOT NULL,
  file_cid VARCHAR(255),
  ip_token_id VARCHAR(255),
  metadata_hash VARCHAR(255),
  tags TEXT[],
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- modules
CREATE TABLE modules (
  id SERIAL PRIMARY KEY,
  course_id INTEGER REFERENCES courses(id),
  title VARCHAR(255),
  resource_url TEXT,
  module_order INTEGER
);

-- progress
CREATE TABLE progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  module_id INTEGER REFERENCES modules(id),
  completed_at TIMESTAMP DEFAULT NOW()
);

-- trending
CREATE TABLE trending (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  summary TEXT,
  source VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Project Structure

```
src/
├── routes/
│   ├── auth.ts             # Auth endpoints
│   ├── courses.ts          # Course CRUD
│   ├── progress.ts         # Progress tracking
│   ├── mentor.ts           # CheckMate endpoints
│   ├── trending.ts         # Trending feed
│   └── admin.ts            # Admin utilities
├── services/
│   ├── courseService.ts    # Course business logic
│   ├── authService.ts      # Auth logic
│   ├── checkmate.ts        # CheckMate rule engine
│   └── blockchain.ts       # Camp SDK integration
├── middleware/
│   ├── auth.ts             # JWT verification
│   └── errorHandler.ts
├── db/
│   ├── client.ts           # DB connection
│   └── migrations/         # DB schema
├── types/
│   └── index.ts            # TypeScript interfaces
└── app.ts                  # Fastify setup
```

## API Endpoints

See `docs/DESIGN.md` for full API spec. Quick reference:

### Auth

```
POST /api/auth/nonce
POST /api/auth/verify
GET /api/me
```

### Courses

```
GET /api/courses
GET /api/courses/:id
POST /api/courses/upload
POST /api/courses/publish
GET /api/courses/onchain
```

### Progress

```
GET /api/user/progress
POST /api/user/progress
```

### CheckMate

```
POST /api/mentor/suggest
POST /api/mentor/explain
```

### Trending

```
GET /api/trending
```

## Implementation Order

1. **Auth endpoints** → `auth.ts`, `authService.ts`
2. **Course CRUD** → `courses.ts`, `courseService.ts`
3. **Progress tracking** → `progress.ts`
4. **CheckMate** → `mentor.ts`, `checkmate.ts`
5. **Blockchain integration** → `blockchain.ts`
6. **Trending** → `trending.ts`

## Key Services

### AuthService

Handles JWT & nonce verification.

```typescript
import { authService } from '@/services/authService';

const nonce = authService.generateNonce();
const token = authService.verifySignature(wallet, signature, nonce);
```

### BlockchainService

Calls Camp Origin SDK to register IP.

```typescript
import { blockchainService } from '@/services/blockchain';

const result = blockchainService.registerIP({
  fileCid,
  title,
  tags,
  creator,
});
```

### CheckMateService

Rule-based mentor logic.

```typescript
import { checkmate } from '@/services/checkmate';

const suggestion = checkmate.suggest(userProgress);
const explanation = checkmate.explain(question);
```

## Testing

```bash
# Unit tests
npm run test

# Test with seed data
npm run test:integration
```

## Build & Deploy

### Local Docker

```bash
docker-compose up -d
npm run migrate
npm run seed
npm run dev
```

### Deploy to Railway

```bash
# Connect repo and deploy from Dashboard
# Or use CLI:
railway up
```

### Deploy to Vercel (Serverless)

```bash
# Requires Supabase for managed DB
npm run build
vercel deploy
```

## Common Tasks

### Add New Endpoint

1. Create route in `src/routes/newRoute.ts`
2. Register in `src/app.ts` → `app.register(newRoute)`
3. Add service logic in `src/services/`
4. Add tests

### Add Database Migration

```bash
npm run generate-migration --name create_new_table
# Edit migration file
npm run migrate
```

### Test Endpoint with Postman

See `postman-collection.json` (included) or import from workspace.

## Troubleshooting

### Database connection failing?

- Check `DATABASE_URL` is correct
- Verify PostgreSQL is running
- For Supabase, use connection string from dashboard

### Camp SDK not working?

- Verify `CAMP_SDK_KEY` is valid
- Check RPC endpoint is accessible
- Ensure account has testnet tokens

### CORS errors?

- Check `CORS_ORIGIN` includes frontend URL
- Add frontend URL to `origins` in `app.ts`

## Resources

- [Fastify Docs](https://www.fastify.io)
- [PostgreSQL Docs](https://www.postgresql.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Camp SDK Docs](https://camp.xyz)

---

**Questions?** Check `docs/DESIGN.md` for the full design specification.
