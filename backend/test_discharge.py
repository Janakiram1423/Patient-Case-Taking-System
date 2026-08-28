"""
Comprehensive verification test for AI Multilingual Patient Discharge & Prescription Instructions Generator
"""
import sys

# Ensure UTF-8 output on Windows
sys.stdout.reconfigure(encoding='utf-8')

from services.discharge_engine import generate_patient_instructions, SUPPORTED_LANGUAGES

test_meds = [
    {"name": "Augmentin 625", "dosage": "1 tab", "frequency": "1-0-1", "duration": "5 Days", "instructions": "After Food"},
    {"name": "Dolo 650", "dosage": "1 tab", "frequency": "SOS", "duration": "3 Days", "instructions": "After Food"},
    {"name": "Pantocid 40", "dosage": "1 tab", "frequency": "1-0-0", "duration": "5 Days", "instructions": "Before Food"}
]

print("================================================================")
print("Testing Multilingual Patient Instructions Generation across 6 Languages")
print("================================================================")

for lang_code, meta in SUPPORTED_LANGUAGES.items():
    res = generate_patient_instructions(
        patient_name="Pooja Verma",
        patient_age=34,
        patient_gender="Female",
        diagnosis="Acute Upper Respiratory Tract Infection (URTI)",
        medications=test_meds,
        follow_up_date="2026-09-02",
        language=lang_code
    )
    
    assert res["language"] == lang_code, f"Language mismatch: {res['language']} vs {lang_code}"
    assert len(res["medications"]) == 3, f"Expected 3 medications, got {len(res['medications'])}"
    assert len(res["diet_guidelines"]) >= 3, "Expected at least 3 diet guidelines"
    assert len(res["emergency_warnings"]["items"]) >= 3, "Expected at least 3 emergency items"
    assert "whatsapp_share_text" in res and len(res["whatsapp_share_text"]) > 50, "Missing WhatsApp share text"
    
    print(f"[{lang_code.upper()} - {meta['native']} ({meta['name']})]")
    print(f"   Greeting: {res['greeting']}")
    print(f"   Follow-up: {res['follow_up_instruction']}")
    print(f"   Med 1 ({res['medications'][0]['name']}): {res['medications'][0]['food_timing']} | {res['medications'][0]['purpose'][:45]}...")
    print(f"   Emergency Title: {res['emergency_warnings']['title']}")
    print(f"   WhatsApp Text Length: {len(res['whatsapp_share_text'])} chars")
    print("----------------------------------------------------------------")

print("ALL 6 LANGUAGES VERIFIED AND FUNCTIONING SUCCESSFULLY!")
