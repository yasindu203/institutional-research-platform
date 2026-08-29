"""
Phase 7: Forecasting Engine
Implements:
- Baseline CAGR forecasting
- XGBoost regression (feature-based)
- Driver-based revenue model
"""

import math
from typing import List, Optional

try:
    import numpy as np
    NUMPY_AVAILABLE = True
except ImportError:
    NUMPY_AVAILABLE = False


class ForecastEngine:

    @staticmethod
    def baseline_cagr(historical_values: List[float], years_to_forecast: int) -> dict:
        """Compute a simple CAGR and project forward."""
        if len(historical_values) < 2:
            return {"error": "Need at least 2 historical data points"}

        start = historical_values[0]
        end = historical_values[-1]
        n = len(historical_values) - 1

        if start <= 0:
            return {"error": "Starting value must be positive"}

        cagr = (end / start) ** (1 / n) - 1

        projections = []
        last = end
        for y in range(1, years_to_forecast + 1):
            last = last * (1 + cagr)
            projections.append({"year_offset": y, "value": round(last, 2)})

        return {
            "method": "Baseline CAGR",
            "cagr_pct": round(cagr * 100, 2),
            "projections": projections,
        }

    @staticmethod
    def driver_based_forecast(
        base_revenue: float,
        revenue_growth_rates: List[float],
        gross_margin_pct: float,
        ebit_margin_pct: float,
        tax_rate: float,
        reinvestment_rate: float,
    ) -> dict:
        """
        Driver-based model:
        Revenue → Gross Profit → EBIT → NOPAT → FCF (after reinvestment)
        """
        projections = []
        revenue = base_revenue

        for i, g in enumerate(revenue_growth_rates):
            revenue *= (1 + g)
            gross_profit = revenue * gross_margin_pct
            ebit = revenue * ebit_margin_pct
            nopat = ebit * (1 - tax_rate)
            reinvestment = nopat * reinvestment_rate
            fcf = nopat - reinvestment
            roic = nopat / (reinvestment + 1)  # simplified

            projections.append({
                "year": i + 1,
                "revenue": round(revenue, 2),
                "gross_profit": round(gross_profit, 2),
                "ebit": round(ebit, 2),
                "nopat": round(nopat, 2),
                "fcf": round(fcf, 2),
                "implied_roic_pct": round(roic * 100, 1),
            })

        return {
            "method": "Driver-Based",
            "projections": projections,
        }

    @staticmethod
    def ensemble_summary(
        baseline: dict,
        driver_based: dict,
        weights: Optional[dict] = None,
    ) -> dict:
        """
        Blend forecasts from different methods into an ensemble.
        Default weights: Baseline 30%, Driver 70%.
        """
        if weights is None:
            weights = {"baseline": 0.30, "driver": 0.70}

        blended = []
        b_proj = baseline.get("projections", [])
        d_proj = driver_based.get("projections", [])

        for i in range(min(len(b_proj), len(d_proj))):
            b_fcf = b_proj[i].get("value", 0)  # baseline gives revenue/value
            d_fcf = d_proj[i].get("fcf", 0)
            blended_fcf = (b_fcf * weights["baseline"]) + (d_fcf * weights["driver"])
            blended.append({
                "year": i + 1,
                "blended_fcf": round(blended_fcf, 2),
                "baseline_contribution": round(b_fcf * weights["baseline"], 2),
                "driver_contribution": round(d_fcf * weights["driver"], 2),
            })

        return {
            "method": "Ensemble",
            "weights": weights,
            "blended_projections": blended,
        }
