# BLOCKEDLEARNING — Blockchain Developer Design Doc

## Purpose

Implement on-chain IP registration, tokenization, and minimal onchain state needed for BLOCKEDLEARNING using Camp Network's Origin SDK and Camp testnet (Basecamp). Provide ABI and endpoints for frontend/backend to interact with.

## Tech Stack & Tools

* Camp Origin SDK (primary)
* Solidity (if custom contracts required) / Camp's recommended primitives
* Hardhat or Foundry for local testing & deployment
* ethers.js or viem for scripts & integration
* Node.js scripts for automated registration workflows
* Testnet: Camp Basecamp testnet
* Explorer: Camp testnet explorer links

## Core Concepts

* **Provenance / IP registration:** Each uploaded course is tokenized/registered, producing an IP token ID and metadata hash.
* **Read-only directory:** Listing of registered IPs for marketplace
* **Optional royalties:** capture royalty split in metadata if needed

## Smart Contracts / Onchain Objects

Prefer Origin SDK primitives first; write minimal custom contracts only if functionality cannot be met by Origin SDK.

### If contracts needed:

#### IPRegistry.sol

```solidity
struct Course {
  uint256 id;
  address creator;
  string metadataHash; // IPFS hash of course metadata
  uint256 time;
}
mapping(uint256 => Course) public courses;
mapping(address => uint256[]) public creatorCourses;
event CourseRegistered(address indexed creator, uint256 indexed ipId, string metadataHash);
function registerCourse(string calldata metadataHash) external returns (uint256) { ... }
function getCreatorCourses(address creator) external view returns (uint256[] memory) { ... }
```

#### CourseDirectory.sol (optional read-only registry or to simplify marketplace)

**Prefer:** Use Origin SDK registration functions to create IP tokens and metadata on Camp; store resulting `ipTokenId` and `metadataHash` in backend DB.

## Onchain Workflows

### Register Course (recommended flow)

1. Frontend uploads file → gets `fileCid` (IPFS/Camp)
2. Frontend calls `POST /api/courses/upload` (backend records temp)
3. Backend calls blockchain dev endpoint or script that:
   * Calls Origin SDK to register IP using `fileCid` and metadata
   * Receives `txHash`, `ipTokenId`, `metadataHash`
   * Returns results to backend → backend updates DB and returns to frontend

### Direct Frontend Signing (alternative)

* If policy allows, frontend can build and prompt user to sign a transaction to register IP; backend monitors for event and updates DB. Use for better UX but more front-end complexity.

### Certificate Minting

* After completion, `CertificateNFT` contract mints a degree/certificate NFT to the learner (optional MVP). Use metadata that references `ipTokenId` for verifiability.

## Events & Notifications

* Emit `CourseRegistered` event with metadata referenced
* Backend watches events to update listings

## Security & Gas

* Optimize metadata size (store large files on IPFS; metadata JSON contains pointers)
* Minimize onchain writes to essential fields to cut gas
* Use off-chain indexing (backend DB) for search and filtering

## Testing & Deployment

* Local testnet for dev (Hardhat)
* Deploy to Camp testnet; capture addresses, ABI, and verify
* Provide scripts: `scripts/deploy.js`, `scripts/registerCourse.js`
* Provide integration examples for frontend: `getCoursesOnchain()`

## Deliverables

* Contracts (if any) in `/contracts` with tests
* Deployment scripts & README `/contracts/README.md`
* ABI & addresses for testnet
* Integration guide for backend + frontend
