from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.database import get_db
from app.models.core import Company, FinancialStatement, FinancialPeriod
from app.services.forensics import ForensicCalculator
from app.services.normalisation import NormalisationEngine

router = APIRouter()

@router.get("/{ticker}")
async def get_forensics(ticker: str, db: AsyncSession = Depends(get_db)):
    """Fetch forensic scores and red flags for a given company ticker."""
    result = await db.execute(select(Company).where(Company.ticker == ticker.upper()))
    company = result.scalars().first()
    
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
        
    stmt_result = await db.execute(
        select(FinancialStatement, FinancialPeriod)
        .join(FinancialPeriod)
        .where(FinancialPeriod.company_id == company.id)
        .order_by(FinancialPeriod.year.asc())
    )
    
    statements = list(stmt_result.all())
    if len(statements) < 2:
        raise HTTPException(status_code=400, detail="Not enough historical data for forensic calculations")
        
    results = []
    # Calculate for the most recent period using the prior period
    for i in range(1, len(statements)):
        prior_fs, prior_period = statements[i-1]
        current_fs, current_period = statements[i]
        
        # In a real app we parse out a unified dict. We'll simulate it here.
        curr_data = {**(current_fs.income_statement or {}), **(current_fs.balance_sheet or {}), **(current_fs.cash_flow or {})}
        prior_data = {**(prior_fs.income_statement or {}), **(prior_fs.balance_sheet or {}), **(prior_fs.cash_flow or {})}
        
        piotroski = ForensicCalculator.calculate_piotroski_f_score(curr_data, prior_data)
        altman = ForensicCalculator.calculate_altman_z_score(curr_data)
        red_flags = ForensicCalculator.check_red_flags(curr_data, prior_data)
        
        # Mock sector filter check (Financials = N/A)
        is_financial = company.sector in ["Banks", "Insurance", "Financials"]
        
        results.append({
            "period": f"{current_period.year} {current_period.period_type}",
            "is_sector_inappropriate": is_financial,
            "piotroski_f_score": None if is_financial else piotroski,
            "altman_z_score": None if is_financial else altman,
            "red_flags": red_flags
        })
        
    return {"company": company.name, "ticker": company.ticker, "forensics": results[::-1]}

@router.post("/normalise/{ticker}")
async def get_normalised_earnings(ticker: str, non_operating_items: list[dict]):
    """Generate reported to normalised earnings bridge."""
    # Assuming reported earnings of $5000M for demo purposes
    reported_earnings = 5000.0 
    
    bridge = NormalisationEngine.build_bridge(reported_earnings, non_operating_items)
    return bridge
