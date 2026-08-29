from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional, Dict
from app.services.portfolio import PortfolioEngine

router = APIRouter()

class Holding(BaseModel):
    ticker: str
    weight: float
    shares: float = 0
    cost_basis: float = 0
    current_price: float = 0
    roic: float = 0
    fcf_yield: float = 0
    pe_ratio: float = 0
    utility_score: float = 50
    volatility: float = 0.20
    expected_return_score: float = 50
    quality_score: float = 50
    moat_score: float = 50
    governance_score: float = 50
    valuation_score: float = 50

class Portfolio(BaseModel):
    holdings: List[Holding]

class UtilityWeights(BaseModel):
    expected_return: float = 0.25
    quality: float = 0.20
    moat: float = 0.20
    governance: float = 0.15
    valuation: float = 0.20

@router.post("/fundamentals")
async def get_portfolio_fundamentals(portfolio: Portfolio):
    """Compute weighted portfolio-level fundamental metrics."""
    return PortfolioEngine.compute_portfolio_fundamentals(
        [h.model_dump() for h in portfolio.holdings]
    )

@router.post("/pnl")
async def get_unrealised_pnl(portfolio: Portfolio):
    """Calculate unrealised profit and loss for each holding."""
    return PortfolioEngine.compute_unrealised_pnl(
        [h.model_dump() for h in portfolio.holdings]
    )

@router.post("/utility-score")
async def compute_utility(holding: Holding, weights: Optional[UtilityWeights] = None):
    """Compute the personalised utility score for a single holding."""
    w = weights.model_dump() if weights else None
    score = PortfolioEngine.compute_utility_score(holding.model_dump(), w)
    return {"ticker": holding.ticker, "utility_score": score}

@router.post("/optimise")
async def optimise_portfolio(portfolio: Portfolio):
    """Run Max Utility / Sharpe Proxy optimisation on a portfolio."""
    return PortfolioEngine.max_sharpe_optimise(
        [h.model_dump() for h in portfolio.holdings]
    )
