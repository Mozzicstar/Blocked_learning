"""
Semantic Search Service - Intent-based content matching
"""

import json
from typing import Dict, Any, List, Optional
from services.gemini import GeminiClient
from services.cache import CacheService


class SearchService:
    """Semantic search for content beyond keyword matching"""
    
    def __init__(self, gemini_client: GeminiClient, cache_service: CacheService):
        self.gemini = gemini_client
        self.cache = cache_service
    
    async def semantic_search(
        self,
        query: str,
        video_database: Optional[List[Dict[str, Any]]] = None,
        difficulty_filter: Optional[str] = None,
        limit: int = 5
    ) -> Dict[str, Any]:
        """
        Perform semantic search on video content
        
        Args:
            query: User search query (e.g., "prevent hacks")
            video_database: Available videos to search
            difficulty_filter: Optional difficulty filter
            limit: Max results to return
            
        Returns:
            Dict with ranked search results and query intent
        """
        # Try cache
        request_data = {"query": query, "difficulty_filter": difficulty_filter or "", "limit": limit}
        cached = await self.cache.get_cached_response("search", request_data, ttl_seconds=3600)
        if cached:
            return cached
        
        # Use sample database if none provided
        if not video_database:
            video_database = [
                {
                    "id": 1,
                    "title": "Smart Contract Security Best Practices",
                    "description": "Learn to identify and prevent common vulnerabilities",
                    "topics": ["security", "vulnerabilities", "best_practices"]
                },
                {
                    "id": 2,
                    "title": "Understanding Reentrancy Attacks",
                    "description": "Deep dive into reentrancy vulnerabilities and prevention",
                    "topics": ["reentrancy", "attacks", "security"]
                },
                {
                    "id": 3,
                    "title": "Access Control Patterns",
                    "description": "Implement secure access control in smart contracts",
                    "topics": ["access_control", "permissions", "security"]
                },
                {
                    "id": 4,
                    "title": "Gas Optimization Techniques",
                    "description": "Optimize your contract for efficiency",
                    "topics": ["gas", "optimization", "performance"]
                },
                {
                    "id": 5,
                    "title": "Smart Contract Auditing",
                    "description": "Professional security audit process",
                    "topics": ["auditing", "security", "testing"]
                }
            ]
        
        # Build database JSON
        db_json = json.dumps([
            {
                "id": v["id"],
                "title": v.get("title", ""),
                "description": v.get("description", ""),
                "topics": v.get("topics", [])
            }
            for v in video_database[:20]  # Limit for prompt
        ])
        
        difficulty_note = f"Filter by difficulty: {difficulty_filter}" if difficulty_filter else ""
        
        prompt = f"""Analyze this search query and match it to videos by INTENT, not just keywords.

Query: "{query}"
{difficulty_note}

Available videos:
{db_json}

Understand what the user REALLY wants:
- "prevent hacks" → security tutorials
- "learn transactions" → blockchain basics
- "optimize gas" → performance content
- "project ideas" → practical learning

Return ONLY valid JSON:
{{
  "query_intent": "security",
  "results": [
    {{
      "video_id": 1,
      "title": "Smart Contract Security Best Practices",
      "description": "Learn to identify and prevent common vulnerabilities",
      "relevance_score": 0.95,
      "match_reason": "Directly addresses preventing common security issues",
      "topics": ["security", "vulnerabilities", "best_practices"]
    }}
  ],
  "total_found": 3,
  "search_summary": "Found 3 videos on security. Top match has 95% relevance."
}}"""
        
        try:
            search_response = await self.gemini.generate(
                prompt=prompt,
                response_schema=None,
                temperature=0.5,
                max_tokens=1500
            )
            
            # Get the response dict
            if isinstance(search_response, dict) and "response" in search_response:
                search_text = search_response["response"]
            else:
                search_text = str(search_response)
            
            # Try to parse JSON from response
            try:
                search_data = json.loads(search_text)
            except json.JSONDecodeError:
                import re
                json_match = re.search(r'\{.*\}', search_text, re.DOTALL)
                if json_match:
                    search_data = json.loads(json_match.group())
                else:
                    search_data = {}
            
            # Validate and clean results
            results = search_data.get("results", [])[:limit]
            
            result = {
                "query": query,
                "query_intent": search_data.get("query_intent", "general"),
                "results": results,
                "total_found": len(results),
                "search_summary": search_data.get("search_summary", "Search completed")
            }
            
        except Exception:
            # Fallback: simple keyword matching
            keywords = query.lower().split()
            results = []
            
            for video in video_database:
                title = video.get("title", "").lower()
                desc = video.get("description", "").lower()
                topics = [t.lower() for t in video.get("topics", [])]
                
                # Count keyword matches
                matches = sum(1 for kw in keywords if kw in title or kw in desc or kw in topics)
                
                if matches > 0:
                    results.append({
                        "video_id": video["id"],
                        "title": video.get("title", ""),
                        "description": video.get("description", ""),
                        "relevance_score": min(0.95, matches / len(keywords)) if keywords else 0.5,
                        "match_reason": f"Found {matches} matching keyword(s)",
                        "topics": video.get("topics", [])
                    })
            
            # Sort by relevance and limit
            results.sort(key=lambda x: x["relevance_score"], reverse=True)
            results = results[:limit]
            
            result = {
                "query": query,
                "query_intent": "search",
                "results": results,
                "total_found": len(results),
                "search_summary": f"Found {len(results)} videos matching '{query}'"
            }
        
        # Cache for 1 hour (results can change if database changes)
        await self.cache.cache_response("search", request_data, result, ttl_seconds=3600)
        
        return result
