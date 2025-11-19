# CheckMate AI Service — Design Doc

**Vision:** Intelligent AI service powering personalized learning + content intelligence for BLOCKEDLEARNING.

---

## System Overview

### Two Core Functions

**1. Learning Mentor (CheckMate)**
- Personalized explanations & guidance
- Smart recommendations
- Learning path analysis

**2. Content Intelligence**
- Video metadata extraction
- Quiz generation
- Quality scoring
- Search & recommendations

### Architecture Flow
```
Backend Request → Context Enrichment → Gemini API → Structured JSON → Cache → Response
```

**No blockchain code.** Backend handles Origin SDK integration.

---

## Tech Stack

- **AI:** Google Gemini 2.0 Flash (multimodal)
- **Framework:** FastAPI + Python 3.11
- **Cache:** Redis
- **Deploy:** Docker

**Cost:** ~$0.0002/request = $6/month for 1K requests/day

---

## Complete Feature Scope

### Phase 1: MVP (Week 1-2) - 13 Features

**A. Learning Mentor (10 features):**
1. Personalized explanations (`/mentor/explain`)
2. Smart recommendations (`/mentor/suggest`)
3. Learning analysis (`/mentor/profile/:wallet`)
4. Context enrichment (skill level, gaps, pace)
5. Prompt templates
6. Code examples in responses
7. Project suggestions
8. Adaptive difficulty
9. Redis caching
10. Rate limiting

**B. Content Intelligence (3 features):**
11. Video metadata extraction (`/analyze/video`)
12. Quality scoring (`/analyze/quality`)
13. Quiz generation (`/generate/quiz`)

### Phase 2: Enhanced (Week 3-4) - 7 Features

**C. Advanced Mentor (4 features):**
14. Security auditing (`/mentor/audit-code`)
15. Project template generator (`/mentor/generate-project`)
16. Industry trends integration
17. Career path recommendations

**D. Advanced Content (3 features):**
18. Smart thumbnails (`/generate/thumbnail`)
19. Semantic search (`/search/semantic`)
20. Video recommendations (`/recommend/next`)

---

#### 1. POST /mentor/explain
**Personalized topic explanations with code examples**

**Input:**
```json
{
  "wallet": "0x123",
  "question": "What is reentrancy?"
}
```

**Process:**
1. Query DB: user's completed topics, skill level
2. Build context: gaps, learning pace, style
3. Gemini prompt: "Explain reentrancy to a beginner who knows wallets but not security. Use analogies. Include code."
4. Return structured JSON

**Output:**
```json
{
  "explanation": "...",
  "analogy": "...",
  "codeExample": "contract Vulnerable {...}",
  "nextTopics": [12, 15],
  "difficulty": "intermediate",
  "resources": [{"title": "...", "url": "..."}]
}
```

#### 2. POST /mentor/suggest
**Smart next-step recommendations**

**Input:**
```json
{
  "wallet": "0x123",
  "progress": {
    "completedModules": [1, 2, 5, 8],
    "xp": 450,
    "timePerWeek": 5
  }
}
```

**Process:**
1. Analyze learning pattern (pace, topics, gaps)
2. Gemini: "User completed 8 modules. What's their BEST next step? Consider career progression."
3. Generate project or course recommendation

**Output:**
```json
{
  "nextStep": "Build a DeFi yield aggregator",
  "reasoning": "You know DeFi basics. This teaches advanced concepts and builds your portfolio.",
  "difficulty": "intermediate",
  "estimatedTime": "12 hours",
  "careerImpact": "high",
  "projectIdea": {
    "title": "...",
    "description": "...",
    "techStack": ["Solidity", "Hardhat"]
  }
}
```

#### 3. GET /mentor/profile/:wallet
**Learning analysis & personalized roadmap**

**Process:**
1. Aggregate progress (modules, pace, time invested)
2. Gemini: "Analyze this learner. Generate strengths, weaknesses, 4-week plan."

**Output:**
```json
{
  "strengths": ["Smart contracts", "Solidity"],
  "weaknesses": ["Security", "Testing"],
  "learningStyle": "hands-on",
  "fourWeekPlan": [
    {
      "week": 1,
      "focus": "Security fundamentals",
      "modules": [12, 13],
      "estimatedHours": 8
    }
  ],
  "careerReadiness": {
    "role": "Junior Smart Contract Developer",
    "match": "75%",
    "gaps": ["Testing", "Gas optimization"]
  }
}
```

