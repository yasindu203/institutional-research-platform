from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from app.services.advanced_research import MonteCarloEngine, SocraticChallenger

router = APIRouter()

class MonteCarloInput(BaseModel):
    base_fcf: float
    net_debt: float
    shares_outstanding: float
    mean_growth: float = 0.07
    std_growth: float = 0.03
    mean_wacc: float = 0.09
    std_wacc: float = 0.01
    mean_terminal: float = 0.025
    std_terminal: float = 0.005
    forecast_years: int = 5
    n_simulations: int = 10000
    seed: int = 42

class SocraticInput(BaseModel):
    thesis_summary: str
    n_questions: int = 5

@router.post("/monte-carlo")
async def run_monte_carlo(payload: MonteCarloInput):
    """
    Run a Monte Carlo simulation to produce a probabilistic price distribution.
    """
    return MonteCarloEngine.run(
        base_fcf=payload.base_fcf,
        net_debt=payload.net_debt,
        shares_outstanding=payload.shares_outstanding,
        mean_growth=payload.mean_growth,
        std_growth=payload.std_growth,
        mean_wacc=payload.mean_wacc,
        std_wacc=payload.std_wacc,
        mean_terminal=payload.mean_terminal,
        std_terminal=payload.std_terminal,
        forecast_years=payload.forecast_years,
        n_simulations=payload.n_simulations,
        seed=payload.seed,
    )

@router.post("/socratic-challenge")
async def socratic_challenge(payload: SocraticInput):
    """
    Generate Socratic devil's advocate questions to pressure-test an investment thesis.
    """
    return SocraticChallenger.generate_challenges(payload.thesis_summary, payload.n_questions)
