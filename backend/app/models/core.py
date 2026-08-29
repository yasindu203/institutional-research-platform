from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    ticker = Column(String, unique=True, index=True)
    name = Column(String, index=True)
    exchange = Column(String)
    sector = Column(String)
    industry = Column(String)
    
    reports = relationship("Report", back_populates="company")
    financial_periods = relationship("FinancialPeriod", back_populates="company")

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"))
    report_type = Column(String) # 10-K, 10-Q, Annual Report
    filing_date = Column(DateTime)
    period_end_date = Column(DateTime)
    source_url = Column(String)
    
    company = relationship("Company", back_populates="reports")
    evidence = relationship("Evidence", back_populates="report")

class FinancialPeriod(Base):
    __tablename__ = "financial_periods"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"))
    period_type = Column(String) # FY, Q1, Q2, Q3, Q4
    year = Column(Integer)
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    audited = Column(Boolean, default=False)
    
    company = relationship("Company", back_populates="financial_periods")
    statements = relationship("FinancialStatement", back_populates="period")

class FinancialStatement(Base):
    __tablename__ = "financial_statements"

    id = Column(Integer, primary_key=True, index=True)
    period_id = Column(Integer, ForeignKey("financial_periods.id"))
    currency = Column(String)
    scale = Column(String) # Millions, Thousands
    
    # Store standard statement items as JSON for flexibility
    income_statement = Column(JSON)
    balance_sheet = Column(JSON)
    cash_flow = Column(JSON)
    
    # Calculated deterministic metrics (Layer 2)
    calculated_metrics = Column(JSON)
    
    period = relationship("FinancialPeriod", back_populates="statements")

class Evidence(Base):
    __tablename__ = "evidence_store"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey("reports.id"))
    claim = Column(String)
    metric_name = Column(String)
    value = Column(Float)
    page_number = Column(Integer)
    excerpt = Column(String)
    reliability_score = Column(Float) # 0-100
    verification_status = Column(String) # UNVERIFIED, CROSS_VERIFIED
    
    report = relationship("Report", back_populates="evidence")
