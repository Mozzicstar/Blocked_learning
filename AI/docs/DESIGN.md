# BLOCKEDLEARNING — AI / CheckMate Developer Design Doc

## Purpose

Implement **CheckMate**: the in-platform mentor that analyzes user progress, suggests next learning steps, explains topics, and flags skill gaps. Start with a rule-based system for the hackathon; provide an upgrade path to lightweight ML or LLM integration post-hackathon.

## MVP Approach

* **Rule-based engine** with deterministic rules + small NLP helpers (keyword matching, synonym list)
* Data-driven recommendations from user progress, course tags, and difficulty levels
* Expose REST endpoints consumed by frontend/backend

## Tech Stack

* Language: **Python** (FastAPI) or Node.js (if team prefers JS)
* Lightweight NLP: **spaCy** or simple tokenizer; optionally use **OpenAI / local LLM** for later
* DB: use backend DB (Postgres) to access course metadata & user progress
* Optional vector DB: **Chroma / FAISS** for semantic search in future

## Knowledge Base

JSON structure with topics, tags, recommended module IDs, example projects, maturity level

```json
{
  "smart_contracts": {
    "definition": "...",
    "keywords": ["contract","solidity","function"],
    "recommend": [moduleId1, moduleId2],
    "projectSuggestions": ["Build a simple ERC20"]
  }
}
```

## Endpoints

### POST /mentor/explain

* Input: `{ question: "What is reentrancy?" }`
* Process: detect topic via keyword match → return explanation + links + recommended module IDs
* Output: `{ topic, explanation, recommendedModules, resources: [{title,url}] }`

### POST /mentor/suggest

* Input: `{ wallet, progress: { completedModuleIds: [...], xp } }`
* Process: compute gaps by comparing completed tags against target learning path
* Output: `{ suggestion, priority, nextModules: [id...], rationale }`

### GET /mentor/profile/:wallet

* Returns: `{ strengths, weaknesses, suggestedProjects }` (derived from local rules)

## Rule Examples

* If user has completed beginner modules for `smart_contracts` and `wallets`, but no `security` modules → Suggest `smart_contract_security` modules and a project: "Fix a vulnerable contract".
* If completed >5 courses but no project built → Suggest creating a small dApp and provide project template.

## Optional ML / LLM Enhancements (post-MVP)

* Use an LLM (e.g., OpenAI or local Llama) to generate:
  * Personalized study plans (from templates)
  * Course summaries and cheat sheets (from transcripts)
  * Project briefs tailored to user skill level
* Use embeddings for semantic matching between user questions and knowledge base

## Evaluation Metrics (for later)

* Advice acceptance rate (did user follow suggestion?)
* Course completion after suggestion
* Time to next completion

## Deliverables

* `/ai` service with endpoints, tests, and a README
* Knowledge base JSON + small admin UI to edit rules
* Integration docs for backend/frontend
