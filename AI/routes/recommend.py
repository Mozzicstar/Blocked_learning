"""
Video Recommendation Routes
"""

import os
from fastapi import APIRouter, HTTPException, Depends
from models.phase2 import VideoRecommendationRequest, VideoRecommendationResponse
from services.recommend import RecommendService
from services.gemini import GeminiClient
from services.cache import CacheService


router = APIRouter(prefix="/recommend", tags=["recommendations"])


def get_recommend_service():
    """Dependency injection for RecommendService"""
    redis_url = os.getenv("REDIS_URL", "redis://redis:6379")
    return RecommendService(
        gemini_client=GeminiClient(),
        cache_service=CacheService(redis_url=redis_url)
    )


@router.post("/next", response_model=VideoRecommendationResponse)
async def recommend_next_videos(
    request: VideoRecommendationRequest,
    service: RecommendService = Depends(get_recommend_service)
):
    """
    Get personalized video recommendations
    
    Analyzes:
    - Watch history and completed videos
    - Current skill level
    - User interests and topics
    
    Returns ranked video recommendations with explanations
    """
    try:
        recommendations = await service.recommend_videos(
            user_id=request.user_id,
            completed_videos=request.completed_videos,
            watch_history=request.watch_history,
            skill_level=request.skill_level,
            interests=request.interests,
            limit=request.limit,
            available_videos=request.available_videos
        )
        
        return VideoRecommendationResponse(
            user_id=recommendations.get("user_id", request.user_id),
            recommended_videos=recommendations.get("recommended_videos", []),
            total_recommended=recommendations.get("total_recommended", 0),
            recommendation_reason=recommendations.get("recommendation_reason", "")
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation failed: {str(e)}")
