from typing import Dict, Any, List
from models.schemas import VitalSigns

def calculate_news2_score(vitals: VitalSigns) -> Dict[str, Any]:
    score = 0
    alerts = []

    # 1. Respiration Rate
    rr = vitals.respiratory_rate
    if rr is not None:
        if rr <= 8:
            score += 3
            alerts.append("Critical Bradypnea (RR <= 8)")
        elif 9 <= rr <= 11:
            score += 1
        elif 12 <= rr <= 20:
            score += 0
        elif 21 <= rr <= 24:
            score += 2
            alerts.append("Tachypnea (RR 21-24)")
        elif rr >= 25:
            score += 3
            alerts.append("Severe Tachypnea (RR >= 25)")

    # 2. SpO2 (Scale 1 standard)
    spo2 = vitals.spo2
    if spo2 is not None:
        if spo2 <= 91:
            score += 3
            alerts.append("Critical Hypoxia (SpO2 <= 91%)")
        elif 92 <= spo2 <= 93:
            score += 2
            alerts.append("Moderate Hypoxia (SpO2 92-93%)")
        elif 94 <= spo2 <= 95:
            score += 1
        elif spo2 >= 96:
            score += 0

    # 3. Systolic Blood Pressure
    sbp = vitals.bp_systolic
    if sbp is not None:
        if sbp <= 90:
            score += 3
            alerts.append("Critical Hypotension (SBP <= 90 mmHg)")
        elif 91 <= sbp <= 100:
            score += 2
            alerts.append("Hypotension (SBP 91-100 mmHg)")
        elif 101 <= sbp <= 110:
            score += 1
        elif 111 <= sbp <= 219:
            score += 0
        elif sbp >= 220:
            score += 3
            alerts.append("Severe Hypertensive Crisis (SBP >= 220 mmHg)")

    # 4. Pulse / Heart Rate
    hr = vitals.pulse
    if hr is not None:
        if hr <= 40:
            score += 3
            alerts.append("Severe Bradycardia (HR <= 40 bpm)")
        elif 41 <= hr <= 50:
            score += 1
        elif 51 <= hr <= 90:
            score += 0
        elif 91 <= hr <= 110:
            score += 1
        elif 111 <= hr <= 130:
            score += 2
            alerts.append("Tachycardia (HR 111-130 bpm)")
        elif hr >= 131:
            score += 3
            alerts.append("Severe Tachycardia (HR >= 131 bpm)")

    # 5. Consciousness / Alertness
    c = (vitals.consciousness or "Alert").lower()
    if c != "alert":
        score += 3
        alerts.append(f"Altered Mental State ({vitals.consciousness})")

    # 6. Body Temperature (Fahrenheit)
    temp = vitals.temperature
    if temp is not None:
        if temp <= 95.0:
            score += 3
            alerts.append("Hypothermia (Temp <= 95.0°F)")
        elif 95.1 <= temp <= 96.8:
            score += 1
        elif 96.9 <= temp <= 100.4:
            score += 0
        elif 100.5 <= temp <= 102.2:
            score += 1
            alerts.append("Low-grade Pyrexia (Temp 100.5-102.2°F)")
        elif temp >= 102.3:
            score += 2
            alerts.append("High Pyrexia / Fever (Temp >= 102.3°F)")

    # Determine Clinical Risk Category
    if score >= 7:
        risk_level = "High"
        recommendation = "Emergency bedside medical assessment required immediately. Consider ICU/HDU transfer."
    elif score >= 5:
        risk_level = "Medium"
        recommendation = "Urgent clinical review by attending physician within 30 minutes."
    elif score >= 1:
        risk_level = "Low"
        recommendation = "Routine ward observation and repeat vitals in 4 to 6 hours."
    else:
        risk_level = "Normal"
        recommendation = "Vitals stable. Standard outpatient observation."

    return {
        "news2_score": score,
        "risk_level": risk_level,
        "alerts": alerts,
        "recommendation": recommendation
    }

