from fastapi import APIRouter, Query
from pydantic import BaseModel
from typing import List, Optional
from services.interaction_engine import (
    DRUG_DATABASE,
    check_drug_interactions,
    calculate_pediatric_dose
)

router = APIRouter(prefix="/api/drugs", tags=["Drugs & Interactions"])

class InteractionCheckRequest(BaseModel):
    drug_names: List[str]

class PediatricDoseRequest(BaseModel):
    weight_kg: float
    age_months: Optional[int] = 24
    drug_key: str

@router.get("/search")
def search_drugs(q: Optional[str] = Query(None, description="Search by brand or generic name")):
    if not q:
        return DRUG_DATABASE
    query = q.lower().strip()
    return [
        d for d in DRUG_DATABASE
        if query in d["brand"].lower() or query in d["generic"].lower() or query in d["category"].lower()
    ]

@router.post("/check-interactions")
def verify_drug_safety(payload: InteractionCheckRequest):
    interactions = check_drug_interactions(payload.drug_names)
    return {
        "has_interactions": len(interactions) > 0,
        "interaction_count": len(interactions),
        "interactions": interactions
    }

@router.post("/pediatric-dose")
def get_pediatric_dosing(payload: PediatricDoseRequest):
    return calculate_pediatric_dose(payload.weight_kg, payload.age_months or 24, payload.drug_key)
