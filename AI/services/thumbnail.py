"""
Smart Thumbnail Generator - Extracts key moments from content
"""

import json
import base64
from typing import Dict, Any
from services.gemini import GeminiClient
from services.cache import CacheService


class ThumbnailService:
    """Generate smart thumbnails with key moment extraction"""
    
    def __init__(self, gemini_client: GeminiClient, cache_service: CacheService):
        self.gemini = gemini_client
        self.cache = cache_service
    
    async def generate_thumbnail(
        self,
        video_title: str,
        transcript: str,
        key_concept: str = None,
        thumbnail_text: str = None
    ) -> Dict[str, Any]:
        """
        Generate smart thumbnail with extracted key moment
        
        Args:
            video_title: Title of the video
            transcript: Video transcript to analyze
            key_concept: Optional main concept to emphasize
            thumbnail_text: Optional override text
            
        Returns:
            Dict with thumbnail generation guidance
        """
        # Try cache
        request_data = {"video_title": video_title, "key_concept": key_concept or ""}
        cached = await self.cache.get_cached_response("thumbnail", request_data, ttl_seconds=604800)
        if cached:
            return cached
        
        concept_note = f"Focus on: {key_concept}" if key_concept else ""
        
        prompt = f"""Analyze this video transcript and suggest a compelling thumbnail design.

Title: {video_title}
{concept_note}

Transcript excerpt:
{transcript[:500]}...

Generate:
1. Key moment description (2 sentences - most engaging part)
2. Suggested overlay text (short, punchy, max 4 words)
3. Color scheme (primary, dark, light)
4. Icon suggestion (emoji or symbol)

Return ONLY valid JSON:
{{
  "key_moment_description": "The moment when...",
  "suggested_text": "Key Text Here",
  "color_scheme": "primary",
  "icon_suggestion": "🔒"
}}"""
        
        try:
            metadata_response = await self.gemini.generate(
                prompt=prompt,
                response_schema=None,
                temperature=0.6,
                max_tokens=500
            )
            
            # Get the response dict
            if isinstance(metadata_response, dict) and "response" in metadata_response:
                metadata_text = metadata_response["response"]
            else:
                metadata_text = str(metadata_response)
            
            # Try to parse JSON from response
            try:
                metadata = json.loads(metadata_text)
            except json.JSONDecodeError:
                import re
                json_match = re.search(r'\{.*\}', metadata_text, re.DOTALL)
                if json_match:
                    metadata = json.loads(json_match.group())
                else:
                    metadata = {}
            
        except Exception:
            # Fallback metadata
            metadata = {
                "key_moment_description": f"Key moment from {video_title}",
                "suggested_text": video_title[:30],
                "color_scheme": "primary",
                "icon_suggestion": "✨"
            }
        
        # Use provided text or suggested text
        overlay_text = thumbnail_text or metadata.get("suggested_text", video_title[:30])
        
        # Determine colors based on scheme
        colors = {
            "primary": {"bg": "#1E40AF", "text": "#FFFFFF"},
            "dark": {"bg": "#1F2937", "text": "#F3F4F6"},
            "light": {"bg": "#F9FAFB", "text": "#1F2937"}
        }
        
        color_scheme = metadata.get("color_scheme", "primary")
        color_config = colors.get(color_scheme, colors["primary"])
        
        # Create placeholder (in production would be actual image generation)
        placeholder_text = f"Thumbnail: {overlay_text}"
        placeholder_b64 = base64.b64encode(placeholder_text.encode()).decode()
        
        result = {
            "base64_placeholder": placeholder_b64,
            "metadata": {
                "key_moment_description": metadata.get("key_moment_description", ""),
                "suggested_text": metadata.get("suggested_text", overlay_text),
                "color_scheme": color_scheme,
                "icon_suggestion": metadata.get("icon_suggestion", "✨")
            },
            "text_overlay": overlay_text,
            "background_color": color_config["bg"],
            "text_color": color_config["text"],
            "generation_notes": f"Thumbnail generated from: {video_title}. Key concept: {key_concept or 'auto-detected'}. Use color scheme: {color_scheme}"
        }
        
        # Cache for 7 days
        await self.cache.cache_response("thumbnail", request_data, result, ttl_seconds=604800)
        
        return result
