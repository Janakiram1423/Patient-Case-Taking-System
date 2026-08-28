from fastapi import APIRouter
from pydantic import BaseModel
from services.ocr_engine import analyze_lab_text_or_markers

router = APIRouter(prefix="/api/lab-ocr", tags=["Lab OCR"])

class LabTextRequest(BaseModel):
    raw_text: str

@router.post("/analyze")
def analyze_lab_report(payload: LabTextRequest):
    return analyze_lab_text_or_markers(payload.raw_text)
