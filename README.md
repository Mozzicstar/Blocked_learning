# Blocked_learning

✅ 1. FRONTEND DEVELOPER DESIGN DOCUMENT
Project: BLOCKEDLEARNING
Developer Role: Frontend Engineer
Stack: React / Next.js, TailwindCSS, Web3Modal, Axios
Overview

You are responsible for building the user interface for both learners and content creators. Your frontend must connect to the backend APIs and interact with Camp Network through the blockchain developer’s smart contracts.

Core Responsibilities
1. Authentication (Wallet Login)

Implement Web3 wallet login using:

Web3Modal (recommended)

ethers.js or viem

Flow:

User clicks "Connect Wallet"

Wallet connects to Camp Testnet

Get user address

Store it in global state (Zustand or Context API)

2. Main Pages (MVP)
Page 1 — Welcome / Login Page

Connect Wallet button

Brief text about the platform

Page 2 — Dashboard (Learner)

User profile (wallet address)

Modules available

Progress bar

“Continue Learning” button

Link to Trending section

Page 3 — Course Marketplace

List of all blockchain courses

Each course card shows:

Title

Creator (wallet address)

Category

IP Token ID (from blockchain dev)

“Start Course” CTA

Page 4 — Course Viewer

Video or PDF embed

List of modules

“Mark as Completed” button

Trigger recommendation from AI teammate’s API

Page 5 — Trending Page

Static or API-driven trending topics

Simple UI list

Creator Side
Page 6 — Creator Dashboard

“Upload New Course”

Upload fields:

Title

Description

Category

Video/PDF upload

On submit → Send metadata to backend → Blockchain dev handles tokenization

Page 7 — My Courses

List of creator’s existing courses

View IP token status

View uploads

API Integrations Needed

Expect these API endpoints (backend will handle):

Auth & Courses
GET /courses
GET /courses/:id
POST /courses/upload
GET /user/progress
POST /user/progress/:module

AI Mentor
POST /mentor/suggest
POST /mentor/explain

Blockchain

Blockchain developer will expose:

POST /register-ip
GET /courses/onchain

Frontend Deliverables

React/Next.js UI

Tailwind styling

Wallet connect integration

Interaction with backend + blockchain endpoints

Clean documentation in /frontend/README.md

Deploy frontend on Vercel

✅ 2. BLOCKCHAIN DEVELOPER DESIGN DOCUMENT
Project: BLOCKEDLEARNING
Developer Role: Blockchain / Smart Contract Engineer
Network: Camp Network Testnet
Tools: Camp Origin SDK, Solidity, viem/ethers
Overview

You are responsible for creating and deploying smart contracts that register educational content as verifiable IP on the Camp Network using the Origin SDK.

Your job is critical because IP verification is the core of the project.

Core Responsibilities
1. Integrate Camp Origin SDK

Use Camp’s Proof of Provenance (PoP) system to register course materials.

You will:

Accept metadata from backend

Hash course content metadata

Register IP using Origin SDK

Return:

tx hash

tokenized IP ID

creator wallet address

2. Smart Contracts for MVP
Smart Contract 1 — IPRegistry.sol

Handles:

Storing the IP token ID

Storing metadata CID

Mapping creator → tokenized course

State:

mapping(uint256 => Course) public courses;
mapping(address => uint256[]) public creatorCourses;


Events:

event CourseRegistered(address indexed creator, uint256 ipId, string metadataHash);

Smart Contract 2 — CourseDirectory.sol

Handles listing:

Course title

Metadata hash

Creator wallet

IP token ID

Read-only (no modification after creation)

3. Onchain Functions (MVP)
function registerCourse(string memory metadataHash) external returns (uint256);
function getCourse(uint256 courseId) public view returns (Course memory);
function getCreatorCourses(address creator) public view returns (uint256[]);

4. Testnet Deployment

Deploy to:

Camp Network Testnet (Basecamp)

Deliver:

Contract address

ABI files

Interaction script

Backend + frontend will use these.

5. API Responsibilities

Provide backend developer with:

/register-ip endpoint

/courses/onchain endpoint

Testnet contract address + ABI

Blockchain Deliverables

Smart contract code in /contracts

Deployment script

ABI JSON

Testnet deployed contracts

Instructions in /contracts/README.md

✅ 3. AI / LOGIC DEVELOPER DESIGN DOCUMENT
Project: BLOCKEDLEARNING
Developer Role: AI Engineer / Logic Developer
Scope: Simple Rule-Based Mentor (MVP)
Overview

Your role is to build CheckMate, the platform’s personal mentor that helps students understand blockchain topics.

Important:
For the MVP, CheckMate is NOT a full AI model.
It is a logic-based system using decision trees and topic routing.

Core Responsibilities
1. Build Topic Knowledge Base

Create structured blockchain topics:

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

2. Build Simple Decision Tree

User says:
“I don’t understand gas fees.”

You detect keyword “gas” → topic: gas_fees
Return explanation + recommended modules.

3. Mentor APIs

You will create these endpoints:

POST /mentor/explain

Input:

{
  "question": "What are smart contracts?"
}


Output:

{
  "topic": "smart_contracts",
  "explanation": "Smart contracts are self-executing...",
  "recommendedModules": [2, 4]
}

POST /mentor/suggest

Input:

{
  "progress": 35
}


Output:

{
  "suggestion": "Continue Module 2: Introduction to Transactions"
}

4. Optional Light AI Layer

Use a small local model or rules to rewrite answers more naturally.

AI Deliverables

Decision tree logic file

Knowledge base JSON

Mentor endpoints

Integration with backend

Documentation in /ai/README.md
