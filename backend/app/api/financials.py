from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.database import get_db
from app.models.core import Company, FinancialStatement, FinancialPeriod
from app.services.calculator import FinancialCalculator
import json

router = APIRouter()

@router.get("/{ticker}")
async def get_financial_statements(ticker: str, db: AsyncSession = Depends(get_db)):
    """Fetch financial statements and dynamically compute ratios for a given company ticker."""
    result = await db.execute(select(Company).where(Company.ticker == ticker.upper()))
    company = result.scalars().first()
    
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
        
    stmt_result = await db.execute(
        select(FinancialStatement, FinancialPeriod)
        .join(FinancialPeriod)
        .where(FinancialPeriod.company_id == company.id)
        .order_by(FinancialPeriod.year.desc())
    )
    
    statements = []
    for fs, period in stmt_result.all():
        # Dynamically compute metrics if not already stored
        metrics = fs.calculated_metrics
        if not metrics:
            metrics = FinancialCalculator.compute_all_metrics(
                income_stmt=fs.income_statement or {},
                balance_sheet=fs.balance_sheet or {},
                cash_flow=fs.cash_flow or {}
            )
            
        statements.append({
            "period": f"{period.year} {period.period_type}",
            "start_date": period.start_date,
            "end_date": period.end_date,
            "audited": period.audited,
            "income_statement": fs.income_statement,
            "balance_sheet": fs.balance_sheet,
            "cash_flow": fs.cash_flow,
            "metrics": metrics
        })
        
    return {"company": company.name, "ticker": company.ticker, "statements": statements}

@router.post("/upload/{ticker}")
async def upload_financial_report(ticker: str, file: UploadFile = File(...), db: AsyncSession = Depends(get_db)):
    """
    Phase 1 Mock Endpoint: Accepts a PDF and simulates extraction.
    Creates mock data by cloning AAPL's structure so the user can test the UI with new tickers.
    """
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
        
    ticker = ticker.upper()
    
    # Check if company already exists
    existing_result = await db.execute(select(Company).where(Company.ticker == ticker))
    if existing_result.scalars().first():
        return {"status": "success", "message": f"Report {file.filename} ingested for {ticker}. Extraction pipeline queued."}
        
    # Clone from AAPL to simulate data extraction
    source_result = await db.execute(select(Company).where(Company.ticker == "AAPL"))
    source_company = source_result.scalars().first()
    
    if not source_company:
        return {"status": "success", "message": f"Report ingested. (Simulation failed: AAPL source not found)"}
        
    # Create new company
    new_company = Company(
        ticker=ticker,
        name=f"{ticker} Corporation",
        exchange="NASDAQ",
        sector=source_company.sector,
        industry=source_company.industry
    )
    db.add(new_company)
    await db.flush()
    
    # Clone periods and statements
    periods_result = await db.execute(
        select(FinancialPeriod)
        .where(FinancialPeriod.company_id == source_company.id)
    )
    for p in periods_result.scalars().all():
        new_period = FinancialPeriod(
            company_id=new_company.id,
            period_type=p.period_type,
            year=p.year,
            start_date=p.start_date,
            end_date=p.end_date,
            audited=p.audited
        )
        db.add(new_period)
        await db.flush()
        
        # Clone statement
        stmt_result = await db.execute(
            select(FinancialStatement)
            .where(FinancialStatement.period_id == p.id)
        )
        for s in stmt_result.scalars().all():
            new_stmt = FinancialStatement(
                period_id=new_period.id,
                currency=s.currency,
                scale=s.scale,
                income_statement=s.income_statement,
                balance_sheet=s.balance_sheet,
                cash_flow=s.cash_flow,
                calculated_metrics=s.calculated_metrics
            )
            db.add(new_stmt)
            
    await db.commit()
    
    return {"status": "success", "message": f"Report {file.filename} ingested for {ticker}. Mock data successfully generated for testing."}
