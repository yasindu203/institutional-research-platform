class FinancialCalculator:
    """
    Layer 2: Deterministic Calculation Engine
    Produces authoritative calculations strictly from Layer 1 Facts.
    """
    
    @staticmethod
    def calculate_fcf(operating_cash_flow: float, capital_expenditures: float) -> float:
        """FCF = Operating Cash Flow - Capital Expenditures"""
        if operating_cash_flow is None or capital_expenditures is None:
            return None
        return operating_cash_flow - capital_expenditures
        
    @staticmethod
    def calculate_roic(nopat: float, invested_capital: float) -> float:
        """ROIC = NOPAT / Invested Capital"""
        if nopat is None or invested_capital is None or invested_capital == 0:
            return None
        return nopat / invested_capital
        
    @staticmethod
    def calculate_working_capital(current_assets: float, current_liabilities: float) -> float:
        """Net Working Capital = Current Assets - Current Liabilities"""
        if current_assets is None or current_liabilities is None:
            return None
        return current_assets - current_liabilities

    @staticmethod
    def verify_accounting_integrity(assets: float, liabilities: float, equity: float, tolerance: float = 1.0) -> bool:
        """Accounting Gate: Assets ≈ Liabilities + Equity"""
        if assets is None or liabilities is None or equity is None:
            return False
        return abs(assets - (liabilities + equity)) <= tolerance

    @staticmethod
    def compute_all_metrics(income_stmt: dict, balance_sheet: dict, cash_flow: dict) -> dict:
        """Compute standard Layer 2 metrics from extracted Layer 1 facts."""
        metrics = {}
        
        # Free Cash Flow
        ocf = cash_flow.get("operating_cash_flow")
        capex = cash_flow.get("capital_expenditures")
        metrics["fcf"] = FinancialCalculator.calculate_fcf(ocf, capex)
        
        # Working Capital
        ca = balance_sheet.get("current_assets")
        cl = balance_sheet.get("current_liabilities")
        metrics["net_working_capital"] = FinancialCalculator.calculate_working_capital(ca, cl)
        
        # ROIC (Simplified NOPAT for Phase 1: EBIT * (1 - tax_rate))
        ebit = income_stmt.get("operating_income")
        tax_expense = income_stmt.get("income_tax_expense", 0)
        pretax_income = income_stmt.get("pretax_income")
        
        if ebit is not None and pretax_income and pretax_income > 0:
            tax_rate = tax_expense / pretax_income
            nopat = ebit * (1 - tax_rate)
            
            total_assets = balance_sheet.get("total_assets")
            excess_cash = balance_sheet.get("cash_and_equivalents", 0)
            non_interest_bearing_cl = balance_sheet.get("accounts_payable", 0) + balance_sheet.get("accrued_liabilities", 0)
            
            if total_assets is not None:
                invested_capital = total_assets - excess_cash - non_interest_bearing_cl
                metrics["roic"] = FinancialCalculator.calculate_roic(nopat, invested_capital)
        
        return metrics
