from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import (
    financials,
    forensics,
    governance,
    capital_allocation,
    valuation,
    research,
    forecast,
    portfolio,
    advanced_research,
    company,
)
from contextlib import asynccontextmanager
from app.db.database import engine, Base

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield


app = FastAPI(
    title="Fundamental Investment Research System (FIRS)",
    description="Institutional-grade investment research platform: 5-layer analytical architecture.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Company metadata (yfinance-powered)
app.include_router(company.router, prefix="/api/v1/company", tags=["Company Info"])

# Phase 1 — Core Financial Engine
app.include_router(financials.router, prefix="/api/v1/financials", tags=["Phase 1 — Financials"])

# Phase 2 — Accounting & Forensics
app.include_router(forensics.router, prefix="/api/v1/forensics", tags=["Phase 2 — Forensics"])

# Phase 3 — Governance
app.include_router(governance.router, prefix="/api/v1/governance", tags=["Phase 3 — Governance"])

# Phase 4 — Management & Capital Allocation
app.include_router(capital_allocation.router, prefix="/api/v1/capital-allocation", tags=["Phase 4 — Capital Allocation"])

# Phase 5 — Valuation
app.include_router(valuation.router, prefix="/api/v1/valuation", tags=["Phase 5 — Valuation"])

# Phase 6 — External Research
app.include_router(research.router, prefix="/api/v1/research", tags=["Phase 6 — Research"])

# Phase 7 — Forecasting
app.include_router(forecast.router, prefix="/api/v1/forecast", tags=["Phase 7 — Forecasting"])

# Phase 8 & 9 — Portfolio Lab
app.include_router(portfolio.router, prefix="/api/v1/portfolio", tags=["Phase 8-9 — Portfolio"])

# Phase 10 — Advanced Research
app.include_router(advanced_research.router, prefix="/api/v1/advanced-research", tags=["Phase 10 — Advanced Research"])


@app.get("/health", tags=["System"])
async def health_check():
    return {"status": "healthy", "system": "FIRS Backend", "version": "1.0.0"}


@app.get("/api/v1/architecture", tags=["System"])
async def get_architecture():
    """Return the 5-layer system architecture."""
    return {
        "layers": [
            {"layer": 1, "name": "Fact", "description": "Verified authoritative evidence extraction"},
            {"layer": 2, "name": "Calculation", "description": "Deterministic calculations on verified facts"},
            {"layer": 3, "name": "Interpretation", "description": "Analytical conclusions using LLMs on verified facts"},
            {"layer": 4, "name": "Forecast", "description": "Probabilistic estimates using ML and driver-based models"},
            {"layer": 5, "name": "Investor Preference", "description": "Personal utility, ranking, and portfolio alignment"},
        ]
    }
