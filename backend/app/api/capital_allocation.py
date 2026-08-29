from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List
from app.services.capital_allocation import CapitalAllocationAnalyser

router = APIRouter()

class CashFlowInput(BaseModel):
    operating_cash_flow: float = 0
    capital_expenditures: float = 0
    acquisitions: float = 0
    share_repurchases: float = 0
    dividends_paid: float = 0
    debt_repayment: float = 0

class IncomeInput(BaseModel):
    net_income: float = 0

class CapAllocInput(BaseModel):
    cash_flow: CashFlowInput
    income_statement: IncomeInput
    roic_history: List[float] = []

@router.post("/analyse")
async def analyse_capital_allocation(payload: CapAllocInput):
    """Analyse FCF deployment and score capital allocation quality."""
    deployment = CapitalAllocationAnalyser.compute_fcf_deployment(
        payload.cash_flow.model_dump(),
        payload.income_statement.model_dump()
    )
    score = CapitalAllocationAnalyser.score_capital_allocation(deployment, payload.roic_history)
    return {**deployment, **score}
