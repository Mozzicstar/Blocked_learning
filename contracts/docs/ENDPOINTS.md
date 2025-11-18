# Blockchain Endpoints

## Endpoints You Consume

None (Smart contracts don't consume HTTP endpoints)

## Endpoints You Provide

### Via Backend (Backend calls your functions)

- **Camp Origin SDK Registration** (internal function call)
  - Input: `{ fileCid, title, tags, royalty, creator }`
  - Output: `{ txHash, ipTokenId, metadataHash }`

### Smart Contract Functions (Read-Only for Frontend)

- `getCoursesOnchain()` → list all registered courses
- `getCourse(uint256 courseId)` → get specific course
- `getCreatorCourses(address creator)` → list creator's courses

---

**Network:** Camp Basecamp testnet

**Contract Type:** Origin SDK or custom Solidity

**Integration:** Backend calls your SDK/functions via ethers.js or Camp SDK
