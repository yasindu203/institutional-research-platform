class CapitalAllocationAnalyser:
    """
    Phase 4: Analyses management's track record of capital allocation.
    Evaluates FCF deployment across reinvestment, acquisitions, buybacks, and dividends.
    """

    @staticmethod
    def compute_fcf_deployment(cash_flow: dict, income_stmt: dict) -> dict:
        """
        Break down how FCF was deployed.
        """
        ocf = cash_flow.get("operating_cash_flow", 0)
        capex = abs(cash_flow.get("capital_expenditures", 0))
        acquisitions = abs(cash_flow.get("acquisitions", 0))
        buybacks = abs(cash_flow.get("share_repurchases", 0))
        dividends = abs(cash_flow.get("dividends_paid", 0))
        debt_repaid = abs(cash_flow.get("debt_repayment", 0))
        fcf = ocf - capex

        total_deployed = acquisitions + buybacks + dividends + debt_repaid
        
        return {
            "operating_cash_flow": ocf,
            "capital_expenditures": capex,
            "free_cash_flow": fcf,
            "acquisitions": acquisitions,
            "share_repurchases": buybacks,
            "dividends_paid": dividends,
            "debt_repaid": debt_repaid,
            "fcf_conversion": round((fcf / income_stmt.get("net_income", 1)) * 100, 1) if income_stmt.get("net_income") else None,
            "deployment_breakdown_pct": {
                "organic_reinvestment": round((capex / total_deployed * 100), 1) if total_deployed else 0,
                "acquisitions": round((acquisitions / total_deployed * 100), 1) if total_deployed else 0,
                "buybacks": round((buybacks / total_deployed * 100), 1) if total_deployed else 0,
                "dividends": round((dividends / total_deployed * 100), 1) if total_deployed else 0,
                "debt_reduction": round((debt_repaid / total_deployed * 100), 1) if total_deployed else 0,
            }
        }

    @staticmethod
    def score_capital_allocation(deployment: dict, roic_history: list) -> dict:
        """
        Score the quality of capital allocation based on:
        - ROIC trend (rising = value-creating)
        - FCF conversion quality
        - Balance between growth investment and shareholder returns
        """
        score = 50.0
        explanation = []

        # ROIC trend
        if len(roic_history) >= 2 and roic_history[-1] > roic_history[-2]:
            score += 15
            explanation.append("ROIC improving year-over-year (value-creating reinvestment)")
        elif len(roic_history) >= 2 and roic_history[-1] < roic_history[-2]:
            score -= 10
            explanation.append("ROIC declining (potential capital destruction)")

        # FCF conversion
        fcf_conv = deployment.get("fcf_conversion", 100)
        if fcf_conv and fcf_conv >= 90:
            score += 15
            explanation.append("FCF conversion > 90% (high earnings quality)")
        elif fcf_conv and fcf_conv < 60:
            score -= 15
            explanation.append("FCF conversion < 60% (concerning earnings quality)")

        # Buyback discipline
        breakdown = deployment.get("deployment_breakdown_pct", {})
        if breakdown.get("buybacks", 0) > 50:
            explanation.append("Heavy buyback focus (check valuation discipline)")

        return {
            "capital_allocation_score": round(max(0, min(100, score)), 1),
            "explanation": explanation,
            "deployment_breakdown": deployment.get("deployment_breakdown_pct", {})
        }
