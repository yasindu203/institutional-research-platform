from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from app.services.research import LLMProvider, WebResearcher

router = APIRouter()

class RAGQuery(BaseModel):
    query: str
    context: Optional[str] = None  # Pre-extracted evidence passed in
    task_type: str = "rag_qa"

class SearchQuery(BaseModel):
    query: str
    max_results: int = 5

@router.post("/query")
async def research_query(payload: RAGQuery):
    """
    Submit a research question to the AI Analyst.
    The response is grounded strictly in the provided evidence context.
    """
    system_prompt = """You are an institutional investment analyst AI.
Answer questions strictly using the provided evidence context.
Always cite the source of each claim using [Source Name, Page X] notation.
If the evidence does not support a claim, state 'Not found in available evidence.'
Never speculate beyond the provided facts."""

    user_message = payload.query
    if payload.context:
        user_message = f"Evidence Context:\n{payload.context}\n\nQuestion: {payload.query}"

    result = await LLMProvider.complete(
        task_type=payload.task_type,
        system_prompt=system_prompt,
        user_message=user_message,
    )
    return result

@router.post("/web-search")
async def web_search(payload: SearchQuery):
    """Search the web via Tavily and return results with reliability tiers."""
    results = await WebResearcher.search(payload.query, payload.max_results)
    return {"query": payload.query, "results": results}

@router.get("/models")
async def list_models():
    """Return available LLM models by task type."""
    from app.services.research import MODEL_REGISTRY
    return {"models": MODEL_REGISTRY}

@router.get("/source-tiers")
async def list_source_tiers():
    """Return the source reliability classification framework."""
    from app.services.research import TIER_REGISTRY
    return {"tiers": TIER_REGISTRY}
