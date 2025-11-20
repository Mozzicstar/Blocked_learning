"""
Gemini AI Client Wrapper

Handles all interactions with Google's Gemini API.
Supports JSON mode, retry logic, and token management.
"""

import os
import json
import asyncio
from typing import Optional, Dict, Any
import google.generativeai as genai
from pydantic import BaseModel


class GeminiClient:
    """Wrapper for Google Gemini API with enhanced features"""
    
    def __init__(self):
        """Initialize Gemini client"""
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        
        genai.configure(api_key=api_key)
        self.model_name = "gemini-2.5-flash"
        self.model = genai.GenerativeModel(self.model_name)
        
    async def generate(
        self,
        prompt: str,
        response_schema: Optional[type[BaseModel]] = None,
        temperature: float = 0.7,
        max_tokens: int = 2048
    ) -> Dict[str, Any]:
        """
        Generate response from Gemini with optional JSON schema validation
        
        Args:
            prompt: The prompt to send to Gemini
            response_schema: Optional Pydantic model for JSON response validation
            temperature: Sampling temperature (0.0-1.0)
            max_tokens: Maximum tokens in response
            
        Returns:
            Dict containing the response
        """
        max_retries = 3
        last_error = None
        
        for attempt in range(max_retries):
            try:
                generation_config = {
                    "temperature": temperature,
                    "max_output_tokens": max_tokens,
                }
                
                # Add JSON mode if schema provided
                if response_schema:
                    generation_config["response_mime_type"] = "application/json"
                    # Add schema hint to prompt
                    prompt_with_schema = f"{prompt}\n\nReturn response as JSON matching this structure: {response_schema.model_json_schema()}"
                else:
                    prompt_with_schema = prompt
                
                response = self.model.generate_content(
                    prompt_with_schema,
                    generation_config=generation_config
                )
                
                # Check if response is valid
                if not response.text or not response.text.strip():
                    if attempt < max_retries - 1:
                        wait_time = 2 ** attempt
                        await asyncio.sleep(wait_time)
                        continue
                    else:
                        raise Exception("Empty response from Gemini API")
                
                # Parse response
                if response_schema:
                    # Gemini JSON mode returns structured JSON
                    response_text = response.text
                    try:
                        response_data = json.loads(response_text)
                    except json.JSONDecodeError as je:
                        # If JSON parsing fails, try to extract JSON from response
                        import re
                        json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
                        if json_match:
                            response_data = json.loads(json_match.group())
                        else:
                            raise Exception(f"No valid JSON found in response. Raw text: {response_text[:200]}")
                    
                    # Validate with Pydantic
                    validated = response_schema(**response_data)
                    return validated.model_dump()
                else:
                    return {"response": response.text}
                    
            except Exception as e:
                last_error = e
                import sys
                print(f"Error on attempt {attempt + 1}: {str(e)}", file=sys.stderr)
                if attempt < max_retries - 1:
                    wait_time = 2 ** attempt  # exponential backoff: 1, 2, 4 seconds
                    await asyncio.sleep(wait_time)
                    continue
        
        raise Exception(f"Gemini API error after {max_retries} attempts: {str(last_error)}")
    
    async def analyze_video(
        self,
        video_path: str,
        prompt: str,
        response_schema: Optional[type[BaseModel]] = None
    ) -> Dict[str, Any]:
        """
        Analyze video content using Gemini's multimodal capabilities
        
        Args:
            video_path: Path to video file
            prompt: Analysis instructions
            response_schema: Optional Pydantic model for response
            
        Returns:
            Dict containing analysis results
        """
        try:
            # Upload video file
            video_file = genai.upload_file(path=video_path)
            
            # Wait for processing
            import time
            while video_file.state.name == "PROCESSING":
                time.sleep(2)
                video_file = genai.get_file(video_file.name)
            
            if video_file.state.name == "FAILED":
                raise ValueError("Video processing failed")
            
            generation_config = {
                "temperature": 0.7,
                "max_output_tokens": 3072,
            }
            
            if response_schema:
                generation_config["response_mime_type"] = "application/json"
                prompt = f"{prompt}\n\nReturn response as JSON matching this structure: {response_schema.model_json_schema()}"
            
            # Generate response with video
            response = self.model.generate_content(
                [video_file, prompt],
                generation_config=generation_config
            )
            
            # Clean up uploaded file
            genai.delete_file(video_file.name)
            
            if response_schema:
                response_text = response.text
                response_data = json.loads(response_text)
                validated = response_schema(**response_data)
                return validated.model_dump()
            else:
                return {"response": response.text}
                
        except Exception as e:
            raise Exception(f"Video analysis error: {str(e)}")
    
    def count_tokens(self, text: str) -> int:
        """Count tokens in text"""
        try:
            return self.model.count_tokens(text).total_tokens
        except:
            # Rough estimate if API fails
            return len(text) // 4
