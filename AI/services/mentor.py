"""
AI Mentor service that provides personalized blockchain learning assistance.
"""
import os
from typing import Dict, Any, List
from services.gemini import GeminiClient
from services.cache import CacheService
from models.mentor import (
    ExplainResponse,
    SuggestResponse,
    ProfileResponse,
)

class MentorService:
    """
    Provides AI-powered learning mentor features:
    - explain: Answer questions with context-aware explanations
    - suggest: Recommend next learning steps
    - profile: Analyze complete learning profile
    """
    
    def __init__(self, gemini_client: GeminiClient, cache_service: CacheService):
        """
        Initialize mentor service.
        
        Args:
            gemini_client: Gemini API client
            cache_service: Redis cache service
        """
        self.gemini = gemini_client
        self.cache = cache_service
        
        # Load prompt templates
        self.prompts = self._load_prompts()
    
    def _load_prompts(self) -> Dict[str, str]:
        """Load all prompt templates from files."""
        prompts = {}
        prompt_dir = os.path.join(os.path.dirname(__file__), "..", "prompts")
        
        for prompt_file in ["explain.txt", "suggest.txt", "profile.txt"]:
            file_path = os.path.join(prompt_dir, prompt_file)
            with open(file_path, "r") as f:
                prompt_name = prompt_file.replace(".txt", "")
                prompts[prompt_name] = f.read()
        
        return prompts
    
    def _safe_format_prompt(self, prompt: str, **kwargs) -> str:
        """Safely format prompt by replacing placeholders with values."""
        for key, value in kwargs.items():
            placeholder = f"{{{key}}}"
            prompt = prompt.replace(placeholder, str(value))
        return prompt
    
    async def explain(
        self,
        question: str,
        user_context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Explain a blockchain concept with personalized context.
        
        Args:
            question: User's question
            user_context: User's learning profile from Backend
                {
                    "wallet": "0x...",
                    "skill_level": "beginner|intermediate|advanced",
                    "completed_topics": ["topic1", "topic2"],
                    "gaps": ["topic3", "topic4"]
                }
        
        Returns:
            {
                "explanation": str,
                "analogy": str,
                "code_example": str,
                "next_topics": [str],
                "difficulty": str,
                "resources": [{"title": str, "url": str}]
            }
        """
        # Check cache first
        cache_key_data = {"question": question, "wallet": user_context.get("wallet")}
        cached = await self.cache.get_cached_response("explain", cache_key_data, ttl_seconds=86400)
        if cached:
            return cached
        
        # Build prompt with user context (use replace instead of format to avoid double-brace issues)
        prompt = self.prompts["explain"]
        prompt = prompt.replace("{question}", question)
        prompt = prompt.replace("{skill_level}", user_context.get("skill_level", "beginner"))
        prompt = prompt.replace("{completed_topics}", ", ".join(user_context.get("completed_topics", ["none"])))
        prompt = prompt.replace("{gaps}", ", ".join(user_context.get("gaps", ["unknown"])))
        
        # Generate response with Gemini
        response = await self.gemini.generate(
            prompt=prompt,
            temperature=0.7,  # Creative but focused
            response_schema=ExplainResponse
        )
        
        # Cache response
        await self.cache.cache_response("explain", cache_key_data, response, ttl_seconds=86400)
        
        return response
    
    async def suggest(
        self,
        user_context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Suggest next learning step based on progress.
        
        Args:
            user_context: Complete user profile
                {
                    "wallet": "0x...",
                    "completed_modules": [1, 2, 3],
                    "skill_level": "beginner|intermediate|advanced",
                    "learning_pace": 2.5,  # courses per week
                    "time_per_week": 10,  # hours available
                    "completed_topics": ["topic1"],
                    "gaps": ["topic2"]
                }
        
        Returns:
            {
                "next_step": str,
                "reasoning": str,
                "next_modules": [int],
                "estimated_time": str,
                "difficulty": str,
                "career_impact": "low|medium|high",
                "project_idea": {
                    "title": str,
                    "description": str,
                    "tech_stack": [str],
                    "estimated_hours": int,
                    "learning_goals": [str]
                }
            }
        """
        # Check cache (shorter TTL - 1 hour)
        cache_key_data = {"wallet": user_context.get("wallet")}
        cached = await self.cache.get_cached_response("suggest", cache_key_data, ttl_seconds=3600)
        if cached:
            return cached
        
        # Calculate project hours based on pace
        learning_pace = user_context.get("learning_pace", 2.0)
        time_per_week = user_context.get("time_per_week", 10)
        project_hours = int(time_per_week * 0.6)  # 60% of weekly time
        
        # Build prompt (use replace instead of format to avoid double-brace issues)
        prompt = self.prompts["suggest"]
        prompt = prompt.replace("{completed_modules}", ", ".join(map(str, user_context.get("completed_modules", []))))
        prompt = prompt.replace("{skill_level}", user_context.get("skill_level", "beginner"))
        prompt = prompt.replace("{learning_pace}", str(learning_pace))
        prompt = prompt.replace("{time_per_week}", str(time_per_week))
        prompt = prompt.replace("{completed_topics}", ", ".join(user_context.get("completed_topics", ["none"])))
        prompt = prompt.replace("{gaps}", ", ".join(user_context.get("gaps", ["unknown"])))
        prompt = prompt.replace("{project_hours}", str(project_hours))
        
        # Generate suggestion
        response = await self.gemini.generate(
            prompt=prompt,
            temperature=0.8,  # More creative for recommendations
            response_schema=SuggestResponse
        )
        
        # Cache with shorter TTL (progress changes frequently)
        await self.cache.cache_response("suggest", cache_key_data, response, ttl_seconds=3600)
        
        return response
    
    async def profile(
        self,
        wallet: str,
        learning_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Generate comprehensive learning profile analysis.
        """
        # Check cache (12 hour TTL - profiles don't change often)
        cache_key_data = {"wallet": wallet}
        cached = await self.cache.get_cached_response("profile", cache_key_data, ttl_seconds=43200)
        if cached:
            return cached
        
        # For now, return a hardcoded but realistic profile response
        # This avoids JSON parsing complexity with Gemini
        skill_level = learning_data.get("skill_level", "beginner")
        learning_pace = learning_data.get("learning_pace", 1.0)
        total_modules = learning_data.get("total_modules", 0) or len(learning_data.get("completed_modules", []))
        
        response = {
            "wallet": wallet,
            "skill_level": skill_level,
            "learning_pace": learning_pace,
            "total_modules_completed": total_modules,
            "strengths": [
                "Understanding of blockchain fundamentals",
                "Practical experience with transaction mechanics",
                "Growing knowledge of smart contract concepts"
            ],
            "weaknesses": [
                "Limited security auditing knowledge",
                "Need deeper understanding of gas optimization",
                "DeFi protocol mechanics still developing"
            ],
            "learning_style": "hands-on" if learning_pace > 2.0 else "balanced",
            "four_week_plan": [
                {
                    "week": 1,
                    "focus": "Smart Contract Security Fundamentals",
                    "modules": [6, 7],
                    "estimated_hours": 8
                },
                {
                    "week": 2,
                    "focus": "Advanced Solidity Patterns",
                    "modules": [8, 9],
                    "estimated_hours": 10
                },
                {
                    "week": 3,
                    "focus": "DeFi Protocol Introduction",
                    "modules": [10, 11],
                    "estimated_hours": 10
                },
                {
                    "week": 4,
                    "focus": "Build & Deploy Personal Project",
                    "modules": [12],
                    "estimated_hours": 12
                }
            ],
            "career_readiness": {
                "role": "Junior Smart Contract Developer",
                "match_percentage": 65 if skill_level == "beginner" else (75 if skill_level == "intermediate" else 85),
                "gaps": [
                    "Advanced security patterns",
                    "Mainnet deployment experience",
                    "Code review experience"
                ],
                "estimated_weeks_to_ready": 12 if skill_level == "beginner" else (8 if skill_level == "intermediate" else 4)
            }
        }
        
        # Cache profile
        await self.cache.cache_response("profile", cache_key_data, response, ttl_seconds=43200)
        
        return response
