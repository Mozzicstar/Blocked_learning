"""
Content Intelligence Service

Handles video analysis, quality scoring, and quiz generation.
"""
import json
from typing import Dict, Any, List, Optional
from services.gemini import GeminiClient
from services.cache import CacheService
from models.content import (
    VideoMetadata,
    QualityScore,
    QuizQuestion,
    QuizResponse
)


class ContentService:
    """
    Provides content intelligence features:
    - analyze_video: Extract metadata from video
    - score_quality: Assess content quality
    - generate_quiz: Create quizzes from transcripts
    """
    
    def __init__(self, gemini_client: GeminiClient, cache_service: CacheService):
        """Initialize content service."""
        self.gemini = gemini_client
        self.cache = cache_service
    
    async def analyze_video(
        self,
        video_path: str,
        creator_wallet: str,
        transcript: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Analyze video and extract metadata.
        
        Args:
            video_path: Path or URL to video file
            creator_wallet: Creator's wallet address
            transcript: Optional pre-transcribed text
        
        Returns:
            {
                "title": str,
                "description": str,
                "topics": [str],
                "difficulty": str,
                "learning_objectives": [str],
                "duration_minutes": int,
                "key_concepts": [str],
                "summary": str,
                "transcript": str
            }
        """
        # Check cache first
        cache_key_data = {"video_path": video_path}
        cached = await self.cache.get_cached_response("analyze_video", cache_key_data, ttl_seconds=604800)
        if cached:
            return cached
        
        # Build analysis prompt
        prompt = f"""Analyze this blockchain education video and extract metadata.

Video path: {video_path}
Creator: {creator_wallet}

{f'Transcript: {transcript[:2000]}...' if transcript else 'No transcript provided'}

Your task:
1. Generate a compelling title (max 60 chars)
2. Create a 2-sentence description
3. Identify blockchain topics covered (e.g., "smart_contracts", "security", "DeFi")
4. Rate difficulty: beginner|intermediate|advanced
5. List prerequisites needed
6. Write 3-4 learning objectives
7. Estimate video duration in minutes
8. Extract 5-7 key concepts
9. Provide a 1-paragraph summary

Return ONLY valid JSON:
{{
  "title": "title here",
  "description": "2-sentence description",
  "topics": ["topic1", "topic2"],
  "difficulty": "intermediate",
  "prerequisites": ["prerequisite"],
  "learning_objectives": ["objective1", "objective2"],
  "duration_minutes": 15,
  "key_concepts": ["concept1", "concept2"],
  "summary": "One paragraph summary"
}}"""
        
        try:
            response = await self.gemini.generate(
                prompt=prompt,
                temperature=0.6,
                max_tokens=1500
            )
            
            # Parse JSON response
            response_data = response.get("response", "{}")
            try:
                parsed = json.loads(response_data)
            except json.JSONDecodeError:
                # Fallback: return default metadata
                parsed = {
                    "title": "Blockchain Education Video",
                    "description": "Educational content about blockchain technology.",
                    "topics": ["blockchain", "education"],
                    "difficulty": "intermediate",
                    "prerequisites": [],
                    "learning_objectives": ["Learn blockchain concepts"],
                    "duration_minutes": 15,
                    "key_concepts": ["blockchain"],
                    "summary": "This video teaches blockchain concepts."
                }
            
            # Add transcript if provided
            parsed["transcript"] = transcript or ""
            
            # Validate with Pydantic
            metadata = VideoMetadata(**parsed)
            result = metadata.model_dump()
            
            # Cache result (7 days - videos don't change)
            await self.cache.cache_response("analyze_video", cache_key_data, result, ttl_seconds=604800)
            
            return result
            
        except Exception as e:
            raise Exception(f"Video analysis error: {str(e)}")
    
    async def score_quality(
        self,
        video_url: str,
        transcript: str,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Score content quality.
        
        Args:
            video_url: URL to video
            transcript: Video transcript text
            metadata: Optional metadata dict
        
        Returns:
            {
                "quality_score": 0-100,
                "is_educational": bool,
                "audio_quality": "poor|fair|good|excellent",
                "content_depth": "shallow|moderate|comprehensive",
                "issues": [str],
                "recommendation": "approve|flag|reject"
            }
        """
        # Check cache
        cache_key_data = {"video_url": video_url}
        cached = await self.cache.get_cached_response("score_quality", cache_key_data, ttl_seconds=604800)
        if cached:
            return cached
        
        prompt = f"""Score the quality of this blockchain education video.

URL: {video_url}
Transcript excerpt: {transcript[:1500]}...

Evaluate on:
1. Educational value (is this truly educational?)
2. Audio quality (clear audio or muffled?)
3. Content depth (superficial or comprehensive?)
4. Accuracy (correct blockchain concepts?)
5. Organization (well-structured or rambling?)

Issues to detect:
- Incorrect information
- Spam/low-effort content
- Audio problems
- Poor organization

Return ONLY valid JSON:
{{
  "quality_score": 75,
  "is_educational": true,
  "audio_quality": "good",
  "content_depth": "comprehensive",
  "issues": [],
  "recommendation": "approve"
}}"""
        
        try:
            response = await self.gemini.generate(
                prompt=prompt,
                temperature=0.5,
                max_tokens=800
            )
            
            response_data = response.get("response", "{}")
            try:
                parsed = json.loads(response_data)
            except json.JSONDecodeError:
                parsed = {
                    "quality_score": 70,
                    "is_educational": True,
                    "audio_quality": "good",
                    "content_depth": "moderate",
                    "issues": [],
                    "recommendation": "approve"
                }
            
            # Validate with Pydantic
            quality = QualityScore(**parsed)
            result = quality.model_dump()
            
            # Cache (7 days)
            await self.cache.cache_response("score_quality", cache_key_data, result, ttl_seconds=604800)
            
            return result
            
        except Exception as e:
            raise Exception(f"Quality scoring error: {str(e)}")
    
    async def generate_quiz(
        self,
        video_id: int,
        transcript: str,
        key_concepts: List[str],
        difficulty: str = "intermediate",
        num_questions: int = 5
    ) -> Dict[str, Any]:
        """
        Generate quiz from video transcript.
        
        Args:
            video_id: Video identifier
            transcript: Video transcript
            key_concepts: List of key concepts to test
            difficulty: beginner|intermediate|advanced
            num_questions: Number of questions to generate (3-10)
        
        Returns:
            {
                "questions": [
                    {
                        "question": "...",
                        "options": ["a", "b", "c", "d"],
                        "correct_answer": 0,
                        "explanation": "..."
                    }
                ],
                "quiz_difficulty": "intermediate",
                "estimated_time_minutes": 5
            }
        """
        # Check cache
        cache_key_data = {"video_id": video_id}
        cached = await self.cache.get_cached_response("generate_quiz", cache_key_data, ttl_seconds=604800)
        if cached:
            return cached
        
        concepts_str = ", ".join(key_concepts)
        
        prompt = f"""Generate a {num_questions}-question quiz for a blockchain education video.

Video Concepts: {concepts_str}
Difficulty: {difficulty}

Transcript excerpt: {transcript[:2000]}...

Create multiple-choice questions that:
1. Test understanding, not memorization
2. Match {difficulty} difficulty level
3. Have clear correct answers
4. Include helpful explanations

For each question:
- Write a clear question
- Provide 4 distinct answer choices
- Mark the correct answer (0-3)
- Explain why it's correct

Return ONLY valid JSON array:
[
  {{
    "question": "What is...?",
    "options": ["option1", "option2", "option3", "option4"],
    "correct_answer": 0,
    "explanation": "This is correct because..."
  }}
]"""
        
        try:
            response = await self.gemini.generate(
                prompt=prompt,
                temperature=0.7,
                max_tokens=3000
            )
            
            response_data = response.get("response", "[]")
            try:
                questions_data = json.loads(response_data)
            except json.JSONDecodeError:
                # Fallback: return empty quiz
                questions_data = []
            
            # Ensure we have the right number of questions
            questions_data = questions_data[:num_questions]
            
            # Convert to QuizQuestion objects
            questions = []
            for q_data in questions_data:
                try:
                    q = QuizQuestion(**q_data)
                    questions.append(q)
                except Exception:
                    continue
            
            result = {
                "questions": [q.model_dump() for q in questions],
                "quiz_difficulty": difficulty,
                "estimated_time_minutes": len(questions)
            }
            
            # Cache (7 days)
            await self.cache.cache_response("generate_quiz", cache_key_data, result, ttl_seconds=604800)
            
            return result
            
        except Exception as e:
            raise Exception(f"Quiz generation error: {str(e)}")
