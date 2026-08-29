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
    In Phase 2, this will use PyMuPDF/pdfplumber to parse actual tables.
    """
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
        
    # TODO: Implement PyMuPDF extraction
    # For Phase 1 validation, we just acknowledge receipt
    return {"status": "success", "message": f"Report {file.filename} ingested for {ticker.upper()}. Extraction pipeline queued."}
