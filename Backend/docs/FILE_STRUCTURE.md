# Backend File Structure

```
Backend/
├── src/
│   ├── routes/
│   │   ├── auth.ts                  # Auth endpoints (nonce, verify, me)
│   │   ├── courses.ts               # Course CRUD endpoints
│   │   ├── progress.ts              # Progress tracking endpoints
│   │   ├── mentor.ts                # CheckMate endpoints (suggest, explain)
│   │   ├── trending.ts              # Trending feed endpoint
│   │   └── admin.ts                 # Admin utilities (seed, stats)
│   │
│   ├── services/
│   │   ├── authService.ts           # Auth business logic (nonce, verify)
│   │   ├── courseService.ts         # Course CRUD logic
│   │   ├── blockchainService.ts     # Camp Origin SDK integration
│   │   ├── checkmate.ts             # CheckMate rule engine logic
│   │   └── trendingService.ts       # Trending aggregation logic
│   │
│   ├── middleware/
│   │   ├── auth.ts                  # JWT verification middleware
│   │   ├── errorHandler.ts          # Error handling middleware
│   │   └── cors.ts                  # CORS configuration
│   │
│   ├── db/
│   │   ├── client.ts                # Database connection (Postgres)
│   │   ├── schema.sql               # DB schema definition
│   │   └── migrations/              # Migration files
│   │       ├── 001_init.sql
│   │       ├── 002_users.sql
│   │       └── ...
│   │
│   ├── types/
│   │   └── index.ts                 # TypeScript interfaces & types
│   │
│   ├── app.ts                       # Fastify app setup & routes registration
│   └── server.ts                    # Server entry point
│
├── seeds/
│   ├── demo-courses.ts              # Demo data seeder
│   └── users.ts                     # Sample users
│
├── test/
│   ├── auth.test.ts
│   ├── courses.test.ts
│   └── integration.test.ts
│
├── .env                             # Environment variables (git-ignored)
├── .env.example                     # Example env vars
├── package.json
├── tsconfig.json
├── docker-compose.yml               # Local Postgres setup
├── Dockerfile
├── README.md
└── .gitignore
```

## Key Folders Explained

- **`routes/`** — API endpoint handlers (organized by feature)
- **`services/`** — Business logic (separates from routes)
- **`middleware/`** — Request/response middleware
- **`db/`** — Database connection & schema
- **`types/`** — Shared TypeScript interfaces
- **`seeds/`** — Demo data for development
- **`test/`** — Test files

## Key Files

- **`app.ts`** — Fastify app initialization & route registration
- **`server.ts`** — Server startup
- **`db/schema.sql`** — Complete database schema
- **`db/migrations/`** — Database version control
