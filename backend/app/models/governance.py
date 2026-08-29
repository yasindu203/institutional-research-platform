from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean, JSON, Text
from sqlalchemy.orm import relationship
from app.db.database import Base

class GovernancePerson(Base):
    __tablename__ = "governance_people"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"))
    full_name = Column(String)
    role = Column(String)  # CEO, CFO, Chairman, Director, etc.
    is_independent = Column(Boolean, default=False)
    tenure_start_date = Column(DateTime, nullable=True)
    compensation_total = Column(Float, nullable=True)
    compensation_details = Column(JSON, nullable=True)
    background_notes = Column(Text, nullable=True)

class BoardStructure(Base):
    __tablename__ = "board_structures"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"))
    snapshot_date = Column(DateTime)
    total_directors = Column(Integer)
    independent_directors = Column(Integer)
    female_directors = Column(Integer)
    ceo_is_chair = Column(Boolean, default=False)  # Red flag if True
    audit_committee_independent = Column(Boolean, default=True)
    compensation_committee_independent = Column(Boolean, default=True)

class OwnershipStructure(Base):
    __tablename__ = "ownership_structures"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"))
    snapshot_date = Column(DateTime)
    share_classes = Column(JSON)  # e.g. {"Class A": {"votes": 1}, "Class B": {"votes": 10}}
    institutional_ownership_pct = Column(Float)
    insider_ownership_pct = Column(Float)
    top_10_shareholders = Column(JSON)

class GovernanceScore(Base):
    __tablename__ = "governance_scores"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"))
    snapshot_date = Column(DateTime)
    overall_score = Column(Float)  # 0-100
    board_effectiveness = Column(Float)
    audit_quality = Column(Float)
    risk_oversight = Column(Float)
    executive_incentives = Column(Float)
    shareholder_rights = Column(Float)
    related_party_flag = Column(Boolean, default=False)
    override_flags = Column(JSON)  # {"audit_issues": "RED", "fraud_history": "CRITICAL"}