### B. Content Intelligence Endpoints

#### 4. POST /analyze/video
**Auto-generate metadata from video**

**Input:**
```json
{
  "video_url": "https://storage.../lesson.mp4",
  "creator_wallet": "0x123"
}
```

**Process:**
1. Transcribe video audio (Gemini multimodal or Whisper)
2. Analyze transcript with Gemini
3. Extract topics, difficulty, learning objectives
4. Generate description & summary

**Output:**
```json
{
  "title": "Smart Contract Security Best Practices",
  "description": "Learn to identify and prevent common vulnerabilities...",
  "topics": ["security", "smart_contracts", "solidity"],
  "difficulty": "intermediate",
  "prerequisites": ["solidity_basics"],
  "learning_objectives": ["Identify reentrancy", "Use security patterns"],
  "duration_minutes": 18,
  "key_concepts": ["reentrancy", "access control"],
  "transcript": "...",
  "summary": "This lesson covers top 5 vulnerabilities..."
}
```

**Gemini Prompt:**
```
Analyze this blockchain education video transcript: {transcript}

Extract:
1. Main topics (tags)
2. Difficulty level
3. Learning objectives
4. Prerequisites
5. Compelling 2-sentence description
6. Key concepts summary

Return JSON.
```

#### 5. POST /analyze/quality
**Content quality scoring**

**Input:**
```json
{
  "video_url": "https://storage.../lesson.mp4",
  "transcript": "...",
  "metadata": {...}
}
```

**Output:**
```json
{
  "quality_score": 87,
  "is_educational": true,
  "audio_quality": "good",
  "content_depth": "comprehensive",
  "issues": [],
  "recommendation": "approve"
}
```

**Purpose:** Prevent spam, maintain platform quality.

#### 6. POST /generate/quiz
**Auto-create quizzes from videos**

**Input:**
```json
{
  "video_id": 42,
  "transcript": "...",
  "key_concepts": ["reentrancy", "access control"],
  "difficulty": "intermediate"
}
```

**Output:**
```json
{
  "questions": [
    {
      "question": "What is the checks-effects-interactions pattern?",
      "options": [
        "Prevents reentrancy attacks",
        "Optimizes gas",
        "Tests contracts",
        "Upgrades contracts"
      ],
      "correct_answer": 0,
      "explanation": "It prevents reentrancy by updating state before external calls."
    }
  ],
  "quiz_difficulty": "intermediate",
  "estimated_time_minutes": 5
}
```

**Gemini Prompt:**
```
Generate a quiz for this blockchain lesson.

Transcript: {transcript}
Key concepts: {concepts}
Difficulty: {difficulty}

Create 5 multiple-choice questions that:
1. Test understanding (not memorization)
2. Match {difficulty} level
3. Include clear explanations

Return JSON.
```

---

## Phase 2: Enhanced Features

### C. Advanced Mentor Features

#### 7. POST /mentor/audit-code
**Security vulnerability detection**

Submit smart contract → Gemini scans for issues → Annotated response

**Features:**
- Reentrancy detection
- Access control vulnerabilities
- Integer overflow/underflow
- Gas optimization suggestions
- Best practice violations

**Example Output:**
```json
{
  "vulnerabilities": [
    {
      "line": 42,
      "severity": "critical",
      "issue": "reentrancy",
      "explanation": "External call before state update allows reentrancy attack",
      "fix": "Use checks-effects-interactions pattern"
    }
  ],
  "gasOptimizations": [...],
  "score": 65
}
```

#### 8. POST /mentor/generate-project
**Custom project template generator**

Based on skill level + interests → Full project scaffold with TODOs

**Output:**
- Project description & learning goals
- File structure
- Starter code with commented TODOs
- Test cases to implement
- Deployment guide

### D. Advanced Content Features

#### 9. POST /generate/thumbnail
**Smart thumbnail generation**

Analyze video frames → Extract key moment → Generate thumbnail with text overlay.

#### 10. POST /search/semantic
**Semantic search for content**

User searches "prevent hacks" → Matches videos about "security", "auditing", "vulnerabilities" (not just keyword match).

#### 11. POST /recommend/next
**Video recommendations**

User finishes video → AI analyzes watch history + skill level → Recommends next video.

