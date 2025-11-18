# AI / CheckMate Endpoints

## Endpoints You Consume

### Backend Database
- Query user progress, course metadata, modules
- Update user profile & learning history

## Endpoints You Provide

### Mentor API

- `POST /mentor/suggest` body `{ wallet, progress: { completedModuleIds, xp, tags } }`
  - Returns: `{ suggestion, priority, nextModules: [id...], projects: [...] }`

- `POST /mentor/explain` body `{ question }`
  - Returns: `{ topic, explanation, recommendedModules: [id...], resources: [{title, url}] }`

- `GET /mentor/profile/:wallet`
  - Returns: `{ strengths: [...], weaknesses: [...], suggestedProjects: [...] }`

---

**Port:** `8000` (default)

**Framework:** FastAPI (Python)

**Auth:** Reads from backend JWT or API key

**Database:** Connects to backend Postgres for user/course data
