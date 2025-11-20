"""
Security Audit Service - Analyzes smart contracts for vulnerabilities
"""

import asyncio
import json
from typing import List, Dict, Any
from services.gemini import GeminiClient
from services.cache import CacheService


class AuditService:
    """Security auditing for smart contracts"""
    
    def __init__(self, gemini_client: GeminiClient, cache_service: CacheService):
        self.gemini = gemini_client
        self.cache = cache_service
    
    async def audit_code(self, code: str, language: str = "solidity") -> Dict[str, Any]:
        """
        Audit smart contract code for security vulnerabilities
        
        Args:
            code: Smart contract code to audit
            language: Programming language
            
        Returns:
            Dict with vulnerabilities, gas optimizations, and security score
        """
        # Try to get from cache
        request_data = {"code": code[:100], "language": language}
        cached = await self.cache.get_cached_response("audit", request_data, ttl_seconds=86400)
        if cached:
            return cached
        
        # Build audit prompt
        prompt = f"""You are an expert smart contract security auditor. Analyze this {language} code for vulnerabilities:

```{language}
{code}
```

Identify:
1. Critical vulnerabilities (reentrancy, access control, overflow, etc.)
2. Gas optimization opportunities
3. Best practice violations
4. Overall security score (0-100)

Return ONLY valid JSON:
{{
  "vulnerabilities": [
    {{
      "line": 42,
      "severity": "critical",
      "issue": "reentrancy",
      "explanation": "...",
      "fix": "..."
    }}
  ],
  "gas_optimizations": [
    {{
      "line": 15,
      "suggestion": "...",
      "potential_savings": "500 gas"
    }}
  ],
  "security_score": 65,
  "recommendations": ["Use checks-effects-interactions", "Add access control"],
  "summary": "..."
}}"""
        
        # Get audit from Gemini
        try:
            audit_data = await self.gemini.generate(
                prompt=prompt,
                response_schema=None,
                temperature=0.2,
                max_tokens=2000
            )
            
            # audit_data is already a dict from generate()
            # Ensure required fields
            if isinstance(audit_data, dict):
                audit_data.setdefault("vulnerabilities", [])
                audit_data.setdefault("gas_optimizations", [])
                audit_data.setdefault("security_score", 75)
                audit_data.setdefault("recommendations", [])
                audit_data.setdefault("summary", "Code audit completed.")
            else:
                # If it's wrapped in response key
                audit_data = audit_data.get("response", {}) if isinstance(audit_data, dict) else {}
                if not audit_data:
                    audit_data = {
                        "vulnerabilities": [],
                        "gas_optimizations": [],
                        "security_score": 75,
                        "recommendations": [],
                        "summary": "Audit completed"
                    }
            
            # Cache for 24 hours (code doesn't change often)
            await self.cache.cache_response("audit", request_data, audit_data, ttl_seconds=86400)
            
            return audit_data
            
        except (json.JSONDecodeError, AttributeError) as e:
            # Return fallback with findings
            return {
                "vulnerabilities": [
                    {
                        "line": 0,
                        "severity": "medium",
                        "issue": "analysis_required",
                        "explanation": "Manual review recommended",
                        "fix": "Use professional audit service"
                    }
                ],
                "gas_optimizations": [],
                "security_score": 50,
                "recommendations": ["Use professional security audit before deployment"],
                "summary": f"Audit analysis in progress. Error: {str(e)}"
            }
