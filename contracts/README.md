# Blockchain (Smart Contracts) Setup & Development

Welcome, Blockchain Developer! This folder contains the BLOCKEDLEARNING smart contracts and on-chain integration.

## Quick Reference

- **Design Doc:** See `docs/DESIGN.md` for full specifications
- **Tech Stack:** Camp Origin SDK, Solidity, Hardhat, ethers.js
- **Testnet:** Camp Basecamp
- **Start Development:** `npm run compile && npm run test`

## Prerequisites

- Node.js 18+
- Wallet with Camp testnet tokens
- Camp SDK key

## Installation

```bash
cd contracts
npm install
```

## Environment Setup

Create `.env`:

```env
PRIVATE_KEY=your_wallet_private_key
CAMP_TESTNET_RPC=https://basecamp.camp/rpc
CAMP_SDK_KEY=your_camp_sdk_key
```

## Quick Start

### Compile Contracts

```bash
npm run compile
```

### Run Tests

```bash
npm run test
```

### Deploy to Testnet

```bash
npm run deploy:testnet
```

Output will include deployed contract addresses and ABI.

## Project Structure

```
contracts/
├── contracts/
│   ├── IPRegistry.sol      # Course IP registration
│   ├── CourseDirectory.sol # Course listing (optional)
│   └── CertificateNFT.sol  # Learner certificates (optional)
├── scripts/
│   ├── deploy.js           # Main deployment
│   ├── registerCourse.js   # Register course example
│   └── utils.js            # Helper functions
├── test/
│   ├── IPRegistry.test.js
│   ├── CourseDirectory.test.js
│   └── ...
├── hardhat.config.js       # Hardhat configuration
└── contracts.json          # Deployed contract addresses
```

## Core Contracts

### IPRegistry.sol

Handles IP registration and metadata storage.

**Key Functions:**

```solidity
// Register a new course
function registerCourse(string calldata metadataHash) external returns (uint256);

// Get course details
function getCourse(uint256 courseId) public view returns (Course memory);

// Get creator's courses
function getCreatorCourses(address creator) public view returns (uint256[] memory);

// Events
event CourseRegistered(address indexed creator, uint256 indexed ipId, string metadataHash);
```

**Deploy:**

```bash
npm run deploy:testnet
```

### CourseDirectory.sol (Optional)

Read-only registry for efficient marketplace queries.

## Integration with Backend

### 1. Get Contract Addresses & ABI

After deployment, export to backend:

```bash
npm run export-contracts
```

This creates `contracts.json` with addresses and ABIs.

### 2. Backend Integration

Backend calls Origin SDK to register IP:

```typescript
// In backend /services/blockchain.ts
import { originSDK } from '@camp/sdk';

async function registerCourse(metadata) {
  const tx = await originSDK.registerIP(metadata);
  return {
    txHash: tx.hash,
    ipTokenId: tx.ipId,
    metadataHash: tx.metadataHash,
  };
}
```

### 3. Frontend Integration

Frontend reads on-chain data for verification:

```typescript
// In frontend lib/web3.ts
import { ethers } from 'ethers';
import IPRegistryABI from '@/contracts/IPRegistry.json';

async function getCoursesOnchain() {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const registry = new ethers.Contract(REGISTRY_ADDRESS, IPRegistryABI, provider);
  return registry.getCourses();
}
```

## Deployment Workflow

### Step 1: Local Testing

```bash
npm run test
```

### Step 2: Deploy to Testnet

```bash
npm run deploy:testnet
```

Captures:
- Contract address
- Deployment tx hash
- Block number

### Step 3: Verify on Explorer

```bash
npx hardhat verify --network basecamp CONTRACT_ADDRESS "constructor args"
```

### Step 4: Export ABIs & Addresses

Update `contracts.json` and share with backend/frontend:

```json
{
  "IPRegistry": {
    "address": "0x...",
    "abi": [...],
    "network": "basecamp",
    "deploymentBlock": 12345
  }
}
```

## Scripts

### Deploy

```bash
npm run deploy:testnet
```

### Register a Course (Example)

```bash
npm run script scripts/registerCourse.js
```

### Get Contract Info

```bash
npm run info
```

## Testing

### Unit Tests

```bash
npm run test
```

### Integration Tests (with testnet)

```bash
npm run test:integration
```

## Security Considerations

- ✅ Minimize on-chain writes (only essential metadata)
- ✅ Use off-chain storage (IPFS) for large files
- ✅ Verify creator signature on registration
- ✅ Event indexing for off-chain updates
- ⚠️ Audit contracts before mainnet (if applicable)

## Camp Origin SDK

### Usage Example

```typescript
import { originSDK } from '@camp/sdk';

// Initialize
const sdk = originSDK.init({
  rpc: process.env.CAMP_TESTNET_RPC,
  apiKey: process.env.CAMP_SDK_KEY,
});

// Register IP
const result = await sdk.registerIP({
  title: 'Smart Contracts 101',
  description: '...',
  fileCid: 'QmXxxx...',
  creator: walletAddress,
  tags: ['blockchain', 'solidity'],
});
```

### Resources

- [Camp Origin SDK Docs](https://camp.xyz/docs/sdk)
- [Camp Basecamp Testnet](https://basecamp.camp)
- [Explorer](https://basecamp-explorer.camp)

## Common Tasks

### Add New Contract

1. Create `contracts/NewContract.sol`
2. Add tests in `test/NewContract.test.js`
3. Update `scripts/deploy.js` to include deployment
4. Run `npm run compile && npm run test`

### Update Contract Logic

1. Edit contract
2. Run `npm run compile`
3. Run tests: `npm run test`
4. If tests pass, redeploy: `npm run deploy:testnet`

### Verify Contract on Explorer

```bash
npx hardhat verify --network basecamp 0xContractAddress "arg1" "arg2"
```

## Troubleshooting

### Deployment failing?

- Check wallet has enough testnet tokens
- Verify RPC endpoint is accessible
- Check private key in `.env` is correct
- Look at tx on explorer for error details

### Tests failing?

- Ensure local node is running: `npx hardhat node`
- Check contract ABI matches interface
- Verify test data is valid

### Can't find deployed address?

- Check `contracts.json` after deployment
- Look at deployment tx on explorer
- Verify you deployed to correct network

## Resources

- [Hardhat Docs](https://hardhat.org)
- [Solidity Docs](https://docs.soliditylang.org)
- [ethers.js Docs](https://docs.ethers.org)
- [Camp Network](https://camp.xyz)

---

**Questions?** Check `docs/DESIGN.md` for the full design specification.
