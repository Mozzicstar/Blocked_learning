"""
Content Intelligence API Routes

Endpoints for video analysis, quality scoring, and quiz generation.
"""
import os
from fastapi import APIRouter, Depends, HTTPException
from models.content import (
    VideoAnalysisRequest,
    VideoAnalysisResponse,
    QualityAnalysisRequest,
    QualityAnalysisResponse,
    QuizGenerationRequest,
    QuizGenerationResponse,
    QualityScore,
    QuizResponse
)
from services.gemini import GeminiClient
from services.cache import CacheService
from services.content import ContentService

router = APIRouter(prefix="/analyze", tags=["Content Intelligence"])

# Dependency injection for services
async def get_content_service() -> ContentService:
    """Dependency to get content service instance."""
    gemini_client = GeminiClient()
    cache_service = CacheService(redis_url=os.getenv("REDIS_URL", "redis://redis:6379/0"))
    return ContentService(gemini_client, cache_service)


# ========== Video Analysis Endpoint ==========

@router.post("/video", response_model=VideoAnalysisResponse)
async def analyze_video(
    request: VideoAnalysisRequest,
    content_service: ContentService = Depends(get_content_service)
):
    """
    Analyze video and extract metadata.
    
    - **video_path**: Path or URL to video file
    - **creator_wallet**: Creator's wallet address
    
    Returns: title, description, topics, difficulty, learning objectives, transcript analysis
    """
    try:
        # Apply rate limiting (more lenient for video analysis - 2 per minute)
        await content_service.cache.check_rate_limit(
            identifier=request.creator_wallet,
            max_requests=2,
            window_seconds=60
        )
        
        # Analyze video
        result = await content_service.analyze_video(
            video_path=request.video_path,
            creator_wallet=request.creator_wallet
        )
        
        return VideoAnalysisResponse(**result)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Video analysis failed: {str(e)}")


# ========== Quality Analysis Endpoint ==========

@router.post("/quality", response_model=QualityAnalysisResponse)
async def analyze_quality(
    request: QualityAnalysisRequest,
    content_service: ContentService = Depends(get_content_service)
):
    """
    Score content quality.
    
    - **video_url**: URL to video
    - **transcript**: Video transcript
    - **metadata**: Optional metadata dict
    
    Returns: quality_score (0-100), is_educational, audio_quality, content_depth, issues, recommendation
    """
    try:
        # Extract creator wallet from URL or use default
        creator_identifier = request.video_url.split('/')[-1][:32]
        
        # Rate limit
        await content_service.cache.check_rate_limit(
            identifier=creator_identifier,
            max_requests=5,
            window_seconds=60
        )
        
        # Score quality
        result = await content_service.score_quality(
            video_url=request.video_url,
            transcript=request.transcript,
            metadata=request.metadata
        )
        
        return QualityAnalysisResponse(**result)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Quality analysis failed: {str(e)}")


# ========== Quiz Generation Endpoint ==========

quiz_router = APIRouter(prefix="/generate", tags=["Content Generation"])

@quiz_router.post("/quiz", response_model=QuizResponse)
async def generate_quiz(
    request: QuizGenerationRequest,
    content_service: ContentService = Depends(get_content_service)
):
    """
    Generate quiz from video transcript.
    
    - **video_id**: Video identifier
    - **transcript**: Video transcript text
    - **key_concepts**: List of concepts to test
    - **difficulty**: beginner|intermediate|advanced
    - **num_questions**: Number of questions (3-10)
    
    Returns: array of multiple-choice questions with explanations
    """
    try:
        # Rate limit (quiz generation is compute-intensive - 3 per minute)
        await content_service.cache.check_rate_limit(
            identifier=f"quiz_{request.video_id}",
            max_requests=3,
            window_seconds=60
        )
        
        # Generate quiz
        result = await content_service.generate_quiz(
            video_id=request.video_id,
            transcript=request.transcript,
            key_concepts=request.key_concepts,
            difficulty=request.difficulty,
            num_questions=request.num_questions
        )
        
        return QuizResponse(**result)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Quiz generation failed: {str(e)}")
