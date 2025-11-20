"""
Phase 2 Advanced Features Models
- Security auditing
- Project generation
- Smart thumbnails
- Semantic search
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any


# ============================================================================
# SECURITY AUDITING MODELS
# ============================================================================

class Vulnerability(BaseModel):
    """Detected vulnerability in smart contract code"""
    line: int = Field(..., description="Line number where vulnerability found")
    severity: str = Field(..., description="critical, high, medium, low")
    issue: str = Field(..., description="Type of vulnerability (reentrancy, access_control, etc)")
    explanation: str = Field(..., description="Detailed explanation of the vulnerability")
    fix: str = Field(..., description="Suggested fix")


class GasOptimization(BaseModel):
    """Gas optimization suggestion"""
    line: Optional[int] = Field(None, description="Line number (optional)")
    suggestion: str = Field(..., description="What to optimize")
    potential_savings: str = Field(..., description="Estimated gas savings")


class AuditCodeRequest(BaseModel):
    """Request to audit smart contract code for vulnerabilities"""
    code: str = Field(..., description="Solidity/smart contract code to audit")
    language: str = Field(default="solidity", description="Programming language")


class AuditCodeResponse(BaseModel):
    """Response with security audit findings"""
    vulnerabilities: List[Vulnerability] = Field(default_factory=list)
    gas_optimizations: List[GasOptimization] = Field(default_factory=list)
    security_score: int = Field(..., ge=0, le=100, description="Overall security score 0-100")
    recommendations: List[str] = Field(default_factory=list)
    summary: str = Field(..., description="Brief summary of findings")


# ============================================================================
# PROJECT GENERATION MODELS
# ============================================================================

class TodoItem(BaseModel):
    """Task to implement in project"""
    name: str = Field(..., description="Task name")
    description: str = Field(..., description="What to implement")
    difficulty: str = Field(..., description="easy, medium, hard")


class FileTemplate(BaseModel):
    """Project file with template code"""
    path: str = Field(..., description="File path in project")
    content: str = Field(..., description="Starter code with TODO comments")


class TestCase(BaseModel):
    """Test case to implement"""
    name: str = Field(..., description="Test name")
    description: str = Field(..., description="What to test")
    example: str = Field(..., description="Example test code")


class GenerateProjectRequest(BaseModel):
    """Request to generate custom project template"""
    title: str = Field(..., description="Project title")
    description: str = Field(..., description="Project description")
    skill_level: str = Field(..., description="beginner, intermediate, advanced")
    technologies: List[str] = Field(..., description="Tech stack (e.g., ['Solidity', 'Hardhat'])")
    learning_goals: List[str] = Field(..., description="What learner will learn")
    estimated_hours: int = Field(default=20, description="Time to complete in hours")


class GenerateProjectResponse(BaseModel):
    """Response with complete project template"""
    title: str
    description: str
    learning_goals: List[str]
    skill_level: str
    estimated_hours: int
    directory_structure: Dict[str, Any] = Field(..., description="Folder structure")
    starter_files: List[FileTemplate] = Field(default_factory=list)
    todos: List[TodoItem] = Field(default_factory=list)
    test_cases: List[TestCase] = Field(default_factory=list)
    deployment_guide: str = Field(..., description="How to deploy/run project")


# ============================================================================
# SMART THUMBNAIL MODELS
# ============================================================================

class GenerateThumbnailRequest(BaseModel):
    """Request to generate smart thumbnail"""
    video_title: str = Field(..., description="Video title for overlay")
    transcript: str = Field(..., description="Video transcript to analyze key moments")
    key_concept: Optional[str] = Field(None, description="Main concept to emphasize")
    thumbnail_text: Optional[str] = Field(None, description="Optional override text")


class ThumbnailMetadata(BaseModel):
    """Thumbnail generation metadata"""
    key_moment_description: str = Field(..., description="Description of key moment extracted")
    suggested_text: str = Field(..., description="Suggested text for thumbnail")
    color_scheme: str = Field(..., description="Suggested color (primary, dark, light)")
    icon_suggestion: str = Field(..., description="Suggested icon/emoji")


class GenerateThumbnailResponse(BaseModel):
    """Response with thumbnail generation guidance"""
    base64_placeholder: str = Field(..., description="Base64 placeholder (in production would be actual image)")
    metadata: ThumbnailMetadata
    text_overlay: str
    background_color: str
    text_color: str
    generation_notes: str


# ============================================================================
# SEMANTIC SEARCH MODELS
# ============================================================================

class SearchResult(BaseModel):
    """Individual search result"""
    video_id: int = Field(..., description="Video ID")
    title: str = Field(..., description="Video title")
    description: str = Field(..., description="Video description")
    relevance_score: float = Field(..., ge=0, le=1, description="Relevance 0-1")
    match_reason: str = Field(..., description="Why this matched the search")
    topics: List[str] = Field(default_factory=list)


class SemanticSearchRequest(BaseModel):
    """Semantic search query"""
    query: str = Field(..., description="User search query (e.g., 'prevent hacks')")
    difficulty_filter: Optional[str] = Field(None, description="Filter by difficulty")
    limit: int = Field(default=5, ge=1, le=20, description="Max results to return")
    video_database: Optional[List[Dict[str, Any]]] = Field(None, description="Available videos to search")


class SemanticSearchResponse(BaseModel):
    """Semantic search results"""
    query: str
    query_intent: str = Field(..., description="Interpreted intent (e.g., 'security')")
    results: List[SearchResult]
    total_found: int = Field(..., description="Total matching results")
    search_summary: str = Field(..., description="Brief summary of results")


# ============================================================================
# VIDEO RECOMMENDATIONS MODELS
# ============================================================================

class RecommendedVideo(BaseModel):
    """Recommended video with reasoning"""
    video_id: int = Field(..., description="Video ID")
    title: str = Field(..., description="Video title")
    description: str = Field(..., description="Video description")
    reason: str = Field(..., description="Why recommended for this user")
    relevance_score: float = Field(..., ge=0, le=1, description="Relevance 0-1")
    difficulty: str = Field(..., description="beginner, intermediate, advanced")
    estimated_duration_minutes: int = Field(default=15)


class VideoRecommendationRequest(BaseModel):
    """Request video recommendations"""
    user_id: str = Field(..., description="User/wallet ID")
    completed_videos: List[int] = Field(default_factory=list, description="Video IDs user completed")
    watch_history: List[int] = Field(default_factory=list, description="Recent watch history")
    skill_level: str = Field(default="beginner", description="Current skill level")
    interests: List[str] = Field(default_factory=list, description="User interests/topics")
    limit: int = Field(default=5, ge=1, le=20, description="Number of recommendations")
    available_videos: Optional[List[Dict[str, Any]]] = Field(None, description="Available videos to recommend from")


class VideoRecommendationResponse(BaseModel):
    """Video recommendations response"""
    user_id: str
    recommended_videos: List[RecommendedVideo]
    total_recommended: int = Field(..., description="Number of recommendations returned")
    recommendation_reason: str = Field(..., description="Overall reason for these recommendations")


# ============================================================================
# INDUSTRY TRENDS MODELS
# ============================================================================

class TrendingSkill(BaseModel):
    """Trending skill in the industry"""
    skill_name: str = Field(..., description="Name of the skill")
    trend_score: float = Field(..., ge=0, le=100, description="Trend score 0-100")
    market_demand: str = Field(..., description="high, medium, low")
    average_salary: Optional[str] = Field(None, description="Average salary range")
    growth_rate: str = Field(..., description="% growth rate")
    description: str = Field(..., description="Brief description")


class CareerPath(BaseModel):
    """Career path recommendation"""
    role: str = Field(..., description="Job role")
    level: str = Field(..., description="Entry-level, Mid-level, Senior")
    required_skills: List[str] = Field(..., description="Required skills")
    average_salary: str = Field(..., description="Salary range")
    job_outlook: str = Field(..., description="Job market outlook")
    progression_path: List[str] = Field(..., description="Typical career progression")


class IndustryTrendsRequest(BaseModel):
    """Request industry trends and career insights"""
    region: str = Field(default="global", description="Geographic region (global, US, EU, etc)")
    industry: str = Field(default="blockchain", description="Industry focus (blockchain, web3, etc)")
    experience_level: Optional[str] = Field(None, description="Filter by experience level")


class IndustryTrendsResponse(BaseModel):
    """Industry trends and career insights"""
    trending_skills: List[TrendingSkill] = Field(..., description="Top trending skills")
    career_paths: List[CareerPath] = Field(..., description="Promising career paths")
    market_insights: str = Field(..., description="General market insights summary")
    top_certifications: List[str] = Field(..., description="Recommended certifications")
    salary_trends: str = Field(..., description="Salary trend analysis")
    report_generated_at: str = Field(..., description="When this report was generated")
