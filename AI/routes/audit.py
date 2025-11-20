"""
Security Audit Routes
"""

import os
from fastapi import APIRouter, HTTPException, Depends
from models.phase2 import AuditCodeRequest, AuditCodeResponse
from services.audit import AuditService
from services.gemini import GeminiClient
from services.cache import CacheService


router = APIRouter(prefix="/mentor", tags=["audit"])


def get_audit_service():
    """Dependency injection for AuditService"""
    redis_url = os.getenv("REDIS_URL", "redis://redis:6379")
    return AuditService(
        gemini_client=GeminiClient(),
        cache_service=CacheService(redis_url=redis_url)
    )


@router.post("/audit-code", response_model=AuditCodeResponse)
async def audit_code(
    request: AuditCodeRequest,
    service: AuditService = Depends(get_audit_service)
):
    """
    Audit smart contract code for security vulnerabilities
    
    Detects:
    - Reentrancy attacks
    - Access control issues
    - Integer overflow/underflow
    - Gas optimization opportunities
    - Best practice violations
    
    Returns security score (0-100) and detailed recommendations
    """
    try:
        audit_result = await service.audit_code(
            code=request.code,
            language=request.language
        )
        
        return AuditCodeResponse(
            vulnerabilities=audit_result.get("vulnerabilities", []),
            gas_optimizations=audit_result.get("gas_optimizations", []),
            security_score=audit_result.get("security_score", 75),
            recommendations=audit_result.get("recommendations", []),
            summary=audit_result.get("summary", "Audit complete")
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Audit failed: {str(e)}")
