from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from app.services.valuation import ValuationEngine

router = APIRouter()

class WACCInput(BaseModel):
    equity_market_cap: float
    total_debt: float
    cost_of_equity: float
    cost_of_debt_pretax: float
    tax_rate: float

class DCFInput(BaseModel):
    base_fcf: float
    fcf_growth_rates: List[float]
    terminal_growth_rate: float
    wacc: float
    net_debt: float
    shares_outstanding: float

class ReverseDCFInput(BaseModel):
    current_share_price: float
    shares_outstanding: float
    net_debt: float
    base_fcf: float
    forecast_years: int = 10
    wacc: float
    terminal_growth_rate: float

class ScenarioInput(BaseModel):
    base_fcf: float
    net_debt: float
    shares_outstanding: float
    wacc: float

@router.post("/wacc")
async def compute_wacc(payload: WACCInput):
    """Calculate the Weighted Average Cost of Capital."""
    result = ValuationEngine.calculate_wacc(
        payload.equity_market_cap, payload.total_debt,
        payload.cost_of_equity, payload.cost_of_debt_pretax, payload.tax_rate
    )
    return {"wacc": round(result * 100, 3) if result else None, "wacc_decimal": result}

@router.post("/dcf")
async def run_dcf(payload: DCFInput):
    """Run a full DCF valuation model."""
    return ValuationEngine.run_dcf(
        payload.base_fcf, payload.fcf_growth_rates, payload.terminal_growth_rate,
        payload.wacc, payload.net_debt, payload.shares_outstanding
    )

@router.post("/reverse-dcf")
async def run_reverse_dcf(payload: ReverseDCFInput):
    """Compute the implied FCF growth rate embedded in the current market price."""
    return ValuationEngine.reverse_dcf(
        payload.current_share_price, payload.shares_outstanding, payload.net_debt,
        payload.base_fcf, payload.forecast_years, payload.wacc, payload.terminal_growth_rate
    )

@router.post("/scenarios")
async def run_scenarios(payload: ScenarioInput):
    """Run Bear / Base / Bull scenario DCFs."""
    return ValuationEngine.run_scenarios(
        payload.base_fcf, payload.net_debt, payload.shares_outstanding, payload.wacc
    )
