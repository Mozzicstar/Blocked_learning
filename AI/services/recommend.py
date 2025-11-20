"""
Video Recommendation Service - Personalized video suggestions
"""

import json
from typing import Dict, Any, List, Optional
from services.gemini import GeminiClient
from services.cache import CacheService


class RecommendService:
    """Generate personalized video recommendations"""
    
    def __init__(self, gemini_client: GeminiClient, cache_service: CacheService):
        self.gemini = gemini_client
        self.cache = cache_service
    
    async def recommend_videos(
        self,
        user_id: str,
        completed_videos: List[int],
        watch_history: List[int],
        skill_level: str,
        interests: List[str],
        limit: int = 5,
        available_videos: Optional[List[Dict[str, Any]]] = None
    ) -> Dict[str, Any]:
        """
        Generate personalized video recommendations
        
        Args:
            user_id: User/wallet ID
            completed_videos: Videos user has completed
            watch_history: Recent watch history
            skill_level: Current skill level
            interests: User interests
            limit: Max recommendations
            available_videos: Available videos to recommend from
            
        Returns:
            Dict with recommended videos and reasoning
        """
        # Try cache
        request_data = {
            "user_id": user_id,
            "skill_level": skill_level,
            "completed": len(completed_videos),
            "interests": ",".join(interests[:3])
        }
        cached = await self.cache.get_cached_response("recommend", request_data, ttl_seconds=3600)
        if cached:
            return cached
        
        # Use sample database if none provided
        if not available_videos:
            available_videos = [
                {
                    "id": 1,
                    "title": "Smart Contract Security Best Practices",
                    "description": "Learn to identify and prevent common vulnerabilities",
                    "difficulty": "intermediate",
                    "topics": ["security", "vulnerabilities", "best_practices"],
                    "duration_minutes": 18
                },
                {
                    "id": 2,
                    "title": "Understanding Reentrancy Attacks",
                    "description": "Deep dive into reentrancy vulnerabilities and prevention",
                    "difficulty": "intermediate",
                    "topics": ["reentrancy", "attacks", "security"],
                    "duration_minutes": 22
                },
                {
                    "id": 3,
                    "title": "Access Control Patterns",
                    "description": "Implement secure access control in smart contracts",
                    "difficulty": "advanced",
                    "topics": ["access_control", "permissions", "security"],
                    "duration_minutes": 25
                },
                {
                    "id": 4,
                    "title": "Advanced DeFi Strategies",
                    "description": "Build sophisticated trading and yield strategies",
                    "difficulty": "advanced",
                    "topics": ["defi", "trading", "yield"],
                    "duration_minutes": 30
                },
                {
                    "id": 5,
                    "title": "Web3 Basics",
                    "description": "Introduction to blockchain and Web3 concepts",
                    "difficulty": "beginner",
                    "topics": ["blockchain", "web3", "basics"],
                    "duration_minutes": 15
                }
            ]
        
        # Build recommendation prompt
        completed_str = ", ".join(str(v) for v in completed_videos[-5:]) if completed_videos else "none"
        interests_str = ", ".join(interests) if interests else "general blockchain"
        
        prompt = f"""Recommend {limit} videos for a blockchain learner.

User: {skill_level} level, interested in {interests_str}
Completed: {completed_str}

Recommend next videos to watch. Return JSON with video recommendations and reasoning."""
        
        try:
            rec_response = await self.gemini.generate(
                prompt=prompt,
                response_schema=None,
                temperature=0.6,
                max_tokens=1500
            )
            
            # Get the response
            if isinstance(rec_response, dict) and "response" in rec_response:
                rec_text = rec_response["response"]
            else:
                rec_text = str(rec_response)
            
            # Try to parse JSON
            try:
                rec_data = json.loads(rec_text)
            except json.JSONDecodeError:
                import re
                json_match = re.search(r'\{.*\}', rec_text, re.DOTALL)
                if json_match:
                    rec_data = json.loads(json_match.group())
                else:
                    rec_data = {}
            
            # Build result
            recommended = rec_data.get("recommended_videos", [])[:limit]
            
            if recommended:
                result = {
                    "user_id": user_id,
                    "recommended_videos": recommended,
                    "total_recommended": len(recommended),
                    "recommendation_reason": rec_data.get("recommendation_reason", "Personalized for your learning path")
                }
            else:
                raise Exception("No recommendations from Gemini")
            
        except Exception as e:
            # Fallback immediately on any error
            import sys
            print(f"Recommendation error: {str(e)}", file=sys.stderr)
            completed_set = set(completed_videos)
            recommendations = [
                v for v in available_videos
                if v["id"] not in completed_set
            ][:limit]
            
            result = {
                "user_id": user_id,
                "recommended_videos": [
                    {
                        "video_id": v["id"],
                        "title": v.get("title", ""),
                        "description": v.get("description", ""),
                        "reason": f"Matches your {skill_level} level and interests",
                        "relevance_score": 0.7,
                        "difficulty": v.get("difficulty", "intermediate"),
                        "estimated_duration_minutes": v.get("duration_minutes", 20)
                    }
                    for v in recommendations
                ],
                "total_recommended": len(recommendations),
                "recommendation_reason": "Recommended based on your profile"
            }
        
        # Cache for 1 hour
        await self.cache.cache_response("recommend", request_data, result, ttl_seconds=3600)
        
        return result
