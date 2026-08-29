"""
Phase 6: External Research Gateway
Provides abstraction layers for:
- OpenRouter LLM API
- Tavily / Exa web search
- Source reliability classification
"""

import httpx
import os
from app.core.config import settings

OPENROUTER_API_KEY = settings.OPENROUTER_API_KEY
TAVILY_API_KEY = settings.TAVILY_API_KEY
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"

# Model config per task type — verified working with this OpenRouter account
MODEL_REGISTRY = {
    "financial_reasoning": "anthropic/claude-3.5-sonnet",
    "governance_analysis": "anthropic/claude-3.5-sonnet",
    "rag_qa": "openai/gpt-4o-mini",
    "classification": "openai/gpt-4o-mini",
    "socratic_challenge": "anthropic/claude-3.5-sonnet",
    "default": "openai/gpt-4o-mini",
}

# Source reliability tiers
TIER_REGISTRY = {
    "SEC EDGAR": {"tier": 1, "reliability": "Very High"},
    "CSE": {"tier": 1, "reliability": "Very High"},
    "Audited Report": {"tier": 1, "reliability": "Very High"},
    "Central Bank": {"tier": 1, "reliability": "Very High"},
    "Reuters": {"tier": 2, "reliability": "High"},
    "Bloomberg": {"tier": 2, "reliability": "High"},
    "WSJ": {"tier": 2, "reliability": "High"},
    "Moody's": {"tier": 2, "reliability": "High"},
    "Tavily Web": {"tier": 3, "reliability": "Medium"},
    "Exa Search": {"tier": 3, "reliability": "Medium"},
    "Reddit": {"tier": 4, "reliability": "Low"},
    "Blog": {"tier": 4, "reliability": "Low"},
}


class LLMProvider:
    """Abstraction gateway for all LLM calls via OpenRouter."""

    @staticmethod
    async def complete(task_type: str, system_prompt: str, user_message: str,
                       temperature: float = 0.1, max_tokens: int = 2048) -> dict:
        """Route an LLM completion request via OpenRouter."""
        model = MODEL_REGISTRY.get(task_type, MODEL_REGISTRY["rag_qa"])
        if not OPENROUTER_API_KEY:
            return {"error": "OPENROUTER_API_KEY not configured", "model": model}

        async with httpx.AsyncClient(timeout=60) as client:
            resp = await client.post(
                f"{OPENROUTER_BASE_URL}/chat/completions",
                headers={
                    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                    "HTTP-Referer": "https://firs.app",
                },
                json={
                    "model": model,
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_message},
                    ],
                    "temperature": temperature,
                    "max_tokens": max_tokens,
                }
            )
            resp.raise_for_status()
            data = resp.json()
            return {
                "model": model,
                "content": data["choices"][0]["message"]["content"],
                "usage": data.get("usage", {}),
            }


class WebResearcher:
    """Abstraction for Tavily web search with reliability tagging."""

    @staticmethod
    async def search(query: str, max_results: int = 5, search_depth: str = "basic") -> list:
        """Search the web via Tavily and tag each result with a reliability tier."""
        if not TAVILY_API_KEY:
            return [{"error": "TAVILY_API_KEY not configured"}]

        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                "https://api.tavily.com/search",
                json={
                    "api_key": TAVILY_API_KEY,
                    "query": query,
                    "max_results": max_results,
                    "search_depth": search_depth,
                }
            )
            resp.raise_for_status()
            data = resp.json()

        results = []
        for r in data.get("results", []):
            source_name = r.get("source", "Unknown")
            reliability = WebResearcher.classify_reliability(source_name)
            results.append({
                "title": r.get("title"),
                "url": r.get("url"),
                "snippet": r.get("content", "")[:500],
                "source": source_name,
                "reliability_tier": reliability["tier"],
                "reliability_label": reliability["reliability"],
            })
        return results

    @staticmethod
    def classify_reliability(source_name: str) -> dict:
        """Classify a source into a reliability tier."""
        for k, v in TIER_REGISTRY.items():
            if k.lower() in source_name.lower():
                return v
        return {"tier": 3, "reliability": "Medium"}  # Default general web
