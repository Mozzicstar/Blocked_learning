# Frontend File Structure

```
Frontend/
├── pages/
│   ├── index.tsx                    # Landing page
│   ├── dashboard.tsx                # Learner dashboard (progress, recommendations)
│   ├── courses/
│   │   ├── index.tsx                # Marketplace (list & filters)
│   │   └── [id].tsx                 # Course viewer (modules, player, mark complete)
│   ├── creator/
│   │   ├── upload.tsx               # Creator upload form
│   │   └── my-courses.tsx           # Creator dashboard & IP status
│   ├── trending.tsx                 # Trending topics list
│   ├── _app.tsx                     # Global setup (providers, theme)
│   ├── _document.tsx                # Document wrapper
│   └── 404.tsx                      # Not found
│
├── components/
│   ├── WalletConnectButton.tsx      # Wallet connection UI
│   ├── CourseCard.tsx               # Course card (title, creator, tags, CTA)
│   ├── CoursePlayer.tsx             # Video/PDF player + fallback download
│   ├── ProgressBar.tsx              # Progress indicator
│   ├── Badge.tsx                    # Achievement badge
│   ├── UploadForm.tsx               # Course upload form
│   ├── MentorPanel.tsx              # CheckMate mentor UI
│   ├── TrendingCard.tsx             # Trending topic card
│   ├── TrendingList.tsx             # Trending topics list
│   ├── Toast.tsx                    # Toast notifications
│   ├── Modal.tsx                    # Modal wrapper
│   ├── Navigation.tsx               # Nav bar / header
│   └── Footer.tsx                   # Footer
│
├── lib/
│   ├── api.ts                       # Axios instance + API call functions
│   ├── web3.ts                      # Wallet utilities (connect, sign, recover)
│   ├── constants.ts                 # API URLs, contract addresses
│   └── types.ts                     # TypeScript interfaces
│
├── state/
│   ├── store.ts                     # Zustand store (user, courses, progress)
│   └── hooks.ts                     # Custom hooks to access store
│
├── styles/
│   ├── globals.css                  # TailwindCSS + global styles
│   └── Home.module.css              # Page-specific styles (optional)
│
├── public/
│   ├── favicon.ico
│   └── (static assets)
│
├── .env.local                       # Local env vars (git-ignored)
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── next.config.js
├── README.md
└── .gitignore
```

## Key Folders Explained

- **`pages/`** — Next.js routes (auto-routes from file names)
- **`components/`** — Reusable React components
- **`lib/`** — Utilities (API, web3, constants, types)
- **`state/`** — Global state management (Zustand)
- **`styles/`** — CSS & styling files
- **`public/`** — Static assets (images, fonts, etc)
