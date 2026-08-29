from typing import Optional

class ValuationEngine:
    """
    Phase 5: Rigorous multi-method valuation engine.
    Implements DCF, Reverse DCF, and Relative Valuation.
    """

    @staticmethod
    def calculate_wacc(
        equity_market_cap: float,
        total_debt: float,
        cost_of_equity: float,
        cost_of_debt_pretax: float,
        tax_rate: float,
    ) -> float:
        """
        WACC = (E/V * Re) + (D/V * Rd * (1 - T))
        """
        v = equity_market_cap + total_debt
        if v == 0:
            return None
        e_weight = equity_market_cap / v
        d_weight = total_debt / v
        return (e_weight * cost_of_equity) + (d_weight * cost_of_debt_pretax * (1 - tax_rate))

    @staticmethod
    def run_dcf(
        base_fcf: float,
        fcf_growth_rates: list,     # e.g. explicit period, one per year
        terminal_growth_rate: float,
        wacc: float,
        net_debt: float,
        shares_outstanding: float,
    ) -> dict:
        """
        Full DCF returning enterprise value, equity value, implied price per share,
        and a year-by-year breakdown for the waterfall.
        """
        if wacc <= terminal_growth_rate:
            return {"error": "WACC must be greater than terminal growth rate"}

        pv_fcfs = []
        cumulative_fcf = base_fcf
        for i, g in enumerate(fcf_growth_rates):
            cumulative_fcf *= (1 + g)
            pv = cumulative_fcf / ((1 + wacc) ** (i + 1))
            pv_fcfs.append({"year": i + 1, "fcf": round(cumulative_fcf, 2), "pv": round(pv, 2)})

        # Terminal value
        final_year_fcf = pv_fcfs[-1]["fcf"]
        terminal_value = final_year_fcf * (1 + terminal_growth_rate) / (wacc - terminal_growth_rate)
        pv_terminal = terminal_value / ((1 + wacc) ** len(fcf_growth_rates))

        total_pv_explicit = sum(x["pv"] for x in pv_fcfs)
        enterprise_value = total_pv_explicit + pv_terminal
        equity_value = enterprise_value - net_debt
        implied_price = equity_value / shares_outstanding if shares_outstanding else None

        return {
            "explicit_period_pv": round(total_pv_explicit, 2),
            "terminal_value_pv": round(pv_terminal, 2),
            "enterprise_value": round(enterprise_value, 2),
            "equity_value": round(equity_value, 2),
            "implied_price_per_share": round(implied_price, 2) if implied_price else None,
            "yearly_breakdown": pv_fcfs,
        }

    @staticmethod
    def reverse_dcf(
        current_share_price: float,
        shares_outstanding: float,
        net_debt: float,
        base_fcf: float,
        forecast_years: int,
        wacc: float,
        terminal_growth_rate: float,
    ) -> dict:
        """
        Reverse DCF: Solve for the implied FCF growth rate that justifies the current market price.
        Uses binary search iteration.
        """
        target_equity_value = current_share_price * shares_outstanding
        target_ev = target_equity_value + net_debt

        lo, hi = -0.20, 0.50
        for _ in range(60):
            mid = (lo + hi) / 2.0
            growth_rates = [mid] * forecast_years
            dcf_result = ValuationEngine.run_dcf(
                base_fcf, growth_rates, terminal_growth_rate, wacc, net_debt, shares_outstanding
            )
            if "error" in dcf_result:
                break
            if dcf_result["enterprise_value"] < target_ev:
                lo = mid
            else:
                hi = mid

        return {
            "current_price": current_share_price,
            "implied_fcf_cagr_pct": round(mid * 100, 2),
            "interpretation": f"The market price implies {round(mid * 100, 1)}% annualized FCF growth over {forecast_years} years at a {round(wacc*100,1)}% WACC and {round(terminal_growth_rate*100,1)}% terminal rate.",
        }

    @staticmethod
    def run_scenarios(base_fcf: float, net_debt: float, shares_outstanding: float, wacc: float) -> dict:
        """Run Bear / Base / Bull scenario DCFs."""
        scenarios = {
            "bear": {"growth_rates": [0.02] * 5, "terminal": 0.015, "label": "Bear (P10)"},
            "base": {"growth_rates": [0.07] * 5, "terminal": 0.025, "label": "Base (Median)"},
            "bull": {"growth_rates": [0.14] * 5, "terminal": 0.035, "label": "Bull (P90)"},
        }
        results = {}
        for key, s in scenarios.items():
            r = ValuationEngine.run_dcf(base_fcf, s["growth_rates"], s["terminal"], wacc, net_debt, shares_outstanding)
            results[key] = {
                "label": s["label"],
                "implied_price": r.get("implied_price_per_share"),
                "enterprise_value": r.get("enterprise_value"),
            }
        return results
