# AI / CheckMate Setup & Development

Welcome, AI Developer! This folder contains the CheckMate mentor service for BLOCKEDLEARNING.

## Quick Reference

- **Design Doc:** See `docs/DESIGN.md` for full specifications
- **Tech Stack:** Python + FastAPI, spaCy, rules-based logic
- **MVP Approach:** Deterministic rules → keyword matching → recommendations
- **Start Development:** `python main.py` or `uvicorn main:app --reload`

## Prerequisites

- Python 3.9+
- pip or conda
- Backend DB connection (Postgres)

## Installation

```bash
cd AI
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## Environment Setup

Create `.env`:

```env
BACKEND_DB_URL=postgresql://user:password@localhost:5432/blockedlearning
OPENAI_API_KEY=sk-... (optional, for future LLM integration)
DEBUG=true
PORT=8000
```

## Development

```bash
uvicorn main:app --reload
```

Server runs on `http://localhost:8000`.

Docs available at `http://localhost:8000/docs` (Swagger UI).

## Project Structure

```
AI/
├── main.py                 # FastAPI app entry
├── services/
│   ├── mentor.py          # Core CheckMate logic
│   ├── knowledge_base.py  # Topic & rule definitions
│   └── nlp_utils.py       # NLP helpers (keyword extraction, etc.)
├── models/
│   ├── request.py         # Request/response schemas
│   └── topic.py           # Topic data models
├── tests/
│   ├── test_mentor.py
│   └── test_nlp.py
├── knowledge_base.json    # Topics, rules, examples
├── requirements.txt
└── README.md
```

## Core Components

### 1. Knowledge Base (knowledge_base.json)

Defines topics, learning paths, and recommendations.

```json
{
  "topics": {
    "smart_contracts": {
      "name": "Smart Contracts",
      "definition": "Programs that run on the blockchain...",
      "keywords": ["contract", "solidity", "code", "function", "deploy"],
      "recommended_modules": [1, 2, 3],
      "difficulty": "intermediate",
      "prerequisites": ["blockchain_basics"],
      "projects": [
        {
          "title": "Build a Simple ERC20",
          "description": "..."
        }
      ]
    }
  }
}
```

### 2. Mentor Service (services/mentor.py)

Core logic for suggestions and explanations.

```python
from services.mentor import CheckMate

mentor = CheckMate()

# Get suggestion based on progress
suggestion = mentor.suggest(
    completed_modules=[1, 2],
    user_xp=150,
    tags=["blockchain", "wallets"]
)

# Explain a topic
explanation = mentor.explain("What is a smart contract?")
```

### 3. NLP Utilities (services/nlp_utils.py)

Keyword extraction, topic matching, synonym resolution.

```python
from services.nlp_utils import extract_keywords, find_matching_topic

keywords = extract_keywords("How do I deploy a contract?")
topic = find_matching_topic(keywords)  # Returns "smart_contracts"
```

## API Endpoints

### POST /mentor/suggest

Recommends next learning steps based on user progress.

**Request:**
```json
{
  "wallet": "0xUser...",
  "progress": {
    "completed_modules": [1, 2, 5],
    "xp": 250,
    "tags": ["blockchain", "wallets"]
  }
}
```

**Response:**
```json
{
  "suggestion": "You've mastered wallets! Next, learn about smart contracts.",
  "priority": "high",
  "next_modules": [3, 4],
  "rationale": "Based on your progress, security is the next logical topic.",
  "projects": [
    {
      "title": "Build a Simple NFT",
      "difficulty": "intermediate"
    }
  ]
}
```

### POST /mentor/explain

Explains a topic with links and recommended modules.

**Request:**
```json
{
  "question": "What is reentrancy?"
}
```

**Response:**
```json
{
  "topic": "smart_contract_security",
  "explanation": "Reentrancy is a vulnerability where...",
  "recommended_modules": [7, 8],
  "resources": [
    {
      "title": "Reentrancy Attack Explained",
      "url": "https://..."
    }
  ]
}
```

### GET /mentor/profile/:wallet

Returns user's learning profile and insights.

**Response:**
```json
{
  "wallet": "0xUser...",
  "strengths": ["blockchain_basics", "wallets"],
  "weaknesses": ["smart_contract_security"],
  "suggested_projects": [
    {
      "title": "Audit a Smart Contract",
      "difficulty": "advanced"
    }
  ]
}
```

## Implementation Steps

