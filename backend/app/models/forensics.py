from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean, JSON
from sqlalchemy.orm import relationship
from app.db.database import Base

class ForensicScore(Base):
    __tablename__ = "forensic_scores"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"))
    period_id = Column(Integer, ForeignKey("financial_periods.id"))
    
    # Ratios
    piotroski_f_score = Column(Integer)
    altman_z_score = Column(Float)
    beneish_m_score = Column(Float)
    accrual_ratio = Column(Float)
    
    # Internal proprietary scores
    earnings_quality_score = Column(Float) # 0-100
    data_reliability_score = Column(Float) # 0-100
    
    # Sector specific flag (Financial institutions)
    is_sector_inappropriate = Column(Boolean, default=False)
    
    # Matrix of boolean flags representing specific red flags
    red_flags = Column(JSON) # e.g. {"declining_margins": True, "rising_debt": False}
