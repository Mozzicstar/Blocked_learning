"""
FastAPI routes for AI Mentor endpoints.
"""
from fastapi import APIRouter, Depends, HTTPException
from models.mentor import (
    ExplainRequest, ExplainResponse,
    SuggestRequest, SuggestResponse,
    ProfileRequest, ProfileResponse
)
from services.mentor import MentorService
from services.gemini import GeminiClient
from services.cache import CacheService
import os

router = APIRouter(prefix="/mentor", tags=["Learning Mentor"])

# Initialize services (will be moved to dependency injection)
async def get_mentor_service() -> MentorService:
    """Dependency to get mentor service instance."""
    gemini_client = GeminiClient()
    cache_service = CacheService(redis_url=os.getenv("REDIS_URL", "redis://redis:6379/0"))
    return MentorService(gemini_client, cache_service)

@router.post("/explain", response_model=ExplainResponse)
async def explain_concept(
    request: ExplainRequest,
    mentor: MentorService = Depends(get_mentor_service)
):
    """
    Get personalized explanation for a blockchain concept.
    
    - **question**: The concept or question to explain
    - **wallet**: User's wallet address (for context)
    - **user_context**: Optional learning profile from Backend
    
    Returns explanation with code examples, analogies, and next topics.
    """
    try:
        # Apply rate limiting
        await mentor.cache.check_rate_limit(
            identifier=request.wallet,
            max_requests=10,  # 10 questions per minute
            window_seconds=60
        )
        
        # Build user context
        user_context = {
            "wallet": request.wallet,
            "skill_level": request.user_context.skill_level if request.user_context else "beginner",
            "completed_topics": request.user_context.completed_topics if request.user_context else [],
            "gaps": request.user_context.gaps if request.user_context else []
        }
        
        # Generate explanation
        result = await mentor.explain(
            question=request.question,
            user_context=user_context
        )
        
        return ExplainResponse(**result)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate explanation: {str(e)}")

@router.post("/suggest", response_model=SuggestResponse)
async def suggest_next_step(
    request: SuggestRequest,
    mentor: MentorService = Depends(get_mentor_service)
):
    """
    Get personalized next learning step recommendation.
    
    - **wallet**: User's wallet address
    - **completed_modules**: List of completed module IDs
    - **skill_level**: Current skill level
    - **learning_pace**: Courses completed per week
    - **time_per_week**: Hours available per week
    
    Returns next step, reasoning, and project suggestion.
    """
    try:
        # Rate limit
        await mentor.cache.check_rate_limit(
            identifier=request.wallet,
            max_requests=5,
            window_seconds=60
        )
        
        # Build context
        user_context = {
            "wallet": request.wallet,
            "completed_modules": request.user_context.completed_modules if request.user_context else [],
            "skill_level": request.user_context.skill_level if request.user_context else "beginner",
            "learning_pace": request.user_context.learning_pace if request.user_context else 2.0,
            "time_per_week": request.user_context.time_per_week if request.user_context else 10,
            "completed_topics": request.user_context.completed_topics if request.user_context else [],
            "gaps": request.user_context.gaps if request.user_context else []
        }
        
        # Generate suggestion
        result = await mentor.suggest(user_context=user_context)
        
        return SuggestResponse(**result)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate suggestion: {str(e)}")

@router.post("/profile", response_model=ProfileResponse)
async def analyze_profile(
    request: ProfileRequest,
    mentor: MentorService = Depends(get_mentor_service)
):
    """
    Comprehensive learning profile analysis with 4-week plan.
    
    - **wallet**: User's wallet address
    - **total_modules**: Total modules completed
    - **topics_breakdown**: Dict mapping topics to completion count
    - **learning_pace**: Average courses per week
    - **total_hours**: Total learning hours invested
    - **skill_level**: Current skill assessment
    
    Returns strengths, weaknesses, learning style, career fit, and 4-week plan.
    """
    try:
        # Rate limit (profile analysis is expensive)
        await mentor.cache.check_rate_limit(
            identifier=request.wallet,
            max_requests=3,
            window_seconds=300  # 3 per 5 minutes
        )
        
        # Build learning data
        learning_data = {
            "completed_modules": request.user_context.completed_modules if request.user_context else [],
            "completed_topics": request.user_context.completed_topics if request.user_context else [],
            "learning_pace": request.user_context.learning_pace if request.user_context else 1.0,
            "time_per_week": request.user_context.time_per_week if request.user_context else 5,
            "skill_level": request.user_context.skill_level if request.user_context else "beginner",
            "gaps": request.user_context.gaps if request.user_context else []
        }
        
        # Generate profile
        result = await mentor.profile(
            wallet=request.wallet,
            learning_data=learning_data
        )
        
        return ProfileResponse(**result)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate profile: {str(e)}")
