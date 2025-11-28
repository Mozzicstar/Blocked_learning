# Blockchain Write Operations - Backend Implementation

## Overview

The backend now includes full **blockchain write operations** for publishing courses on-chain via the IPRegistry smart contract. This document explains the implementation and usage.

---

## ✅ Implemented Features

### 1. **registerIP() Function**
**Location:** `Backend/src/services/blockchainService.ts`

Registers a new course on the blockchain and creates an IP token.

```typescript
registerIP(
  metadataHash: string,      // IPFS hash of course metadata
  tags: string[] = [],       // Course tags/categories
  royaltyBps: number = 500   // Royalty basis points (500 = 5%)
): Promise<{
  courseId: string;          // Generated course ID on-chain
  txHash: string;            // Transaction hash
  metadataHash: string;      // The metadata hash used
  timestamp: number;         // Unix timestamp
}>
```

**Features:**
- ✅ Calls `registerCourse()` on IPRegistry contract
- ✅ Parses `CourseRegistered` event to extract course ID
- ✅ Comprehensive error handling & logging
- ✅ Returns structured response with all relevant data
- ✅ Supports optional tags and configurable royalties

**Example Return Value:**
```json
{
  "courseId": "42",
  "txHash": "0x1234...abcd",
  "metadataHash": "QmXxxx...yyy",
  "timestamp": 1732815600
}
```

---

### 2. **POST /api/courses/publish Endpoint**
**Location:** `Backend/src/routes/courses.ts`

Publishes a course from the database to the blockchain.

**Request Body:**
```typescript
{
  courseId: string;           // Database course ID (required)
  ipTokenId?: string;         // (Optional) If already on-chain
  metadataHash?: string;      // (Optional) Override metadata
  txHash?: string;            // (Optional) Previous tx hash
}
```

**Workflow:**
1. Checks if course exists in database
2. If `ipTokenId` not provided:
   - Uses course's `file_cid` as metadata hash
   - Calls `registerIP()` to register on-chain
   - Returns courseId, txHash, metadataHash
3. If blockchain registration fails, returns 500 error with details

**Success Response (201):**
```json
{
  "statusCode": 201,
  "message": "Course published successfully",
  "data": {
    "courseId": "42",
    "ipTokenId": "42",
    "txHash": "0x1234...abcd",
    "metadataHash": "QmXxxx...yyy",
    "blockchainStatus": "confirmed"
  }
}
```

**Error Response (500):**
```json
{
  "statusCode": 500,
  "message": "Blockchain registration failed: [error details]"
}
```

---

### 3. **Other Blockchain Write Operations**

#### updateCourseMetadata()
Updates the metadata hash of a published course (creator only).

```typescript
updateCourseMetadata(
  courseId: number,
  newMetadataHash: string
): Promise<{ txHash: string }>
```

#### deactivateCourse()
Deactivates a published course (creator only).

```typescript
deactivateCourse(
  courseId: number
): Promise<{ txHash: string }>
```

---

## 🔐 Security Considerations

### Private Key Management
- ✅ Private key is read from `PRIVATE_KEY` environment variable
- ✅ Only used for write operations that require signing
- ✅ Signer is created as a Wallet instance connected to provider
- ⚠️ **Production:** Never hardcode private keys in code

### Transaction Handling
- ✅ All write operations wait for transaction confirmation (`tx.wait()`)
- ✅ Error handling for failed transactions
- ✅ Event parsing validates transaction success

### Read-Only Mode
- ✅ If `PRIVATE_KEY` not set, contracts operate in read-only mode
- ✅ Read operations (getTotalCourses, getCourse, etc.) work without signer
- ✅ Write operations throw errors if signer not available

---

## 📋 Full API Reference

### Course Publishing Workflow

**Step 1: Create Draft Course**
```bash
POST /api/courses/upload
{
  "title": "Blockchain 101",
  "description": "Learn blockchain",
  "tags": ["blockchain", "web3"],
  "fileCid": "QmXxxx...",
  "fileName": "course.pdf"
}
```

**Step 2: Publish to Blockchain**
```bash
POST /api/courses/publish
{
  "courseId": "1"
}
```

**Response:**
```json
{
  "statusCode": 201,
  "message": "Course published successfully",
  "data": {
    "courseId": "1",
    "ipTokenId": "42",
    "txHash": "0x...",
    "metadataHash": "QmXxxx...",
    "blockchainStatus": "confirmed"
  }
}
```

---

## 🛠️ Configuration

