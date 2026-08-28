from fastapi import APIRouter

router = APIRouter(prefix="/api/emergency", tags=["Emergency Protocols"])

EMERGENCY_PROTOCOLS = [
    {
        "id": "EM-01",
        "title": "Anaphylaxis / Severe Acute Allergic Reaction",
        "category": "Immediate Resuscitation",
        "primary_drug": "Adrenaline / Epinephrine (1:1000, 0.5mg IM anterolateral thigh)",
        "algorithm": [
            "1. Stop suspected offending agent immediately.",
            "2. Administer IM Adrenaline 1:1000 (0.5 mL in adults, 0.01 mg/kg in children).",
            "3. Lie patient flat, elevate legs (unless respiratory distress).",
            "4. High-flow oxygen (10-15 L/min via non-rebreather mask).",
            "5. Establish IV access: Rapid crystalloid infusion (500-1000 mL normal saline).",
            "6. Second-line: IV Hydrocortisone (200mg) + IV Chlorpheniramine (10mg)."
        ]
    },
    {
        "id": "EM-02",
        "title": "Acute STEMI (ST-Elevation Myocardial Infarction)",
        "category": "Cardiovascular Emergency",
        "primary_drug": "Dual Antiplatelet Therapy (DAPT) + Heparin / Thrombolysis",
        "algorithm": [
            "1. Immediate 12-lead ECG within 10 minutes of arrival.",
            "2. Chewable Aspirin 300mg + Clopidogrel 300-600mg (or Ticagrelor 180mg).",
            "3. Sublingual Nitroglycerin 0.5mg (Contraindicated if SBP < 90 or RV infarction).",
            "4. Oxygen only if SpO2 < 90%.",
            "5. Activate Cath Lab for Primary PCI (Door-to-balloon < 90 mins) or Thrombolytic therapy if PCI unavailable within 120 mins."
        ]
    },
    {
        "id": "EM-03",
        "title": "Acute Severe Asthma / Status Asthmaticus",
        "category": "Respiratory Emergency",
        "primary_drug": "Nebulized Salbutamol + Ipratropium + Systemic Corticosteroids",
        "algorithm": [
            "1. High-flow oxygen to maintain SpO2 between 93-95%.",
            "2. Oxygen-driven nebulization: Salbutamol 5mg + Ipratropium bromide 0.5mg back-to-back.",
            "3. IV Hydrocortisone 100mg or Oral Prednisolone 40-50mg immediately.",
            "4. Severe refractory cases: IV Magnesium Sulfate 2g in 100mL normal saline over 20 minutes."
        ]
    }
]

@router.get("/protocols")
def get_emergency_protocols():
    return EMERGENCY_PROTOCOLS
