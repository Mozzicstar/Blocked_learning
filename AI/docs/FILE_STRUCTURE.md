# AI / CheckMate File Structure

```
AI/
├── services/
│   ├── mentor.py                    # Core CheckMate logic & rule engine
│   ├── nlp_utils.py                 # Keyword extraction, topic matching
│   ├── knowledge_base.py            # Load & manage knowledge base
│   └── db.py                        # Database connection to backend DB
│
├── models/
│   ├── request.py                   # Pydantic request models (SuggestRequest, ExplainRequest)
│   ├── response.py                  # Pydantic response models
│   └── topic.py                     # Topic data models
│
├── routes/
│   └── mentor.py                    # FastAPI endpoints (/suggest, /explain, /profile)
│
├── test/
│   ├── test_mentor.py
│   ├── test_nlp.py
│   └── test_routes.py
│
├── knowledge_base.json              # Topics, rules, learning paths, projects
├── main.py                          # FastAPI app entry point
├── requirements.txt                 # Python dependencies
├── .env                             # Database URL, API keys (git-ignored)
├── .env.example
├── Dockerfile
├── docker-compose.yml
├── README.md
└── .gitignore
```

## Key Folders Explained

- **`services/`** — Core logic (mentor rules, NLP, knowledge base, DB)
- **`models/`** — Pydantic request/response schemas
- **`routes/`** — FastAPI endpoint handlers
- **`test/`** — Unit & integration tests

## Key Files

- **`main.py`** — FastAPI app setup & route registration
- **`services/mentor.py`** — Rule engine (suggest, explain logic)
- **`services/nlp_utils.py`** — Keyword extraction, topic matching
- **`knowledge_base.json`** — Topics, rules, recommended modules, projects
- **`models/request.py`** — Request validation schemas
- **`models/response.py`** — Response schemas

## Knowledge Base Structure

```json
{
  "topics": {
    "smart_contracts": {
      "name": "Smart Contracts",
      "definition": "...",
      "keywords": ["contract", "solidity", "code"],
      "recommended_modules": [1, 2, 3],
      "difficulty": "intermediate",
      "prerequisites": ["blockchain_basics"],
      "projects": [{"title": "Build ERC20", "difficulty": "intermediate"}]
    }
  },
  "learning_paths": {
    "blockchain_dev": {
      "name": "Blockchain Developer",
      "topics": ["blockchain_basics", "wallets", "smart_contracts", "security"],
      "duration_weeks": 8
    }
  }
}
```
