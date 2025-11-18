# Frontend Setup & Development

Welcome, Frontend Developer! This folder contains the BLOCKEDLEARNING frontend application built with Next.js.

## Quick Reference

- **Design Doc:** See `docs/DESIGN.md` for full specifications
- **Tech Stack:** Next.js, TypeScript, TailwindCSS, Web3Modal, ethers.js
- **Deploy:** Vercel
- **Start Development:** `npm run dev`

## Prerequisites

- Node.js 18+
- npm or yarn
- A wallet with Camp testnet tokens

## Installation

```bash
cd Frontend
npm install
```

## Environment Setup

Create `.env.local`:

```env
NEXT_PUBLIC_API_BASE=http://localhost:3001
NEXT_PUBLIC_CONTRACT_ADDRESSES={"registry":"0x...","courses":"0x..."}
NEXT_PUBLIC_CHAIN_ID=626  # Camp testnet chain ID
```

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── pages/
│   ├── index.tsx           # Landing page
│   ├── dashboard.tsx       # Learner dashboard
│   ├── courses/
│   │   ├── index.tsx       # Marketplace
│   │   └── [id].tsx        # Course viewer
│   ├── creator/
│   │   ├── upload.tsx      # Upload form
│   │   └── my-courses.tsx  # Creator dashboard
│   ├── trending.tsx        # Trending topics
│   └── _app.tsx            # Global setup
├── components/
│   ├── WalletConnectButton.tsx
│   ├── CourseCard.tsx
│   ├── CoursePlayer.tsx
│   ├── UploadForm.tsx
│   ├── MentorPanel.tsx
│   └── ...
├── lib/
│   ├── api.ts              # Axios instance & API calls
│   ├── web3.ts             # Wallet utilities
│   └── ...
├── state/
│   └── store.ts            # Zustand store
└── styles/
    └── globals.css         # TailwindCSS
```

## Key Components to Implement

### 1. WalletConnectButton

Handles wallet connection via Web3Modal.

```typescript
// Example usage
import { WalletConnectButton } from '@/components/WalletConnectButton';

export default function Home() {
  return <WalletConnectButton />;
}
```

### 2. Course Upload Form

Allows creators to upload courses to IPFS and register on-chain.

**Flow:**
1. User fills form (title, description, tags, file)
2. Frontend uploads file to IPFS → gets `fileCid`
3. POST `/api/courses/upload` with metadata
4. Backend returns `tempId`
5. Show success message with onchain registration status

### 3. CheckMate Mentor Panel

Displays recommendations based on user progress.

**Endpoints:**
- `POST /api/mentor/suggest` → next recommended module
- `POST /api/mentor/explain` → topic explanation

## API Integration

### Example API Call

```typescript
import { api } from '@/lib/api';

async function getCourses() {
  try {
    const response = await api.get('/courses');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch courses:', error);
  }
}
```

### Expected Backend Responses

See `docs/DESIGN.md` for full API contract. Key endpoints:

- `GET /api/courses` → `Course[]`
- `GET /api/user/progress` → `{ completedModules, badges, xp }`
- `POST /api/mentor/suggest` → `{ suggestion, nextSteps }`

## Testing

```bash
# Unit tests
npm run test

# E2E tests (optional)
npm run test:e2e
```

## Build & Deploy

```bash
# Build
npm run build

# Deploy to Vercel
npm run deploy
# or connect repo to Vercel dashboard for auto-deploy
```

## Common Tasks

### Add a New Page

```bash
# Create pages/new-page.tsx
# Update navigation in components/Navigation.tsx
```

### Add a New Component

```bash
# Create components/NewComponent.tsx
# Import and use in pages
```

### Integrate New API Endpoint

1. Add to `lib/api.ts`
2. Use in component with `useEffect` or custom hook
3. Handle loading/error states

## Troubleshooting

### Wallet not connecting?

- Ensure MetaMask or WalletConnect is installed
- Check `NEXT_PUBLIC_CHAIN_ID` matches Camp testnet (626)
- Check RPC endpoint availability

### API calls failing?

- Verify `NEXT_PUBLIC_API_BASE` is correct
- Check backend is running
- Look at network tab in DevTools

### Styling issues?

- Ensure TailwindCSS is properly configured in `tailwind.config.js`
- Rebuild with `npm run dev`

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [TailwindCSS](https://tailwindcss.com)
- [Web3Modal](https://docs.web3modal.com)
- [ethers.js](https://docs.ethers.org)

---

**Questions?** Check `docs/DESIGN.md` for the full design specification.