### Environment Variables
```bash
# RPC Endpoint (BaseCAMP testnet)
RPC_URL=https://rpc.basecamp.t.raas.gelato.cloud

# Private key for signing transactions (optional, read-only if not set)
PRIVATE_KEY=0x...

# Contract Addresses
IP_REGISTRY_ADDRESS=0x6D9bb552f5fa5f180Bb5C8c31ce877365088427D
COURSE_DIRECTORY_ADDRESS=0x34bfD3e362CC6f33d18cA55EBCA29a8946Bf3b9a
CERTIFICATE_NFT_ADDRESS=0xeA648db267C686269e687661BE24DFC96A338c77
REPUTATION_SYSTEM_ADDRESS=0x...
ROYALTY_MANAGER_ADDRESS=0x...
```

### Royalty Configuration
Default royalty: **5% (500 basis points)**
- 100 bp = 1%
- 500 bp = 5%
- 1000 bp = 10%
- 10000 bp = 100% (max)

---

## 🧪 Testing

### Test registerIP() Directly
```bash
curl -X POST http://localhost:3001/api/courses/publish \
  -H "Content-Type: application/json" \
  -d '{
    "courseId": "1"
  }'
```

### All Tests Passing
```bash
./test_endpoints.sh
```

Expected output:
```
✅ OK (200) - All endpoints working
```

---

## 📊 Blockchain Integration Status

| Feature | Status | Details |
|---------|--------|---------|
| Contract ABIs | ✅ Loaded | All 5 contracts loaded |
| RPC Connection | ✅ Working | Connected to BaseCAMP testnet |
| Read Operations | ✅ Implemented | getTotalCourses, getCourse, etc. |
| Write Operations | ✅ Implemented | registerIP, updateCourseMetadata, deactivateCourse |
| Event Parsing | ✅ Working | CourseRegistered event extracted |
| Error Handling | ✅ Comprehensive | Try-catch with detailed logging |
| Deployment | ✅ Live | Railway production deployment |

---

## 📝 Usage Examples

### Example 1: Publish a Course with Tags and Custom Royalty

**Backend Code:**
```typescript
const result = await ipRegistryService.registerIP(
  'QmPf8nrSxQ3BfyXd3hLaVxZP3vFf5fB8dH',  // metadata hash
  ['blockchain', 'web3', 'smart-contracts'], // tags
  1000  // 10% royalty
);
console.log(result);
// Output:
// {
//   courseId: '42',
//   txHash: '0x...',
//   metadataHash: 'QmPf8...',
//   timestamp: 1732815600
// }
```

### Example 2: Use via API Endpoint

**Request:**
```bash
POST /api/courses/publish
Content-Type: application/json

{
  "courseId": "5",
  "metadataHash": "QmPf8nrSxQ3BfyXd3hLaVxZP3vFf5fB8dH"
}
```

**Response:**
```json
{
  "statusCode": 201,
  "message": "Course published successfully",
  "data": {
    "courseId": "5",
    "ipTokenId": "42",
    "txHash": "0xabcd1234...",
    "metadataHash": "QmPf8nrSxQ3BfyXd3hLaVxZP3vFf5fB8dH",
    "blockchainStatus": "confirmed"
  }
}
```

---

## 🔍 Logging & Debugging

When `registerIP()` is called, you'll see logs like:
```
[BlockchainService] Course registered successfully
  - Course ID: 42
  - Metadata Hash: QmPf8nrSxQ3BfyXd3hLaVxZP3vFf5fB8dH
  - TX Hash: 0xabcd1234...
  - Tags: blockchain, web3
  - Royalty: 5%
```

---

## ⚠️ Known Limitations

1. **PRIVATE_KEY Required for Writes:** Set `PRIVATE_KEY` to enable write operations
2. **Testnet Only:** Currently configured for BaseCAMP testnet
3. **Event Parsing:** Relies on parsing `CourseRegistered` event from transaction logs
4. **Signer Per Transaction:** New signer created for each write (could be optimized for batch operations)

---

## 🚀 Next Steps

- [ ] Add support for batch course registration
- [ ] Implement course update endpoint (metadata updates)
- [ ] Add course deactivation endpoint
- [ ] Create admin dashboard for monitoring on-chain courses
- [ ] Add webhooks for on-chain event notifications
- [ ] Implement course transfer functionality (change creator)

---

## 📞 Support

For issues or questions about blockchain write operations:
1. Check logs: `railway logs`
2. Verify contract addresses in `.env`
3. Ensure `PRIVATE_KEY` is set for write operations
4. Check RPC endpoint connectivity: `/api/blockchain/status`

---

**Status:** ✅ **COMPLETE** - Backend blockchain write operations fully implemented and tested.
