"""Pydantic models for mentor endpoints"""

from typing import List, Optional, Dict
from pydantic import BaseModel, Field


# ========== Request Models ==========

class UserContext(BaseModel):
    """User learning context from Backend"""
    completed_modules: List[int] = Field(default_factory=list)
    completed_topics: List[str] = Field(default_factory=list)
    skill_level: str = Field(default="beginner")
    learning_pace: float = Field(default=1.0, description="Courses per week")
    time_per_week: int = Field(default=5, description="Hours per week")
    gaps: List[str] = Field(default_factory=list, description="Missing topics")


class ExplainRequest(BaseModel):
    """Request for topic explanation"""
    wallet: str
    question: str
    user_context: Optional[UserContext] = None


class SuggestRequest(BaseModel):
    """Request for learning suggestion"""
    wallet: str
    user_context: Optional[UserContext] = None


class ProfileRequest(BaseModel):
    """Request for user profile analysis"""
    wallet: str
    user_context: Optional[UserContext] = None


# ========== Response Models ==========

class Resource(BaseModel):
    """External learning resource"""
    title: str
    url: str


class ExplainResponse(BaseModel):
    """Response from explain endpoint"""
    explanation: str
    analogy: Optional[str] = None
    code_example: Optional[str] = None
    next_topics: List[str] = Field(default_factory=list)
    difficulty: str
    resources: List[Resource] = Field(default_factory=list)


class ProjectSuggestion(BaseModel):
    """Project idea for learner"""
    title: str
    description: str
    tech_stack: List[str]
    estimated_hours: int
    learning_goals: List[str]


class SuggestResponse(BaseModel):
    """Response from suggest endpoint"""
    next_step: str
    reasoning: str
    next_modules: List[int] = Field(default_factory=list)
    estimated_time: str
    difficulty: str
    career_impact: str
    project_idea: Optional[ProjectSuggestion] = None


class WeekPlan(BaseModel):
    """Weekly learning plan"""
    week: int
    focus: str
    modules: List[int]
    estimated_hours: int


class CareerReadiness(BaseModel):
    """Career readiness assessment"""
    role: str
    match_percentage: int
    gaps: List[str]
    estimated_weeks_to_ready: int


class ProfileResponse(BaseModel):
    """Response from profile endpoint"""
    wallet: str
    skill_level: str
    learning_pace: float
    total_modules_completed: int
    strengths: List[str]
    weaknesses: List[str]
    learning_style: str
    four_week_plan: List[WeekPlan]
    career_readiness: Optional[CareerReadiness] = None