**Example:**
```json
{
  "recommended_videos": [
    {
      "video_id": 42,
      "title": "Advanced Reentrancy Prevention",
      "reason": "You've mastered basics. This covers advanced patterns.",
      "relevance_score": 0.94
    }
  ]
}
```

## API Endpoints

### Phase 1: MVP

#### A. Learning Mentor Endpoints

---

## Integration with Backend

**Backend calls AI service:**
```python
# Learning mentor
ai_response = requests.post("http://ai-service:8000/mentor/explain", json=data)

# Video analysis
metadata = requests.post("http://ai-service:8000/analyze/video", json=data)

# Backend handles blockchain (Origin SDK) and database
origin_id = origin_sdk.register_content(metadata)
db.save({**metadata, "origin_id": origin_id})
```

**Clean separation:**
- AI service: Intelligence only (no blockchain code)
- Backend: Blockchain, DB, orchestration
- Smart contracts: On-chain storage

---

Reusable templates in `prompts/` folder:

```
prompts/
├── explain.txt      # Educational explanations
├── suggest.txt      # Next-step suggestions
├── profile.txt      # Learning analysis
├── audit.txt        # Code vulnerability scanning (Phase 2)
└── project.txt      # Project generation (Phase 2)
```

**Example (explain.txt):**
```
You are an expert blockchain educator. A {skill_level} developer asks: "{question}"

Their knowledge: {completed_topics}
Their gaps: {missing_topics}

Explain by:
1. Building on what they KNOW
2. Using a real-world analogy
3. Including a Solidity code example
4. Suggesting 2 next topics

Return ONLY valid JSON:
{
  "explanation": "...",
  "analogy": "...",
  "codeExample": "...",
  "nextTopics": [...],
  "difficulty": "..."
}
```

---

## Context Enrichment

**Key to personalization.** Enrich every request with DB data:

```python
user_context = {
    "completed_modules": db.get_completed(wallet),
    "skill_level": calculate_level(completed_count),
    "learning_pace": db.get_avg_time_per_module(wallet),
    "gaps": find_missing_prerequisites(completed_modules),
    "time_per_week": user.time_commitment,
    "last_active": user.last_login
}

prompt = template.format(**user_context, question=question)
response = gemini.generate(prompt, output_format="json")
```

---

## Caching Strategy

**Redis caching:**
- Key: `hash(wallet + question + context)`
- TTL: 24 hours for explanations, 1 hour for suggestions
- Saves costs (same question = instant cached response)

**Rate limiting:**
- 3 requests/minute per user
- Prevents abuse, controls API costs

---

## Dockerization

```yaml
services:
  ai-service:
    build: ./AI
    ports: ["8000:8000"]
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - REDIS_URL=redis://redis:6379
      - BACKEND_DB_URL=postgresql://...
    depends_on: [redis, postgres]
  
  redis:
    image: redis:7-alpine
    volumes: [redis_data:/data]
  
  postgres:
    # Shared with Backend service
```

**Commands:**
```bash
docker-compose up                # Development
dockermnj-compose up -d             # Production (detached)
docker-compose logs ai-service   # View logs
```

---

## Cost Analysis

| Volume | Daily Cost | Monthly Cost |
|--------|-----------|--------------|
| 1K requests/day | $0.20 | $6 |
| 10K requests/day | $2.00 | $60 |
| 100K requests/day | $20.00 | $600 |

**Calculation:**
- Input: $0.075 per 1M tokens
- Output: $0.30 per 1M tokens
- Typical: 1000 input + 500 output tokens = $0.0002

---

## Implementation Timeline

### Week 1: Core MVP
- Gemini wrapper + basic inference
- 3 mentor endpoints (explain, suggest, profile)
- Context enrichment logic
- Prompt templates
- Redis caching

### Week 2: MVP Polish + Content
- Code examples in responses
- Project suggestions
- Adaptive difficulty
- 3 content endpoints (analyze/video, analyze/quality, generate/quiz)
- Docker setup
- Rate limiting

### Week 3: Phase 2 - High Impact
- Security auditing endpoint
- Project generator endpoint
- Smart thumbnails
- Semantic search

### Week 4: Phase 2 - Engagement
- Video recommendations
- Industry trends integration
- Career path hints
- Testing & polish

---

## Success Metrics

- Response quality (user ratings)
- Metadata accuracy (creator validation rate)
- Quiz completion rate
- Recommendation click-through rate
- Cost per active user (~$0.0002/request)
