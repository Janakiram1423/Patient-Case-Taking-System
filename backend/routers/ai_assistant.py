from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List
import asyncio
import json
import os
from urllib.request import Request, urlopen
from models.schemas import VitalSigns
from services.clinical_engine import (
    calculate_news2_score,
    generate_symptom_inquiry,
    generate_differential_diagnosis
)
from services.discharge_engine import generate_patient_instructions

router = APIRouter(prefix="/api/ai", tags=["AI Clinical Assistant"])

class SymptomInquiryRequest(BaseModel):
    complaint: str
    language: Optional[str] = "en"

class DifferentialRequest(BaseModel):
    complaint: str
    history: Optional[str] = ""
    vitals: Optional[VitalSigns] = None

class DischargeInstructionsRequest(BaseModel):
    patient_name: str
    patient_age: Optional[int] = 30
    patient_gender: Optional[str] = "Unknown"
    diagnosis: Optional[str] = ""
    medications: List[dict] = []
    follow_up_date: Optional[str] = None
    language: Optional[str] = "hi"

class GeneralAssistantRequest(BaseModel):
    question: str
    context: Optional[str] = ""

def _ask_configured_ai(question: str, context: str) -> Optional[str]:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return None

    payload = json.dumps({
        "model": os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
        "messages": [
            {
                "role": "system",
                "content": (
                    "You are a concise hospital and medical information assistant. "
                    "Answer the user's question clearly. Give general educational or workflow guidance, "
                    "do not invent patient data, and do not make a definitive diagnosis or prescription. "
                    "For emergencies, advise immediate local emergency assessment."
                )
            },
            {"role": "user", "content": f"Hospital context: {context}\nQuestion: {question}"}
        ],
        "temperature": 0.2
    }).encode("utf-8")
    request = Request(
        os.getenv("OPENAI_API_URL", "https://api.openai.com/v1/chat/completions"),
        data=payload,
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        method="POST"
    )
    with urlopen(request, timeout=20) as response:
        result = json.loads(response.read().decode("utf-8"))
    return result["choices"][0]["message"]["content"]

@router.post("/symptom-questions")
def get_symptom_questions(payload: SymptomInquiryRequest):
    return generate_symptom_inquiry(payload.complaint, payload.language or "en")

@router.post("/differential-diagnosis")
def get_differential_diagnosis(payload: DifferentialRequest):
    return generate_differential_diagnosis(payload.complaint, payload.vitals, payload.history or "")

@router.post("/vitals-score")
def evaluate_vitals(vitals: VitalSigns):
    return calculate_news2_score(vitals)

@router.post("/patient-discharge-instructions")
def get_patient_discharge_instructions(payload: DischargeInstructionsRequest):
    return generate_patient_instructions(
        patient_name=payload.patient_name,
        patient_age=payload.patient_age or 30,
        patient_gender=payload.patient_gender or "Unknown",
        diagnosis=payload.diagnosis or "",
        medications=payload.medications or [],
        follow_up_date=payload.follow_up_date,
        language=payload.language or "hi"
    )

@router.post("/assistant")
async def ask_general_assistant(payload: GeneralAssistantRequest):
    question = payload.question.strip()
    if not question:
        return {"answer": "Please enter a question."}

    try:
        answer = await asyncio.to_thread(_ask_configured_ai, question, payload.context or "")
    except Exception:
        answer = None

    if answer:
        return {"answer": answer}
    return {
        "answer": (
            "The general AI service is not configured yet. I can still help with common hospital workflows "
            "and general clinical guidance. Configure OPENAI_API_KEY on the backend for broad question answering."
        )
    }

