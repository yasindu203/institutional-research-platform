class NormalisationEngine:
    """
    Engine to identify potential exceptional/non-recurring items and build 
    a Reported -> Normalised Earnings bridge.
    """
    
    EXCEPTIONAL_KEYWORDS = [
        "disposal", "restructuring", "impairment", "litigation",
        "acquisition costs", "unusual", "bargain purchase", "settlement"
    ]
    
    @staticmethod
    def build_bridge(reported_earnings: float, non_operating_items: list) -> dict:
        """
        Takes reported earnings and a list of identified line items that might be non-recurring.
        Returns a bridge dict and the calculated normalised earnings.
        """
        bridge = {
            "reported_earnings": reported_earnings,
            "adjustments": [],
            "normalised_earnings": reported_earnings
        }
        
        total_adjustment = 0
        for item in non_operating_items:
            name = item.get("name", "").lower()
            amount = item.get("amount", 0)
            
            # Simple heuristic: if name contains an exceptional keyword, add it to the bridge
            # Note: A real implementation uses an LLM to interpret footnotes and classify these.
            # In Phase 2, we just build the framework based on text matching.
            is_exceptional = any(kw in name for kw in NormalisationEngine.EXCEPTIONAL_KEYWORDS)
            
            if is_exceptional:
                # Add back expenses (negative impact on reported), deduct gains (positive impact)
                # Assuming expenses are reported as positive numbers here
                adjustment_value = amount if "gain" not in name else -amount
                
                bridge["adjustments"].append({
                    "name": item.get("name"),
                    "amount": adjustment_value,
                    "evidence": item.get("evidence", "Unverified")
                })
                total_adjustment += adjustment_value
                
        bridge["normalised_earnings"] += total_adjustment
        return bridge
