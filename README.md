# Blocked_learning

A short, organized design document for the BLOCKEDLEARNING project.  
This README groups responsibilities, APIs, and deliverables by developer role (Frontend, Blockchain, AI/Logic).

---

## Project Summary
Project: BLOCKEDLEARNING  
Goal: Build a platform to register and deliver educational content as verifiable IP on Camp Network, with a simple rule-based AI mentor (MVP).

Tech stack (suggested)
- Frontend: React / Next.js, TailwindCSS, Web3Modal, Axios
- Blockchain: Camp Origin SDK, Solidity, viem/ethers
- State: Zustand or Context API
- Other: Backend API to handle uploads, metadata, and integration with blockchain

---

## Table of Contents
- Frontend Developer Design Document
- Blockchain Developer Design Document
- AI / Logic Developer Design Document
- API Endpoints (expected)
- Deliverables (by role)
- Suggested repository structure

---

## 1) Frontend Developer Design Document (✅)
Role: Frontend Engineer  
Stack: React / Next.js, TailwindCSS, Web3Modal, Axios

Overview
- Build UI for learners and creators.
- Integrate wallet authentication and connect to backend + Camp Network via blockchain dev.

Core responsibilities
1. Authentication (Wallet Login)
   - Implement Web3 wallet login using:
     - Web3Modal (recommended)
     - ethers.js or viem
   - Flow:
     - User clicks "Connect Wallet"
     - Wallet connects to Camp Testnet
     - Get user address
     - Store in global state (Zustand or Context API)

2. Main Pages (MVP)
   - Page 1 — Welcome / Login
     - "Connect Wallet" CTA
     - Brief platform intro
   - Page 2 — Dashboard (Learner)
     - User profile (wallet address)
     - Modules available
     - Progress bar
     - "Continue Learning" button
     - Link to Trending
   - Page 3 — Course Marketplace
     - List of blockchain courses
     - Course card includes:
       - Title
       - Creator (wallet address)
       - Category
       - IP Token ID (from blockchain)
       - “Start Course” CTA
   - Page 4 — Course Viewer
     - Video or PDF embed
     - List of modules
     - “Mark as Completed” button
     - Trigger recommendation from AI mentor API
   - Page 5 — Trending Page
     - Static or API-driven trending topics
     - Simple list UI

   Creator Side
   - Page 6 — Creator Dashboard
     - "Upload New Course"
     - Upload fields: Title, Description, Category, Video/PDF upload
     - On submit → Send metadata to backend → Blockchain dev tokenizes IP
   - Page 7 — My Courses
     - List of creator’s courses
     - View IP token status and uploads

API integrations (frontend expects)
- GET /courses
- GET /courses/:id
- POST /courses/upload
- GET /user/progress
- POST /user/progress/:module
- POST /mentor/suggest
- POST /mentor/explain
- POST /register-ip (blockchain)
- GET /courses/onchain (blockchain)

Frontend deliverables
- React / Next.js UI with Tailwind
- Wallet connect integration
- Interaction with backend + blockchain
- Documentation at /frontend/README.md
- Deploy on Vercel

---

## 2) Blockchain Developer Design Document (✅)
Role: Blockchain / Smart Contract Engineer  
Network: Camp Network Testnet (Basecamp)  
Tools: Camp Origin SDK, Solidity, viem/ethers

Overview
- Register educational content as verifiable IP via Camp Origin SDK.
- Accept metadata from backend, hash it, register via Origin SDK, and return tx info.

Core responsibilities
1. Integrate Camp Origin SDK
   - Accept metadata from backend
   - Hash course metadata
   - Register IP using Origin SDK
   - Return: tx hash, tokenized IP ID, creator wallet address

2. Smart Contracts (MVP)
   - IPRegistry.sol
     - Store IP token ID and metadata CID
     - Map creator → tokenized course
     - State examples:
       - mapping(uint256 => Course) public courses;
       - mapping(address => uint256[]) public creatorCourses;
     - Event:
       - event CourseRegistered(address indexed creator, uint256 ipId, string metadataHash);
   - CourseDirectory.sol
     - Listing contract (read-only after creation)
     - Stores: title, metadata hash, creator wallet, IP token ID

