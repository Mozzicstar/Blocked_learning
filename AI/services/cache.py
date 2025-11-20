"""
Redis caching service for AI responses and rate limiting.
"""
import json
import hashlib
from typing import Optional, Any
from datetime import timedelta
import redis.asyncio as redis
from fastapi import HTTPException

class CacheService:
    """
    Handles caching of AI responses and rate limiting.
    """
    
    def __init__(self, redis_url: str):
        """Initialize Redis connection."""
        self.redis_client = redis.from_url(
            redis_url,
            encoding="utf-8",
            decode_responses=True
        )
        
    async def close(self):
        """Close Redis connection."""
        await self.redis_client.close()
        
    def _generate_cache_key(self, prefix: str, data: dict) -> str:
        """
        Generate deterministic cache key from request data.
        
        Args:
            prefix: Namespace prefix (e.g., 'explain', 'suggest')
            data: Request data dict
            
        Returns:
            Hash-based cache key
        """
        # Sort dict keys for deterministic hashing
        data_str = json.dumps(data, sort_keys=True)
        data_hash = hashlib.sha256(data_str.encode()).hexdigest()[:16]
        return f"blockedlearning:ai:{prefix}:{data_hash}"
    
    async def get(self, key: str) -> Optional[dict]:
        """
        Retrieve cached response.
        
        Args:
            key: Cache key
            
        Returns:
            Cached data as dict, or None if not found
        """
        try:
            cached_data = await self.redis_client.get(key)
            if cached_data:
                return json.loads(cached_data)
            return None
        except Exception as e:
            # Log error but don't fail the request
            print(f"Cache get error: {e}")
            return None
    
    async def set(
        self, 
        key: str, 
        value: dict, 
        ttl_seconds: int
    ) -> bool:
        """
        Store response in cache with TTL.
        
        Args:
            key: Cache key
            value: Data to cache
            ttl_seconds: Time to live in seconds
            
        Returns:
            True if successful, False otherwise
        """
        try:
            await self.redis_client.setex(
                key,
                ttl_seconds,
                json.dumps(value)
            )
            return True
        except Exception as e:
            print(f"Cache set error: {e}")
            return False
    
    async def get_cached_response(
        self, 
        prefix: str, 
        request_data: dict,
        ttl_seconds: int = 86400  # 24 hours default
    ) -> Optional[dict]:
        """
        Get cached AI response if exists.
        
        Args:
            prefix: Cache namespace (explain/suggest/profile)
            request_data: Original request data
            ttl_seconds: How long to cache (default 24h)
            
        Returns:
            Cached response or None
        """
        cache_key = self._generate_cache_key(prefix, request_data)
        return await self.get(cache_key)
    
    async def cache_response(
        self, 
        prefix: str, 
        request_data: dict,
        response_data: dict,
        ttl_seconds: int = 86400
    ) -> bool:
        """
        Cache AI response.
        
        Args:
            prefix: Cache namespace
            request_data: Original request data
            response_data: AI response to cache
            ttl_seconds: Cache duration
            
        Returns:
            True if cached successfully
        """
        cache_key = self._generate_cache_key(prefix, request_data)
        return await self.set(cache_key, response_data, ttl_seconds)
    
    async def check_rate_limit(
        self, 
        identifier: str, 
        max_requests: int = 3,
        window_seconds: int = 60
    ) -> None:
        """
        Rate limit by identifier (wallet/IP).
        
        Args:
            identifier: User identifier (wallet address or IP)
            max_requests: Max requests allowed in window
            window_seconds: Time window in seconds
            
        Raises:
            HTTPException: If rate limit exceeded
        """
        rate_key = f"blockedlearning:ratelimit:{identifier}"
        
        try:
            # Increment counter
            current = await self.redis_client.incr(rate_key)
            
            # Set TTL on first request
            if current == 1:
                await self.redis_client.expire(rate_key, window_seconds)
            
            # Check if exceeded
            if current > max_requests:
                raise HTTPException(
                    status_code=429,
                    detail=f"Rate limit exceeded. Max {max_requests} requests per {window_seconds}s."
                )
                
        except HTTPException:
            raise
        except Exception as e:
            # Don't block request on rate limit errors
            print(f"Rate limit check error: {e}")
    
    async def get_user_cache_stats(self, wallet: str) -> dict:
        """
        Get cache statistics for a user (debugging).
        
        Args:
            wallet: User wallet address
            
        Returns:
            Dict with cache stats
        """
        try:
            # Count cached items for user
            pattern = f"blockedlearning:ai:*{wallet}*"
            cursor = 0
            cached_count = 0
            
            while True:
                cursor, keys = await self.redis_client.scan(
                    cursor, 
                    match=pattern, 
                    count=100
                )
                cached_count += len(keys)
                if cursor == 0:
                    break
            
            return {
                "wallet": wallet,
                "cached_responses": cached_count
            }
        except Exception as e:
            print(f"Cache stats error: {e}")
            return {"wallet": wallet, "cached_responses": 0}
    
    async def invalidate_user_cache(self, wallet: str) -> int:
        """
        Clear all cached responses for a user.
        
        Args:
            wallet: User wallet address
            
        Returns:
            Number of keys deleted
        """
        try:
            pattern = f"blockedlearning:ai:*{wallet}*"
            cursor = 0
            deleted = 0
            
            while True:
                cursor, keys = await self.redis_client.scan(
                    cursor,
                    match=pattern,
                    count=100
                )
                if keys:
                    deleted += await self.redis_client.delete(*keys)
                if cursor == 0:
                    break
            
            return deleted
        except Exception as e:
            print(f"Cache invalidation error: {e}")
            return 0