def generate_symptom_inquiry(complaint: str, language: str = "en") -> Dict[str, Any]:
    text = (complaint or "").lower()
    
    questions = []
    category = "General"

    if any(w in text for w in ["chest", "heart", "chhati", "pain in chest", "angina", "discomfort"]):
        category = "Cardiovascular / Thoracic"
        questions = [
            {"id": "q1", "category": "Character", "text": "Is the discomfort crushing, burning, pressure-like, sharp, or tearing?"},
            {"id": "q2", "category": "Radiation", "text": "Does the discomfort radiate to your left arm, neck, jaw, or back?"},
            {"id": "q3", "category": "Aggravating/Relieving", "text": "Does it worsen with physical exertion or deep breathing, and relieve with rest?"},
            {"id": "q4", "category": "Associated Symptoms", "text": "Are you experiencing cold sweating, nausea, dizziness, or breathlessness?"}
        ]
    elif any(w in text for w in ["cough", "breath", "wheeze", "khasi", "asthma", "phlegm"]):
        category = "Respiratory"
        questions = [
            {"id": "q1", "category": "Type", "text": "Is your cough dry or productive with yellow/green/blood-tinged sputum?"},
            {"id": "q2", "category": "Timing", "text": "Is it worse at night or early morning, or triggered by dust/cold air?"},
            {"id": "q3", "category": "Severity", "text": "Can you speak in full sentences without needing to catch your breath?"},
            {"id": "q4", "category": "History", "text": "Have you had fever, chills, or previous episodes of asthma/bronchospasm?"}
        ]
    elif any(w in text for w in ["headache", "sar dard", "migraine", "head", "dizziness"]):
        category = "Neurological"
        questions = [
            {"id": "q1", "category": "Onset", "text": "Did the headache come on suddenly like a 'thunderclap' or build up gradually?"},
            {"id": "q2", "category": "Location", "text": "Is the pain throbbing on one side (unilateral) or tight like a band around the head?"},
            {"id": "q3", "category": "Red Flags", "text": "Is there nausea, vomiting, light sensitivity (photophobia), or neck stiffness?"},
            {"id": "q4", "category": "Deficits", "text": "Have you noticed any visual blurriness, limb weakness, or slurred speech?"}
        ]
    elif any(w in text for w in ["stomach", "abdomen", "pet dard", "vomit", "diarrhea", "loose motion"]):
        category = "Gastrointestinal"
        questions = [
            {"id": "q1", "category": "Site", "text": "Where is the pain located (epigastric, right lower quadrant, periumbilical)?"},
            {"id": "q2", "category": "Food Relation", "text": "Does eating food relieve the burning sensation or worsen cramping?"},
            {"id": "q3", "category": "Bowel Habits", "text": "Have you passed dark black tarry stools or blood with stools?"},
            {"id": "q4", "category": "Associated", "text": "Is there fever, persistent vomiting, or inability to keep fluids down?"}
        ]
    elif any(w in text for w in ["fever", "bukhar", "temperature", "chills"]):
        category = "Infectious / Systemic"
        questions = [
            {"id": "q1", "category": "Pattern", "text": "Is the fever continuous, or does it spike at night with severe shaking chills/rigors?"},
            {"id": "q2", "category": "Localizing Signs", "text": "Are there symptoms like sore throat, burning urination, rash, or joint pains?"},
            {"id": "q3", "category": "Travel/Exposure", "text": "Any history of monsoon water exposure, mosquito bites, or recent travel?"}
        ]
    else:
        questions = [
            {"id": "q1", "category": "Onset & Duration", "text": "When did this symptom start, and has it been constant or intermittent?"},
            {"id": "q2", "category": "Progression", "text": "Is the condition improving, staying the same, or progressively worsening?"},
            {"id": "q3", "category": "Prior Episodes", "text": "Have you or anyone in your family experienced a similar condition in the past?"}
        ]

    return {
        "category": category,
        "suggested_questions": questions
    }

def generate_differential_diagnosis(complaint: str, vitals: VitalSigns = None, history: str = "") -> Dict[str, Any]:
    text = (complaint + " " + history).lower()

    if any(w in text for w in ["chest", "angina", "coronary", "ischemia"]):
        return {
            "provisional": "Coronary Artery Disease (CAD) / Stable Angina Pectoris",
            "icd10": "I20.9 (Angina pectoris, unspecified)",
            "differentials": [
                "Acute Coronary Syndrome (NSTEMI / STEMI) - ICD: I21.9",
                "Gastroesophageal Reflux Disease (GERD) - ICD: K21.9",
                "Costochondritis / Musculoskeletal Chest Wall Pain - ICD: M94.0",
                "Aortic Dissection - ICD: I71.0"
            ],
            "recommended_investigations": [
                "12-Lead Electrocardiogram (ECG)",
                "High-Sensitivity Troponin-I / Troponin-T",
                "2D Echocardiography",
                "Fasting Lipid Profile",
                "Chest X-Ray (PA View)"
            ]
        }
    elif any(w in text for w in ["cough", "wheeze", "asthma", "breathless", "dyspnea"]):
        return {
            "provisional": "Acute Bronchial Asthma Exacerbation",
            "icd10": "J45.901 (Unspecified asthma with acute exacerbation)",
            "differentials": [
                "Chronic Obstructive Pulmonary Disease (COPD) Exacerbation - ICD: J44.1",
                "Community-Acquired Pneumonia (CAP) - ICD: J18.9",
                "Acute Bronchitis - ICD: J20.9",
                "Pulmonary Embolism - ICD: I26.99"
            ],
            "recommended_investigations": [
                "Peak Expiratory Flow Rate (PEFR) / Spirometry",
                "Complete Blood Count (CBC) with Absolute Eosinophil Count",
                "Chest X-Ray (PA View)",
                "Arterial Blood Gas (ABG) if SpO2 < 92%"
            ]
        }
    elif any(w in text for w in ["fever", "chills", "bukhar", "rigors"]):
        return {
            "provisional": "Acute Febrile Illness of Undetermined Etiology",
            "icd10": "R50.9 (Fever, unspecified)",
            "differentials": [
                "Dengue Fever / Viral Hemorrhagic Fever - ICD: A90",
                "Typhoid / Enteric Fever (Salmonella) - ICD: A01.0",
                "Malaria (Plasmodium Vivax / Falciparum) - ICD: B54",
                "Urinary Tract Infection (UTI) - ICD: N39.0"
            ],
            "recommended_investigations": [
                "Complete Blood Count (CBC with Platelet Count & PCV)",
                "Dengue NS1 Antigen & IgM/IgG Serology",
                "Peripheral Blood Smear for Malaria Parasite (MP)",
                "Widal / Typhidot Test & Blood Culture",
                "Routine & Microscopic Urine Analysis"
            ]
        }
    else:
        return {
            "provisional": "Non-Specific Symptom Presentation",
            "icd10": "R69 (Illness, unspecified)",
            "differentials": [
                "Viral Syndrome / Upper Respiratory Tract Infection - ICD: J06.9",
                "Tension-Type Functional Symptom - ICD: G44.2",
                "Metabolic Derangement (Electrolyte / Glucose) - ICD: E87.8"
            ],
            "recommended_investigations": [
                "Complete Blood Count (CBC)",
                "Random Blood Glucose (GRBS)",
                "Basic Metabolic Panel (Serum Electrolytes & Creatinine)"
            ]
        }
