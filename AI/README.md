# CheckMate AI Service

Intelligent AI service for BLOCKEDLEARNING platform. Powers personalized learning + content intelligence.

## Quick Start

```bash
cp .env.example .env
# Add GEMINI_API_KEY to .env
docker-compose up --build
```

**API:** `http://localhost:8000` | **Docs:** `http://localhost:8000/docs`

## Tech Stack

- **AI:** Google Gemini 2.0 Flash (~$0.0002/request)
- **Framework:** FastAPI + Python 3.11
- **Cache:** Redis
- **Deploy:** Docker + docker-compose

**Cost:** ~$6/month for 1K requests/day

## Environment Variables

```env
GEMINI_API_KEY=your_api_key_here
REDIS_URL=redis://redis:6379
DEBUG=true
PORT=8000
RATE_LIMIT=3  # requests per minute
```

## API Endpoints

### 🎓 Learning Mentor (CheckMate)

| Endpoint | Purpose | Phase |
|----------|---------|-------|
| `POST /mentor/explain` | Personalized explanations with code examples | MVP |
| `POST /mentor/suggest` | Smart next-step recommendations | MVP |
| `GET /mentor/profile/:wallet` | Learning analysis & 4-week plan | MVP |
| `POST /mentor/audit-code` | Security vulnerability detection | Phase 2 |
| `POST /mentor/generate-project` | Custom project templates | Phase 2 |

### 🎥 Content Intelligence

| Endpoint | Purpose | Phase |
|----------|---------|-------|
| `POST /analyze/video` | Auto-generate metadata from video | MVP |
| `POST /analyze/quality` | Content quality scoring | MVP |
| `POST /generate/quiz` | Auto-create quizzes from videos | MVP |
| `POST /generate/thumbnail` | Smart thumbnail generation | Phase 2 |
| `POST /search/semantic` | Semantic search for content | Phase 2 |
| `POST /recommend/next` | Video recommendations | Phase 2 |

## Features

**Phase 1 (MVP - Week 1-2):**

*Learning Mentor:*
- ✅ Personalized explanations with code examples
- ✅ Smart next-step recommendations
- ✅ Learning analysis & 4-week plans
- ✅ Adaptive difficulty (skill level detection)
- ✅ Context enrichment from user progress

*Content Intelligence:*
- ✅ Video metadata extraction (auto-generate title, topics, objectives)
- ✅ Quality scoring (prevent spam, maintain standards)
- ✅ Quiz auto-generation from video content

**Phase 2 (Enhanced - Week 3-4):**

*Advanced Mentor:*
- 🔥 Security code auditing (vulnerability detection)
- 🔥 Project template generator (custom scaffolds)
- 📈 Industry trend integration (news connection)
- 🎯 Career path recommendations (job readiness)

*Advanced Content:*
- 🔥 Smart thumbnail generation
- 🔥 Semantic search (context-aware discovery)
- 🔥 Video recommendation engine

**Total: 20 features across 2 phases**

## Project Structure

```
AI/
├── services/
│   ├── gemini.py          # Gemini API wrapper
│   ├── mentor.py          # Learning mentor logic
│   ├── content_analyzer.py # Video analysis
│   ├── quiz_generator.py  # Quiz creation
│   ├── cache.py           # Redis caching
│   └── context_builder.py # Context enrichment
├── prompts/               # Prompt templates
│   ├── explain.txt        # Mentor prompts
│   ├── suggest.txt
│   ├── profile.txt
│   ├── analyze_video.txt  # Content prompts
│   ├── generate_quiz.txt
│   ├── audit.txt          # Phase 2
│   └── project.txt        # Phase 2
├── models/                # Pydantic schemas
│   ├── mentor.py          # Mentor request/response
│   ├── content.py         # Content request/response
│   └── common.py
├── routes/
│   ├── mentor.py          # /mentor/* endpoints
│   └── content.py         # /analyze/*, /generate/*
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
└── main.py
```

## Local Development (Without Docker)

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Start Redis
redis-server

# Start FastAPI
uvicorn main:app --reload
```

## Docker Services

```yaml
services:
  ai-service:    # FastAPI app (port 8000)
  redis:         # Cache layer
  postgres:      # Shared with Backend
```

## Key Benefits

**For Learners:**
- Personalized explanations (not generic)
- Smart recommendations (adaptive)
- Interactive quizzes (auto-generated)

**For Content Creators:**
- 4x faster uploads (AI auto-fills metadata)
- Quality scoring (maintains platform standards)
- Better discoverability (semantic search)

## Integration with Backend

**Backend sends requests:**
```python
# Learning mentor
ai_response = requests.post("http://ai-service:8000/mentor/explain", json=data)

# Video analysis
metadata = requests.post("http://ai-service:8000/analyze/video", json=data)
```

**You return JSON. Backend handles:**
- Blockchain storage (Origin SDK)
- Database persistence
- Frontend responses

**Clean separation. No blockchain code in AI service.**

## Example Requests

### 🎓 Mentor: Explain Concept

**Request:**
```json
POST /mentor/explain
{
  "wallet": "0x123",
  "question": "What is reentrancy?",
  "user_context": {
    "completed_topics": ["wallets", "transactions"],
    "skill_level": "beginner"
  }
}
```

**Response:**
```json
{
  "explanation": "Reentrancy is like leaving your door unlocked...",
  "codeExample": "contract Vulnerable {...}",
  "nextTopics": [12, 15],
  "difficulty": "intermediate"
}
```

### 🎥 Content: Analyze Video

**Request:**
```json
POST /analyze/video
{
  "video_url": "https://storage.../lesson.mp4",
  "creator_wallet": "0x456"
}
```

**Response:**
```json
{
  "title": "Smart Contract Security Best Practices",
  "topics": ["security", "solidity", "auditing"],
  "difficulty": "intermediate",
  "learning_objectives": ["Identify vulnerabilities", "Use security patterns"],
  "duration_minutes": 18,
  "quality_score": 87
}
```

### 📝 Content: Generate Quiz

**Request:**
```json
POST /generate/quiz
{
  "video_id": 42,
  "transcript": "Today we'll learn about reentrancy...",
  "difficulty": "intermediate"
}
```

**Response:**
```json
{
  "questions": [
    {
      "question": "What is the checks-effects-interactions pattern?",
      "options": ["Prevents reentrancy", "Optimizes gas", "Tests contracts"],
      "correct_answer": 0,
      "explanation": "It prevents reentrancy by updating state first."
    }
  ]
}
```

## Testing

```bash
# Unit tests
pytest tests/

# API tests
pytest tests/test_api.py

# With coverage
pytest --cov=services tests/
```

## Monitoring

- Health check: `GET /health`
- Metrics: `GET /metrics`
- Logs: Docker logs or stdout

## See Also

- **Design Doc:** `docs/DESIGN.md` - Full technical specifications
- **Endpoints:** `docs/ENDPOINTS.md` - API reference
- **File Structure:** `docs/FILE_STRUCTURE.md` - Detailed folder breakdown
