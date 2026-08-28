from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from services.voice_parser import parse_voice_clinical_transcript

router = APIRouter(prefix="/api/voice", tags=["Voice Scribe"])

class VoiceTranscriptRequest(BaseModel):
    transcript: str
    language: Optional[str] = "en"

@router.post("/process-transcript")
def process_transcript(payload: VoiceTranscriptRequest):
    return parse_voice_clinical_transcript(payload.transcript, payload.language or "en")
