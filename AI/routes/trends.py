"""
Industry Trends Routes
"""

import os
from fastapi import APIRouter, HTTPException, Depends
from models.phase2 import IndustryTrendsRequest, IndustryTrendsResponse
from services.trends import TrendsService
from services.gemini import GeminiClient
from services.cache import CacheService


router = APIRouter(prefix="/trends", tags=["trends"])


def get_trends_service():
    """Dependency injection for TrendsService"""
    redis_url = os.getenv("REDIS_URL", "redis://redis:6379")
    return TrendsService(
        gemini_client=GeminiClient(),
        cache_service=CacheService(redis_url=redis_url)
    )


@router.post("/industry", response_model=IndustryTrendsResponse)
async def get_industry_trends(
    request: IndustryTrendsRequest,
    service: TrendsService = Depends(get_trends_service)
):
    """
    Get industry trends and career insights
    
    Provides:
    - Trending skills with market demand
    - Promising career paths and salaries
    - Industry insights and market analysis
    - Recommended certifications
    - Salary trend predictions
    
    Perfect for career planning and staying current
    """
    try:
        trends = await service.get_trends(
            region=request.region,
            industry=request.industry,
            experience_level=request.experience_level
        )
        
        return IndustryTrendsResponse(
            trending_skills=trends.get("trending_skills", []),
            career_paths=trends.get("career_paths", []),
            market_insights=trends.get("market_insights", ""),
            top_certifications=trends.get("top_certifications", []),
            salary_trends=trends.get("salary_trends", ""),
            report_generated_at=trends.get("report_generated_at", "")
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Trends retrieval failed: {str(e)}")
