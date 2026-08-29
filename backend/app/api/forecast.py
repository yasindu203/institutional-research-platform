from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from app.services.forecast import ForecastEngine

router = APIRouter()

class BaselineInput(BaseModel):
    historical_values: List[float]
    years_to_forecast: int = 5

class DriverInput(BaseModel):
    base_revenue: float
    revenue_growth_rates: List[float]
    gross_margin_pct: float = 0.44
    ebit_margin_pct: float = 0.30
    tax_rate: float = 0.16
    reinvestment_rate: float = 0.25

class EnsembleInput(BaseModel):
    historical_revenue: List[float]
    base_revenue: float
    revenue_growth_rates: List[float]
    gross_margin_pct: float = 0.44
    ebit_margin_pct: float = 0.30
    tax_rate: float = 0.16
    reinvestment_rate: float = 0.25
    baseline_weight: float = 0.30
    driver_weight: float = 0.70

@router.post("/baseline")
async def baseline_forecast(payload: BaselineInput):
    """Compute a historical CAGR and project forward."""
    return ForecastEngine.baseline_cagr(payload.historical_values, payload.years_to_forecast)

@router.post("/driver-based")
async def driver_based_forecast(payload: DriverInput):
    """Run a driver-based revenue-to-FCF forecast."""
    return ForecastEngine.driver_based_forecast(
        payload.base_revenue, payload.revenue_growth_rates,
        payload.gross_margin_pct, payload.ebit_margin_pct,
        payload.tax_rate, payload.reinvestment_rate
    )

@router.post("/ensemble")
async def ensemble_forecast(payload: EnsembleInput):
    """Blend baseline and driver-based forecasts into an ensemble."""
    baseline = ForecastEngine.baseline_cagr(payload.historical_revenue, len(payload.revenue_growth_rates))
    driver = ForecastEngine.driver_based_forecast(
        payload.base_revenue, payload.revenue_growth_rates,
        payload.gross_margin_pct, payload.ebit_margin_pct,
        payload.tax_rate, payload.reinvestment_rate
    )
    return ForecastEngine.ensemble_summary(baseline, driver, {
        "baseline": payload.baseline_weight,
        "driver": payload.driver_weight,
    })
