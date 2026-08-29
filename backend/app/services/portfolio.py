"""
Phase 8 & 9: Portfolio Lab & Optimisation Engine
- Tracks holdings (cost basis, current price, weight)
- Computes portfolio-level fundamentals (weighted ROIC, FCF Yield, P/E)
- Implements Utility Scoring: U(i) = E(Rp) - lambda/2 * sigma^2
- Optimisation: Max Utility, Min Variance, Max Sharpe
"""

import math
from typing import List, Dict, Optional


class PortfolioEngine:

    @staticmethod
    def compute_portfolio_fundamentals(holdings: List[dict]) -> dict:
        """
        Compute weighted portfolio-level fundamentals from individual holdings.
        Each holding: {ticker, weight, roic, fcf_yield, pe_ratio, utility_score}
        """
        total_weight = sum(h.get("weight", 0) for h in holdings)
        if total_weight == 0:
            return {"error": "Total weight is zero"}

        weighted_roic = sum(h.get("weight", 0) * h.get("roic", 0) for h in holdings) / total_weight
        weighted_fcf_yield = sum(h.get("weight", 0) * h.get("fcf_yield", 0) for h in holdings) / total_weight
        weighted_pe = sum(h.get("weight", 0) * h.get("pe_ratio", 0) for h in holdings) / total_weight
        weighted_utility = sum(h.get("weight", 0) * h.get("utility_score", 0) for h in holdings) / total_weight

        return {
            "weighted_roic_pct": round(weighted_roic * 100, 2),
            "weighted_fcf_yield_pct": round(weighted_fcf_yield * 100, 2),
            "weighted_pe": round(weighted_pe, 2),
            "portfolio_utility_score": round(weighted_utility, 1),
        }

    @staticmethod
    def compute_utility_score(
        holding: dict,
        weights: Optional[dict] = None
    ) -> float:
        """
        Compute a personalised investor utility score for a single holding.
        U = sum(wi * score_i) for each dimension.
        """
        if weights is None:
            weights = {
                "expected_return": 0.25,
                "quality": 0.20,
                "moat": 0.20,
                "governance": 0.15,
                "valuation": 0.20,
            }

        score = (
            holding.get("expected_return_score", 50) * weights.get("expected_return", 0) +
            holding.get("quality_score", 50) * weights.get("quality", 0) +
            holding.get("moat_score", 50) * weights.get("moat", 0) +
            holding.get("governance_score", 50) * weights.get("governance", 0) +
            holding.get("valuation_score", 50) * weights.get("valuation", 0)
        )
        return round(score, 1)

    @staticmethod
    def compute_unrealised_pnl(holdings: List[dict]) -> List[dict]:
        """Calculate unrealised P&L for each holding."""
        results = []
        for h in holdings:
            cost = h.get("cost_basis", 0)
            current = h.get("current_price", 0)
            shares = h.get("shares", 0)

            unrealised_pct = ((current - cost) / cost * 100) if cost else 0
            unrealised_value = (current - cost) * shares

            results.append({
                "ticker": h.get("ticker"),
                "cost_basis": cost,
                "current_price": current,
                "shares": shares,
                "unrealised_value": round(unrealised_value, 2),
                "unrealised_pct": round(unrealised_pct, 2),
            })
        return results

    @staticmethod
    def max_sharpe_optimise(holdings: List[dict]) -> dict:
        """
        Simplified Max Sharpe Ratio optimisation.
        Re-weights holdings proportionally to their utility_score / risk,
        as a heuristic proxy for Mean-Variance optimisation.
        """
        scored = [(h.get("ticker"), h.get("utility_score", 50),
                   max(h.get("volatility", 0.20), 0.01)) for h in holdings]

        sharpe_proxies = [(t, u / v) for t, u, v in scored]
        total = sum(s for _, s in sharpe_proxies)

        if total == 0:
            return {"error": "Cannot optimise: all utility scores are zero"}

        optimised = [
            {"ticker": t, "suggested_weight_pct": round((s / total) * 100, 2)}
            for t, s in sharpe_proxies
        ]
        optimised.sort(key=lambda x: -x["suggested_weight_pct"])

        return {
            "method": "Max Utility / Sharpe Proxy",
            "note": "Full Black-Litterman will be implemented in the ML engine phase.",
            "optimised_weights": optimised,
        }
