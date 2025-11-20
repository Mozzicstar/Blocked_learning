"""
Project Generator Service - Creates custom learning project templates
"""

import json
from typing import Dict, Any, List
from services.gemini import GeminiClient
from services.cache import CacheService


class ProjectService:
    """Generate custom project templates based on skill level and interests"""
    
    def __init__(self, gemini_client: GeminiClient, cache_service: CacheService):
        self.gemini = gemini_client
        self.cache = cache_service
    
    async def generate_project(
        self,
        title: str,
        description: str,
        skill_level: str,
        technologies: List[str],
        learning_goals: List[str],
        estimated_hours: int = 20
    ) -> Dict[str, Any]:
        """
        Generate a custom project template with structure and starter code
        
        Args:
            title: Project title
            description: Project description
            skill_level: beginner, intermediate, advanced
            technologies: Tech stack list
            learning_goals: What learner will learn
            estimated_hours: Time to complete
            
        Returns:
            Dict with project structure, starter files, todos, tests
        """
        # Try cache
        request_data = {"title": title, "skill_level": skill_level, "technologies": ",".join(technologies)}
        cached = await self.cache.get_cached_response("project", request_data, ttl_seconds=604800)
        if cached:
            return cached
        
        tech_str = ", ".join(technologies)
        goals_str = "\n".join(f"- {g}" for g in learning_goals)
        
        prompt = f"""Create a {skill_level} blockchain learning project.

Title: {title}
Description: {description}
Tech Stack: {tech_str}
Learning Goals:
{goals_str}
Estimated Hours: {estimated_hours}

Generate:
1. Project folder structure
2. 3-4 starter files with TODO comments
3. 5-6 implementation tasks (easy/medium/hard)
4. 3 test cases to implement
5. Deployment guide

Return ONLY valid JSON:
{{
  "title": "{title}",
  "description": "{description}",
  "learning_goals": {json.dumps(learning_goals)},
  "skill_level": "{skill_level}",
  "estimated_hours": {estimated_hours},
  "directory_structure": {{
    "root": ["src/", "tests/", "README.md", "package.json"],
    "src": ["contract.sol", "utils.js", "config.js"]
  }},
  "starter_files": [
    {{
      "path": "src/contract.sol",
      "content": "// TODO: Implement main contract\\npragma solidity ^0.8.0;\\ncontract Main {{}}"
    }}
  ],
  "todos": [
    {{"name": "Setup", "description": "Initialize project", "difficulty": "easy"}}
  ],
  "test_cases": [
    {{"name": "Basic Deployment", "description": "Test contract deploys", "example": "describe('Deployment', () => {{ it('deploys', async () => {{}}) }});"}},
  ],
  "deployment_guide": "1. Install dependencies\\n2. Compile contracts\\n3. Deploy to testnet"
}}"""
        
        try:
            project_data = await self.gemini.generate(
                prompt=prompt,
                response_schema=None,
                temperature=0.7,
                max_tokens=3000
            )
            
            # project_data is already a dict from generate()
            if not isinstance(project_data, dict) or "response" in project_data:
                project_data = project_data.get("response", {}) if isinstance(project_data, dict) else {}
            
            # Ensure required fields
            project_data.setdefault("directory_structure", {"root": []})
            project_data.setdefault("starter_files", [])
            project_data.setdefault("todos", [])
            project_data.setdefault("test_cases", [])
            project_data.setdefault("deployment_guide", "Follow framework documentation")
            
            # Cache for 7 days (projects don't change)
            await self.cache.cache_response("project", request_data, project_data, ttl_seconds=604800)
            
            return project_data
            
        except (json.JSONDecodeError, AttributeError):
            # Return template project
            return {
                "title": title,
                "description": description,
                "learning_goals": learning_goals,
                "skill_level": skill_level,
                "estimated_hours": estimated_hours,
                "directory_structure": {
                    "root": ["src/", "tests/", "README.md", "package.json"],
                    "src": ["index.js", "utils.js"]
                },
                "starter_files": [
                    {
                        "path": "src/index.js",
                        "content": "// TODO: Start implementing here\nconst main = async () => {\n  console.log('Starting project...');\n};\n\nmain();"
                    }
                ],
                "todos": [
                    {"name": "Setup project", "description": "Initialize and configure", "difficulty": "easy"},
                    {"name": "Implement core", "description": "Build main functionality", "difficulty": "medium"},
                    {"name": "Testing", "description": "Write comprehensive tests", "difficulty": "medium"}
                ],
                "test_cases": [
                    {"name": "Basic Test", "description": "First test", "example": "test('works', () => { expect(true).toBe(true); });"}
                ],
                "deployment_guide": "1. Install dependencies: npm install\n2. Configure .env\n3. Deploy: npm run deploy"
            }
