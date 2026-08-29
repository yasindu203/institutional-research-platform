class ForensicCalculator:
    """Calculates standard forensic accounting ratios."""
    
    @staticmethod
    def calculate_piotroski_f_score(current_period: dict, prior_period: dict) -> int:
        """Piotroski F-Score (0-9)"""
        if not current_period or not prior_period:
            return None
            
        score = 0
        
        # 1. Positive ROA
        roa = current_period.get('net_income', 0) / current_period.get('total_assets', 1)
        if roa > 0: score += 1
        
        # 2. Positive Operating Cash Flow
        cfo = current_period.get('operating_cash_flow', 0)
        if cfo > 0: score += 1
        
        # 3. Higher ROA than previous year
        prior_roa = prior_period.get('net_income', 0) / prior_period.get('total_assets', 1)
        if roa > prior_roa: score += 1
        
        # 4. CFO > Net Income (Accrual indicator)
        if cfo > current_period.get('net_income', 0): score += 1
        
        # 5. Lower ratio of long term debt
        ltd_ratio = current_period.get('long_term_debt', 0) / current_period.get('total_assets', 1)
        prior_ltd_ratio = prior_period.get('long_term_debt', 0) / prior_period.get('total_assets', 1)
        if ltd_ratio < prior_ltd_ratio: score += 1
        
        # 6. Higher current ratio
        current_ratio = current_period.get('current_assets', 0) / max(current_period.get('current_liabilities', 1), 1)
        prior_current_ratio = prior_period.get('current_assets', 0) / max(prior_period.get('current_liabilities', 1), 1)
        if current_ratio > prior_current_ratio: score += 1
        
        # 7. No new shares issued
        if current_period.get('shares_outstanding', 0) <= prior_period.get('shares_outstanding', 0): score += 1
        
        # 8. Higher gross margin
        gm = current_period.get('gross_profit', 0) / max(current_period.get('revenue', 1), 1)
        prior_gm = prior_period.get('gross_profit', 0) / max(prior_period.get('revenue', 1), 1)
        if gm > prior_gm: score += 1
        
        # 9. Higher asset turnover
        ato = current_period.get('revenue', 0) / current_period.get('total_assets', 1)
        prior_ato = prior_period.get('revenue', 0) / prior_period.get('total_assets', 1)
        if ato > prior_ato: score += 1
        
        return score
        
    @staticmethod
    def calculate_altman_z_score(stmt: dict) -> float:
        """Altman Z-Score (Manufacturing/Non-Financials)"""
        ta = stmt.get('total_assets', 1)
        tl = stmt.get('total_liabilities', 1)
        
        if ta == 0 or tl == 0:
            return None
            
        A = (stmt.get('current_assets', 0) - stmt.get('current_liabilities', 0)) / ta
        B = stmt.get('retained_earnings', 0) / ta
        C = stmt.get('ebit', 0) / ta
        D = stmt.get('market_cap', 0) / tl 
        E = stmt.get('revenue', 0) / ta
        
        return (1.2 * A) + (1.4 * B) + (3.3 * C) + (0.6 * D) + (1.0 * E)

    @staticmethod
    def check_red_flags(current_period: dict, prior_period: dict) -> dict:
        """Evaluate key accounting warning signs"""
        flags = {
            "declining_margins": False,
            "cfo_divergence": False,
            "rising_leverage": False,
            "inventory_accumulation": False
        }
        
        if current_period and prior_period:
            # 1. Margins declining
            gm = current_period.get('gross_profit', 0) / max(current_period.get('revenue', 1), 1)
            prior_gm = prior_period.get('gross_profit', 0) / max(prior_period.get('revenue', 1), 1)
            flags["declining_margins"] = gm < prior_gm
            
            # 2. Profits rising while CFO falls
            net_income_growth = current_period.get('net_income', 0) > prior_period.get('net_income', 0)
            cfo_decline = current_period.get('operating_cash_flow', 0) < prior_period.get('operating_cash_flow', 0)
            flags["cfo_divergence"] = net_income_growth and cfo_decline
            
            # 3. Rising leverage
            ltd = current_period.get('long_term_debt', 0)
            prior_ltd = prior_period.get('long_term_debt', 0)
            flags["rising_leverage"] = ltd > prior_ltd
            
            # 4. Inventory outgrowing revenue
            inv_growth = current_period.get('inventory', 0) / max(prior_period.get('inventory', 1), 1)
            rev_growth = current_period.get('revenue', 0) / max(prior_period.get('revenue', 1), 1)
            flags["inventory_accumulation"] = inv_growth > rev_growth
            
        return flags
