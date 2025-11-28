# BLOCKEDLEARNING — Blockchain Developer Design Doc

## 🎯 Backend Status: ✅ COMPLETE & DEPLOYED

**Backend Service:** https://blockbackend-production.up.railway.app/  
**AI Service:** https://blockedlearning-production.up.railway.app/  
**Database:** PostgreSQL (Railway) — Connected

All backend APIs are deployed, tested, and ready for integration.

---

## 🚀 YOUR NEXT STEPS

### 1. Backend is Ready & Waiting

The backend service is fully deployed with these endpoints ready for your integration:

**Ready to integrate:**
- `POST /api/courses/publish` — Needs your `registerIP()` function
- `GET /api/courses/onchain` — Needs your read functions

**Already working:**
- Course metadata storage → Database ✓
- User authentication → JWT ✓  
- Progress tracking → Database ✓
- AI features → All working ✓
- Admin dashboard → Statistics ✓

### 2. What Backend Needs From You

**Critical: IP Registration Function**
```typescript
// Backend will call this when user publishes a course
async function registerIP(metadata: {
  fileCid: string;
  title: string;
  description: string;
  tags: string[];
  creator: string;
  royalty?: number;
}) {
  // Your Camp SDK integration here
  return {
    txHash: "0x...",
    ipTokenId: "123",
    metadataHash: "Qm..."
  };
}
```

**Important: Read Functions**
```typescript
// Backend needs these for /api/courses/onchain
getCoursesOnchain(): Promise<Course[]>
getCourse(ipTokenId: string): Promise<Course>
getCreatorCourses(wallet: string): Promise<Course[]>
```

### 3. Integration Points

**Your endpoint:** Provide a Node.js module or REST endpoint  
**Backend calls:** When user clicks "Publish Course"  
**Flow:**
1. User uploads course → backend stores in DB
2. User clicks publish → backend calls your function
3. Your service registers on Camp Network
4. Return `ipTokenId` + `txHash` → backend updates DB
5. Course now visible on-chain

### 4. Contract Info Needed

Send to frontend dev:
- Contract addresses (Camp Basecamp testnet)
- ABIs for read operations
- RPC endpoint URL
- Testnet faucet link

### 5. Test Your Integration

```bash
# Backend has test data ready
curl https://blockbackend-production.up.railway.app/api/courses

# Use this to test your registration
curl -X POST https://blockbackend-production.up.railway.app/api/courses/upload \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","description":"Test","fileCid":"Qm...","tags":["test"]}'
```

---

## Tech Stack

* Camp Origin SDK (primary)
* Solidity (if custom contracts needed)
* Camp Basecamp testnet
* ethers.js or viem for integration
* Node.js scripts

## Core Implementation

### Onchain Registration

Use Camp Origin SDK to:
- Register IP with metadata
- Generate `ipTokenId` 
- Store metadata hash on-chain
- Emit `CourseRegistered` event

### Minimal Contract (if needed)

```solidity
struct Course {
  uint256 id;
  address creator;
  string metadataHash;
  uint256 timestamp;
}

event CourseRegistered(address indexed creator, uint256 indexed ipId, string metadataHash);

function registerCourse(string calldata metadataHash) external returns (uint256);
```

## Deliverables

* IP registration integration with backend
* Contract ABIs and addresses
* Event monitoring setup
* End-to-end test script

**Contact:** Backend API docs at https://blockbackend-production.up.railway.app/
ok