### Step 1: Initialize Knowledge Base

1. Create `knowledge_base.json` with topics
2. Add keywords, modules, prerequisites
3. Include example projects

### Step 2: Implement NLP Utils

```python
# services/nlp_utils.py
import spacy

nlp = spacy.load("en_core_web_sm")

def extract_keywords(text):
    doc = nlp(text)
    return [token.text for token in doc if not token.is_stop]

def find_matching_topic(keywords):
    # Match against knowledge base topics
    # Return best match
    pass
```

### Step 3: Implement Mentor Service

```python
# services/mentor.py
class CheckMate:
    def suggest(self, completed_modules, user_xp, tags):
        # Analyze progress
        # Find gaps
        # Return recommendations
        pass
    
    def explain(self, question):
        # Extract topic from question
        # Return explanation + links
        pass
```

### Step 4: Create API Endpoints

```python
# main.py
from fastapi import FastAPI
from services.mentor import mentor

app = FastAPI()

@app.post("/mentor/suggest")
async def suggest(request: SuggestRequest):
    return mentor.suggest(
        completed_modules=request.progress.completed_modules,
        user_xp=request.progress.xp,
        tags=request.progress.tags
    )

@app.post("/mentor/explain")
async def explain(request: ExplainRequest):
    return mentor.explain(question=request.question)
```

## Rule Examples

### Rule 1: Security Gap Detection

```python
if "smart_contracts" in completed_modules and "security" not in completed_modules:
    return {
        "suggestion": "You've learned smart contracts! Master security next.",
        "next_modules": [7, 8, 9],  # Security modules
    }
```

### Rule 2: Project Suggestion

```python
if len(completed_modules) >= 5 and not user_has_project:
    return {
        "suggestion": "You're ready to build! Try a small dApp.",
        "projects": [{"title": "Build a Simple NFT", ...}]
    }
```

### Rule 3: Topic Explanation

```python
if "reentrancy" in question.lower():
    topic = knowledge_base["smart_contract_security"]
    return {
        "topic": "smart_contract_security",
        "explanation": topic["definition"],
        "recommended_modules": topic["recommended_modules"],
    }
```

## Testing

### Unit Tests

```bash
pytest tests/test_mentor.py
pytest tests/test_nlp.py
```

### Integration Tests

```bash
pytest tests/test_api.py
```

### Manual Testing

Use Swagger UI at `http://localhost:8000/docs` to test endpoints.

## Database Integration

CheckMate reads from backend DB to access:
- User progress data
- Course metadata
- Module information

**Query Example:**

```python
from sqlalchemy import create_engine

engine = create_engine(os.getenv("BACKEND_DB_URL"))

def get_user_progress(wallet):
    # Query progress table
    # Return completed modules
    pass
```

## Future Enhancements (Post-MVP)

### LLM Integration

Use OpenAI or local Llama for:
- Personalized study plans
- Course summaries
- Project briefs

```python
# Optional: services/llm.py
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_study_plan(user_profile):
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "user", "content": f"Create a study plan for: {user_profile}"}
        ]
    )
    return response.choices[0].message.content
```

### Embeddings & Semantic Search

Use embeddings for better topic matching:

```python
from openai import OpenAI

def embed_question(question):
    response = client.embeddings.create(
        input=question,
        model="text-embedding-3-small"
    )
    return response.data[0].embedding
```

## Deployment

### Local Docker

```bash
docker build -t checkmate .
docker run -p 8000:8000 checkmate
```

### Railway

```bash
railway up
```

### Vercel (with serverless)

```bash
pip freeze > requirements.txt
# Deploy via Vercel dashboard or CLI
```

## Troubleshooting

### Module import errors?

```bash
pip install -r requirements.txt
```

### spaCy model not found?

```bash
python -m spacy download en_core_web_sm
```

### Database connection failing?

- Check `BACKEND_DB_URL` is correct
- Verify PostgreSQL is running
- Check firewall/network access

### Endpoints not responding?

- Check FastAPI is running
- Verify port 8000 is not blocked
- Check `/docs` for errors

## Resources

- [FastAPI Docs](https://fastapi.tiangolo.com)
- [spaCy Docs](https://spacy.io)
- [SQLAlchemy Docs](https://docs.sqlalchemy.org)
- [OpenAI API Docs](https://platform.openai.com/docs) (for future LLM)

---

**Questions?** Check `docs/DESIGN.md` for the full design specification.
