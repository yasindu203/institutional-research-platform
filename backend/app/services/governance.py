class GovernanceScorer:
    """
    Calculates the institutional governance score (0-100) 
    based on structured data from filings, proxy statements, and evidence.
    """

    DUAL_CLASS_PENALTY = -15.0
    CEO_CHAIR_PENALTY = -10.0
    RELATED_PARTY_PENALTY = -20.0
    FRAUD_HISTORY_PENALTY = -30.0

    @staticmethod
    def score_board_effectiveness(board: dict) -> float:
        """Score the board structure out of 100."""
        score = 50.0
        total = board.get("total_directors", 1)
        independent = board.get("independent_directors", 0)

        independence_ratio = independent / total if total else 0
        score += (independence_ratio - 0.5) * 40  # +/- 20 based on independence

        if board.get("ceo_is_chair"):
            score += GovernanceScorer.CEO_CHAIR_PENALTY

        female_directors = board.get("female_directors", 0)
        if female_directors >= 3:
            score += 10
        elif female_directors >= 1:
            score += 5

        return max(0, min(100, score))

    @staticmethod
    def score_audit_quality(audit_data: dict) -> float:
        """Score audit quality out of 100."""
        score = 70.0
        if audit_data.get("material_weakness"):
            score -= 30
        if audit_data.get("qualified_opinion"):
            score -= 25
        if audit_data.get("auditor_tenure_years", 10) > 20:
            score -= 5  # Very long tenure can impair independence
        if audit_data.get("big_four"):
            score += 10
        return max(0, min(100, score))

    @staticmethod
    def score_executive_incentives(comp_data: dict) -> float:
        """Score executive compensation alignment out of 100."""
        score = 60.0
        ltip_pct = comp_data.get("ltip_pct_of_total", 0)
        score += (ltip_pct - 0.4) * 50  # Reward if >40% is long-term
        if comp_data.get("clawback_policy"):
            score += 10
        if comp_data.get("say_on_pay_approval_pct", 100) < 70:
            score -= 20
        return max(0, min(100, score))

    @staticmethod
    def compute_overall_score(board: dict, audit: dict, compensation: dict,
                               ownership: dict, related_parties: dict) -> dict:
        """Compute all sub-scores and the overall governance score."""
        board_eff = GovernanceScorer.score_board_effectiveness(board)
        audit_q = GovernanceScorer.score_audit_quality(audit)
        exec_inc = GovernanceScorer.score_executive_incentives(compensation)

        # Shareholder rights
        shareholder_rights = 80.0
        if ownership.get("dual_class_shares"):
            shareholder_rights += GovernanceScorer.DUAL_CLASS_PENALTY
        shareholder_rights = max(0, min(100, shareholder_rights))

        # Related party
        related_party_flag = related_parties.get("material_transactions", False)
        related_party_score = 100.0 if not related_party_flag else 40.0

        # Weighted overall score
        overall = (
            board_eff * 0.25 +
            audit_q * 0.25 +
            exec_inc * 0.20 +
            shareholder_rights * 0.20 +
            related_party_score * 0.10
        )

        # Build override flags
        override_flags = {}
        if audit.get("qualified_opinion"):
            override_flags["audit_opinion"] = "RED"
        if related_party_flag:
            override_flags["related_party"] = "AMBER"
        if ownership.get("dual_class_shares"):
            override_flags["dual_class"] = "AMBER"
        if board.get("ceo_is_chair"):
            override_flags["ceo_duality"] = "AMBER"

        return {
            "overall_score": round(overall, 1),
            "board_effectiveness": round(board_eff, 1),
            "audit_quality": round(audit_q, 1),
            "executive_incentives": round(exec_inc, 1),
            "shareholder_rights": round(shareholder_rights, 1),
            "related_party_score": round(related_party_score, 1),
            "related_party_flag": related_party_flag,
            "override_flags": override_flags,
        }
