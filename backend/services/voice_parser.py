import re
from typing import Dict, Any, List

def parse_voice_clinical_transcript(transcript: str, language: str = "en") -> Dict[str, Any]:
    """
    Parses spoken multilingual clinical notes (English, Hindi, Hinglish, Tamil, etc.)
    and maps them into structured CaseTaking data fields.
    """
    text = (transcript or "").strip()
    lower_text = text.lower()

    # Default extracted structure
    result = {
        "raw_transcript": text,
        "language": language,
        "chief_complaint": {
            "main_complaint": "",
            "duration_value": 3,
            "duration_unit": "days",
            "severity": "Moderate"
        },
        "vitals": {},
        "history": {
            "diabetes": False,
            "hypertension": False,
            "asthma_copd": False,
            "cad": False
        },
        "prescription_candidates": [],
        "confidence_score": 0.88
    }

    # 1. Chief Complaint Extraction
    if any(w in lower_text for w in ["chest pain", "chhati mein dard", "seene mein dard", "nenju vali", "chest discomfort"]):
        result["chief_complaint"]["main_complaint"] = "Retrosternal chest discomfort / angina"
        result["chief_complaint"]["severity"] = "Severe" if "severe" in lower_text or "bohot" in lower_text else "Moderate"
    elif any(w in lower_text for w in ["cough", "khasi", "irumal", "coughing", "wheeze"]):
        result["chief_complaint"]["main_complaint"] = "Productive cough and respiratory congestion"
    elif any(w in lower_text for w in ["fever", "bukhar", "kaichal", "taap", "chills"]):
        result["chief_complaint"]["main_complaint"] = "High grade fever with body aches"
    elif any(w in lower_text for w in ["headache", "sar dard", "thalai vali", "migraine"]):
        result["chief_complaint"]["main_complaint"] = "Throbbing headache and dizziness"
    elif any(w in lower_text for w in ["stomach pain", "pet dard", "vayiru vali", "vomit", "ulati"]):
        result["chief_complaint"]["main_complaint"] = "Epigastric abdominal pain and nausea"
    else:
        # Fallback to first clause
        result["chief_complaint"]["main_complaint"] = text.split(".")[0] if "." in text else text

    # Duration parsing
    duration_match = re.search(r'(\d+)\s*(days?|din|hours?|weeks?|mahine|months?)', lower_text)
    if duration_match:
        val = int(duration_match.group(1))
        unit_str = duration_match.group(2)
        unit = "days"
        if "hour" in unit_str: unit = "hours"
        elif "week" in unit_str: unit = "weeks"
        elif "month" in unit_str or "mahine" in unit_str: unit = "months"
        result["chief_complaint"]["duration_value"] = val
        result["chief_complaint"]["duration_unit"] = unit

    # 2. Vitals Extraction
    # Temperature
    temp_match = re.search(r'(?:temp|temperature|fever|bukhar)\s*(?:is|of|hai)?\s*(\d{2,3}(?:\.\d+)?)', lower_text)
    if temp_match:
        try:
            val = float(temp_match.group(1))
            if 94.0 <= val <= 108.0:
                result["vitals"]["temperature"] = val
        except ValueError:
            pass

    # Pulse / Heart rate
    pulse_match = re.search(r'(?:pulse|heart rate|hr|dhadkan)\s*(?:is|of|hai)?\s*(\d{2,3})', lower_text)
    if pulse_match:
        try:
            val = int(pulse_match.group(1))
            if 30 <= val <= 220:
                result["vitals"]["pulse"] = val
        except ValueError:
            pass

    # Blood Pressure (e.g., 120 by 80, 130/90)
    bp_match = re.search(r'(?:bp|blood pressure)\s*(?:is|hai)?\s*(\d{2,3})\s*(?:/|by|over)\s*(\d{2,3})', lower_text)
    if bp_match:
        try:
            sbp = int(bp_match.group(1))
            dbp = int(bp_match.group(2))
            if 50 <= sbp <= 260 and 30 <= dbp <= 160:
                result["vitals"]["bp_systolic"] = sbp
                result["vitals"]["bp_diastolic"] = dbp
        except ValueError:
            pass

    # SpO2
    spo2_match = re.search(r'(?:spo2|oxygen|o2|saturation)\s*(?:is|hai)?\s*(\d{2,3})%?', lower_text)
    if spo2_match:
        try:
            val = float(spo2_match.group(1))
            if 50.0 <= val <= 100.0:
                result["vitals"]["spo2"] = val
        except ValueError:
            pass

    # 3. Medical History Flags
    if any(w in lower_text for w in ["diabetic", "diabetes", "sugar", "madhumeha"]):
        result["history"]["diabetes"] = True
    if any(w in lower_text for w in ["hypertension", "bp patient", "high bp", "uchh raktchap"]):
        result["history"]["hypertension"] = True
    if any(w in lower_text for w in ["asthma", "asthmatic", "dama"]):
        result["history"]["asthma_copd"] = True
    if any(w in lower_text for w in ["heart problem", "stent", "bypass", "heart attack"]):
        result["history"]["cad"] = True

    # 4. Medication extraction
    med_keywords = [
        ("Paracetamol", "Tablet", "650mg", "1-0-1", "After Food"),
        ("Amoxicillin", "Capsule", "500mg", "1-1-1", "After Food"),
        ("Pantoprazole", "Tablet", "40mg", "1-0-0", "Before Food"),
        ("Azithromycin", "Tablet", "500mg", "1-0-0", "After Food"),
        ("Cetirizine", "Tablet", "10mg", "0-0-1", "At Bedtime"),
        ("Metformin", "Tablet", "500mg", "1-0-1", "With Food"),
        ("Telmisartan", "Tablet", "40mg", "1-0-0", "After Food"),
        ("Aspirin", "Tablet", "75mg", "0-1-0", "After Food"),
        ("Atorvastatin", "Tablet", "20mg", "0-0-1", "At Bedtime")
    ]

    for name, form, strength, freq, timing in med_keywords:
        if name.lower() in lower_text:
            result["prescription_candidates"].append({
                "brand_name": name,
                "generic_name": name,
                "dosage_form": form,
                "strength": strength,
                "frequency": freq,
                "timing": timing,
                "duration_value": 5,
                "duration_unit": "days"
            })

    return result
