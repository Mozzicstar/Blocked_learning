"""
Semantic Search Routes
"""

import os
from fastapi import APIRouter, HTTPException, Depends
from models.phase2 import SemanticSearchRequest, SemanticSearchResponse
from services.search import SearchService
from services.gemini import GeminiClient
from services.cache import CacheService
from typing import Optional, List, Dict, Any


router = APIRouter(prefix="/search", tags=["search"])


def get_search_service():
    """Dependency injection for SearchService"""
    redis_url = os.getenv("REDIS_URL", "redis://redis:6379")
    return SearchService(
        gemini_client=GeminiClient(),
        cache_service=CacheService(redis_url=redis_url)
    )


@router.post("/semantic", response_model=SemanticSearchResponse)
async def semantic_search(
    request: SemanticSearchRequest,
    service: SearchService = Depends(get_search_service)
):
    """
    Semantic search for content beyond keyword matching
    
    Understands user intent:
    - "prevent hacks" → security content
    - "learn transactions" → blockchain basics
    - "optimize gas" → performance tutorials
    
    Returns ranked results with relevance scores and match explanations
    """
    try:
        search_result = await service.semantic_search(
            query=request.query,
            video_database=request.video_database,
            difficulty_filter=request.difficulty_filter,
            limit=request.limit
        )
        
        return SemanticSearchResponse(
            query=search_result.get("query", request.query),
            query_intent=search_result.get("query_intent", "general"),
            results=search_result.get("results", []),
            total_found=search_result.get("total_found", 0),
            search_summary=search_result.get("search_summary", "Search completed")
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")
