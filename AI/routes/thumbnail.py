"""
Thumbnail Generator Routes
"""

import os
from fastapi import APIRouter, HTTPException, Depends
from models.phase2 import GenerateThumbnailRequest, GenerateThumbnailResponse
from services.thumbnail import ThumbnailService
from services.gemini import GeminiClient
from services.cache import CacheService


router = APIRouter(prefix="/generate", tags=["thumbnail"])


def get_thumbnail_service():
    """Dependency injection for ThumbnailService"""
    redis_url = os.getenv("REDIS_URL", "redis://redis:6379")
    return ThumbnailService(
        gemini_client=GeminiClient(),
        cache_service=CacheService(redis_url=redis_url)
    )


@router.post("/thumbnail", response_model=GenerateThumbnailResponse)
async def generate_thumbnail(
    request: GenerateThumbnailRequest,
    service: ThumbnailService = Depends(get_thumbnail_service)
):
    """
    Generate smart thumbnail with key moment extraction
    
    Analyzes video transcript to:
    - Identify most engaging moment
    - Suggest compelling overlay text
    - Choose optimal color scheme
    - Recommend icon/emoji
    
    Returns guidance for thumbnail creation with color scheme and text overlay
    """
    try:
        thumbnail_result = await service.generate_thumbnail(
            video_title=request.video_title,
            transcript=request.transcript,
            key_concept=request.key_concept,
            thumbnail_text=request.thumbnail_text
        )
        
        return GenerateThumbnailResponse(
            base64_placeholder=thumbnail_result.get("base64_placeholder", ""),
            metadata=thumbnail_result.get("metadata", {}),
            text_overlay=thumbnail_result.get("text_overlay", ""),
            background_color=thumbnail_result.get("background_color", "#1E40AF"),
            text_color=thumbnail_result.get("text_color", "#FFFFFF"),
            generation_notes=thumbnail_result.get("generation_notes", "")
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Thumbnail generation failed: {str(e)}")
