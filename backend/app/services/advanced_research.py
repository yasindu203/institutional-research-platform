"""
Phase 10: Advanced Research
- Monte Carlo Simulation
- Socratic Challenge Engine
"""

import math
import random
from typing import List, Optional


class MonteCarloEngine:
    """
    Monte Carlo simulation for probabilistic valuation.
    Samples key drivers (FCF growth, WACC, terminal rate) and 
    builds a distribution of implied share prices.
    """

    @staticmethod
    def run(
        base_fcf: float,
        net_debt: float,
        shares_outstanding: float,
        mean_growth: float,
        std_growth: float,
        mean_wacc: float,
        std_wacc: float,
        mean_terminal: float,
        std_terminal: float,
        forecast_years: int = 5,
        n_simulations: int = 10000,
        seed: int = 42,
    ) -> dict:
        """Run N Monte Carlo simulations and return a price distribution."""
        random.seed(seed)
        prices = []

        for _ in range(n_simulations):
            g = max(-0.30, random.gauss(mean_growth, std_growth))
            w = max(0.04, random.gauss(mean_wacc, std_wacc))
            t = max(0.0, random.gauss(mean_terminal, std_terminal))

            if w <= t:
                continue  # Invalid scenario

            fcf = base_fcf
            pv_sum = 0.0
            for yr in range(1, forecast_years + 1):
                fcf *= (1 + g)
                pv_sum += fcf / ((1 + w) ** yr)

            final_fcf = base_fcf * ((1 + g) ** forecast_years)
            tv = final_fcf * (1 + t) / (w - t)
            pv_tv = tv / ((1 + w) ** forecast_years)
            ev = pv_sum + pv_tv
            equity = ev - net_debt
            price = equity / shares_outstanding if shares_outstanding else 0
            if price > 0:
                prices.append(round(price, 2))

        if not prices:
            return {"error": "No valid simulations produced"}

        prices.sort()
        n = len(prices)

        def pctile(p):
            idx = int(p / 100 * n)
            return prices[min(idx, n - 1)]

        return {
            "n_valid_simulations": n,
            "mean_price": round(sum(prices) / n, 2),
            "median_price": pctile(50),
            "p10_bear": pctile(10),
            "p25": pctile(25),
            "p75": pctile(75),
            "p90_bull": pctile(90),
            "std_dev": round(math.sqrt(sum((p - sum(prices)/n)**2 for p in prices) / n), 2),
        }


class SocraticChallenger:
    """
    Generates structured devil's advocate questions to challenge an investment thesis.
    In production, this will call the LLM via the OpenRouter gateway.
    The prompts here form the structured 'challenge framework'.
    """

    CHALLENGE_TEMPLATES = [
        "What specific evidence would cause you to abandon this investment thesis?",
        "If margins compress by 200bps, what is the new implied intrinsic value?",
        "How dependent is the ROIC on assumptions that are outside management's control?",
        "Is the moat genuinely structural or is it a temporary competitive advantage?",
        "What would a rational bear say about the quality of reported earnings?",
        "If the terminal growth rate is 100bps lower than your base case, does the investment still make sense?",
        "Is management's track record of capital allocation supported by ROIC data, or is it narrative?",
        "What are the three most material risks that are not yet reflected in your probability-weighted scenarios?",
    ]

    @staticmethod
    def generate_challenges(thesis_summary: str, n: int = 5) -> dict:
        """
        Generate structured Socratic challenges for a given thesis summary.
        """
        selected = random.sample(SocraticChallenger.CHALLENGE_TEMPLATES, min(n, len(SocraticChallenger.CHALLENGE_TEMPLATES)))
        return {
            "thesis_summary": thesis_summary,
            "socratic_challenges": [
                {"id": i + 1, "question": q} for i, q in enumerate(selected)
            ],
            "note": "In production, LLM (via OpenRouter) generates company-specific questions grounded in extracted evidence."
        }
