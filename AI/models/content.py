"""Pydantic models for content intelligence endpoints"""

from typing import List, Optional
from pydantic import BaseModel, Field


# ========== Request Models ==========

class VideoAnalysisRequest(BaseModel):
    """Request for video analysis"""
    video_path: str = Field(description="Path or URL to video file")
    creator_wallet: str = Field(description="Creator's wallet address")


class QuizGenerationRequest(BaseModel):
    """Request for quiz generation"""
    video_id: int
    transcript: str
    key_concepts: List[str] = Field(default_factory=list)
    difficulty: str = "intermediate"
    num_questions: int = Field(default=5)


class QualityAnalysisRequest(BaseModel):
    """Request for quality analysis"""
    video_url: str
    transcript: str
    metadata: Optional[dict] = None


# ========== Response Models ==========

class VideoMetadata(BaseModel):
    """Auto-generated video metadata"""
    title: str
    description: str
    topics: List[str]
    difficulty: str
    prerequisites: List[str] = Field(default_factory=list)
    learning_objectives: List[str]
    duration_minutes: int
    key_concepts: List[str]
    language: str = "english"
    transcript: Optional[str] = None
    summary: str


class QualityScore(BaseModel):
    """Content quality assessment"""
    quality_score: int = Field(ge=0, le=100)
    is_educational: bool
    audio_quality: str
    content_depth: str
    issues: List[str] = Field(default_factory=list)
    recommendation: str


class QuizQuestion(BaseModel):
    """Single quiz question"""
    question: str
    options: List[str]
    correct_answer: int = Field(ge=0, le=3)
    explanation: str


class QuizResponse(BaseModel):
    """Response from quiz generation"""
    questions: List[QuizQuestion]
    quiz_difficulty: str
    estimated_time_minutes: int


# ========== Response Aliases for Routes ==========

VideoAnalysisResponse = VideoMetadata
QualityAnalysisResponse = QualityScore
QuizGenerationResponse = QuizResponse
