"""
Project Generator Routes
"""

import os
from fastapi import APIRouter, HTTPException, Depends
from models.phase2 import GenerateProjectRequest, GenerateProjectResponse
from services.project import ProjectService
from services.gemini import GeminiClient
from services.cache import CacheService


router = APIRouter(prefix="/mentor", tags=["project"])


def get_project_service():
    """Dependency injection for ProjectService"""
    redis_url = os.getenv("REDIS_URL", "redis://redis:6379")
    return ProjectService(
        gemini_client=GeminiClient(),
        cache_service=CacheService(redis_url=redis_url)
    )


@router.post("/generate-project", response_model=GenerateProjectResponse)
async def generate_project(
    request: GenerateProjectRequest,
    service: ProjectService = Depends(get_project_service)
):
    """
    Generate custom learning project template
    
    Returns:
    - Project directory structure
    - Starter files with TODO comments
    - Implementation tasks by difficulty
    - Test cases to implement
    - Deployment guide
    
    Perfect for hands-on learning with real project structure
    """
    try:
        project_result = await service.generate_project(
            title=request.title,
            description=request.description,
            skill_level=request.skill_level,
            technologies=request.technologies,
            learning_goals=request.learning_goals,
            estimated_hours=request.estimated_hours
        )
        
        return GenerateProjectResponse(
            title=project_result.get("title", request.title),
            description=project_result.get("description", request.description),
            learning_goals=project_result.get("learning_goals", request.learning_goals),
            skill_level=project_result.get("skill_level", request.skill_level),
            estimated_hours=project_result.get("estimated_hours", request.estimated_hours),
            directory_structure=project_result.get("directory_structure", {}),
            starter_files=project_result.get("starter_files", []),
            todos=project_result.get("todos", []),
            test_cases=project_result.get("test_cases", []),
            deployment_guide=project_result.get("deployment_guide", "")
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Project generation failed: {str(e)}")
