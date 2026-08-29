from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.services.governance import GovernanceScorer

router = APIRouter()

class BoardInput(BaseModel):
    total_directors: int = 10
    independent_directors: int = 7
    female_directors: int = 3
    ceo_is_chair: bool = False

class AuditInput(BaseModel):
    material_weakness: bool = False
    qualified_opinion: bool = False
    auditor_tenure_years: int = 8
    big_four: bool = True

class CompensationInput(BaseModel):
    ltip_pct_of_total: float = 0.60
    clawback_policy: bool = True
    say_on_pay_approval_pct: float = 95.0

class OwnershipInput(BaseModel):
    dual_class_shares: bool = False
    institutional_ownership_pct: float = 70.0
    insider_ownership_pct: float = 5.0

class RelatedPartyInput(BaseModel):
    material_transactions: bool = False

class GovernanceInput(BaseModel):
    board: BoardInput = BoardInput()
    audit: AuditInput = AuditInput()
    compensation: CompensationInput = CompensationInput()
    ownership: OwnershipInput = OwnershipInput()
    related_parties: RelatedPartyInput = RelatedPartyInput()

@router.post("/score")
async def compute_governance_score(payload: GovernanceInput):
    """Compute a full institutional governance score from structured inputs."""
    result = GovernanceScorer.compute_overall_score(
        board=payload.board.model_dump(),
        audit=payload.audit.model_dump(),
        compensation=payload.compensation.model_dump(),
        ownership=payload.ownership.model_dump(),
        related_parties=payload.related_parties.model_dump(),
    )
    return result

@router.get("/framework")
async def get_governance_framework():
    """Return the governance scoring methodology for transparency."""
    return {
        "dimensions": [
            {"name": "Board Effectiveness", "weight": "25%", "key_drivers": ["Independence ratio", "CEO/Chair duality", "Board diversity"]},
            {"name": "Audit Quality", "weight": "25%", "key_drivers": ["Auditor quality", "Material weaknesses", "Opinion type"]},
            {"name": "Executive Incentives", "weight": "20%", "key_drivers": ["LTIP ratio", "Clawback policy", "Say-on-Pay"]},
            {"name": "Shareholder Rights", "weight": "20%", "key_drivers": ["Dual-class shares", "Float", "Anti-takeover provisions"]},
            {"name": "Related Parties", "weight": "10%", "key_drivers": ["Material transactions", "Undisclosed loans"]},
        ],
        "override_flags": {
            "CRITICAL": "Fraud history, accounting restatements",
            "RED": "Qualified/adverse audit opinion, material weakness",
            "AMBER": "CEO/Chair duality, dual-class shares, related party transactions",
            "GREEN": "All clear",
        }
    }
