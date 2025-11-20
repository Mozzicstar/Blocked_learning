"""
Main FastAPI application for BLOCKEDLEARNING AI Service.
"""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import routers
from routes.mentor import router as mentor_router
from routes.content import router as content_router, quiz_router
from routes.audit import router as audit_router
from routes.project import router as project_router
from routes.thumbnail import router as thumbnail_router
from routes.search import router as search_router
from routes.recommend import router as recommend_router
from routes.trends import router as trends_router

# Initialize FastAPI app
app = FastAPI(
    title="BLOCKEDLEARNING AI Service",
    description="AI-powered learning mentor and content intelligence for blockchain education",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration (adjust for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(mentor_router)
app.include_router(content_router)
app.include_router(quiz_router)
app.include_router(audit_router)
app.include_router(project_router)
app.include_router(thumbnail_router)
app.include_router(search_router)
app.include_router(recommend_router)
app.include_router(trends_router)

@app.get("/")
async def root():
    """Root endpoint - health check."""
    return {
        "service": "BLOCKEDLEARNING AI",
        "status": "running",
        "version": "3.0.0",
        "features": [
            "Learning Mentor (explain, suggest, profile, audit-code, generate-project)",
            "Content Intelligence (analyze/video, analyze/quality, generate/quiz, thumbnail, search)",
            "Video Recommendations (recommend/next)",
            "Industry Trends (trends/industry)"
        ],
        "total_endpoints": 13
    }

@app.get("/health")
async def health_check():
    """
    Health check endpoint for monitoring.
    Verifies AI service and Redis connection.
    """
    health_status = {
        "status": "healthy",
        "services": {}
    }
    
    try:
        # Check Gemini API key exists
        api_key = os.getenv("GEMINI_API_KEY")
        health_status["services"]["gemini_api"] = "configured" if api_key else "missing_key"
        
        # Check Redis connection
        redis_url = os.getenv("REDIS_URL", "redis://redis:6379/0")
        # TODO: Add actual Redis ping
        health_status["services"]["redis"] = "unknown"  # Will test in Docker
        
        return health_status
        
    except Exception as e:
        health_status["status"] = "unhealthy"
        health_status["error"] = str(e)
        return health_status

if __name__ == "__main__":
    import uvicorn
    
    port = int(os.getenv("PORT", 8000))
    debug = os.getenv("DEBUG", "false").lower() == "true"
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=debug
    )