3. Onchain functions (MVP)
   - function registerCourse(string memory metadataHash) external returns (uint256);
   - function getCourse(uint256 courseId) public view returns (Course memory);
   - function getCreatorCourses(address creator) public view returns (uint256[]);

4. Testnet deployment
   - Deploy to Camp Network Testnet (Basecamp)
   - Deliver contract addresses, ABI JSON, and interaction scripts for backend/frontend use

5. API responsibilities (for backend)
   - /register-ip
   - /courses/onchain
   - Provide testnet contract address + ABI

Blockchain deliverables
- Smart contract code in /contracts
- Deployment script
- ABI JSON
- Deployed testnet contracts and contract addresses
- Documentation in /contracts/README.md

---

## 3) AI / Logic Developer Design Document (✅)
Role: AI Engineer / Logic Developer  
Scope: CheckMate — Simple rule-based mentor (MVP)

Overview
- Build CheckMate: personal mentor to help students with blockchain topics using deterministic logic (decision trees / topic routing). Not a full ML model for MVP.

Core responsibilities
1. Topic knowledge base (JSON)
   - Example structure:
     {
       "wallets": {
         "definition": "...",
         "examples": [...],
         "recommendedModules": [1, 3]
       },
       "smart_contracts": {
         "definition": "...",
         "examples": [...],
         "recommendedModules": [2, 4]
       }
     }

2. Simple decision tree
   - Keyword detection and topic routing
   - Example: user says "I don’t understand gas fees." → detect "gas" → topic gas_fees → return explanation + recommended modules

3. Mentor APIs
   - POST /mentor/explain
     - Input: { "question": "What are smart contracts?" }
     - Output: { "topic": "smart_contracts", "explanation": "...", "recommendedModules": [2,4] }
   - POST /mentor/suggest
     - Input: { "progress": 35 }
     - Output: { "suggestion": "Continue Module 2: Introduction to Transactions" }

4. Optional light AI layer
   - Use a small local model or rules to rewrite answers more naturally (optional)

AI deliverables
- Decision tree logic file
- Knowledge base JSON
- Mentor endpoints
- Integration instructions with backend
- Documentation in /ai/README.md

---

## API Endpoints (Expected / Recommended)
Auth & Courses
- GET /courses
- GET /courses/:id
- POST /courses/upload
- GET /user/progress
- POST /user/progress/:module

AI Mentor
- POST /mentor/suggest
- POST /mentor/explain

Blockchain
- POST /register-ip
- GET /courses/onchain

---

## Deliverables (By role)
Frontend
- Next.js app (React) with Tailwind
- Wallet connect integration
- Frontend documentation: /frontend/README.md
- Vercel deployment

Blockchain
- /contracts with Solidity files
- Deployment scripts
- ABI JSON and contract addresses
- /contracts/README.md

AI
- /ai knowledge base and decision logic
- Mentor API implementation and docs

Backend
- API glue to accept uploads, store metadata, call blockchain registration, and present onchain course data to frontend

---

## Suggested Repository Structure
- /frontend
  - README.md
  - src/
- /backend
  - README.md
  - src/
- /contracts
  - IPRegistry.sol
  - CourseDirectory.sol
  - deploy/
  - README.md
- /ai
  - knowledge-base.json
  - decision-tree.js
  - README.md
- README.md (this file)

---

## Notes & Next Steps
What I did:
- Reformatted and organized the original document into clear sections and bullet lists for readability.
- Preserved all original content and responsibilities while grouping related information.

What's next:
- If you want, I can:
  - Create separate README files for /frontend, /contracts, and /ai with more implementation details.
  - Convert the API contract into an OpenAPI spec.
  - Draft component/page templates for the frontend (Next.js + Tailwind).
  - Draft Solidity contract skeletons for /contracts.

Tell me which next step you'd like and I'll prepare the files.  
