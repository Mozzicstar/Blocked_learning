# Frontend File Structure

```
Frontend/
├── app/                             # Next.js 13+ app directory
│   ├── page.tsx                     # Landing page
│   ├── layout.tsx                   # Root layout with providers
│   ├── globals.css                  # Global styles
│   └── (routes)/
│       ├── dashboard/
│       │   └── page.tsx             # Learner dashboard
│       ├── courses/
│       │   ├── page.tsx             # Course marketplace
│       │   └── [id]/
│       │       └── page.tsx         # Course viewer
│       ├── creator/
│       │   ├── upload/
│       │   │   └── page.tsx         # Upload course
│       │   └── my-courses/
│       │       └── page.tsx         # Creator dashboard
│       ├── trending/
│       │   └── page.tsx             # Trending topics
│       └── admin/
│           └── page.tsx             # Admin dashboard (stats, users)
│
├── components/
│   ├── WalletConnect.tsx            # Wallet connection
│   ├── CourseCard.tsx               # Course display card
│   ├── ModulePlayer.tsx             # Video/content player
│   ├── ProgressBar.tsx              # Progress indicator
│   ├── MentorPanel.tsx              # CheckMate AI mentor
│   ├── SearchBar.tsx                # Semantic search
│   ├── TrendingCard.tsx             # Trending topic card
│   ├── Navbar.tsx                   # Navigation header
│   ├── AdminStats.tsx               # Admin statistics display
│   └── ui/                          # shadcn/ui components
│       ├── button.tsx
│       ├── dialog.tsx
│       ├── table.tsx
│       └── ...
│
├── lib/
│   ├── api.backend.ts               # Backend API calls
│   ├── api.ts                       # General API utilities
│   ├── wallet.tsx                   # Wallet integration
│   ├── utils.ts                     # Helper functions
│   └── client.ts                    # HTTP client setup
│
├── stores/
│   ├── useUserStore.ts              # User state (auth, profile)
│   └── useCourseStore.ts            # Course data state
│
├── types/
│   └── index.d.ts                   # TypeScript definitions
│
├── public/
│   └── fonts/                       # Custom fonts
│
├── .env.local                       # Environment variables
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.js
└── README.md
```

## Key Folders Explained

- **`pages/`** — Next.js routes (auto-routes from file names)
- **`components/`** — Reusable React components
- **`lib/`** — Utilities (API, web3, constants, types)
- **`state/`** — Global state management (Zustand)
- **`styles/`** — CSS & styling files
- **`public/`** — Static assets (images, fonts, etc)
